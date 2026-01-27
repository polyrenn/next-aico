import React from 'react';
import { User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="no-print bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  AICO GAS LIMITED
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Admin
                </p>
              </div>
            </div>

          </div>
        </div>
      </header>
      <main className="pb-safe">{children}</main>
    </div>
  );
};

export default Layout;