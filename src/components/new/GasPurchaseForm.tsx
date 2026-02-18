import React, { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, ShoppingCart, Calculator, CheckCircle, AlertCircle, Loader, Hash } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';

interface GasPurchaseFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CustomerData {
  name: string;
  phone: string;
  uniqueCode: string;
  branch: string;
  branchId: string;
}

interface GasItem {
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface OrderResult {
  success: boolean;
  orderNumber?: string;
  message: string;
}

interface Branch {
  branchId: number;
  name: string;
  address: string;
}

const GasPurchaseForm: React.FC<GasPurchaseFormProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'register' | 'purchase' | 'success'>('register');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    phone: '',
    uniqueCode: '',
    branch: '',
    branchId: ''
  });
  
  // Store only quantities in state
  const [quantities, setQuantities] = useState<Record<string, number>>({
    '1KG': 0,
    '6KG': 0,
    '12.5KG': 0,
    '25KG': 0,
    '50KG': 0
  });

  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Fetch Branches
  const { data: branches, isLoading: isLoadingBranches } = useQuery<Branch[]>({
    queryKey: ['branches'],
    queryFn: async () => {
      const res = await fetch('/api/Common/GetBranches');
      if (!res.ok) throw new Error('Failed to fetch branches');
      return res.json();
    }
  });

  // Fetch Prices for the selected branch
  const { data: branchPrices, isLoading: isLoadingPrices } = useQuery({
    queryKey: ['branchPrices', customerData.branchId],
    queryFn: async () => {
      if (!customerData.branchId) return null;
      const res = await fetch(`/api/Prices/GetPriceList?branch=${customerData.branchId}`);
      if (!res.ok) throw new Error('Failed to fetch prices');
      return res.json();
    },
    enabled: !!customerData.branchId && isOpen
  });

  // Derive gasItems from branchPrices and quantities
  const gasItems: GasItem[] = Object.keys(quantities).map(size => {
    const quantity = quantities[size];
    // Find the domestic price for this branch
    const domesticPriceObj = branchPrices?.find((p: any) => p.category.toLowerCase() === 'domestic');
    const pricePerKg = domesticPriceObj ? domesticPriceObj.pricePerKg : 1144; // Default if not found
    
    const kg = parseFloat(size.replace('KG', ''));
    const unitPrice = Math.round(pricePerKg * kg);
    
    return {
      size,
      quantity,
      unitPrice,
      totalPrice: quantity * unitPrice
    };
  });

  const generateUniqueCode = (name: string, phone: string): string => {
    const cleanName = name.replace(/\s+/g, '').toUpperCase();
    const cleanPhone = phone.replace(/\D/g, '');
    
    const phonePart = cleanPhone.slice(-3);
    const namePart = cleanName.slice(-3);
    
    return `${phonePart}${namePart}`;
  };

  const validateRegistration = (): boolean => {
    const newErrors: Record<string, string | undefined> = {};
    
    if (!customerData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!customerData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+234|0)[789]\d{9}$/.test(customerData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Nigerian phone number';
    }

    if (!customerData.branchId) {
      newErrors.branch = 'Please select a branch';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePurchase = (): boolean => {
    const hasItems = gasItems.some(item => item.quantity > 0);
    if (!hasItems) {
      setErrors({ purchase: 'Please select at least one gas cylinder' });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleCustomerDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedData = { ...customerData, [name]: value };
    
    if (name === 'name' || name === 'phone') {
      const uniqueCode = generateUniqueCode(
        name === 'name' ? value : customerData.name,
        name === 'phone' ? value : customerData.phone
      );
      updatedData.uniqueCode = uniqueCode;
    }

    if (name === 'branchId') {
      const selectedBranch = branches?.find(b => b.branchId.toString() === value);
      updatedData.branch = selectedBranch ? selectedBranch.name : '';
    }
    
    setCustomerData(updatedData);
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleQuantityChange = (size: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [size]: Math.max(0, quantity)
    }));
    
    if (errors.purchase) {
      setErrors(prev => ({ ...prev, purchase: undefined }));
    }
  };

  const getTotalAmount = (): number => {
    return gasItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getTotalItems = (): number => {
    return gasItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalKg = (): number => {
    return gasItems.reduce((total, item) => {
      const kg = parseFloat(item.size.replace('KG', ''));
      return total + (kg * item.quantity);
    }, 0);
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateRegistration()) {
      setStep('purchase');
    }
  };

  const queueMutation = useMutation({
    mutationFn: async (queueData: any) => {
      const response = await fetch('/api/FrontDesk/InsertQueue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queueData)
      });
      if (!response.ok) {
        throw new Error('Failed to inject into queue');
      }
      return response.json();
    }
  });

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePurchase()) return;

    setIsSubmitting(true);

    try {
      // Format items for description
      const description = gasItems
        .filter(item => item.quantity > 0)
        .map(item => ({
          kg: item.size,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.totalPrice
        }));

      // Inject to queue - API will generate CRB number server-side
      const queueData = {
        branchId: parseInt(customerData.branchId),
        // crbNumber is now generated server-side, not pre-fetched
        customerId: customerData.uniqueCode,
        description: description,
        amount: getTotalAmount(),
        totalKg: getTotalKg(),
        category: 'Walk-in',
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
      };

      const result = await queueMutation.mutateAsync(queueData);
      
      // Read the assigned CRB number from the API response
      setOrderResult({
        success: true,
        orderNumber: `CRB-${result.crbNumber}`,
        message: 'Your gas order has been successfully placed in the queue!'
      });
      
      setStep('success');
    } catch (error: any) {
      console.error('Order error:', error);
      setOrderResult({
        success: false,
        message: error.message || 'Failed to place order. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('register');
    setCustomerData({ name: '', phone: '', uniqueCode: '', branch: '', branchId: '' });
    setQuantities({
      '1KG': 0,
      '6KG': 0,
      '12.5KG': 0,
      '25KG': 0,
      '50KG': 0
    });
    setOrderResult(null);
    setErrors({});
    onClose();
  };

  const handleBackToRegister = () => {
    setStep('register');
    setErrors({});
  };

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('234')) {
      return '0' + cleaned.substring(3);
    }
    return cleaned;
  };

  if (!isOpen) return null;

  return (
    <div className="tw-fixed tw-inset-0 tw-bg-black/60 tw-backdrop-blur-sm tw-flex tw-items-center tw-justify-center tw-z-50 tw-p-4">
      <div className="tw-bg-gray-800/95 tw-backdrop-blur-md tw-rounded-2xl tw-border tw-border-gray-700/50 tw-w-full tw-max-w-4xl tw-max-h-[90vh] tw-overflow-hidden">
        {/* Header */}
        <div className="tw-bg-gradient-to-r tw-from-blue-600/20 tw-to-green-600/20 tw-p-6 tw-border-b tw-border-gray-700/50">
          <div className="tw-flex tw-items-center tw-justify-between">
            <div>
              <h2 className="tw-text-2xl tw-font-bold tw-text-white tw-mb-1">
                {step === 'register' ? 'Gas Purchase Order' : 
                 step === 'purchase' ? 'Gas Purchase Order' : 
                 'Order Confirmation'}
              </h2>
              <p className="tw-text-gray-300 tw-text-sm">
                {step === 'register' ? 'New gas purchase order' : 
                 step === 'purchase' ? 'Select your gas cylinders and quantities' : 
                 'Your order has been processed'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="tw-p-2 hover:tw-bg-gray-700/50 tw-rounded-lg tw-transition-colors"
            >
              <X className="tw-h-5 tw-w-5 tw-text-gray-400" />
            </button>
          </div>
        </div>

        <div className="tw-p-6 tw-overflow-y-auto tw-max-h-[calc(90vh-120px)]">
          {step === 'register' && (
            <form onSubmit={handleRegistrationSubmit} className="tw-space-y-6">
              <div className="tw-grid md:tw-grid-cols-2 tw-gap-6">
                <div>
                  <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-300 tw-mb-2">
                    Full Name *
                  </label>
                  <div className="tw-relative">
                    <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
                      <User className="tw-h-5 tw-w-5 tw-text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={customerData.name}
                      onChange={handleCustomerDataChange}
                      className={`tw-w-full tw-pl-10 tw-pr-4 tw-py-3 tw-bg-gray-700/50 tw-border tw-rounded-lg tw-text-white tw-placeholder-gray-400 focus:tw-outline-none focus:tw-ring-2 focus:tw-border-transparent tw-transition-all ${
                        errors.name 
                          ? 'tw-border-red-500 focus:tw-ring-red-500/50' 
                          : 'tw-border-gray-600 focus:tw-ring-blue-500'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="tw-mt-1 tw-text-sm tw-text-red-400 tw-flex tw-items-center tw-space-x-1">
                      <AlertCircle className="tw-h-4 tw-w-4" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-300 tw-mb-2">
                    Phone Number *
                  </label>
                  <div className="tw-relative">
                    <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
                      <Phone className="tw-h-5 tw-w-5 tw-text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={customerData.phone}
                      onChange={handleCustomerDataChange}
                      className={`tw-w-full tw-pl-10 tw-pr-4 tw-py-3 tw-bg-gray-700/50 tw-border tw-rounded-lg tw-text-white tw-placeholder-gray-400 focus:tw-outline-none focus:tw-ring-2 focus:tw-border-transparent tw-transition-all ${
                        errors.phone 
                          ? 'tw-border-red-500 focus:tw-ring-red-500/50' 
                          : 'tw-border-gray-600 focus:tw-ring-blue-500'
                      }`}
                      placeholder="e.g., 08012345678"
                    />
                  </div>
                  {errors.phone && (
                    <p className="tw-mt-1 tw-text-sm tw-text-red-400 tw-flex tw-items-center tw-space-x-1">
                      <AlertCircle className="tw-h-4 tw-w-4" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-300 tw-mb-2">
                  Select Branch *
                </label>
                <div className="tw-relative">
                  <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
                    <MapPin className="tw-h-5 tw-w-5 tw-text-gray-400" />
                  </div>
                  <select
                    name="branchId"
                    value={customerData.branchId}
                    onChange={handleCustomerDataChange}
                    className={`tw-w-full tw-pl-10 tw-pr-4 tw-py-3 tw-bg-gray-700/50 tw-border tw-rounded-lg tw-text-white focus:tw-outline-none focus:tw-ring-2 focus:tw-border-transparent tw-transition-all ${
                      errors.branch 
                        ? 'tw-border-red-500 focus:tw-ring-red-500/50' 
                        : 'tw-border-gray-600 focus:tw-ring-blue-500'
                    }`}
                    disabled={isLoadingBranches}
                  >
                    <option value="">{isLoadingBranches ? 'Loading branches...' : 'Choose your preferred branch'}</option>
                    {branches?.map((branch) => (
                      <option key={branch.branchId} value={branch.branchId}>{branch.name}</option>
                    ))}
                  </select>
                </div>
                {errors.branch && (
                  <p className="tw-mt-1 tw-text-sm tw-text-red-400 tw-flex tw-items-center tw-space-x-1">
                    <AlertCircle className="tw-h-4 tw-w-4" />
                    <span>{errors.branch}</span>
                  </p>
                )}
              </div>

              {customerData.uniqueCode && (
                <div className="tw-bg-blue-600/10 tw-border tw-border-blue-500/30 tw-rounded-lg tw-p-4">
                  <div className="tw-flex tw-items-center tw-space-x-3">
                    <Hash className="tw-h-5 tw-w-5 tw-text-blue-400 tw-flex-shrink-0" />
                    <div>
                      <h4 className="tw-text-sm tw-font-medium tw-text-blue-300 tw-mb-1">Your Unique Code</h4>
                      <div className="tw-text-2xl tw-font-bold tw-text-blue-400 tw-tracking-wider">
                        {customerData.uniqueCode}
                      </div>
                      <p className="tw-text-xs tw-text-gray-300 tw-mt-1">
                        This code will be used for your orders and support
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="tw-w-full tw-px-6 tw-py-3 tw-bg-gradient-to-r tw-from-blue-600 tw-to-green-600 tw-text-white tw-rounded-lg tw-font-semibold hover:tw-shadow-lg hover:tw-shadow-blue-500/30 tw-transition-all tw-duration-300 tw-flex tw-items-center tw-justify-center tw-space-x-2"
              >
                <ShoppingCart className="tw-h-5 tw-w-5" />
                <span>Continue to Purchase</span>
              </button>
            </form>
          )}

          {step === 'purchase' && (
            <div className="tw-space-y-6">
              {/* Customer Info Summary */}
              <div className="tw-bg-gray-700/30 tw-rounded-lg tw-p-4 tw-border tw-border-gray-600/50">
                <h3 className="tw-text-lg tw-font-semibold tw-text-white tw-mb-2">Customer Information</h3>
                <div className="tw-grid md:tw-grid-cols-3 tw-gap-4 tw-text-sm">
                  <div>
                    <span className="tw-text-gray-400">Name:</span>
                    <span className="tw-text-white tw-ml-2">{customerData.name}</span>
                  </div>
                  <div>
                    <span className="tw-text-gray-400">Code:</span>
                    <span className="tw-text-blue-400 tw-ml-2 tw-font-mono">{customerData.uniqueCode}</span>
                  </div>
                  <div>
                    <span className="tw-text-gray-400">Branch:</span>
                    <span className="tw-text-white tw-ml-2">{customerData.branch}</span>
                  </div>
                </div>
                <button
                  onClick={handleBackToRegister}
                  className="tw-mt-2 tw-text-blue-400 hover:tw-text-blue-300 tw-text-sm tw-transition-colors"
                >
                  Edit Information
                </button>
              </div>

              <form onSubmit={handlePurchaseSubmit} className="tw-space-y-6">
                <div>
                  <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
                    <h3 className="tw-text-xl tw-font-semibold tw-text-white">Select Gas Cylinders</h3>
                    {isLoadingPrices && (
                      <div className="tw-flex tw-items-center tw-space-x-2 tw-text-blue-400 tw-text-sm">
                        <Loader className="tw-h-4 tw-w-4 tw-animate-spin" />
                        <span>Updating prices...</span>
                      </div>
                    )}
                  </div>
                  
                  {errors.purchase && (
                    <div className="tw-mb-4 tw-p-3 tw-bg-red-600/20 tw-border tw-border-red-500/50 tw-rounded-lg tw-flex tw-items-center tw-space-x-2">
                      <AlertCircle className="tw-h-5 tw-w-5 tw-text-red-400" />
                      <span className="tw-text-red-300">{errors.purchase}</span>
                    </div>
                  )}

                  <div className="tw-overflow-x-auto">
                    <table className="tw-w-full">
                      <thead>
                        <tr className="tw-border-b tw-border-gray-600">
                          <th className="tw-text-left tw-py-3 tw-px-4 tw-text-gray-300 tw-font-medium">Size</th>
                          <th className="tw-text-center tw-py-3 tw-px-4 tw-text-gray-300 tw-font-medium">Quantity</th>
                          <th className="tw-text-right tw-py-3 tw-px-4 tw-text-gray-300 tw-font-medium">Unit Price</th>
                          <th className="tw-text-right tw-py-3 tw-px-4 tw-text-gray-300 tw-font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gasItems.map((item, index) => (
                          <tr key={item.size} className="tw-border-b tw-border-gray-700/50">
                            <td className="tw-py-4 tw-px-4">
                              <div className="tw-flex tw-items-center tw-space-x-2">
                                <div className="tw-w-8 tw-h-8 tw-bg-gradient-to-r tw-from-blue-500 tw-to-green-500 tw-rounded-lg tw-flex tw-items-center tw-justify-center">
                                  <span className="tw-text-white tw-text-xs tw-font-bold">{item.size.split('K')[0]}</span>
                                </div>
                                <span className="tw-text-white tw-font-medium">{item.size}</span>
                              </div>
                            </td>
                            <td className="tw-py-4 tw-px-4 tw-text-center">
                              <div className="tw-flex tw-items-center tw-justify-center tw-space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(item.size, item.quantity - 1)}
                                  className="tw-w-8 tw-h-8 tw-bg-gray-600 hover:tw-bg-gray-500 tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-text-white tw-transition-colors"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  value={item.quantity === 0 ? "" : item.quantity}
                                  placeholder="0"
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.size,
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="tw-w-16 tw-px-2 tw-py-1 tw-bg-gray-700 tw-border tw-border-gray-600 tw-rounded tw-text-white tw-text-center focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(item.size, item.quantity + 1)}
                                  className="tw-w-8 tw-h-8 tw-bg-gray-600 hover:tw-bg-gray-500 tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-text-white tw-transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="tw-py-4 tw-px-4 tw-text-right tw-text-white">
                              ₦{item.unitPrice.toLocaleString()}
                            </td>
                            <td className="tw-py-4 tw-px-4 tw-text-right tw-text-white tw-font-semibold">
                              ₦{item.totalPrice.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="tw-bg-gradient-to-r tw-from-blue-600/10 tw-to-green-600/10 tw-rounded-lg tw-p-6 tw-border tw-border-gray-600/50">
                  <h3 className="tw-text-lg tw-font-semibold tw-text-white tw-mb-4">Order Summary</h3>
                  <div className="tw-space-y-2">
                    <div className="tw-flex tw-justify-between tw-text-gray-300">
                      <span>Total Items:</span>
                      <span>{getTotalItems()} cylinders</span>
                    </div>
                    <div className="tw-flex tw-justify-between tw-text-gray-300">
                      <span>Subtotal:</span>
                      <span>₦{getTotalAmount().toLocaleString()}</span>
                    </div>
                    <div className="tw-border-t tw-border-gray-600 tw-pt-2 tw-mt-2">
                      <div className="tw-flex tw-justify-between tw-text-white tw-font-bold tw-text-lg">
                        <span>Total Amount:</span>
                        <span>₦{getTotalAmount().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || getTotalAmount() === 0}
                  className="tw-w-full tw-px-6 tw-py-4 tw-bg-gradient-to-r tw-from-green-600 tw-to-blue-600 tw-text-white tw-rounded-lg tw-font-semibold hover:tw-shadow-lg hover:tw-shadow-green-500/30 tw-transition-all tw-duration-300 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-flex tw-items-center tw-justify-center tw-space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="tw-h-5 tw-w-5 tw-animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="tw-h-5 tw-w-5" />
                      <span>Place Order - ₦{getTotalAmount().toLocaleString()}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {step === 'success' && orderResult && (
            <div className="tw-text-center tw-space-y-6">
              {orderResult.success ? (
                <>
                  <div className="tw-inline-flex tw-items-center tw-justify-center tw-w-20 tw-h-20 tw-bg-green-500/20 tw-rounded-full tw-mb-4">
                    <CheckCircle className="tw-h-10 tw-w-10 tw-text-green-400" />
                  </div>
                  <h3 className="tw-text-2xl tw-font-bold tw-text-white tw-mb-2">Order Placed Successfully!</h3>
                  
                  <div className="tw-bg-gray-700/50 tw-rounded-lg tw-p-6 tw-mb-6">
                    <div className="tw-grid md:tw-grid-cols-2 tw-gap-4 tw-text-left">
                      <div>
                        <h4 className="tw-text-sm tw-font-medium tw-text-gray-400 tw-mb-1">Order Number</h4>
                        <p className="tw-text-xl tw-font-bold tw-text-blue-400">{orderResult.orderNumber}</p>
                      </div>
                      <div>
                        <h4 className="tw-text-sm tw-font-medium tw-text-gray-400 tw-mb-1">Customer Code</h4>
                        <p className="tw-text-xl tw-font-bold tw-text-green-400">{customerData.uniqueCode}</p>
                      </div>
                      <div>
                        <h4 className="tw-text-sm tw-font-medium tw-text-gray-400 tw-mb-1">Branch</h4>
                        <p className="tw-text-white">{customerData.branch}</p>
                      </div>
                      <div>
                        <h4 className="tw-text-sm tw-font-medium tw-text-gray-400 tw-mb-1">Total Amount</h4>
                        <p className="tw-text-xl tw-font-bold tw-text-white">₦{getTotalAmount().toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="tw-bg-blue-600/10 tw-border tw-border-blue-500/30 tw-rounded-lg tw-p-4 tw-mb-6">
                    <h4 className="tw-text-blue-300 tw-font-medium tw-mb-2">Next Steps:</h4>
                    <ul className="tw-text-gray-300 tw-text-sm tw-space-y-1 tw-text-left">
                      <li>• Visit your selected branch: {customerData.branch}</li>
                      <li>• Present your order number: {orderResult.orderNumber}</li>
                      <li>• Complete payment and collect your gas cylinders</li>
                      <li>• Keep your customer code for future orders</li>
                    </ul>
                  </div>

                  <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4 tw-justify-center">
                    <button
                      onClick={handleClose}
                      className="tw-px-6 tw-py-3 tw-bg-gradient-to-r tw-from-blue-600 tw-to-green-600 tw-text-white tw-rounded-lg tw-font-semibold hover:tw-shadow-lg hover:tw-shadow-blue-500/30 tw-transition-all tw-duration-300"
                    >
                      Close
                    </button>
                    <a
                      href={`tel:+2348085379134`}
                      className="tw-px-6 tw-py-3 tw-bg-gray-700 tw-text-white tw-rounded-lg tw-font-semibold hover:tw-bg-gray-600 tw-transition-colors"
                    >
                      Call Branch
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <div className="tw-inline-flex tw-items-center tw-justify-center tw-w-20 tw-h-20 tw-bg-red-500/20 tw-rounded-full tw-mb-4">
                    <AlertCircle className="tw-h-10 tw-w-10 tw-text-red-400" />
                  </div>
                  <h3 className="tw-text-2xl tw-font-bold tw-text-white tw-mb-2">Order Failed</h3>
                  <p className="tw-text-gray-300 tw-mb-6">{orderResult.message}</p>
                  <button
                    onClick={() => setStep('purchase')}
                    className="tw-px-6 tw-py-3 tw-bg-blue-600 tw-text-white tw-rounded-lg tw-font-semibold hover:tw-bg-blue-700 tw-transition-colors"
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GasPurchaseForm;