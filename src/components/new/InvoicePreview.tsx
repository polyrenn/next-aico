import React from 'react';
import { Invoice } from '@/types';
import { formatCurrency, formatDate, formatTime } from '@/utils/invoice-utils';
import { FileText, Receipt, Printer } from 'lucide-react';

interface InvoicePreviewProps {
  invoice: Invoice;
  onPrintInvoice: () => void;
  onPrintReceipt: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  onPrintInvoice,
  onPrintReceipt,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-lg">
            <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Invoice Preview
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Review before printing
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Invoice Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            AICO GAS LIMITED
          </h1>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p>Invoice: {invoice.invoiceNumber}</p>
            <p>Date: {formatDate(new Date(invoice.date))}</p>
            <p>Time: {invoice.time}</p>
            <p>Sales Staff: {invoice.userName}</p>
            <p>Category: {invoice.salesCategory.toUpperCase()}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Customer Name:
          </h4>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {invoice.customerName}
          </p>
        </div>

        {/* Invoice Items */}
        {invoice.items.length > 0 && (
          <div className="mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left py-2 text-gray-700 dark:text-gray-300 font-medium">
                      KG Type
                    </th>
                    <th className="text-center py-2 text-gray-700 dark:text-gray-300 font-medium">
                      Qty
                    </th>
                    <th className="text-right py-2 text-gray-700 dark:text-gray-300 font-medium">
                      Total KG
                    </th>
                    <th className="text-right py-2 text-gray-700 dark:text-gray-300 font-medium">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2 text-gray-900 dark:text-white font-medium">
                        {item.kgType}
                      </td>
                      <td className="py-2 text-center text-gray-600 dark:text-gray-400">
                        {item.quantity}
                      </td>
                      <td className="py-2 text-right text-gray-600 dark:text-gray-400">
                        {item.totalKg}kg
                      </td>
                      <td className="py-2 text-right text-gray-900 dark:text-white font-medium">
                        {formatCurrency(item.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Totals and Payment Info */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Total KG Sold:
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {invoice.totalKg}kg
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xl font-medium text-gray-700 dark:text-gray-300">
              Grand Total:
            </span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(invoice.grandTotal)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Amount Paid:
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(invoice.amountPaid)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Balance:
            </span>
            <span className={`text-xl font-bold ${
              invoice.balance >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(invoice.balance)}
            </span>
          </div>
          {invoice.balance < 0 && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2 text-right">
              Customer owes {formatCurrency(Math.abs(invoice.balance))}
            </p>
          )}
          {invoice.balance > 0 && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2 text-right">
              Change to give: {formatCurrency(invoice.balance)}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onPrintInvoice}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <Printer className="h-5 w-5" />
            <span>Print Invoice</span>
          </button>
          
          <button
            onClick={onPrintReceipt}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <Receipt className="h-5 w-5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;