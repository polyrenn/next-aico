import React from 'react';
import { Invoice } from '@/types';
import { SalesStatus } from '@/reducers/salesReducer';
import { formatCurrency, formatDate, formatTime } from '@/utils/invoice-utils';
import { FileText, Receipt, Printer, X, AlertTriangle, CheckCircle, RefreshCw, Loader2 } from 'lucide-react';
import { Drawer } from 'vaul';

interface InvoicePreviewProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPrintInvoice: () => void;
  onPrintReceipt: () => void;
  onNewInvoice: () => void;
  hasPrintedInvoice: boolean;
  hasPrintedReceipt: boolean;
  isSavingCrb: boolean;
  isCrbSaved: boolean;
  isSavingSale: boolean;
  crbError: string | null;
  saleError: string | null;
  isDuplicate: boolean;
  status: SalesStatus;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  isOpen,
  onOpenChange,
  onPrintInvoice,
  onPrintReceipt,
  onNewInvoice,
  hasPrintedInvoice,
  hasPrintedReceipt,
  isSavingCrb,
  isCrbSaved,
  isSavingSale,
  crbError,
  saleError,
  isDuplicate,
  status,
}) => {
  if (!invoice) return null;

  // Determine if the drawer can be closed (only in safe states)
  const canClose = status === 'IDLE' || status === 'FINISHED';

  // Button 1 (Invoice) state logic
  const getInvoiceButtonState = () => {
    if (isSavingCrb) return 'saving';
    if (crbError) return 'error';
    if (isCrbSaved) return 'done'; // Once saved, it's done — no reprints
    return 'ready';
  };

  // Button 2 (Receipt) state logic
  const getReceiptButtonState = () => {
    if (isSavingSale) return 'saving';
    if (saleError) return 'error';
    if (hasPrintedReceipt) return 'done';
    if (isCrbSaved) return 'ready';
    return 'waiting';
  };

  const invoiceBtnState = getInvoiceButtonState();
  const receiptBtnState = getReceiptButtonState();

  return (
    <Drawer.Root open={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="tw-fixed tw-inset-0 tw-bg-black/40 tw-z-50 tw-no-print" />
        <Drawer.Content 
          className="tw-bg-white dark:tw-bg-gray-800 tw-flex tw-flex-col tw-rounded-t-[10px] tw-max-h-[96%] tw-mt-24 tw-fixed tw-bottom-0 tw-left-0 tw-right-0 tw-z-50 tw-outline-none tw-no-print"
        >
          <div 
            className="tw-p-4 tw-bg-white dark:tw-bg-gray-800 tw-rounded-t-[10px] tw-flex-1 tw-overflow-y-auto"
          >
            <div className="tw-mx-auto tw-w-12 tw-h-1.5 tw-flex-shrink-0 tw-rounded-full tw-bg-gray-300 dark:tw-bg-gray-700 tw-mb-8" />
            
            <div className="tw-max-w-md tw-mx-auto">
              {/* Header with Close */}
              <div className="tw-flex tw-justify-between tw-items-start tw-mb-6">
                <div>
                  <Drawer.Title className="tw-font-bold tw-text-2xl tw-text-gray-900 dark:tw-text-white tw-mb-2">
                    Invoice
                  </Drawer.Title>
                  <Drawer.Description className="tw-text-gray-500 dark:tw-text-gray-400">
                  {isSavingCrb 
                    ? "Generating official record in database..." 
                    : crbError
                      ? "Failed to save — tap to retry."
                      : isDuplicate
                        ? "⚠️ Duplicate detected — original record loaded."
                        : isCrbSaved 
                          ? "Review the details below before printing." 
                          : "Record will be created when you print the invoice."}
                  </Drawer.Description>
                </div>
                {/* Close Button — only works when safe to close */}
                <button 
                    onClick={() => onOpenChange(false)} 
                    disabled={!canClose}
                    className={`tw-p-2 tw-rounded-full tw-transition-colors ${
                      canClose 
                        ? 'tw-bg-gray-100 dark:tw-bg-gray-700 hover:tw-bg-gray-200 dark:hover:tw-bg-gray-600' 
                        : 'tw-bg-gray-50 dark:tw-bg-gray-800 tw-cursor-not-allowed tw-opacity-30'
                    }`}
                    aria-label="Cancel and go back"
                    title={canClose ? 'Close' : 'Complete the transaction first'}
                >
                   <X className="tw-h-5 tw-w-5 tw-text-gray-500 dark:tw-text-gray-400" />
                </button>
              </div>

              {/* Duplicate Warning Banner */}
              {isDuplicate && (
                <div className="tw-mb-4 tw-p-3 tw-bg-amber-50 dark:tw-bg-amber-900/20 tw-border tw-border-amber-200 dark:tw-border-amber-800 tw-rounded-lg tw-flex tw-items-start tw-gap-3">
                  <AlertTriangle className="tw-h-5 tw-w-5 tw-text-amber-500 tw-flex-shrink-0 tw-mt-0.5" />
                  <div>
                    <p className="tw-text-sm tw-font-medium tw-text-amber-800 dark:tw-text-amber-200">
                      Duplicate Transaction Detected
                    </p>
                    <p className="tw-text-xs tw-text-amber-600 dark:tw-text-amber-400 tw-mt-1">
                      A matching CRB record was found from the last 5 minutes. The original record ({invoice.invoiceNumber}) has been loaded instead of creating a new entry.
                    </p>
                  </div>
                </div>
              )}

              {/* Invoice Details Card */}
              <div className="tw-bg-gray-50 dark:tw-bg-gray-900/50 tw-rounded-xl tw-p-6 tw-mb-6 tw-border tw-border-gray-100 dark:tw-border-gray-700">
                 {/* Invoice Header Info */}
                <div className="tw-text-center tw-mb-8 tw-pb-6 tw-border-b tw-border-gray-200 dark:tw-border-gray-700">
                  <h1 className="tw-text-xl tw-font-bold tw-text-gray-900 dark:tw-text-white tw-mb-1">
                    AICO GAS LIMITED
                  </h1>
                  <p className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400 tw-mb-4">
                    Official Transaction Record
                  </p>
                  
                  <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-text-xs tw-text-left tw-bg-white dark:tw-bg-gray-800 tw-p-3 tw-rounded-lg tw-border tw-border-gray-100 dark:tw-border-gray-700">
                    <div>
                      <span className="tw-block tw-text-gray-400 tw-mb-0.5">Invoice No</span>
                      <span className="tw-font-mono tw-font-medium tw-text-gray-900 dark:tw-text-white">{invoice.invoiceNumber}</span>
                    </div>
                    <div>
                       <span className="tw-block tw-text-gray-400 tw-mb-0.5">Date & Time</span>
                       <span className="tw-font-medium tw-text-gray-900 dark:tw-text-white">{formatDate(new Date(invoice.date))} {invoice.time}</span>
                    </div>
                    <div>
                        <span className="tw-block tw-text-gray-400 tw-mb-0.5">Staff</span>
                        <span className="tw-font-medium tw-text-gray-900 dark:tw-text-white">{invoice.userName}</span>
                    </div>
                     <div>
                        <span className="tw-block tw-text-gray-400 tw-mb-0.5">Category</span>
                        <span className="tw-font-medium badge tw-bg-blue-100 tw-text-blue-800 tw-px-1.5 tw-py-0.5 tw-rounded">{invoice.salesCategory.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="tw-mb-6">
                  <span className="tw-text-xs tw-font-medium tw-text-gray-400 tw-uppercase tw-tracking-wider">Customer</span>
                  <div className="tw-mt-1 tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-white tw-flex tw-items-center">
                    <div className="tw-w-8 tw-h-8 tw-rounded-full tw-bg-blue-100 dark:tw-bg-blue-900/30 tw-flex tw-items-center tw-justify-center tw-mr-3 tw-text-blue-600">
                       <span className="tw-text-sm">{invoice.customerName.charAt(0).toUpperCase()}</span>
                    </div>
                    {invoice.customerName}
                  </div>
                </div>

                {/* Items Table */}
                {invoice.items.length > 0 && (
                  <div className="tw-mb-6">
                     <span className="tw-text-xs tw-font-medium tw-text-gray-400 tw-uppercase tw-tracking-wider tw-block tw-mb-2">Items</span>
                    <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-overflow-hidden tw-border tw-border-gray-200 dark:tw-border-gray-700">
                      <table className="tw-w-full tw-text-sm">
                        <thead className="tw-bg-gray-50 dark:tw-bg-gray-700/50">
                          <tr>
                            <th className="tw-text-left tw-py-2 tw-px-3 tw-text-gray-500 tw-font-medium">Type</th>
                            <th className="tw-text-center tw-py-2 tw-px-3 tw-text-gray-500 tw-font-medium">Qty</th>
                            <th className="tw-text-right tw-py-2 tw-px-3 tw-text-gray-500 tw-font-medium">Total</th>
                          </tr>
                        </thead>
                        <tbody className="tw-divide-y tw-divide-gray-100 dark:tw-divide-gray-700">
                          {invoice.items.map((item, index) => (
                            <tr key={index}>
                              <td className="tw-py-2 tw-px-3 tw-text-gray-900 dark:tw-text-white tw-font-medium">
                                {item.kg}
                              </td>
                              <td className="tw-py-2 tw-px-3 tw-text-center tw-text-gray-600 dark:tw-text-gray-400">
                                {item.quantity}
                              </td>
                              <td className="tw-py-2 tw-px-3 tw-text-right tw-text-gray-900 dark:tw-text-white tw-font-medium">
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
                 <div className="tw-space-y-3 tw-pt-4 tw-border-t tw-border-gray-200 dark:tw-border-gray-700 tw-border-dashed">
                    <div className="tw-flex tw-justify-between tw-items-center tw-text-sm">
                        <span className="tw-text-gray-500">Total KG</span>
                        <span className="tw-font-medium tw-text-gray-900 dark:tw-text-white">{invoice.totalKg}kg</span>
                    </div>
                    <div className="tw-flex tw-justify-between tw-items-center">
                        <span className="tw-text-base tw-font-medium tw-text-gray-900 dark:tw-text-white">Grand Total</span>
                         <span className="tw-text-xl tw-font-bold tw-text-blue-600 dark:tw-text-blue-400">{formatCurrency(invoice.grandTotal)}</span>
                    </div>
                    
                    <div className="tw-bg-white dark:tw-bg-gray-800 tw-p-3 tw-rounded-lg tw-border tw-border-gray-200 dark:tw-border-gray-700 tw-mt-2">
                        <div className="tw-flex tw-justify-between tw-items-center tw-text-sm tw-mb-1">
                            <span className="tw-text-gray-500">Amount Paid</span>
                             <span className="tw-font-medium tw-text-gray-900 dark:tw-text-white">{formatCurrency(invoice.amountPaid)}</span>
                        </div>
                         <div className="tw-flex tw-justify-between tw-items-center tw-text-sm">
                            <span className="tw-text-gray-500">Balance</span>
                            <span className={`tw-font-bold ${
                              invoice.balance >= 0 
                                ? 'tw-text-green-600' 
                                : 'tw-text-red-500'
                            }`}>
                              {invoice.balance > 0 ? '+' : ''}{formatCurrency(invoice.balance)}
                            </span>
                        </div>
                    </div>
                 </div>
              </div>

              {/* Error Banners */}
              {crbError && (
                <div className="tw-mb-4 tw-p-3 tw-bg-red-50 dark:tw-bg-red-900/20 tw-border tw-border-red-200 dark:tw-border-red-800 tw-rounded-lg tw-flex tw-items-start tw-gap-3">
                  <AlertTriangle className="tw-h-5 tw-w-5 tw-text-red-500 tw-flex-shrink-0 tw-mt-0.5" />
                  <div>
                    <p className="tw-text-sm tw-font-medium tw-text-red-800 dark:tw-text-red-200">
                      Failed to Save Invoice
                    </p>
                    <p className="tw-text-xs tw-text-red-600 dark:tw-text-red-400 tw-mt-1">
                      {crbError}. Tap "Print Invoice" to retry.
                    </p>
                  </div>
                </div>
              )}

              {saleError && (
                <div className="tw-mb-4 tw-p-3 tw-bg-red-50 dark:tw-bg-red-900/20 tw-border tw-border-red-200 dark:tw-border-red-800 tw-rounded-lg tw-flex tw-items-start tw-gap-3">
                  <AlertTriangle className="tw-h-5 tw-w-5 tw-text-red-500 tw-flex-shrink-0 tw-mt-0.5" />
                  <div>
                    <p className="tw-text-sm tw-font-medium tw-text-red-800 dark:tw-text-red-200">
                      Failed to Save Sale
                    </p>
                    <p className="tw-text-xs tw-text-red-600 dark:tw-text-red-400 tw-mt-1">
                      {saleError}. The invoice (CRB) IS saved — tap "Print Receipt" to retry saving the sale.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="tw-grid tw-grid-cols-2 tw-gap-3 tw-mb-4">
                   {/* Button 1: Print Invoice */}
                   <button
                    onClick={onPrintInvoice}
                    disabled={invoiceBtnState === 'saving' || invoiceBtnState === 'done'}
                    className={`tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-4 tw-border-2 tw-rounded-xl tw-transition-all tw-group ${
                      invoiceBtnState === 'saving'
                        ? 'tw-opacity-60 tw-cursor-wait tw-border-blue-200 dark:tw-border-blue-900/30 tw-bg-blue-50 dark:tw-bg-blue-900/10'
                        : invoiceBtnState === 'error'
                          ? 'tw-border-red-300 dark:tw-border-red-800 tw-bg-red-50 dark:tw-bg-red-900/10 hover:tw-bg-red-100 dark:hover:tw-bg-red-900/20 tw-cursor-pointer'
                          : invoiceBtnState === 'done'
                            ? 'tw-border-green-200 dark:tw-border-green-900/30 tw-bg-green-50 dark:tw-bg-green-900/10 tw-cursor-default'
                            : 'tw-bg-white dark:tw-bg-gray-800 tw-border-blue-100 dark:tw-border-blue-900/30 hover:tw-border-blue-500 hover:tw-bg-blue-50 dark:hover:tw-bg-blue-900/20'
                    }`}
                  >
                    {invoiceBtnState === 'saving' ? (
                      <Loader2 className="tw-h-6 tw-w-6 tw-mb-2 tw-text-blue-600 tw-animate-spin" />
                    ) : invoiceBtnState === 'error' ? (
                      <RefreshCw className="tw-h-6 tw-w-6 tw-mb-2 tw-text-red-500" />
                    ) : invoiceBtnState === 'done' ? (
                      <CheckCircle className="tw-h-6 tw-w-6 tw-mb-2 tw-text-green-600" />
                    ) : (
                      <Printer className="tw-h-6 tw-w-6 tw-mb-2 tw-text-blue-600 group-hover:tw-scale-110 tw-transition-transform" />
                    )}

                    <span className={`tw-font-medium ${
                      invoiceBtnState === 'error' ? 'tw-text-red-700 dark:tw-text-red-300'
                        : invoiceBtnState === 'done' ? 'tw-text-green-700 dark:tw-text-green-300'
                        : invoiceBtnState === 'saving' ? 'tw-text-blue-500'
                        : 'tw-text-blue-900 dark:tw-text-blue-100'
                    }`}>
                      {invoiceBtnState === 'saving' ? 'Saving...'
                        : invoiceBtnState === 'error' ? 'Tap to Retry'
                        : invoiceBtnState === 'done' ? '✅ Invoice Saved'
                        : 'Print Invoice'}
                    </span>
                    <span className={`tw-text-xs ${
                      invoiceBtnState === 'error' ? 'tw-text-red-400'
                        : invoiceBtnState === 'done' ? 'tw-text-green-500'
                        : invoiceBtnState === 'saving' ? 'tw-text-blue-400'
                        : 'tw-text-blue-500'
                    }`}>
                      {invoiceBtnState === 'saving' ? 'Please wait...'
                        : invoiceBtnState === 'error' ? 'Save failed'
                        : invoiceBtnState === 'done' ? 'Record created'
                        : 'Creates DB Record'}
                    </span>
                  </button>
                  
                   {/* Button 2: Print Receipt */}
                   <button
                    onClick={onPrintReceipt}
                    disabled={receiptBtnState === 'saving' || receiptBtnState === 'waiting'}
                    className={`tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-4 tw-border-2 tw-rounded-xl tw-transition-all tw-group ${
                      receiptBtnState === 'saving'
                        ? 'tw-opacity-60 tw-cursor-wait tw-border-green-200 dark:tw-border-green-900/30 tw-bg-green-50 dark:tw-bg-green-900/10'
                        : receiptBtnState === 'error'
                          ? 'tw-border-red-300 dark:tw-border-red-800 tw-bg-red-50 dark:tw-bg-red-900/10 hover:tw-bg-red-100 dark:hover:tw-bg-red-900/20 tw-cursor-pointer'
                          : receiptBtnState === 'done'
                            ? 'tw-border-green-200 dark:tw-border-green-900/30 tw-bg-green-50 dark:tw-bg-green-900/10 hover:tw-bg-green-100 dark:hover:tw-bg-green-900/20 tw-cursor-pointer'
                            : receiptBtnState === 'waiting'
                              ? 'tw-opacity-50 tw-cursor-not-allowed tw-border-gray-200 dark:tw-border-gray-700 tw-bg-white dark:tw-bg-gray-800'
                              : 'tw-bg-white dark:tw-bg-gray-800 tw-border-green-100 dark:tw-border-green-900/30 hover:tw-border-green-500 hover:tw-bg-green-50 dark:hover:tw-bg-green-900/20'
                    }`}
                  >
                    {receiptBtnState === 'saving' ? (
                      <Loader2 className="tw-h-6 tw-w-6 tw-mb-2 tw-text-green-600 tw-animate-spin" />
                    ) : receiptBtnState === 'error' ? (
                      <RefreshCw className="tw-h-6 tw-w-6 tw-mb-2 tw-text-red-500" />
                    ) : receiptBtnState === 'done' ? (
                      <CheckCircle className="tw-h-6 tw-w-6 tw-mb-2 tw-text-green-600" />
                    ) : (
                      <Receipt className={`tw-h-6 tw-w-6 tw-mb-2 tw-transition-transform ${
                        receiptBtnState === 'waiting' ? 'tw-text-gray-400' : 'tw-text-green-600 group-hover:tw-scale-110'
                      }`} />
                    )}

                    <span className={`tw-font-medium ${
                      receiptBtnState === 'error' ? 'tw-text-red-700 dark:tw-text-red-300'
                        : receiptBtnState === 'done' ? 'tw-text-green-700 dark:tw-text-green-300'
                        : receiptBtnState === 'saving' ? 'tw-text-green-500'
                        : receiptBtnState === 'waiting' ? 'tw-text-gray-400'
                        : 'tw-text-green-900 dark:tw-text-green-100'
                    }`}>
                      {receiptBtnState === 'saving' ? 'Saving...'
                        : receiptBtnState === 'error' ? 'Tap to Retry'
                        : receiptBtnState === 'done' ? '✅ Complete'
                        : receiptBtnState === 'waiting' ? 'Print Receipt'
                        : 'Print Receipt'}
                    </span>
                    <span className={`tw-text-xs ${
                      receiptBtnState === 'error' ? 'tw-text-red-400'
                        : receiptBtnState === 'done' ? 'tw-text-green-500'
                        : receiptBtnState === 'saving' ? 'tw-text-green-400'
                        : receiptBtnState === 'waiting' ? 'tw-text-gray-300'
                        : 'tw-text-green-500'
                    }`}>
                      {receiptBtnState === 'saving' ? 'Please wait...'
                        : receiptBtnState === 'error' ? 'Sale failed — CRB is safe'
                        : receiptBtnState === 'done' ? 'Sale Complete ✅'
                        : receiptBtnState === 'waiting' ? 'Print Invoice First'
                        : 'Completes Sale'}
                    </span>
                  </button>
              </div>

               {/* New Invoice button — only visible when transaction is complete */}
               {status === 'FINISHED' && (
                 <button
                   onClick={onNewInvoice}
                   className="tw-w-full tw-py-4 tw-bg-gray-900 dark:tw-bg-white tw-text-white dark:tw-text-gray-900 tw-rounded-xl tw-font-bold tw-text-lg hover:tw-opacity-90 tw-transition-opacity tw-mb-4"
                 >
                   New Transaction
                 </button>
               )}

                <div className="tw-h-4"></div> 
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default InvoicePreview;