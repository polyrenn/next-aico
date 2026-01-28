import React from 'react';
import { Invoice } from '@/types';
import { formatCurrency, formatDate, formatTime } from '@/utils/invoice-utils';
import { FileText, Receipt, Printer, X } from 'lucide-react';
import { Drawer } from 'vaul';

interface InvoicePreviewProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPrintInvoice: () => void;
  onPrintReceipt: () => void;
  onNewInvoice: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  isOpen,
  onOpenChange,
  onPrintInvoice,
  onPrintReceipt,
  onNewInvoice,
}) => {
  if (!invoice) return null;

  return (
    <Drawer.Root open={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 no-print" />
        <Drawer.Content className="bg-white dark:bg-gray-800 flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none no-print">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-t-[10px] flex-1 overflow-y-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-700 mb-8" />
            
            <div className="max-w-md mx-auto">
              {/* Header with Close */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Drawer.Title className="font-bold text-2xl text-gray-900 dark:text-white mb-2">
                    Invoice Preview
                  </Drawer.Title>
                  <Drawer.Description className="text-gray-500 dark:text-gray-400">
                    Review the details below before printing.
                  </Drawer.Description>
                </div>
                {/* Close Button acting as Dismiss */}
                <button onClick={() => onOpenChange(false)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                   <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Invoice Details Card */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 mb-6 border border-gray-100 dark:border-gray-700">
                 {/* Invoice Header Info */}
                <div className="text-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    AICO GAS LIMITED
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Official Transaction Record
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs text-left bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div>
                      <span className="block text-gray-400 mb-0.5">Invoice No</span>
                      <span className="font-mono font-medium text-gray-900 dark:text-white">{invoice.invoiceNumber}</span>
                    </div>
                    <div>
                       <span className="block text-gray-400 mb-0.5">Date & Time</span>
                       <span className="font-medium text-gray-900 dark:text-white">{formatDate(new Date(invoice.date))} {invoice.time}</span>
                    </div>
                    <div>
                        <span className="block text-gray-400 mb-0.5">Staff</span>
                        <span className="font-medium text-gray-900 dark:text-white">{invoice.userName}</span>
                    </div>
                     <div>
                        <span className="block text-gray-400 mb-0.5">Category</span>
                        <span className="font-medium text-gray-900 dark:text-white badge bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">{invoice.salesCategory.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mb-6">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</span>
                  <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 text-blue-600">
                       <span className="text-sm">{invoice.customerName.charAt(0).toUpperCase()}</span>
                    </div>
                    {invoice.customerName}
                  </div>
                </div>

                {/* Items Table */}
                {invoice.items.length > 0 && (
                  <div className="mb-6">
                     <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">Items</span>
                    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                          <tr>
                            <th className="text-left py-2 px-3 text-gray-500 font-medium">Type</th>
                            <th className="text-center py-2 px-3 text-gray-500 font-medium">Qty</th>
                            <th className="text-right py-2 px-3 text-gray-500 font-medium">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                          {invoice.items.map((item, index) => (
                            <tr key={index}>
                              <td className="py-2 px-3 text-gray-900 dark:text-white font-medium">
                                {item.kgType}
                              </td>
                              <td className="py-2 px-3 text-center text-gray-600 dark:text-gray-400">
                                {item.quantity}
                              </td>
                              <td className="py-2 px-3 text-right text-gray-900 dark:text-white font-medium">
                                {formatCurrency(item.totalAmount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Totals Section */}
                 <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700 dashed border-dashed">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Total KG</span>
                        <span className="font-medium text-gray-900 dark:text-white">{invoice.totalKg}kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-base font-medium text-gray-900 dark:text-white">Grand Total</span>
                         <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(invoice.grandTotal)}</span>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 mt-2">
                        <div className="flex justify-between items-center text-sm mb-1">
                            <span className="text-gray-500">Amount Paid</span>
                             <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(invoice.amountPaid)}</span>
                        </div>
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Balance</span>
                            <span className={`font-bold ${
                              invoice.balance >= 0 
                                ? 'text-green-600' 
                                : 'text-red-500'
                            }`}>
                              {invoice.balance > 0 ? '+' : ''}{formatCurrency(invoice.balance)}
                            </span>
                        </div>
                    </div>
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={onPrintInvoice}
                    className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 border-2 border-blue-100 dark:border-blue-900/30 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all group"
                  >
                    <Printer className="h-6 w-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-blue-900 dark:text-blue-100">Print Invoice</span>
                    <span className="text-xs text-blue-500">For Customer</span>
                  </button>
                  
                  <button
                    onClick={onPrintReceipt}
                    className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 border-2 border-green-100 dark:border-green-900/30 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-all group"
                  >
                    <Receipt className="h-6 w-6 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-green-900 dark:text-green-100">Print Receipt</span>
                     <span className="text-xs text-green-500">For Records</span>
                  </button>
              </div>

               <button
                  onClick={onNewInvoice}
                  className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
                >
                  Create New Invoice
                </button>
                <div className="h-4"></div> 
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default InvoicePreview;