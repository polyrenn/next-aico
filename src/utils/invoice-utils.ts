import { Invoice } from '../types';

const isClient = typeof window !== 'undefined';

export const generateInvoiceNumber = (): string => {
  if (!isClient) return 'CRB-...';
  
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem('aicogas_invoice_date');
  let invoiceCount = parseInt(localStorage.getItem('aicogas_invoice_count') || '0');
  
  // Reset counter if it's a new day
  if (savedDate !== today) {
    invoiceCount = 0;
    localStorage.setItem('aicogas_invoice_date', today);
    localStorage.setItem('aicogas_invoice_count', '0');
  }
  
  // Return the next invoice number without incrementing yet
  return `CRB-${invoiceCount + 1}`;
};

export const incrementInvoiceNumber = (): void => {
  if (!isClient) return;
  
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem('aicogas_invoice_date');
  let invoiceCount = parseInt(localStorage.getItem('aicogas_invoice_count') || '0');
  
  // Reset counter if it's a new day
  if (savedDate !== today) {
    invoiceCount = 0;
    localStorage.setItem('aicogas_invoice_date', today);
  }
  
  // Increment the counter
  invoiceCount += 1;
  localStorage.setItem('aicogas_invoice_count', invoiceCount.toString());
};

export const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString()}`;
};

export const formatAmount = (amount: number): string => {
  return amount.toLocaleString();
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const saveInvoice = (invoice: Invoice): void => {
  if (!isClient) return;
  
  const invoices = getInvoices();
  invoices.push(invoice);
  localStorage.setItem('aicogas_invoices', JSON.stringify(invoices));
  
  // Increment the invoice number only after successful save
  incrementInvoiceNumber();
};

export const getInvoices = (): Invoice[] => {
  if (!isClient) return [];
  
  const saved = localStorage.getItem('aicogas_invoices');
  return saved ? JSON.parse(saved) : [];
};