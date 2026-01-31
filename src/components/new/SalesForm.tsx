import React, { useState, useEffect } from 'react';
import { SalesCategory, InvoiceItem } from '@/types';
import { kgTypes } from '@/data/mock-data';
import { formatCurrency } from '@/utils/invoice-utils';
import { Calculator, ShoppingCart } from 'lucide-react';

// Hard code kg types, and multiply by price

interface SalesFormProps {
  salesCategory: SalesCategory;
  pricePerKg: number;
  onItemsChange: (items: InvoiceItem[]) => void;
  onTotalsChange: (totalKg: number, grandTotal: number) => void;
  initialItems?: InvoiceItem[];
}

const SalesForm: React.FC<SalesFormProps> = ({
  salesCategory,
  pricePerKg,
  onItemsChange,
  onTotalsChange,
  initialItems,
}) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // Populate quantities from initialItems when loaded from queue
  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      const newQuantities: { [key: string]: number } = {};
      initialItems.forEach(item => {
        newQuantities[item.kg] = item.quantity;
      });
      setQuantities(newQuantities);
    }
  }, [initialItems]);


  useEffect(() => {
    const items: InvoiceItem[] = kgTypes
      .filter(kg => quantities[kg.type] > 0)
      .map(kg => {
        const quantity = quantities[kg.type];
        const totalKg = quantity * kg.weight;
        const totalAmount = totalKg * pricePerKg;
        
        return {
          kg: kg.type,
          weight: kg.weight,
          quantity,
          pricePerKg,
          totalKg,
          totalAmount,
        };
      });

    const totalKg = items.reduce((sum, item) => sum + item.totalKg, 0);
    const grandTotal = items.reduce((sum, item) => sum + item.totalAmount, 0);

    onItemsChange(items);
    onTotalsChange(totalKg, grandTotal);
  }, [quantities, pricePerKg, onItemsChange, onTotalsChange]);

  const handleQuantityChange = (kg: string, value: string) => {
    const quantity = parseFloat(value) || 0;
    setQuantities(prev => ({
      ...prev,
      [kg]: quantity,
    }));
  };

  const totalKg = Object.entries(quantities).reduce((sum, [kg, qty]) => {
    const kgData = kgTypes.find(k => k.type === kg);
    return sum + (qty * (kgData?.weight || 0));
  }, 0);

  const grandTotal = totalKg * pricePerKg;

  return (
    <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200 dark:tw-border-gray-700">
      <div className="tw-p-4 tw-border-b tw-border-gray-200 dark:tw-border-gray-700 tw-flex tw-items-center tw-justify-between">
        <div className="tw-flex tw-items-center tw-space-x-3">
          <div className="tw-bg-green-100 dark:tw-bg-green-900/20 tw-p-2 tw-rounded-lg">
            <Calculator className="tw-h-5 tw-w-5 tw-text-green-600 dark:tw-text-green-400" />
          </div>
          <div>
            <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-white">
              Sales Calculator
            </h3>
            <p className="tw-text-sm tw-text-gray-600 dark:tw-text-gray-400">
              Price per KG: {formatCurrency(pricePerKg)}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setQuantities({})}
          className="tw-text-xs tw-text-gray-500 hover:tw-text-red-500 tw-transition-colors tw-font-medium tw-uppercase tw-tracking-wider"
        >
          Clear All
        </button>
      </div>

      <div className="tw-p-4">
        <div className="tw-space-y-3">
          {kgTypes.map((kg) => (
            <div
              key={kg.type}
              className="tw-grid tw-grid-cols-12 tw-gap-3 tw-items-center tw-p-3 tw-bg-gray-50 dark:tw-bg-gray-700/50 tw-rounded-lg"
            >
              <div className="tw-col-span-3">
                <span className="tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white">
                  {kg.type}
                </span>
              </div>
              
              <div className="tw-col-span-3">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={quantities[kg.type] || ''}
                  onChange={(e) => handleQuantityChange(kg.type, e.target.value)}
                  className="tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent tw-bg-white dark:tw-bg-gray-700 tw-text-gray-900 dark:tw-text-white"
                  placeholder="Qty"
                />
              </div>

              <div className="tw-col-span-3 tw-text-right">
                <span className="tw-text-sm tw-text-gray-600 dark:tw-text-gray-400">
                  {quantities[kg.type] ? `${quantities[kg.type] * kg.weight}kg` : '0kg'}
                </span>
              </div>

              <div className="tw-col-span-3 tw-text-right">
                <span className="tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white">
                  {quantities[kg.type] 
                    ? formatCurrency(quantities[kg.type] * kg.weight * pricePerKg)
                    : '₦0'
                  }
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="tw-mt-6 tw-p-4 tw-bg-blue-50 dark:tw-bg-blue-900/20 tw-rounded-lg">
          <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
            <span className="tw-text-sm tw-font-medium tw-text-blue-800 dark:tw-text-blue-200">
              Total KG Sold:
            </span>
            <span className="tw-text-lg tw-font-bold tw-text-blue-900 dark:tw-text-blue-100">
              {totalKg}kg
            </span>
          </div>
          <div className="tw-flex tw-items-center tw-justify-between">
            <span className="tw-text-sm tw-font-medium tw-text-blue-800 dark:tw-text-blue-200">
              Grand Total:
            </span>
            <span className="tw-text-xl tw-font-bold tw-text-blue-900 dark:tw-text-blue-100">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesForm;