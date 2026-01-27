import React, { useState, useEffect, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import { SalesCategory, InvoiceItem, Invoice } from '@/types';
import { formatDate, formatTime, saveInvoice, formatCurrency } from '@/utils/invoice-utils';
import Layout from '@/components/new/Layout';
import SalesForm from '@/components/new/SalesForm';
import InvoicePreview from '@/components/new/InvoicePreview';
import PrintableInvoice from '@/components/new/PrintableInvoice';
import { Calendar, Clock, Tag, User, DollarSign, CreditCard, Banknote } from 'lucide-react';
import { withSessionSsr } from '../../lib/withSession';
import { prisma } from '../../lib/prisma';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';

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

    const invoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber,
      date: currentDate.toISOString(),
      time: formatTime(currentDate),
      userId: 'admin',
      userName: 'Admin',
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
  };

  const handlePrint = (type: 'invoice' | 'receipt') => {
    if (!currentInvoice) return;
    
    setPrintType(type);
    setTimeout(() => {
      window.print();
    }, 100);
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
    // Invalidate nextCrbNumber to fetch fresh one for next sale
    queryClient.invalidateQueries({ queryKey: ['nextCrbNumber'] });
  };

  if (showPreview && currentInvoice) {
    return (
      <Layout>
        <div className="no-print p-4 space-y-6">
          <InvoicePreview
            invoice={currentInvoice}
            onPrintInvoice={() => handlePrint('invoice')}
            onPrintReceipt={() => handlePrint('receipt')}
          />
          
          <button
            onClick={handleNewInvoice}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Create New Invoice
          </button>
        </div>

        {/* Printable content - only visible when printing */}
        <div className="print-only">
          <PrintableInvoice invoice={currentInvoice} isReceipt={printType === 'receipt'} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Invoice Header Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-gray-600 dark:text-gray-400">Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(currentDate)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-gray-600 dark:text-gray-400">Time</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatTime(currentDate)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Invoice Number</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {invoiceNumber}
            </p>
          </div>
        </div>

        {/* Sales Category Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-lg">
              <Tag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sales Category
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select customer type
              </p>
            </div>
          </div>

          <select
            value={salesCategory}
            onChange={(e) => setSalesCategory(e.target.value as SalesCategory)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="domestic">Domestic</option>
            <option value="eatery">Eatery</option>
            <option value="dealers">Dealers</option>
            <option value="others">Others</option>
          </select>
        </div>

        {/* Sales Form */}
        <SalesForm
          salesCategory={salesCategory}
          onItemsChange={setInvoiceItems}
          onTotalsChange={handleTotalsChange}
        />

        {/* Customer Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-indigo-100 dark:bg-indigo-900/20 p-2 rounded-lg">
              <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Customer Information
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter customer details
              </p>
            </div>
          </div>

          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        {/* Payment Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/20 p-2 rounded-lg">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payment Information
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Payment details and balance
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Balance Display */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Amount:
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Amount Paid:
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(amountPaid)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-600 pt-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Balance:
                </span>
                <span className={`text-xl font-bold ${
                  balance >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatCurrency(balance)}
                </span>
              </div>
              {balance < 0 && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Customer owes {formatCurrency(Math.abs(balance))}
                </p>
              )}
              {balance > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Change to give: {formatCurrency(balance)}
                </p>
              )}
            </div>

            {/* Amount Paid Entry - Now positioned after Balance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Payment Method Buttons */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-2 rounded-lg">
              <CreditCard className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payment Method
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Quick payment options
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handlePaymentMethodClick('pos')}
              disabled={grandTotal === 0}
              className={`flex items-center justify-center space-x-3 py-4 px-4 rounded-lg font-medium transition-all duration-200 ${
                paymentMethod === 'pos'
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <CreditCard className="h-6 w-6" />
              <span className="text-lg">POS</span>
            </button>

            <button
              onClick={() => handlePaymentMethodClick('cash')}
              disabled={grandTotal === 0}
              className={`flex items-center justify-center space-x-3 py-4 px-4 rounded-lg font-medium transition-all duration-200 ${
                paymentMethod === 'cash'
                  ? 'bg-green-600 text-white shadow-lg transform scale-105'
                  : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <Banknote className="h-6 w-6" />
              <span className="text-lg">CASH</span>
            </button>
          </div>

          {paymentMethod && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Payment method: <span className="font-medium text-gray-900 dark:text-white uppercase">{paymentMethod}</span>
              </p>
            </div>
          )}
        </div>

        {/* Generate Invoice Button */}
        <button
          onClick={handleGenerateInvoice}
          disabled={!customerName.trim() || invoiceItems.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-4 px-4 rounded-lg transition-colors text-lg"
        >
          Generate Invoice
        </button>
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