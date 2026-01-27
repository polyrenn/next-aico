export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
}

export interface PriceStructure {
  domestic: number;
  eatery: number;
  dealers: number;
  others: number;
}

export interface KGType {
  type: string;
  weight: number;
}

export interface InvoiceItem {
  kgType: string;
  weight: number;
  quantity: number;
  pricePerKg: number;
  totalKg: number;
  totalAmount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  time: string;
  userId: string;
  userName: string;
  customerName: string;
  salesCategory: 'domestic' | 'eatery' | 'dealers' | 'others';
  items: InvoiceItem[];
  totalKg: number;
  grandTotal: number;
  amountPaid: number;
  balance: number;
}

export type SalesCategory = 'domestic' | 'eatery' | 'dealers' | 'others';