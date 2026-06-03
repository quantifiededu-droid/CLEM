export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  price: number; // in GHS
  cost: number;  // in GHS for gross margin calculations
  image?: string;
  stock: number;
  minStock: number;
  unit: string;
  type: 'hospitality' | 'retail';
}

export interface OrderItem {
  product: Product;
  quantity: number;
  note?: string;
}

export interface Table {
  id: string;
  name: string;
  status: 'available' | 'occupied' | 'billing' | 'dirty';
  capacity: number;
  currentOrder?: OrderItem[];
  waiterName?: string;
}

export interface TaxComponent {
  name: string;
  rate: number; // e.g., 0.15 for 15%
  amount: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  timestamp: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    cost: number;
    quantity: number;
  }[];
  subtotal: number;
  taxes: TaxComponent[];
  total: number;
  totalUSD: number; // For Gh duality
  paymentMethod: 'Cash' | 'Mobile Money' | 'Card' | 'Split';
  momoProvider?: 'MTN' | 'Telecel' | 'AirtelTigo';
  customerName?: string;
  customerPhone?: string;
  cashierName: string;
}

export interface Shift {
  id: string;
  cashierName: string;
  startTime: string;
  endTime?: string;
  startingCash: number;
  actualCash?: number;
  expectedCash?: number;
  status: 'open' | 'closed';
}

export interface BusinessSettings {
  businessName: string;
  businessPhone: string;
  currency: string;
  currencySymbol: string;
  isReceiptOptional: boolean;
}

export interface StoreKeeper {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: 'active' | 'suspended';
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  type: 'restock' | 'sale' | 'waste';
  quantity: number;
  timestamp: string;
  note?: string;
}
