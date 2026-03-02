import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Phone, Hash, X, Loader } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Customer {
  id: number;
  name: string;
  phone: string;
  uniqueId: string;
  customerType: string | null;
  purchaseCount: number;
}

interface CustomerSearchProps {
  branchId: number;
  value: string;
  onChange: (name: string, uniqueId: string | null) => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Memory-safe customer search component with:
 * - React Query for caching & auto-cancellation
 * - Debounced input to reduce network hits
 * - Threshold-based searching (3+ chars)
 */
const CustomerSearch: React.FC<CustomerSearchProps> = ({
  branchId,
  value,
  onChange,
  disabled = false,
  placeholder = 'Search or enter customer name',
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Debounce logic: Only update debouncedValue after 500ms of no typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // 2. React Query: Handle the heavy lifting
  const { data, isLoading } = useQuery({
    queryKey: ['customerSearch', branchId, debouncedValue],
    queryFn: async ({ signal }) => {
      if (!debouncedValue.trim() || debouncedValue.length < 3) return { items: [] };
      
      const res = await fetch(
        `/api/Customer/search-mobile?branch=${branchId}&searchTerm=${encodeURIComponent(debouncedValue)}&limit=10`,
        { signal } // Automated cancellation by React Query
      );
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    },
    enabled: debouncedValue.length >= 3 && !selectedCustomer,
    staleTime: 60000, // Keep results "fresh" for 1 minute
    gcTime: 300000,  // Keep in memory for 5 minutes (Garbage Collection)
  });

  const results = data?.items || [];

  // Sync external value changes (reset scenario)
  useEffect(() => {
    if (value === '' && inputValue !== '') {
      setInputValue('');
      setDebouncedValue('');
      setSelectedCustomer(null);
      setShowDropdown(false);
    } else if (value !== inputValue && !selectedCustomer) {
      setInputValue(value);
    }
  }, [value]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedCustomer(null);
    setShowDropdown(true);
    onChange(newValue, null);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setInputValue(customer.name);
    setSelectedCustomer(customer);
    setShowDropdown(false);
    onChange(customer.name, customer.uniqueId);
  };

  const handleClear = () => {
    setInputValue('');
    setDebouncedValue('');
    setSelectedCustomer(null);
    setShowDropdown(false);
    onChange('', null);
  };

  return (
    <div ref={containerRef} className="tw-relative">
      <div className="tw-relative">
        <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
          <Search className="tw-h-5 tw-w-5 tw-text-gray-400" />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.length >= 3 && setShowDropdown(true)}
          disabled={disabled}
          placeholder={placeholder}
          className="tw-w-full tw-pl-10 tw-pr-10 tw-py-3 tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent tw-bg-white dark:tw-bg-gray-700 tw-text-gray-900 dark:tw-text-white disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
        />
        {(inputValue || isLoading) && (
          <div className="tw-absolute tw-inset-y-0 tw-right-0 tw-pr-3 tw-flex tw-items-center">
            {isLoading ? (
              <Loader className="tw-h-4 tw-w-4 tw-text-gray-400 tw-animate-spin" />
            ) : (
              <button
                type="button"
                onClick={handleClear}
                className="tw-p-1 hover:tw-bg-gray-100 dark:hover:tw-bg-gray-600 tw-rounded"
              >
                <X className="tw-h-4 tw-w-4 tw-text-gray-400" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Selected customer badge */}
      {selectedCustomer && (
        <div className="tw-mt-2 tw-flex tw-items-center tw-space-x-2 tw-text-xs tw-text-green-600 dark:tw-text-green-400">
          <Hash className="tw-h-3 tw-w-3" />
          <span>Registered: {selectedCustomer.uniqueId}</span>
          <span className="tw-text-gray-400">•</span>
          <span>{selectedCustomer.purchaseCount} purchases</span>
        </div>
      )}

      {/* Dropdown results */}
      {showDropdown && results.length > 0 && (
        <div className="tw-absolute tw-z-50 tw-w-full tw-mt-1 tw-bg-white dark:tw-bg-gray-800 tw-border tw-border-gray-200 dark:tw-border-gray-700 tw-rounded-lg tw-shadow-lg tw-max-h-60 tw-overflow-y-auto">
          {results.map((customer: Customer) => (
            <button
              key={customer.id}
              type="button"
              onClick={() => handleSelectCustomer(customer)}
              className="tw-w-full tw-px-4 tw-py-3 tw-text-left hover:tw-bg-blue-50 dark:hover:tw-bg-blue-900/20 tw-transition-colors tw-border-b tw-border-gray-100 dark:tw-border-gray-700 last:tw-border-b-0"
            >
              <div className="tw-flex tw-items-center tw-justify-between">
                <div className="tw-flex tw-items-center tw-space-x-3">
                  <div className="tw-bg-blue-100 dark:tw-bg-blue-900/30 tw-p-2 tw-rounded-full">
                    <User className="tw-h-4 tw-w-4 tw-text-blue-600 dark:tw-text-blue-400" />
                  </div>
                  <div>
                    <p className="tw-font-medium tw-text-gray-900 dark:tw-text-white">
                      {customer.name}
                    </p>
                    <div className="tw-flex tw-items-center tw-space-x-2 tw-text-xs tw-text-gray-500 dark:tw-text-gray-400">
                      <Phone className="tw-h-3 tw-w-3" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="tw-text-right">
                  <span className="tw-text-xs tw-font-mono tw-text-blue-600 dark:tw-text-blue-400 tw-bg-blue-50 dark:tw-bg-blue-900/30 tw-px-2 tw-py-0.5 tw-rounded">
                    {customer.uniqueId}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showDropdown && debouncedValue.length >= 3 && !isLoading && results.length === 0 && (
        <div className="tw-absolute tw-z-50 tw-w-full tw-mt-1 tw-bg-white dark:tw-bg-gray-800 tw-border tw-border-gray-200 dark:tw-border-gray-700 tw-rounded-lg tw-shadow-lg tw-p-4 tw-text-center">
          <p className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">
            No registered customers found. Name will be used directly.
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerSearch;
