import { SalesCategory, InvoiceItem, Invoice } from '@/types';

// Sales flow status
export type SalesStatus = 'IDLE' | 'GENERATING' | 'READY' | 'COMPLETING' | 'FINISHED';

// Unified state for the sales dashboard
export interface SalesState {
  // Status tracking
  status: SalesStatus;
  
  // Form data
  salesCategory: SalesCategory;
  customerName: string;
  invoiceItems: InvoiceItem[];
  totalKg: number;
  grandTotal: number;
  
  // Payment data
  amountPaid: number;
  balance: number;
  paymentMethod: 'pos' | 'cash' | null;
  
  // Invoice tracking
  currentInvoice: Invoice | null;
  invoiceNumber: string;
  
  // CRB/Sale tracking
  savedCrbData: { crbNumber: number } | null;
  
  // Queue tracking (for completion/decline)
  currentQueueItemId: number | null;
  currentQueueItem: any | null;
  
  // Print tracking
  hasPrintedInvoice: boolean;
  hasPrintedReceipt: boolean;
  printType: 'invoice' | 'receipt';
  
  // UI state
  showPreview: boolean;
  formKey: number;
}

// Action types
export type SalesAction =
  | { type: 'SET_CATEGORY'; payload: SalesCategory }
  | { type: 'SET_CUSTOMER_NAME'; payload: string }
  | { type: 'SET_ITEMS'; payload: InvoiceItem[] }
  | { type: 'SET_TOTALS'; payload: { kg: number; total: number } }
  | { type: 'SET_AMOUNT_PAID'; payload: number }
  | { type: 'SET_PAYMENT_METHOD'; payload: 'pos' | 'cash' | null }
  | { type: 'SET_INVOICE_NUMBER'; payload: string }
  | { type: 'GENERATE_INVOICE'; payload: Invoice }
  | { type: 'CRB_SAVED'; payload: { crbNumber: number } }
  | { type: 'PRINT_INVOICE' }
  | { type: 'PRINT_RECEIPT' }
  | { type: 'SALE_COMPLETED' }
  | { type: 'RESET_FOR_NEW_INVOICE' }
  | { type: 'LOAD_QUEUE_ITEM'; payload: any };

// Initial state
export const initialSalesState: SalesState = {
  status: 'IDLE',
  salesCategory: 'domestic',
  customerName: '',
  invoiceItems: [],
  totalKg: 0,
  grandTotal: 0,
  amountPaid: 0,
  balance: 0,
  paymentMethod: null,
  currentInvoice: null,
  invoiceNumber: 'CRB-...',
  savedCrbData: null,
  currentQueueItemId: null,
  currentQueueItem: null,
  hasPrintedInvoice: false,
  hasPrintedReceipt: false,
  printType: 'invoice',
  showPreview: false,
  formKey: 0,
};

// Reducer function
export function salesReducer(state: SalesState, action: SalesAction): SalesState {
  switch (action.type) {
    case 'SET_CATEGORY':
      return { ...state, salesCategory: action.payload };
      
    case 'SET_CUSTOMER_NAME':
      return { ...state, customerName: action.payload };
      
    case 'SET_ITEMS':
      return { ...state, invoiceItems: action.payload };
      
    case 'SET_TOTALS':
      return {
        ...state,
        totalKg: action.payload.kg,
        grandTotal: action.payload.total,
        balance: state.amountPaid - action.payload.total,
      };
      
    case 'SET_AMOUNT_PAID':
      return {
        ...state,
        amountPaid: action.payload,
        balance: action.payload - state.grandTotal,
      };
      
    case 'SET_PAYMENT_METHOD':
      return {
        ...state,
        paymentMethod: action.payload,
        // Auto-fill amount paid when payment method is selected
        amountPaid: action.payload ? state.grandTotal : state.amountPaid,
      };
      
    case 'SET_INVOICE_NUMBER':
      return { ...state, invoiceNumber: action.payload };
      
    case 'GENERATE_INVOICE':
      return {
        ...state,
        status: 'GENERATING',
        currentInvoice: action.payload,
        showPreview: true,
      };
      
    case 'CRB_SAVED':
      return {
        ...state,
        status: 'READY',
        savedCrbData: action.payload,
        invoiceNumber: `CRB-${action.payload.crbNumber}`,
      };
      
    case 'PRINT_INVOICE':
      return {
        ...state,
        hasPrintedInvoice: true,
        printType: 'invoice',
      };
      
    case 'PRINT_RECEIPT':
      return {
        ...state,
        status: 'COMPLETING',
        printType: 'receipt',
      };
      
    case 'SALE_COMPLETED':
      return {
        ...state,
        status: 'FINISHED',
        hasPrintedReceipt: true,
      };
      
    case 'RESET_FOR_NEW_INVOICE':
      return {
        ...initialSalesState,
        formKey: state.formKey + 1,
        // Keep the invoice number if it was already fetched, it'll be updated by the next fetch anyway
        invoiceNumber: state.invoiceNumber,
        // Clear queue tracking
        currentQueueItemId: null,
        currentQueueItem: null,
      };
      
    case 'LOAD_QUEUE_ITEM':
      const queueItem = action.payload;
      // Map queue description (InvoiceItems from GasPurchaseForm) to our internal InvoiceItem structure if needed
      // GasPurchaseForm uses: { kg: "12.5KG", quantity: 1, unitPrice: 1000, total: 1000 }
      // Our internal uses: { kg: "12.5KG", weight: 12.5, quantity: 1, pricePerKg: 1000, totalKg: 12.5, totalAmount: 1000 }
      
      const mappedItems: InvoiceItem[] = (queueItem.description as any[]).map(item => {
        const weight = parseFloat(item.kg.replace('KG', ''));
        return {
          kg: item.kg,
          weight: weight,
          quantity: item.quantity,
          pricePerKg: item.unitPrice / weight,
          totalKg: weight * item.quantity,
          totalAmount: item.total
        };
      });

      return {
        ...state,
        customerName: queueItem.customerId || '',
        invoiceItems: mappedItems,
        totalKg: queueItem.totalKg,
        grandTotal: queueItem.amount,
        balance: state.amountPaid - queueItem.amount,
        invoiceNumber: `CRB-${queueItem.crbNumber}`,
        formKey: state.formKey + 1, // Reset form component to reflect new items
        // Store queue item for completion/decline tracking
        currentQueueItemId: queueItem.id,
        currentQueueItem: queueItem,
      };
      
    default:
      return state;
  }
}
