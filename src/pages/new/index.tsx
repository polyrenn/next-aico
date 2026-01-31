import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { GetServerSideProps } from 'next';
import { SalesCategory, InvoiceItem, Invoice } from '@/types';
import { formatDate, formatTime, saveInvoice, formatCurrency } from '@/utils/invoice-utils';
import Layout from '@/components/new/Layout';
import SalesForm from '@/components/new/SalesForm';
import InvoicePreview from '@/components/new/InvoicePreview';
import PrintableInvoice from '@/components/new/PrintableInvoice';
import TestDrawer from '@/components/new/TestDrawer';
import { Calendar, Clock, Tag, User, DollarSign, CreditCard, Banknote } from 'lucide-react';
import { withSessionSsr } from '../../lib/withSession';
import { prisma } from '../../lib/prisma';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { salesReducer, initialSalesState } from '@/reducers/salesReducer';
import { ShoppingCart as CartIcon, RefreshCcw, User as UserIcon, ListOrdered } from 'lucide-react';

interface DashboardPageProps {
  user: {
    id: number;
    username: string;
    branch: number;
    company: number;
    role: string;
  };
  branch: {
    address: string;
    branchId: number;
    name: string;
  };
  prices: {
    category: string;
    pricePerKg: number;
    availableKgs: number[];
  }[];
}

const DashboardContent: React.FC<DashboardPageProps> = ({ user, branch, prices }) => {
  const [state, dispatch] = useReducer(salesReducer, initialSalesState);
  const queryClient = useQueryClient();

  // Fetch next CRB number from API
  const { data: crbData } = useQuery({
    queryKey: ['nextCrbNumber', branch?.branchId],
    queryFn: async () => {
      if (!branch?.branchId) return null;
      const res = await fetch(`/api/Common/next-crb-number?branch=${branch.branchId}`);
      if (!res.ok) throw new Error('Failed to fetch CRB number');
      return res.json();
    },
    enabled: !!branch?.branchId,
  });

  // Fetch Queue data
  const { data: queueItems, refetch: refetchQueue, isFetching: isFetchingQueue } = useQuery({
    queryKey: ['branchQueue', branch?.branchId],
    queryFn: async () => {
      if (!branch?.branchId) return [];
      const res = await fetch(`/api/FrontDesk/FetchQueue?id=${branch.branchId}`);
      if (!res.ok) throw new Error('Failed to fetch queue');
      return res.json();
    },
    enabled: !!branch?.branchId,
    refetchInterval: 5000, // Auto refresh every 5 seconds
  });

  // Update invoice number when CRB data is fetched or when resetting
  useEffect(() => {
    if (crbData?.nextCrbNumber && state.status === 'IDLE') {
      dispatch({ type: 'SET_INVOICE_NUMBER', payload: `CRB-${crbData.nextCrbNumber}` });
    }
  }, [crbData, state.status]);

  // Browser lock: prevent refresh/close when in active transaction
  useEffect(() => {
    const shouldLock = state.status !== 'IDLE' && state.status !== 'FINISHED';
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldLock) {
        e.preventDefault();
        e.returnValue = ''; // Chrome requires returnValue to be set
        return ''; // Some browsers require a return value
      }
    };

    if (shouldLock) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [state.status]);

  const currentDate = new Date();

  const handleTotalsChange = useCallback((kg: number, total: number) => {
    dispatch({ type: 'SET_TOTALS', payload: { kg, total } });
  }, []);

  const handleItemsChange = useCallback((items: InvoiceItem[]) => {
    dispatch({ type: 'SET_ITEMS', payload: items });
  }, []);

  const handlePaymentMethodClick = (method: 'pos' | 'cash') => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  };

  const handleGenerateInvoice = () => {
    if (!state.customerName.trim()) {
      alert('Please enter customer name');
      return;
    }

    if (state.invoiceItems.length === 0) {
      alert('Please add items to the invoice');
      return;
    }

    if (!state.paymentMethod) {
      alert('Please select a payment method (POS or CASH)');
      return;
    }

    if (state.amountPaid < state.grandTotal) {
      const confirmCredit = window.confirm(`Amount paid (${formatCurrency(state.amountPaid)}) is less than total (${formatCurrency(state.grandTotal)}). Proceed with credit sale?`);
      if (!confirmCredit) return;
    }

    const invoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: state.invoiceNumber,
      date: currentDate.toISOString(),
      time: formatTime(currentDate),
      userId: user.id.toString(),
      userName: user.username,
      customerName: state.customerName.trim(),
      salesCategory: state.salesCategory,
      items: state.invoiceItems,
      totalKg: state.totalKg,
      grandTotal: state.grandTotal,
      amountPaid: state.amountPaid,
      balance: state.balance,
    };

    dispatch({ type: 'GENERATE_INVOICE', payload: invoice });
    saveInvoice(invoice);
  };

  // Mutation for inserting CRB
  const { mutate: insertCrb, isPending: isInsertingCrb } = useMutation({
    mutationFn: async (invoice: Invoice) => {
      const response = await fetch('/api/FrontDesk/insert-crb-mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId: branch?.branchId,
          customerId: invoice.customerName,
          description: invoice.items,
          amount: invoice.grandTotal,
          totalKg: invoice.totalKg,
          category: invoice.salesCategory,
          timestamp: new Date().toISOString(),
          date: new Date().toISOString(),
          crbNumber: parseInt(state.invoiceNumber.replace('CRB-', '')),
        }),
      });
      if (!response.ok) throw new Error('Failed to insert CRB');
      return response.json();
    },
    onSuccess: (data) => {
      dispatch({ type: 'CRB_SAVED', payload: { crbNumber: data.crbNumber } });
      queryClient.invalidateQueries({ queryKey: ['nextCrbNumber'] });
    },
    onError: (error) => {
      alert('Failed to save invoice record: ' + error.message);
    }
  });

  // Mutation for inserting Sale
  const { mutate: insertSale, isPending: isInsertingSale } = useMutation({
    mutationFn: async ({ invoice, crbNumber }: { invoice: Invoice, crbNumber: number }) => {
      const response = await fetch('/api/FrontDesk/insert-sales-mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch: branch?.branchId.toString(),
          totalKg: invoice.totalKg.toString(),
          amount: invoice.amountPaid.toString(),
          change: invoice.balance.toString(),
          customerId: invoice.customerName,
          category: invoice.salesCategory,
          paymentMethod: state.paymentMethod || 'cash',
          narrative: `Sale for ${invoice.customerName}`,
          saleNumber: crbNumber,
          description: invoice.items,
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to insert Sale');
      }
      return response.json();
    },
    onSuccess: (data) => {
      dispatch({ type: 'SALE_COMPLETED' });
    },
    onError: (error) => {
      alert('Failed to save sale record: ' + error.message);
    }
  });




  const handlePrint = (type: 'invoice' | 'receipt') => {
    if (!state.currentInvoice) return;
    if (type === 'invoice' && state.hasPrintedInvoice) return;
    if (type === 'receipt' && (state.hasPrintedReceipt || !state.savedCrbData)) return;

    if (type === 'invoice') {
       if (!state.savedCrbData) {
         insertCrb(state.currentInvoice, {
           onSuccess: () => {
             dispatch({ type: 'PRINT_INVOICE' });
             setTimeout(() => {
                window.print();
              }, 100);
           }
         });
       } else {
         dispatch({ type: 'PRINT_INVOICE' });
         setTimeout(() => {
            window.print();
          }, 100);
       }
    } else {
      // Process Sale (which depends on CRB already being saved)
      if (!state.savedCrbData) return;
      dispatch({ type: 'PRINT_RECEIPT' });
      insertSale({ invoice: state.currentInvoice, crbNumber: state.savedCrbData.crbNumber }, {
        onSuccess: () => {
          setTimeout(() => {
            window.print();
            // After print, wait a bit then reset to main page
            setTimeout(() => {
                handleNewInvoice();
            }, 1000);
          }, 100);
        }
      });
    }
  };



  const handleNewInvoice = () => {
    dispatch({ type: 'RESET_FOR_NEW_INVOICE' });
    queryClient.invalidateQueries({ queryKey: ['nextCrbNumber'] });
    queryClient.invalidateQueries({ queryKey: ['branchQueue'] });
  };

  const handleLoadQueueItem = (item: any) => {
    dispatch({ type: 'LOAD_QUEUE_ITEM', payload: item });
  };

  // Calculate current price based on category
  const currentPricePerKg = prices?.find(p => 
    p.category.toLowerCase() === state.salesCategory.toLowerCase()
  )?.pricePerKg || 0;

  return (
    <Layout userName={user.username} role={user.role}>
      {/* Drawer Component for Invoice Preview */}
      <InvoicePreview
        invoice={state.currentInvoice}
        isOpen={state.showPreview}
        onOpenChange={(open) => !open && handleNewInvoice()}
        onPrintInvoice={() => handlePrint('invoice')}
        onPrintReceipt={() => handlePrint('receipt')}
        onNewInvoice={handleNewInvoice}
        hasPrintedInvoice={state.hasPrintedInvoice}
        hasPrintedReceipt={state.hasPrintedReceipt}
        isSavingCrb={isInsertingCrb}
        isCrbSaved={!!state.savedCrbData}
      />
      
      {/* Test Drawer for debugging - DISABLED */}
      {/* <div className="tw-fixed tw-bottom-4 tw-right-4 tw-z-50 tw-no-print">
        <TestDrawer />
      </div> */}

       {/* Printable content - only visible when printing */}
       {state.currentInvoice && (
        <div className="tw-print-only">
          <PrintableInvoice invoice={state.currentInvoice} isReceipt={state.printType === 'receipt'} />
        </div>
      )}

      <div className="tw-grid lg:tw-grid-cols-3 tw-gap-6 tw-p-4 tw-no-print">
        {/* Left Column: Queue List (1 col on large screens) */}
        <div className="lg:tw-col-span-1 tw-space-y-6">
          <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200 dark:tw-border-gray-700 tw-overflow-hidden">
            <div className="tw-p-4 tw-border-b tw-border-gray-200 dark:tw-border-gray-700 tw-flex tw-items-center tw-justify-between tw-bg-gray-50 dark:tw-bg-gray-800/50">
              <div className="tw-flex tw-items-center tw-space-x-3">
                <div className="tw-bg-blue-100 dark:tw-bg-blue-900/20 tw-p-2 tw-rounded-lg">
                  <ListOrdered className="tw-h-5 tw-w-5 tw-text-blue-600 dark:tw-text-blue-400" />
                </div>
                <div>
                  <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-white">
                    Order Queue
                  </h3>
                  <p className="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400">
                    Pending gas orders
                  </p>
                </div>
              </div>
              <button 
                onClick={() => refetchQueue()}
                disabled={isFetchingQueue}
                className="tw-p-2 tw-text-gray-500 hover:tw-bg-gray-100 dark:hover:tw-bg-gray-700 tw-rounded-lg tw-transition-colors"
                title="Refresh Queue"
              >
                <RefreshCcw className={`tw-h-4 tw-w-4 ${isFetchingQueue ? 'tw-animate-spin' : ''}`} />
              </button>
            </div>

            <div className="tw-divide-y tw-divide-gray-100 dark:tw-divide-gray-700 tw-max-h-[calc(100vh-250px)] tw-overflow-y-auto">
              {!queueItems || queueItems.length === 0 ? (
                <div className="tw-p-8 tw-text-center">
                  <p className="tw-text-gray-500 dark:tw-text-gray-400 tw-text-sm">Queue is empty</p>
                </div>
              ) : (
                queueItems.map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => handleLoadQueueItem(item)}
                    className="tw-w-full tw-p-4 tw-text-left hover:tw-bg-blue-50 dark:hover:tw-bg-blue-900/10 tw-transition-colors tw-group"
                  >
                    <div className="tw-flex tw-justify-between tw-items-start tw-mb-2">
                      <span className="tw-text-xs tw-font-mono tw-text-blue-600 dark:tw-text-blue-400 tw-bg-blue-50 dark:tw-bg-blue-900/30 tw-px-2 tw-py-0.5 tw-rounded">
                        CRB-{item.crbNumber}
                      </span>
                      <span className="tw-text-xs tw-text-gray-400">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="tw-flex tw-items-center tw-space-x-2 tw-mb-2">
                      <UserIcon className="tw-h-4 tw-w-4 tw-text-gray-400" />
                      <span className="tw-font-semibold tw-text-gray-900 dark:tw-text-white tw-truncate">
                        {item.customerId || 'Unknown'}
                      </span>
                    </div>
                    <div className="tw-flex tw-items-center tw-justify-between">
                      <div className="tw-flex tw-items-center tw-space-x-2">
                        <CartIcon className="tw-h-3 tw-w-3 tw-text-gray-400" />
                        <span className="tw-text-xs tw-text-gray-600 dark:tw-text-gray-400">
                          {item.totalKg}kg Total
                        </span>
                      </div>
                      <span className="tw-text-sm tw-font-bold tw-text-blue-600 dark:tw-text-blue-400">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Columns: Main Form (2 cols on large screens) */}
        <div className="lg:tw-col-span-2 tw-space-y-6">
        {/* Invoice Header Info */}
        <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200 dark:tw-border-gray-700 tw-p-4">
          <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-text-sm">
            <div className="tw-flex tw-items-center tw-space-x-3">
              <Calendar className="tw-h-5 tw-w-5 tw-text-blue-600" />
              <div>
                <p className="tw-text-gray-600 dark:tw-text-gray-400">Date</p>
                <p className="tw-font-medium tw-text-gray-900 dark:tw-text-white">
                  {formatDate(currentDate)}
                </p>
              </div>
            </div>
            
            <div className="tw-flex tw-items-center tw-space-x-3">
              <Clock className="tw-h-5 tw-w-5 tw-text-green-600" />
              <div>
                <p className="tw-text-gray-600 dark:tw-text-gray-400">Time</p>
                <p className="tw-font-medium tw-text-gray-900 dark:tw-text-white">
                  {formatTime(currentDate)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="tw-mt-4 tw-text-center">
            <p className="tw-text-sm tw-text-gray-600 dark:tw-text-gray-400">Invoice Number</p>
            <p className="tw-text-xl tw-font-bold tw-text-blue-600 dark:tw-text-blue-400">
              {state.invoiceNumber}
            </p>
          </div>
        </div>

        {/* Sales Category Selection */}
        <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200 dark:tw-border-gray-700 tw-p-4">
          <div className="tw-flex tw-items-center tw-space-x-3 tw-mb-4">
            <div className="tw-bg-purple-100 dark:tw-bg-purple-900/20 tw-p-2 tw-rounded-lg">
              <Tag className="tw-h-5 tw-w-5 tw-text-purple-600 dark:tw-text-purple-400" />
            </div>
            <div>
              <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-white">
                Sales Category
              </h3>
              <p className="tw-text-sm tw-text-gray-600 dark:tw-text-gray-400">
                Select customer type
              </p>
            </div>
          </div>

          <select
            value={state.salesCategory}
            onChange={(e) => dispatch({ type: 'SET_CATEGORY', payload: e.target.value as SalesCategory })}
            disabled={state.status !== 'IDLE'}
            className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent tw-bg-white dark:tw-bg-gray-700 tw-text-gray-900 dark:tw-text-white disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
          >
            <option value="domestic">Domestic</option>
            <option value="eatery">Eatery</option>
            <option value="dealer">Dealer</option>
            <option value="others">Others</option>
          </select>
        </div>

        {/* Sales Form */}
        <SalesForm
          key={state.formKey}
          salesCategory={state.salesCategory}
          pricePerKg={currentPricePerKg}
          onItemsChange={handleItemsChange}
          onTotalsChange={handleTotalsChange}
          initialItems={state.invoiceItems}
        />


        {/* Customer Information */}
        <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200 dark:tw-border-gray-700 tw-p-4">
          <div className="tw-flex tw-items-center tw-space-x-3 tw-mb-4">
            <div className="tw-bg-indigo-100 dark:tw-bg-indigo-900/20 tw-p-2 tw-rounded-lg">
              <User className="tw-h-5 tw-w-5 tw-text-indigo-600 dark:tw-text-indigo-400" />
            </div>
            <div>
              <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-white">
                Customer Information
              </h3>
              <p className="tw-text-sm tw-text-gray-600 dark:tw-text-gray-400">
                Enter customer details
              </p>
            </div>
          </div>

          <input
            type="text"
            value={state.customerName}
            onChange={(e) => dispatch({ type: 'SET_CUSTOMER_NAME', payload: e.target.value })}
            disabled={state.status !== 'IDLE'}
            placeholder="Enter customer name"
            className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent tw-bg-white dark:tw-bg-gray-700 tw-text-gray-900 dark:tw-text-white disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
            required
          />
        </div>

        {/* Payment Information */}
        <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200 dark:tw-border-gray-700 tw-p-4">
          <div className="tw-flex tw-items-center tw-space-x-3 tw-mb-4">
            <div className="tw-bg-emerald-100 dark:tw-bg-emerald-900/20 tw-p-2 tw-rounded-lg">
              <DollarSign className="tw-h-5 tw-w-5 tw-text-emerald-600 dark:tw-text-emerald-400" />
            </div>
            <div>
              <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-white">
                Payment Information
              </h3>
              <p className="tw-text-sm tw-text-gray-600 dark:tw-text-gray-400">
                Payment details and balance
              </p>
            </div>
          </div>

          <div className="tw-space-y-4">
            {/* Balance Display */}
            <div className="tw-p-4 tw-bg-gray-50 dark:tw-bg-gray-700/50 tw-rounded-lg">
              <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
                <span className="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">
                  Total Amount:
                </span>
                <span className="tw-text-lg tw-font-bold tw-text-gray-900 dark:tw-text-white">
                  {formatCurrency(state.grandTotal)}
                </span>
              </div>
              <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
                <span className="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">
                  Amount Paid:
                </span>
                <span className="tw-text-lg tw-font-bold tw-text-gray-900 dark:tw-text-white">
                  {formatCurrency(state.amountPaid)}
                </span>
              </div>
              <div className="tw-flex tw-items-center tw-justify-between tw-border-t tw-border-gray-200 dark:tw-border-gray-600 tw-pt-2">
                <span className="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">
                  Balance:
                </span>
                <span className={`tw-text-xl tw-font-bold ${
                  state.balance >= 0 
                    ? 'tw-text-green-600 dark:tw-text-green-400' 
                    : 'tw-text-red-600 dark:tw-text-red-400'
                }`}>
                  {formatCurrency(state.balance)}
                </span>
              </div>
              {state.balance < 0 && (
                <p className="tw-text-xs tw-text-red-600 dark:tw-text-red-400 tw-mt-1">
                  Customer owes {formatCurrency(Math.abs(state.balance))}
                </p>
              )}
              {state.balance > 0 && (
                <p className="tw-text-xs tw-text-green-600 dark:tw-text-green-400 tw-mt-1">
                  Change to give: {formatCurrency(state.balance)}
                </p>
              )}
            </div>

            {/* Amount Paid Entry - Now positioned after Balance */}
            <div>
              <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-2">
                Amount Paid
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={state.amountPaid || ''}
                onChange={(e) => {
                  dispatch({ type: 'SET_AMOUNT_PAID', payload: parseFloat(e.target.value) || 0 });
                  dispatch({ type: 'SET_PAYMENT_METHOD', payload: null });
                }}
                disabled={state.status !== 'IDLE'}
                placeholder="Enter amount paid"
                className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent tw-bg-white dark:tw-bg-gray-700 tw-text-gray-900 dark:tw-text-white disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Payment Method Buttons */}
        <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200 dark:tw-border-gray-700 tw-p-4">
          <div className="tw-flex tw-items-center tw-space-x-3 tw-mb-4">
            <div className="tw-bg-yellow-100 dark:tw-bg-yellow-900/20 tw-p-2 tw-rounded-lg">
              <CreditCard className="tw-h-5 tw-w-5 tw-text-yellow-600 dark:tw-text-yellow-400" />
            </div>
            <div>
              <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-white">
                Payment Method
              </h3>
              <p className="tw-text-sm tw-text-gray-600 dark:tw-text-gray-400">
                Quick payment options
              </p>
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-2 tw-gap-4">
            <button
              onClick={() => handlePaymentMethodClick('pos')}
              disabled={state.grandTotal === 0 || state.status !== 'IDLE'}
              className={`tw-flex tw-items-center tw-justify-center tw-space-x-3 tw-py-4 tw-px-4 tw-rounded-lg tw-font-medium tw-transition-all tw-duration-200 ${
                state.paymentMethod === 'pos'
                  ? 'tw-bg-blue-600 tw-text-white tw-shadow-lg tw-transform tw-scale-105'
                  : 'tw-bg-blue-50 dark:tw-bg-blue-900/20 tw-text-blue-700 dark:tw-text-blue-300 hover:tw-bg-blue-100 dark:hover:tw-bg-blue-900/30 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed'
              }`}
            >
              <CreditCard className="tw-h-6 tw-w-6" />
              <span className="tw-text-lg">POS</span>
            </button>

            <button
              onClick={() => handlePaymentMethodClick('cash')}
              disabled={state.grandTotal === 0 || state.status !== 'IDLE'}
              className={`tw-flex tw-items-center tw-justify-center tw-space-x-3 tw-py-4 tw-px-4 tw-rounded-lg tw-font-medium tw-transition-all tw-duration-200 ${
                state.paymentMethod === 'cash'
                  ? 'tw-bg-green-600 tw-text-white tw-shadow-lg tw-transform tw-scale-105'
                  : 'tw-bg-green-50 dark:tw-bg-green-900/20 tw-text-green-700 dark:tw-text-green-300 hover:tw-bg-green-100 dark:hover:tw-bg-green-900/30 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed'
              }`}
            >
              <Banknote className="tw-h-6 tw-w-6" />
              <span className="tw-text-lg">CASH</span>
            </button>
          </div>

          {state.paymentMethod && (
            <div className="tw-mt-4 tw-p-3 tw-bg-gray-50 dark:tw-bg-gray-700/50 tw-rounded-lg">
              <p className="tw-text-sm tw-text-gray-600 dark:tw-text-gray-400 tw-text-center">
                Payment method: <span className="tw-font-medium tw-text-gray-900 dark:tw-text-white tw-uppercase">{state.paymentMethod}</span>
              </p>
            </div>
          )}
        </div>

        {/* Generate Invoice Button */}
        <button
          onClick={handleGenerateInvoice}
          disabled={!state.customerName.trim() || state.invoiceItems.length === 0 || state.status !== 'IDLE'}
          className="tw-w-full tw-bg-blue-600 hover:tw-bg-blue-700 disabled:tw-bg-gray-400 disabled:tw-cursor-not-allowed tw-text-white tw-font-medium tw-py-4 tw-px-4 tw-rounded-lg tw-transition-colors tw-text-lg"
        >
          Generate Invoice
        </button>
        
      </div>
    </div>
</Layout>
  );
};

const DashboardPage: React.FC<DashboardPageProps> = (props) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent {...props} />
    </QueryClientProvider>
  );
};

export default DashboardPage;

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    // Check if user is not authenticated
    if (!user) {
      return {
        redirect: {
          destination: '/Login',
          permanent: false,
        },
      };
    }

    // Check if user has the correct role
    if (user.role !== 'Crb Attendant') {
      return {
        redirect: {
          destination: '/Login',
          permanent: false,
        },
      };
    }

    // Fetch branch data
    const branch = await prisma.branch.findFirst({
      where: {
        branchId: user.branch,
      },
      select: {
        address: true,
        branchId: true,
        name: true,
      },
    });

    // Fetch prices data
    const prices = await prisma.prices.findMany({
      where: {
        branchId: user.branch,
      },
      select: {
        category: true,
        pricePerKg: true,
        availableKgs: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    // Handle case where branch is not found
    if (!branch) {
      return {
        redirect: {
          destination: '/Login',
          permanent: false,
        },
      };
    }

    return {
      props: { branch, prices, user },
    };

  }
);