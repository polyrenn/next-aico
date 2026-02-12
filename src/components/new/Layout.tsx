import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { User, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  userName?: string;
  role?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, userName, role }) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch('/api/Common/Logout', { method: 'POST' });
      if (res.ok) {
        router.push('/Login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="tw-min-h-screen tw-bg-gray-50 dark:tw-bg-gray-900">
      <header className="tw-no-print tw-bg-white dark:tw-bg-gray-800 tw-shadow-sm tw-border-b tw-border-gray-200 dark:tw-border-gray-700">
        <div className="tw-px-4 tw-py-3">
          <div className="tw-flex tw-items-center tw-justify-between">
            <div className="tw-flex tw-items-center tw-space-x-3">
              <div className="tw-bg-blue-600 tw-p-2 tw-rounded-lg">
                <User className="tw-h-5 tw-w-5 tw-text-white" />
              </div>
              <div>
                <h1 className="tw-text-lg tw-font-bold tw-text-gray-900 dark:tw-text-white">
                  AICO GAS LIMITED
                </h1>
                <p className="tw-text-sm tw-text-gray-600 dark:tw-text-gray-400">
                  {userName || 'Guest'} ({role || 'Staff'})
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="tw-flex tw-items-center tw-space-x-2 tw-px-3 tw-py-2 tw-text-sm tw-font-medium tw-text-red-600 dark:tw-text-red-400 tw-bg-red-50 dark:tw-bg-red-900/20 hover:tw-bg-red-100 dark:hover:tw-bg-red-900/30 tw-rounded-lg tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
            >
              <LogOut className="tw-h-4 tw-w-4" />
              <span>{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
            </button>
          </div>
        </div>
      </header>
      <main className="tw-pb-safe">{children}</main>
    </div>
  );
};

export default Layout;