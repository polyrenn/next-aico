import React, { useState } from 'react';
import { X, User, Phone, MapPin, Hash, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';

interface CustomerRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  phone: string;
  branchId: string;
}

interface RegistrationResult {
  success: boolean;
  customerId?: string;
  message: string;
}

interface Branch {
  branchId: number;
  name: string;
  address: string;
}

const CustomerRegistration: React.FC<CustomerRegistrationProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({ name: '', phone: '', branchId: '' });
  const [result, setResult] = useState<RegistrationResult | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Fetch Branches
  const { data: branches, isLoading: isLoadingBranches } = useQuery<Branch[]>({
    queryKey: ['branches'],
    queryFn: async () => {
      const res = await fetch('/api/Common/GetBranches');
      if (!res.ok) throw new Error('Failed to fetch branches');
      return res.json();
    }
  });

  const generateUniqueId = (name: string, phone: string): string => {
    // Standard format consistent with screenshot: 3 numbers and 3 uppercase letters
    const cleanName = name.replace(/\s+/g, '').toUpperCase();
    const cleanPhone = phone.replace(/\D/g, '');
    
    const phonePart = cleanPhone.slice(-3);
    const namePart = cleanName.slice(-3);
    
    return `${phonePart}${namePart}`;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+234|0)[789]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Nigerian phone number';
    }

    if (!formData.branchId) {
      newErrors.branchId = 'Please select a branch';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Formats phone number to stay within DB's VarChar(12) limit.
   * Standard Nigerian mobile format (080...) is 11 characters.
   */
  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    // If it starts with 234, convert to 0 and ensure local format (11 digits)
    if (cleaned.startsWith('234')) {
      return '0' + cleaned.substring(3);
    }
    // Return the cleaned digits (e.g., 08123456789)
    return cleaned;
  };

  const mutation = useMutation({
    mutationFn: async (customerData: any) => {
      const response = await fetch('/api/Customer/create-customer-mobile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register customer');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setResult({
        success: true,
        customerId: data.uniqueId,
        message: 'Registration successful! Your customer ID has been generated.'
      });
      setFormData({ name: '', phone: '', branchId: '' });
      setErrors({});
    },
    onError: (error: Error) => {
      setResult({
        success: false,
        message: error.message || 'Registration failed. This phone number or ID might already exist.'
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Generate Unique ID using uppercase logic for consistency with other IDs
    const uniqueId = generateUniqueId(formData.name, formData.phone);
    const formattedPhone = formatPhoneNumber(formData.phone);
    
    mutation.mutate({
      uniqueId,
      name: formData.name.trim().substring(0, 100), // Ensure within 100 character limit
      phone: formattedPhone.substring(0, 12), // Ensure within 12 character limit
      branchId: parseInt(formData.branchId),
      date: new Date().toISOString()
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleClose = () => {
    setFormData({ name: '', phone: '', branchId: '' });
    setErrors({});
    setResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="tw-fixed tw-inset-0 tw-bg-black/60 tw-backdrop-blur-sm tw-flex tw-items-center tw-justify-center tw-z-50 tw-p-4">
      <div className="tw-bg-gray-800/95 tw-backdrop-blur-md tw-rounded-2xl tw-border tw-border-gray-700/50 tw-w-full tw-max-w-md tw-relative tw-overflow-hidden">
        {/* Header */}
        <div className="tw-bg-gradient-to-r tw-from-blue-600/20 tw-to-green-600/20 tw-p-6 tw-border-b tw-border-gray-700/50">
          <div className="tw-flex tw-items-center tw-justify-between">
            <div>
              <h2 className="tw-text-2xl tw-font-bold tw-text-white tw-mb-1">Customer Registration</h2>
              <p className="tw-text-gray-300 tw-text-sm">Join AICO GAS family and get your unique customer ID</p>
            </div>
            <button
              onClick={handleClose}
              className="tw-p-2 hover:tw-bg-gray-700/50 tw-rounded-lg tw-transition-colors"
            >
              <X className="tw-h-5 tw-w-5 tw-text-gray-400" />
            </button>
          </div>
        </div>

        <div className="tw-p-6">
          {result ? (
            <div className="tw-text-center">
              {result.success ? (
                <div className="tw-space-y-4">
                  <div className="tw-inline-flex tw-items-center tw-justify-center tw-w-16 tw-h-16 tw-bg-green-500/20 tw-rounded-full tw-mb-4">
                    <CheckCircle className="tw-h-8 tw-w-8 tw-text-green-400" />
                  </div>
                  <h3 className="tw-text-xl tw-font-semibold tw-text-white tw-mb-2">Registration Successful!</h3>
                  <div className="tw-bg-gray-700/50 tw-rounded-lg tw-p-4 tw-mb-4">
                    <div className="tw-flex tw-items-center tw-justify-center tw-space-x-2 tw-mb-2">
                      <Hash className="tw-h-5 tw-w-5 tw-text-blue-400" />
                      <span className="tw-text-gray-300 tw-font-medium">Your Customer ID</span>
                    </div>
                    <div className="tw-text-3xl tw-font-bold tw-text-blue-400 tw-tracking-wider">
                      {result.customerId}
                    </div>
                  </div>
                  <p className="tw-text-gray-300 tw-text-sm tw-mb-6">
                    Please save this ID for future reference. You can use it for orders and support.
                  </p>
                  <button
                    onClick={handleClose}
                    className="tw-w-full tw-px-6 tw-py-3 tw-bg-gradient-to-r tw-from-blue-600 tw-to-green-600 tw-text-white tw-rounded-lg tw-font-semibold hover:tw-shadow-lg hover:tw-shadow-blue-500/30 tw-transition-all tw-duration-300"
                  >
                    Continue
                  </button>
                </div>
              ) : (
                <div className="tw-space-y-4">
                  <div className="tw-inline-flex tw-items-center tw-justify-center tw-w-16 tw-h-16 tw-bg-red-500/20 tw-rounded-full tw-mb-4">
                    <AlertCircle className="tw-h-8 tw-w-8 tw-text-red-400" />
                  </div>
                  <h3 className="tw-text-xl tw-font-semibold tw-text-white tw-mb-2">Registration Failed</h3>
                  <p className="tw-text-gray-300 tw-text-sm tw-mb-6">{result.message}</p>
                  <button
                    onClick={() => setResult(null)}
                    className="tw-w-full tw-px-6 tw-py-3 tw-bg-blue-600 tw-text-white tw-rounded-lg tw-font-semibold hover:tw-bg-blue-700 tw-transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="tw-space-y-6">
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
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`tw-w-full tw-pl-10 tw-pr-4 tw-py-3 tw-bg-gray-700/50 tw-border tw-rounded-lg tw-text-white tw-placeholder-gray-400 focus:tw-outline-none focus:tw-ring-2 focus:tw-border-transparent tw-transition-all ${
                      errors.name 
                        ? 'tw-border-red-500 focus:tw-ring-red-500/50' 
                        : 'tw-border-gray-600 focus:tw-ring-blue-500'
                    }`}
                    placeholder="Enter your full name"
                    disabled={mutation.isPending}
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
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`tw-w-full tw-pl-10 tw-pr-4 tw-py-3 tw-bg-gray-700/50 tw-border tw-rounded-lg tw-text-white tw-placeholder-gray-400 focus:tw-outline-none focus:tw-ring-2 focus:tw-border-transparent tw-transition-all ${
                      errors.phone 
                        ? 'tw-border-red-500 focus:tw-ring-red-500/50' 
                        : 'tw-border-gray-600 focus:tw-ring-blue-500'
                    }`}
                    placeholder="e.g., 08012345678"
                    disabled={mutation.isPending}
                  />
                </div>
                {errors.phone && (
                  <p className="tw-mt-1 tw-text-sm tw-text-red-400 tw-flex tw-items-center tw-space-x-1">
                    <AlertCircle className="tw-h-4 tw-w-4" />
                    <span>{errors.phone}</span>
                  </p>
                )}
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
                    value={formData.branchId}
                    onChange={handleInputChange}
                    className={`tw-w-full tw-pl-10 tw-pr-4 tw-py-3 tw-bg-gray-700/50 tw-border tw-rounded-lg tw-text-white focus:tw-outline-none focus:tw-ring-2 focus:tw-border-transparent tw-transition-all ${
                      errors.branchId 
                        ? 'tw-border-red-500 focus:tw-ring-red-500/50' 
                        : 'tw-border-gray-600 focus:tw-ring-blue-500'
                    }`}
                    disabled={mutation.isPending || isLoadingBranches}
                  >
                    <option value="">{isLoadingBranches ? 'Loading branches...' : 'Choose your branch'}</option>
                    {branches?.map((branch) => (
                      <option key={branch.branchId} value={branch.branchId}>{branch.name}</option>
                    ))}
                  </select>
                </div>
                {errors.branchId && (
                  <p className="tw-mt-1 tw-text-sm tw-text-red-400 tw-flex tw-items-center tw-space-x-1">
                    <AlertCircle className="tw-h-4 tw-w-4" />
                    <span>{errors.branchId}</span>
                  </p>
                )}
              </div>

              <div className="tw-bg-blue-600/10 tw-border tw-border-blue-500/30 tw-rounded-lg tw-p-4">
                <div className="tw-flex tw-items-start tw-space-x-3">
                  <Hash className="tw-h-5 tw-w-5 tw-text-blue-400 tw-mt-0.5 tw-flex-shrink-0" />
                  <div>
                    <h4 className="tw-text-sm tw-font-medium tw-text-blue-300 tw-mb-1">Customer ID Benefits</h4>
                    <ul className="tw-text-xs tw-text-gray-300 tw-space-y-1">
                      <li>• Faster order processing</li>
                      <li>• Priority customer support</li>
                      <li>• Order history tracking</li>
                      <li>• Exclusive offers and discounts</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="tw-w-full tw-px-6 tw-py-3 tw-bg-gradient-to-r tw-from-blue-600 tw-to-green-600 tw-text-white tw-rounded-lg tw-font-semibold hover:tw-shadow-lg hover:tw-shadow-blue-500/30 tw-transition-all tw-duration-300 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-flex tw-items-center tw-justify-center tw-space-x-2"
              >
                {mutation.isPending ? (
                  <>
                    <Loader className="tw-h-5 tw-w-5 tw-animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <User className="tw-h-5 tw-w-5" />
                    <span>Register & Get Customer ID</span>
                  </>
                )}
              </button>

              <p className="tw-text-xs tw-text-gray-400 tw-text-center">
                By registering, you agree to our terms of service and privacy policy.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerRegistration;