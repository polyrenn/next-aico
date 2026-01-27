import React, { useState } from 'react';
import { X, User, Phone, MapPin, ShoppingCart, Calculator, CheckCircle, AlertCircle, Loader, Hash } from 'lucide-react';

interface GasPurchaseFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CustomerData {
  name: string;
  phone: string;
  uniqueCode: string;
  branch: string;
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

const GasPurchaseForm: React.FC<GasPurchaseFormProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'register' | 'purchase' | 'success'>('register');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    phone: '',
    uniqueCode: '',
    branch: ''
  });
  const [gasItems, setGasItems] = useState<GasItem[]>([
    { size: '1KG', quantity: 0, unitPrice: 1144, totalPrice: 0 },
    { size: '6KG', quantity: 0, unitPrice: 6864, totalPrice: 0 },
    { size: '12.5KG', quantity: 0, unitPrice: 14300, totalPrice: 0 },
    { size: '25KG', quantity: 0, unitPrice: 28600, totalPrice: 0 },
    { size: '50KG', quantity: 0, unitPrice: 57200, totalPrice: 0 }
  ]);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const branches = [
    'Airport Road',
    'Ugbor',
    'Ugbowo',
    'Aduwawa',
    'Upper Mission',
    'Ogba'
  ];

  const generateUniqueCode = (name: string, phone: string): string => {
    const namePrefix = name.trim().substring(0, 3).toUpperCase();
    const phoneSuffix = phone.replace(/\D/g, '').slice(-3);
    return `${namePrefix}${phoneSuffix}`;
  };

  const validateRegistration = (): boolean => {
    const newErrors: Record<string, string | undefined> = {};
    
    if (!customerData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (customerData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!customerData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+234|0)[789]\d{9}$/.test(customerData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Nigerian phone number';
    }

    if (!customerData.branch) {
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
    
    setCustomerData(updatedData);
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedItems = [...gasItems];
    updatedItems[index].quantity = Math.max(0, quantity);
    updatedItems[index].totalPrice = updatedItems[index].quantity * updatedItems[index].unitPrice;
    setGasItems(updatedItems);
    
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

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateRegistration()) {
      setStep('purchase');
    }
  };

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePurchase()) return;

    setIsSubmitting(true);

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderNumber = `AICO${Date.now().toString().slice(-6)}`;
      
      setOrderResult({
        success: true,
        orderNumber,
        message: 'Your gas order has been placed successfully!'
      });
      
      setStep('success');
    } catch (error) {
      setOrderResult({
        success: false,
        message: 'Failed to place order. Please try again or contact support.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('register');
    setCustomerData({ name: '', phone: '', uniqueCode: '', branch: '' });
    setGasItems(gasItems.map(item => ({ ...item, quantity: 0, totalPrice: 0 })));
    setOrderResult(null);
    setErrors({});
    onClose();
  };

  const handleBackToRegister = () => {
    setStep('register');
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/95 backdrop-blur-md rounded-2xl border border-gray-700/50 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {step === 'register' ? 'Customer Registration' : 
                 step === 'purchase' ? 'Gas Purchase Order' : 
                 'Order Confirmation'}
              </h2>
              <p className="text-gray-300 text-sm">
                {step === 'register' ? 'Register to place your gas order' : 
                 step === 'purchase' ? 'Select your gas cylinders and quantities' : 
                 'Your order has been processed'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {step === 'register' && (
            <form onSubmit={handleRegistrationSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={customerData.name}
                      onChange={handleCustomerDataChange}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                        errors.name 
                          ? 'border-red-500 focus:ring-red-500/50' 
                          : 'border-gray-600 focus:ring-blue-500'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={customerData.phone}
                      onChange={handleCustomerDataChange}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                        errors.phone 
                          ? 'border-red-500 focus:ring-red-500/50' 
                          : 'border-gray-600 focus:ring-blue-500'
                      }`}
                      placeholder="e.g., 08012345678"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Branch *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    name="branch"
                    value={customerData.branch}
                    onChange={handleCustomerDataChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      errors.branch 
                        ? 'border-red-500 focus:ring-red-500/50' 
                        : 'border-gray-600 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">Choose your preferred branch</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
                {errors.branch && (
                  <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.branch}</span>
                  </p>
                )}
              </div>

              {customerData.uniqueCode && (
                <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Hash className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-300 mb-1">Your Unique Code</h4>
                      <div className="text-2xl font-bold text-blue-400 tracking-wider">
                        {customerData.uniqueCode}
                      </div>
                      <p className="text-xs text-gray-300 mt-1">
                        This code will be used for your orders and support
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Continue to Purchase</span>
              </button>
            </form>
          )}

          {step === 'purchase' && (
            <div className="space-y-6">
              {/* Customer Info Summary */}
              <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
                <h3 className="text-lg font-semibold text-white mb-2">Customer Information</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white ml-2">{customerData.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Code:</span>
                    <span className="text-blue-400 ml-2 font-mono">{customerData.uniqueCode}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Branch:</span>
                    <span className="text-white ml-2">{customerData.branch}</span>
                  </div>
                </div>
                <button
                  onClick={handleBackToRegister}
                  className="mt-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  Edit Information
                </button>
              </div>

              <form onSubmit={handlePurchaseSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Select Gas Cylinders</h3>
                  
                  {errors.purchase && (
                    <div className="mb-4 p-3 bg-red-600/20 border border-red-500/50 rounded-lg flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <span className="text-red-300">{errors.purchase}</span>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-600">
                          <th className="text-left py-3 px-4 text-gray-300 font-medium">Size</th>
                          <th className="text-center py-3 px-4 text-gray-300 font-medium">Quantity</th>
                          <th className="text-right py-3 px-4 text-gray-300 font-medium">Unit Price</th>
                          <th className="text-right py-3 px-4 text-gray-300 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gasItems.map((item, index) => (
                          <tr key={item.size} className="border-b border-gray-700/50">
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">{item.size.split('K')[0]}</span>
                                </div>
                                <span className="text-white font-medium">{item.size}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(index, item.quantity - 1)}
                                  className="w-8 h-8 bg-gray-600 hover:bg-gray-500 rounded-lg flex items-center justify-center text-white transition-colors"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                                  className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(index, item.quantity + 1)}
                                  className="w-8 h-8 bg-gray-600 hover:bg-gray-500 rounded-lg flex items-center justify-center text-white transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right text-white">
                              ₦{item.unitPrice.toLocaleString()}
                            </td>
                            <td className="py-4 px-4 text-right text-white font-semibold">
                              ₦{item.totalPrice.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gradient-to-r from-blue-600/10 to-green-600/10 rounded-lg p-6 border border-gray-600/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>Total Items:</span>
                      <span>{getTotalItems()} cylinders</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal:</span>
                      <span>₦{getTotalAmount().toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-600 pt-2 mt-2">
                      <div className="flex justify-between text-white font-bold text-lg">
                        <span>Total Amount:</span>
                        <span>₦{getTotalAmount().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || getTotalAmount() === 0}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="h-5 w-5" />
                      <span>Place Order - ₦{getTotalAmount().toLocaleString()}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {step === 'success' && orderResult && (
            <div className="text-center space-y-6">
              {orderResult.success ? (
                <>
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
                    <CheckCircle className="h-10 w-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Order Placed Successfully!</h3>
                  
                  <div className="bg-gray-700/50 rounded-lg p-6 mb-6">
                    <div className="grid md:grid-cols-2 gap-4 text-left">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Order Number</h4>
                        <p className="text-lg font-bold text-blue-400">{orderResult.orderNumber}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Customer Code</h4>
                        <p className="text-lg font-bold text-green-400">{customerData.uniqueCode}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Branch</h4>
                        <p className="text-white">{customerData.branch}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Total Amount</h4>
                        <p className="text-lg font-bold text-white">₦{getTotalAmount().toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                    <h4 className="text-blue-300 font-medium mb-2">Next Steps:</h4>
                    <ul className="text-gray-300 text-sm space-y-1 text-left">
                      <li>• Visit your selected branch: {customerData.branch}</li>
                      <li>• Present your order number: {orderResult.orderNumber}</li>
                      <li>• Complete payment and collect your gas cylinders</li>
                      <li>• Keep your customer code for future orders</li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleClose}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                    >
                      Close
                    </button>
                    <a
                      href={`tel:+2348085379134`}
                      className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                    >
                      Call Branch
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-4">
                    <AlertCircle className="h-10 w-10 text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Order Failed</h3>
                  <p className="text-gray-300 mb-6">{orderResult.message}</p>
                  <button
                    onClick={() => setStep('purchase')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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