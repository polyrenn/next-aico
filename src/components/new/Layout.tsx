import React from 'react';
import { User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  userName?: string;
  role?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, userName, role }) => {


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

          </div>
        </div>
      </header>
      <main className="tw-pb-safe">{children}</main>
    </div>
  );
};

export default Layout;