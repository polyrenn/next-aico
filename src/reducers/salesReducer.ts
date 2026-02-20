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
  customerUniqueId: string | null; // For reward system tracking
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
  savedCrbData: { crbNumber: number; isDuplicate?: boolean } | null;
  crbError: string | null;
  saleError: string | null;
  
  // Queue tracking (for completion/decline)
  currentQueueItemId: number | null;
  currentQueueItem: any | null;
  
  // Print tracking
  hasPrintedInvoice: boolean;
  hasPrintedReceipt: boolean;
  
  // UI state
  showPreview: boolean;
  formKey: number;
}

// Action types
export type SalesAction =
  | { type: 'SET_CATEGORY'; payload: SalesCategory }
  | { type: 'SET_CUSTOMER_NAME'; payload: string }
  | { type: 'SET_CUSTOMER_UNIQUE_ID'; payload: string | null }
  | { type: 'SET_ITEMS'; payload: InvoiceItem[] }
  | { type: 'SET_TOTALS'; payload: { kg: number; total: number } }
  | { type: 'SET_AMOUNT_PAID'; payload: number }
  | { type: 'SET_PAYMENT_METHOD'; payload: 'pos' | 'cash' | null }
  | { type: 'SET_INVOICE_NUMBER'; payload: string }
  | { type: 'GENERATE_INVOICE'; payload: Invoice }
  | { type: 'CRB_SAVED'; payload: { crbNumber: number; isDuplicate?: boolean } }
  | { type: 'CRB_FAILED'; payload: string }
  | { type: 'SALE_FAILED'; payload: string }
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
  customerUniqueId: null,
  invoiceItems: [],
  totalKg: 0,
  grandTotal: 0,
  amountPaid: 0,
  balance: 0,
  paymentMethod: null,
  currentInvoice: null,
  invoiceNumber: 'CRB-...',
  savedCrbData: null,
  crbError: null,
  saleError: null,
  currentQueueItemId: null,
  currentQueueItem: null,
  hasPrintedInvoice: false,
  hasPrintedReceipt: false,
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

    case 'SET_CUSTOMER_UNIQUE_ID':
      return { ...state, customerUniqueId: action.payload };
      
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
      const realInvoiceNumber = `CRB-${action.payload.crbNumber}`;
      return {
        ...state,
        status: 'READY',
        savedCrbData: action.payload,
        crbError: null,
        invoiceNumber: realInvoiceNumber,
        // Update the invoice object with the real server-assigned number
        currentInvoice: state.currentInvoice 
          ? { ...state.currentInvoice, invoiceNumber: realInvoiceNumber }
          : null,
      };
      
    case 'CRB_FAILED':
      return {
        ...state,
        // Stay in GENERATING so the drawer remains open and button is retry-able
        status: 'GENERATING',
        crbError: action.payload,
      };
      
    case 'SALE_FAILED':
      return {
        ...state,
        // Stay in READY — CRB is saved, sale can be retried
        status: 'READY',
        saleError: action.payload,
      };
      
    case 'PRINT_INVOICE':
      return {
        ...state,
        hasPrintedInvoice: true,
      };
      
    case 'PRINT_RECEIPT':
      return {
        ...state,
        status: 'COMPLETING',
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
        // Clear errors
        crbError: null,
        saleError: null,
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
        // invoiceNumber: keep current preview — real number assigned at print time
        formKey: state.formKey + 1, // Reset form component to reflect new items
        // Store queue item for completion/decline tracking
        currentQueueItemId: queueItem.id,
        currentQueueItem: queueItem,
      };
      
    default:
      return state;
  }
}
