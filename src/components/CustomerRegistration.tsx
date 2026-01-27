import React, { useState } from 'react';
import { X, User, Phone, Hash, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface CustomerRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  phone: string;
}

interface RegistrationResult {
  success: boolean;
  customerId?: string;
  message: string;
}

const CustomerRegistration: React.FC<CustomerRegistrationProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<RegistrationResult | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const generateCustomerId = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+234|0)[789]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Nigerian phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.startsWith('0')) {
      return '+234' + cleaned.substring(1);
    }
    return cleaned.startsWith('+234') ? cleaned : '+234' + cleaned;
  };

  const submitToGoogleSheets = async (customerData: any): Promise<boolean> => {
    try {
      // Google Apps Script Web App URL - Replace with your actual deployment URL
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw5O_OmYmgNlPsYXZHDQZcWw4k24FvkRd0GdKLZvWKS9NW_NSME4ZaQOZT94kUGRhV-/exec';
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData)
      });

      // Since we're using no-cors mode, we can't read the response
      // We'll assume success if no error is thrown
      return true;
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const customerId = generateCustomerId();
      const formattedPhone = formatPhoneNumber(formData.phone);
      
      const customerData = {
        customerId,
        name: formData.name.trim(),
        phone: formattedPhone,
        registrationDate: new Date().toISOString(),
        timestamp: new Date().getTime()
      };

      // Submit to Google Sheets
      const success = await submitToGoogleSheets(customerData);

      if (success) {
        setResult({
          success: true,
          customerId,
          message: 'Registration successful! Your customer ID has been generated.'
        });
        
        // Reset form
        setFormData({ name: '', phone: '' });
        setErrors({});
      } else {
        throw new Error('Failed to submit registration');
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Registration failed. Please try again or contact support.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleClose = () => {
    setFormData({ name: '', phone: '' });
    setErrors({});
    setResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/95 backdrop-blur-md rounded-2xl border border-gray-700/50 w-full max-w-md relative overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Customer Registration</h2>
              <p className="text-gray-300 text-sm">Join AICO GAS family and get your unique customer ID</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {result ? (
            <div className="text-center">
              {result.success ? (
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Registration Successful!</h3>
                  <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Hash className="h-5 w-5 text-blue-400" />
                      <span className="text-gray-300 font-medium">Your Customer ID</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-400 tracking-wider">
                      {result.customerId}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-6">
                    Please save this ID for future reference. You can use it for orders and support.
                  </p>
                  <button
                    onClick={handleClose}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                  >
                    Continue
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                    <AlertCircle className="h-8 w-8 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Registration Failed</h3>
                  <p className="text-gray-300 text-sm mb-6">{result.message}</p>
                  <button
                    onClick={() => setResult(null)}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      errors.name 
                        ? 'border-red-500 focus:ring-red-500/50' 
                        : 'border-gray-600 focus:ring-blue-500'
                    }`}
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
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
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      errors.phone 
                        ? 'border-red-500 focus:ring-red-500/50' 
                        : 'border-gray-600 focus:ring-blue-500'
                    }`}
                    placeholder="e.g., 08012345678"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.phone}</span>
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  Enter your Nigerian phone number (e.g., 08012345678)
                </p>
              </div>

              <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Hash className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-300 mb-1">Customer ID Benefits</h4>
                    <ul className="text-xs text-gray-300 space-y-1">
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
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <User className="h-5 w-5" />
                    <span>Register & Get Customer ID</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
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