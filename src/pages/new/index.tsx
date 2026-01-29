import React, { useState, useEffect, useCallback } from 'react';
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
  const [salesCategory, setSalesCategory] = useState<SalesCategory>('domestic');
  const [customerName, setCustomerName] = useState('');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'pos' | 'cash' | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [totalKg, setTotalKg] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [printType, setPrintType] = useState<'invoice' | 'receipt'>('invoice');
  const [invoiceNumber, setInvoiceNumber] = useState('CRB-...');
  const [hasPrintedInvoice, setHasPrintedInvoice] = useState(false);
  const [hasPrintedReceipt, setHasPrintedReceipt] = useState(false);

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

  // Update invoice number when CRB data is fetched
  useEffect(() => {
    if (crbData?.nextCrbNumber) {
      setInvoiceNumber(`CRB-${crbData.nextCrbNumber}`);
    }
  }, [crbData]);

  const currentDate = new Date();

  // Calculate balance whenever amountPaid or grandTotal changes
  useEffect(() => {
    setBalance(amountPaid - grandTotal);
  }, [amountPaid, grandTotal]);

  const handleTotalsChange = useCallback((kg: number, total: number) => {
    setTotalKg(kg);
    setGrandTotal(total);
  }, []);

  const handlePaymentMethodClick = (method: 'pos' | 'cash') => {
    setPaymentMethod(method);
    setAmountPaid(grandTotal);
  };

  const handleGenerateInvoice = () => {
    if (!customerName.trim()) {
      alert('Please enter customer name');
      return;
    }

    if (invoiceItems.length === 0) {
      alert('Please add items to the invoice');
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method (POS or CASH)');
      return;
    }

    if (amountPaid < grandTotal) {
      const confirmCredit = window.confirm(`Amount paid (${formatCurrency(amountPaid)}) is less than total (${formatCurrency(grandTotal)}). Proceed with credit sale?`);
      if (!confirmCredit) return;
    }

    const invoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber,
      date: currentDate.toISOString(),
      time: formatTime(currentDate),
      userId: user.id.toString(),
      userName: user.username,
      customerName: customerName.trim(),
      salesCategory,
      items: invoiceItems,
      totalKg,
      grandTotal,
      amountPaid,
      balance,
    };

    setCurrentInvoice(invoice);
    setShowPreview(true);
    saveInvoice(invoice);
    
    // Automatically trigger CRB insertion to get a valid number/record before printing
    if (!savedCrbData && !isInsertingCrb) {
      insertCrb(invoice, {
        onSuccess: (data) => {
          setSavedCrbData(data);
          // Update the invoice number if the DB returned a real one
          if (data.crbNumber) {
            setInvoiceNumber(`CRB-${data.crbNumber}`);
          }
        }
      });
    }
  };

  // Mutation for inserting CRB
  const { mutate: insertCrb, isPending: isInsertingCrb } = useMutation({
    mutationFn: async (invoice: Invoice) => {
      const response = await fetch('/api/FrontDesk/insert-crb-mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId: branch?.branchId,
          customerId: invoice.customerName, // Using name as ID for now or need a real ID? Assuming name is ok based on schema string
          description: invoice.items,
          amount: invoice.grandTotal,
          totalKg: invoice.totalKg,
          category: invoice.salesCategory,
          timestamp: new Date().toISOString(),
          date: new Date().toISOString(),
          crbNumber: parseInt(invoiceNumber.replace('CRB-', '')), // Send the number we displayed? Or let DB handle it? 
          // Schema says crbNumber is Int @default(0). Let's trust the auto-gen or the one we fetched?
          // The API insert-crb-mobile does prisma.crb.create with ...data. 
          // If we send crbNumber, it uses it. If not, default 0? Unique constraint!
          // We fetched nextCrbNumber. We should probably send it if we want to "claim" it.
        }),
      });
      if (!response.ok) throw new Error('Failed to insert CRB');
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate to get next number
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
          branch: branch?.branchId.toString(), // API expects string parsable to int
          totalKg: invoice.totalKg.toString(),
          amount: invoice.amountPaid.toString(),
          change: invoice.balance.toString(), // Balance is change if positive?
          customerId: invoice.customerName,
          category: invoice.salesCategory,
          paymentMethod: paymentMethod || 'cash',
          narrative: `Sale for ${invoice.customerName}`,
          saleNumber: crbNumber, // Linking Sale to CRB Number as requested
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
      // Sale saved
    },
    onError: (error) => {
      alert('Failed to save sale record: ' + error.message);
    }
  });


  /* State to track saved CRB data to prevent duplicates and use returned number */
  const [savedCrbData, setSavedCrbData] = useState<{ crbNumber: number } | null>(null);

  const handlePrint = (type: 'invoice' | 'receipt') => {
    if (!currentInvoice || !savedCrbData) return;
    if (type === 'invoice' && hasPrintedInvoice) return;
    if (type === 'receipt' && hasPrintedReceipt) return;
    
    setPrintType(type);

    if (type === 'invoice') {
       setHasPrintedInvoice(true);
       setTimeout(() => {
          window.print();
        }, 100);
    } else {
      // Process Sale (which depends on CRB already being saved)
      insertSale({ invoice: currentInvoice, crbNumber: savedCrbData.crbNumber }, {
        onSuccess: () => {
          setHasPrintedReceipt(true);
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

  const queryClient = useQueryClient();

  const handleNewInvoice = () => {
    setShowPreview(false);
    setCurrentInvoice(null);
    setCustomerName('');
    setAmountPaid(0);
    setBalance(0);
    setPaymentMethod(null);
    setInvoiceItems([]);
    setTotalKg(0);
    setGrandTotal(0);
    setSavedCrbData(null); // Reset for next customer
    setHasPrintedInvoice(false);
    setHasPrintedReceipt(false);
    // Invalidate nextCrbNumber to fetch fresh one for next sale
    queryClient.invalidateQueries({ queryKey: ['nextCrbNumber'] });
  };

  // Calculate current price based on category
  const currentPricePerKg = prices?.find(p => 
    p.category.toLowerCase() === salesCategory.toLowerCase()
  )?.pricePerKg || 0;

  return (
    <Layout userName={user.username} role={user.role}>
      {/* Drawer Component for Invoice Preview */}
      <InvoicePreview
        invoice={currentInvoice}
        isOpen={showPreview}
        onOpenChange={setShowPreview}
        onPrintInvoice={() => handlePrint('invoice')}
        onPrintReceipt={() => handlePrint('receipt')}
        onNewInvoice={handleNewInvoice}
        hasPrintedInvoice={hasPrintedInvoice}
        hasPrintedReceipt={hasPrintedReceipt}
        isSavingCrb={isInsertingCrb}
        isCrbSaved={!!savedCrbData}
      />
      
      {/* Test Drawer for debugging */}
      <div className="tw-fixed tw-bottom-4 tw-right-4 tw-z-50 tw-no-print">
        <TestDrawer />
      </div>

       {/* Printable content - only visible when printing */}
       {currentInvoice && (
        <div className="tw-print-only">
          <PrintableInvoice invoice={currentInvoice} isReceipt={printType === 'receipt'} />
        </div>
      )}

      <div className="tw-p-4 tw-space-y-6 tw-no-print">
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
              {invoiceNumber}
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
            value={salesCategory}
            onChange={(e) => setSalesCategory(e.target.value as SalesCategory)}
            className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent tw-bg-white dark:tw-bg-gray-700 tw-text-gray-900 dark:tw-text-white"
          >
            <option value="domestic">Domestic</option>
            <option value="eatery">Eatery</option>
            <option value="dealer">Dealer</option>
            <option value="others">Others</option>
          </select>
        </div>

        {/* Sales Form */}
        <SalesForm
          salesCategory={salesCategory}
          pricePerKg={currentPricePerKg}
          onItemsChange={setInvoiceItems}
          onTotalsChange={handleTotalsChange}
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
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
            className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent tw-bg-white dark:tw-bg-gray-700 tw-text-gray-900 dark:tw-text-white"
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
                  {formatCurrency(grandTotal)}
                </span>
              </div>
              <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
                <span className="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">
                  Amount Paid:
                </span>
                <span className="tw-text-lg tw-font-bold tw-text-gray-900 dark:tw-text-white">
                  {formatCurrency(amountPaid)}
                </span>
              </div>
              <div className="tw-flex tw-items-center tw-justify-between tw-border-t tw-border-gray-200 dark:tw-border-gray-600 tw-pt-2">
                <span className="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">
                  Balance:
                </span>
                <span className={`tw-text-xl tw-font-bold ${
                  balance >= 0 
                    ? 'tw-text-green-600 dark:tw-text-green-400' 
                    : 'tw-text-red-600 dark:tw-text-red-400'
                }`}>
                  {formatCurrency(balance)}
                </span>
              </div>
              {balance < 0 && (
                <p className="tw-text-xs tw-text-red-600 dark:tw-text-red-400 tw-mt-1">
                  Customer owes {formatCurrency(Math.abs(balance))}
                </p>
              )}
              {balance > 0 && (
                <p className="tw-text-xs tw-text-green-600 dark:tw-text-green-400 tw-mt-1">
                  Change to give: {formatCurrency(balance)}
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
                value={amountPaid || ''}
                onChange={(e) => {
                  setAmountPaid(parseFloat(e.target.value) || 0);
                  setPaymentMethod(null); // Clear payment method when manually entering amount
                }}
                placeholder="Enter amount paid"
                className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent tw-bg-white dark:tw-bg-gray-700 tw-text-gray-900 dark:tw-text-white"
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
              disabled={grandTotal === 0}
              className={`tw-flex tw-items-center tw-justify-center tw-space-x-3 tw-py-4 tw-px-4 tw-rounded-lg tw-font-medium tw-transition-all tw-duration-200 ${
                paymentMethod === 'pos'
                  ? 'tw-bg-blue-600 tw-text-white tw-shadow-lg tw-transform tw-scale-105'
                  : 'tw-bg-blue-50 dark:tw-bg-blue-900/20 tw-text-blue-700 dark:tw-text-blue-300 hover:tw-bg-blue-100 dark:hover:tw-bg-blue-900/30 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed'
              }`}
            >
              <CreditCard className="tw-h-6 tw-w-6" />
              <span className="tw-text-lg">POS</span>
            </button>

            <button
              onClick={() => handlePaymentMethodClick('cash')}
              disabled={grandTotal === 0}
              className={`tw-flex tw-items-center tw-justify-center tw-space-x-3 tw-py-4 tw-px-4 tw-rounded-lg tw-font-medium tw-transition-all tw-duration-200 ${
                paymentMethod === 'cash'
                  ? 'tw-bg-green-600 tw-text-white tw-shadow-lg tw-transform tw-scale-105'
                  : 'tw-bg-green-50 dark:tw-bg-green-900/20 tw-text-green-700 dark:tw-text-green-300 hover:tw-bg-green-100 dark:hover:tw-bg-green-900/30 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed'
              }`}
            >
              <Banknote className="tw-h-6 tw-w-6" />
              <span className="tw-text-lg">CASH</span>
            </button>
          </div>

          {paymentMethod && (
            <div className="tw-mt-4 tw-p-3 tw-bg-gray-50 dark:tw-bg-gray-700/50 tw-rounded-lg">
              <p className="tw-text-sm tw-text-gray-600 dark:tw-text-gray-400 tw-text-center">
                Payment method: <span className="tw-font-medium tw-text-gray-900 dark:tw-text-white tw-uppercase">{paymentMethod}</span>
              </p>
            </div>
          )}
        </div>

        {/* Generate Invoice Button */}
        <button
          onClick={handleGenerateInvoice}
          disabled={!customerName.trim() || invoiceItems.length === 0}
          className="tw-w-full tw-bg-blue-600 hover:tw-bg-blue-700 disabled:tw-bg-gray-400 disabled:tw-cursor-not-allowed tw-text-white tw-font-medium tw-py-4 tw-px-4 tw-rounded-lg tw-transition-colors tw-text-lg"
        >
          Generate Invoice
        </button>
        
        {/* Test Drawer for debugging - Inline */}
        <div className="tw-mt-4 tw-no-print">
          <TestDrawer 
            invoice={currentInvoice}
            isOpen={showPreview && !!currentInvoice} 
            onOpenChange={setShowPreview}
            onPrintInvoice={() => handlePrint('invoice')}
            onPrintReceipt={() => handlePrint('receipt')}
            onNewInvoice={handleNewInvoice}
            hasPrintedInvoice={hasPrintedInvoice}
            hasPrintedReceipt={hasPrintedReceipt}
            isSavingCrb={isInsertingCrb}
            isCrbSaved={!!savedCrbData}
          />
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