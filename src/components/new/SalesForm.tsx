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
}

const SalesForm: React.FC<SalesFormProps> = ({
  salesCategory,
  pricePerKg,
  onItemsChange,
  onTotalsChange,
}) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});


  useEffect(() => {
    const items: InvoiceItem[] = kgTypes
      .filter(kg => quantities[kg.type] > 0)
      .map(kg => {
        const quantity = quantities[kg.type];
        const totalKg = quantity * kg.weight;
        const totalAmount = totalKg * pricePerKg;
        
        return {
          kgType: kg.type,
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

  const handleQuantityChange = (kgType: string, value: string) => {
    const quantity = parseFloat(value) || 0;
    setQuantities(prev => ({
      ...prev,
      [kgType]: quantity,
    }));
  };

  const totalKg = Object.entries(quantities).reduce((sum, [kgType, qty]) => {
    const kg = kgTypes.find(k => k.type === kgType);
    return sum + (qty * (kg?.weight || 0));
  }, 0);

  const grandTotal = totalKg * pricePerKg;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg">
            <Calculator className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sales Calculator
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Price per KG: {formatCurrency(pricePerKg)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {kgTypes.map((kg) => (
            <div
              key={kg.type}
              className="grid grid-cols-12 gap-3 items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="col-span-3">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {kg.type}
                </span>
              </div>
              
              <div className="col-span-3">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={quantities[kg.type] || ''}
                  onChange={(e) => handleQuantityChange(kg.type, e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Qty"
                />
              </div>

              <div className="col-span-3 text-right">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {quantities[kg.type] ? `${quantities[kg.type] * kg.weight}kg` : '0kg'}
                </span>
              </div>

              <div className="col-span-3 text-right">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
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
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Total KG Sold:
            </span>
            <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
              {totalKg}kg
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Grand Total:
            </span>
            <span className="text-xl font-bold text-blue-900 dark:text-blue-100">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesForm;