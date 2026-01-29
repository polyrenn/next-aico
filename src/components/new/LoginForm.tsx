import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = login(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
    setIsLoading(false);
  };

  return (
    <div className="tw-min-h-screen tw-bg-gradient-to-br from-blue-50 to-indigo-100 dark:tw-from-gray-900 dark:tw-to-gray-800 tw-flex tw-items-center tw-justify-center tw-p-4">
      <div className="tw-w-full tw-max-w-md">
        <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-2xl tw-shadow-xl tw-p-8">
          {/* Logo and Title */}
          <div className="tw-text-center tw-mb-8">
            <div className="tw-bg-blue-600 tw-w-16 tw-h-16 tw-rounded-full tw-mx-auto tw-mb-4 tw-flex tw-items-center tw-justify-center">
              <LogIn className="tw-h-8 tw-w-8 tw-text-white" />
            </div>
            <h1 className="tw-text-2xl tw-font-bold tw-text-gray-900 dark:tw-text-white tw-mb-2">
              AICO GAS LIMITED
            </h1>
            <p className="tw-text-gray-600 dark:tw-text-gray-400">
              Sales Invoice System
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="tw-bg-blue-50 dark:tw-bg-blue-900/20 tw-rounded-lg tw-p-4 tw-mb-6">
            <h3 className="tw-text-sm tw-font-medium tw-text-blue-800 dark:tw-text-blue-200 tw-mb-2">
              Demo Credentials:
            </h3>
            <div className="tw-text-xs tw-text-blue-700 dark:tw-text-blue-300 tw-space-y-1">
              <div>admin / admin123</div>
              <div>sales1 / sales123</div>
              <div>airportcrb / airport1</div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="tw-space-y-6">
            {error && (
              <div className="tw-bg-red-50 dark:tw-bg-red-900/20 tw-border tw-border-red-200 dark:tw-border-red-800 tw-rounded-lg tw-p-4 tw-flex tw-items-center tw-space-x-3">
                <AlertCircle className="tw-h-5 tw-w-5 tw-text-red-500" />
                <span className="tw-text-sm tw-text-red-700 dark:tw-text-red-300">{error}</span>
              </div>
            )}

            <div className="tw-space-y-4">
              <div>
                <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-2">
                  Username
                </label>
                <div className="tw-relative">
                  <User className="tw-absolute left-3 top-1/2 tw-transform -translate-y-1/2 tw-h-5 tw-w-5 tw-text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="tw-w-full tw-pl-10 tw-pr-4 tw-py-3 tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent tw-bg-white dark:tw-bg-gray-700 tw-text-gray-900 dark:tw-text-white"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-2">
                  Password
                </label>
                <div className="tw-relative">
                  <Lock className="tw-absolute left-3 top-1/2 tw-transform -translate-y-1/2 tw-h-5 tw-w-5 tw-text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="tw-w-full tw-pl-10 tw-pr-4 tw-py-3 tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent tw-bg-white dark:tw-bg-gray-700 tw-text-gray-900 dark:tw-text-white"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="tw-w-full tw-bg-blue-600 hover:tw-bg-blue-700 disabled:tw-bg-blue-400 disabled:tw-cursor-not-allowed tw-text-white tw-font-medium tw-py-3 tw-px-4 tw-rounded-lg tw-transition-colors tw-flex tw-items-center tw-justify-center tw-space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin tw-rounded-full tw-h-5 tw-w-5 tw-border-2 tw-border-white tw-border-t-transparent"></div>
              ) : (
                <>
                  <LogIn className="tw-h-5 tw-w-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;