import { Product, Table, Sale, Shift } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // Hospitality (Food & Drinks)
  {
    id: 'h1',
    name: 'Ghana Jollof Rice (with Grilled Chicken & Coleslaw)',
    code: 'HOSP-JOL-01',
    category: 'Main Dishes',
    price: 65.00,
    cost: 22.50,
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=400',
    stock: 120,
    minStock: 15,
    unit: 'Plate',
    type: 'hospitality'
  },
  {
    id: 'h2',
    name: 'Waakye Special (with Shito, Egg, Wele, Tallia & Gari)',
    code: 'HOSP-WAA-02',
    category: 'Main Dishes',
    price: 55.00,
    cost: 18.00,
    stock: 90,
    minStock: 10,
    unit: 'Wrap',
    type: 'hospitality'
  },
  {
    id: 'h3',
    name: 'Grilled Tilapia with Banku & Hot Pepper (Large)',
    code: 'HOSP-TIL-03',
    category: 'Seafood',
    price: 85.00,
    cost: 34.00,
    stock: 45,
    minStock: 8,
    unit: 'Serving',
    type: 'hospitality'
  },
  {
    id: 'h4',
    name: 'Fufu with Light Soup & Goat Meat',
    code: 'HOSP-FUF-04',
    category: 'Traditional',
    price: 75.00,
    cost: 29.00,
    stock: 60,
    minStock: 10,
    unit: 'Bowl',
    type: 'hospitality'
  },
  {
    id: 'h5',
    name: 'Spicy Kelewele (Spiced Fried Plantain chunks)',
    code: 'HOSP-KEL-05',
    category: 'Appetizers & Sides',
    price: 25.00,
    cost: 7.00,
    stock: 150,
    minStock: 20,
    unit: 'Portion',
    type: 'hospitality'
  },
  {
    id: 'h6',
    name: 'House Sobolo (Chilled Ginger Hibiscus Drink)',
    code: 'HOSP-SOB-06',
    category: 'Beverages',
    price: 15.00,
    cost: 4.50,
    stock: 200,
    minStock: 30,
    unit: 'Bottle',
    type: 'hospitality'
  },
  {
    id: 'h7',
    name: 'Club Gold Lager Beer (625ml)',
    code: 'HOSP-CLB-07',
    category: 'Beverages',
    price: 22.00,
    cost: 14.00,
    stock: 180,
    minStock: 24,
    unit: 'Bottle',
    type: 'hospitality'
  },
  {
    id: 'h8',
    name: 'Asun / Spicy Peppered Goat Meat',
    code: 'HOSP-ASN-08',
    category: 'Appetizers & Sides',
    price: 45.00,
    cost: 17.50,
    stock: 80,
    minStock: 12,
    unit: 'Plate',
    type: 'hospitality'
  },

  // Retail Items
  {
    id: 'r1',
    name: 'Royal Feast Jasmine Rice 5kg',
    code: 'RET-RIC-101',
    category: 'Dry Foods',
    price: 145.00,
    cost: 110.00,
    stock: 45,
    minStock: 10,
    unit: 'Bag',
    type: 'retail'
  },
  {
    id: 'r2',
    name: 'Frytol Pure Vegetable Oil 1L',
    code: 'RET-OIL-102',
    category: 'Cooking Oils',
    price: 58.00,
    cost: 44.00,
    stock: 60,
    minStock: 15,
    unit: 'Bottle',
    type: 'retail'
  },
  {
    id: 'r3',
    name: 'Nestle Milo Activ-Go 400g Tin',
    code: 'RET-MIL-103',
    category: 'Breakfast',
    price: 49.50,
    cost: 38.00,
    stock: 35,
    minStock: 8,
    unit: 'Tin',
    type: 'retail'
  },
  {
    id: 'r4',
    name: 'Pioneer Canned Tuna in Oil 160g',
    code: 'RET-TUN-104',
    category: 'Canned Goods',
    price: 18.50,
    cost: 12.00,
    stock: 140,
    minStock: 25,
    unit: 'Can',
    type: 'retail'
  },
  {
    id: 'r5',
    name: 'Voltic Natural Mineral Water 1.5L x6 Pack',
    code: 'RET-WAT-105',
    category: 'Beverages',
    price: 36.00,
    cost: 25.00,
    stock: 80,
    minStock: 15,
    unit: 'Pack',
    type: 'retail'
  },
  {
    id: 'r6',
    name: 'Gino Tomato Paste 400g Tin',
    code: 'RET-TOM-106',
    category: 'Canned Goods',
    price: 24.00,
    cost: 17.00,
    stock: 110,
    minStock: 20,
    unit: 'Tin',
    type: 'retail'
  }
];

export const INITIAL_TABLES: Table[] = [
  { id: 't1', name: 'Table 01', status: 'available', capacity: 2, waiterName: 'Kofi' },
  { id: 't2', name: 'Table 02', status: 'occupied', capacity: 4, waiterName: 'Ama', currentOrder: [
    { product: INITIAL_PRODUCTS[0], quantity: 2, note: 'Extra shito' },
    { product: INITIAL_PRODUCTS[4], quantity: 1 },
    { product: INITIAL_PRODUCTS[5], quantity: 3 }
  ] },
  { id: 't3', name: 'Table 03', status: 'available', capacity: 4, waiterName: 'Kofi' },
  { id: 't4', name: 'Table 04', status: 'billing', capacity: 6, waiterName: 'Kwame', currentOrder: [
    { product: INITIAL_PRODUCTS[2], quantity: 2 },
    { product: INITIAL_PRODUCTS[6], quantity: 4 }
  ] },
  { id: 't5', name: 'Table 05', status: 'available', capacity: 2, waiterName: 'Ama' },
  { id: 't6', name: 'VIP Garden Lounge', status: 'dirty', capacity: 8, waiterName: 'Kwame' },
];

export const INITIAL_SHIFTS: Shift[] = [
  {
    id: 's1',
    cashierName: 'Ekow Mensah',
    startTime: '2026-06-03T07:00:00Z',
    status: 'open',
    startingCash: 500.00
  }
];

export const SAMPLE_SALES: Sale[] = [
  {
    id: 'tx1',
    invoiceNumber: 'INV/2026/0603/001',
    timestamp: '2026-06-03T07:15:00Z',
    items: [
      { productId: 'h1', productName: 'Ghana Jollof Rice (with Grilled Chicken)', price: 65.00, cost: 22.50, quantity: 2 },
      { productId: 'h6', productName: 'House Sobolo (Chilled Ginger Hibiscus Drink)', price: 15.00, cost: 4.50, quantity: 2 }
    ],
    subtotal: 160.00,
    taxes: [
      { name: 'GETFund (2.5%)', rate: 0.025, amount: 4.00 },
      { name: 'NHIL (2.5%)', rate: 0.025, amount: 4.00 },
      { name: 'Covid-19 Levy (1%)', rate: 0.01, amount: 1.60 },
      { name: 'VAT (15%)', rate: 0.15, amount: 24.00 }
    ],
    total: 193.60,
    totalUSD: 13.35,
    paymentMethod: 'Mobile Money',
    momoProvider: 'MTN',
    customerName: 'Abena Osei',
    customerPhone: '+233 24 456 7890',
    cashierName: 'Ekow Mensah'
  },
  {
    id: 'tx2',
    invoiceNumber: 'INV/2026/0603/002',
    timestamp: '2026-06-03T07:34:00Z',
    items: [
      { productId: 'r1', productName: 'Royal Feast Jasmine Rice 5kg', price: 145.00, cost: 110.00, quantity: 1 },
      { productId: 'r2', productName: 'Frytol Pure Vegetable Oil 1L', price: 58.00, cost: 44.00, quantity: 2 }
    ],
    subtotal: 261.00,
    taxes: [
      { name: 'GETFund (2.5%)', rate: 0.025, amount: 6.53 },
      { name: 'NHIL (2.5%)', rate: 0.025, amount: 6.53 },
      { name: 'Covid-19 Levy (1%)', rate: 0.01, amount: 2.61 },
      { name: 'VAT (15%)', rate: 0.15, amount: 39.15 }
    ],
    total: 315.82,
    totalUSD: 21.78,
    paymentMethod: 'Cash',
    customerName: 'Kwesi Appiah',
    cashierName: 'Ekow Mensah'
  },
  {
    id: 'tx3',
    invoiceNumber: 'INV/2026/0603/003',
    timestamp: '2026-06-03T07:55:00Z',
    items: [
      { productId: 'h3', productName: 'Grilled Tilapia with Banku & Hot Pepper', price: 85.00, cost: 34.00, quantity: 1 },
      { productId: 'h7', productName: 'Club Gold Lager Beer', price: 22.00, cost: 14.00, quantity: 2 }
    ],
    subtotal: 129.00,
    taxes: [
      { name: 'GETFund (2.5%)', rate: 0.025, amount: 3.23 },
      { name: 'NHIL (2.5%)', rate: 0.025, amount: 3.23 },
      { name: 'Covid-19 Levy (1%)', rate: 0.01, amount: 1.29 },
      { name: 'VAT (15%)', rate: 0.15, amount: 19.35 }
    ],
    total: 156.10,
    totalUSD: 10.77,
    paymentMethod: 'Card',
    customerName: 'Yaa Bonsu',
    cashierName: 'Ekow Mensah'
  }
];

export const BLOG_POSTS = [
  {
    title: 'Optimizing Store Cash Flow: A Guide for Ghanaian Retailers',
    excerpt: 'Understand how cash balancing, register float control, and real-time cloud bookkeeping safeguard your stores liquidity and prevent cash register variances.',
    date: 'May 28, 2026',
    author: 'Kwadwo Boateng, ERP Consultant'
  },
  {
    title: 'Reducing Ingredients Waste with Food Recipe Cost Engineering',
    excerpt: 'Learn how to maximize your restaurant profit margins in Ghana by managing menu recipe ratios, ingredients spoilage, and direct purchases tracking.',
    date: 'April 14, 2026',
    author: 'Chef Akwasi, Clemtrix Partner'
  }
];
