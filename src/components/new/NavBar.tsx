import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, Flame } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Prices', path: '/prices' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => router.pathname === path;

  return (
    <nav className="tw-bg-gray-900/80 tw-backdrop-blur-md tw-border-b tw-border-gray-700/50 tw-sticky tw-top-0 tw-z-50">
      <div className="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8">
        <div className="tw-flex tw-items-center tw-justify-between tw-h-16">
          <div className="tw-flex tw-items-center">
            <Link href="/" className="tw-flex tw-items-center tw-space-x-2">
              <div className="tw-p-2 tw-bg-gradient-to-r tw-from-blue-500 tw-to-green-500 tw-rounded-lg">
                <Flame className="tw-h-6 tw-w-6 tw-text-white" />
              </div>
              <span className="tw-text-xl tw-font-bold tw-text-white">AICO GAS LIMITED</span>
            </Link>
          </div>
          
          <div className="tw-hidden md:tw-block">
            <div className="tw-ml-10 tw-flex tw-items-baseline tw-space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`tw-px-3 tw-py-2 tw-rounded-md tw-text-sm tw-font-medium tw-transition-all tw-duration-300 ${
                    isActive(item.path)
                      ? 'tw-bg-blue-600 tw-text-white tw-shadow-lg tw-shadow-blue-500/30'
                      : 'tw-text-gray-300 hover:tw-bg-gray-700 hover:tw-text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:tw-hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="tw-inline-flex tw-items-center tw-justify-center tw-p-2 tw-rounded-md tw-text-gray-400 hover:tw-text-white hover:tw-bg-gray-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-inset focus:tw-ring-white"
            >
              {isOpen ? <X className="tw-h-6 tw-w-6" /> : <Menu className="tw-h-6 tw-w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:tw-hidden">
          <div className="tw-px-2 tw-pt-2 tw-pb-3 tw-space-y-1 sm:tw-px-3 tw-bg-gray-800/90 tw-backdrop-blur-md">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`tw-block tw-px-3 tw-py-2 tw-rounded-md tw-text-base tw-font-medium tw-transition-all tw-duration-300 ${
                  isActive(item.path)
                    ? 'tw-bg-blue-600 tw-text-white tw-shadow-lg tw-shadow-blue-500/30'
                    : 'tw-text-gray-300 hover:tw-bg-gray-700 hover:tw-text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;