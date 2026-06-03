import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coffee, ShoppingBag, Search, Plus, Minus, Trash2, User, Phone, 
  CreditCard, Smartphone, Receipt, Printer, ArrowLeft, AlertCircle, 
  CheckCircle2, Calculator, Percent, Sparkles, Clock, Coins, Lock,
  ChevronRight, RefreshCw, Layers
} from 'lucide-react';
import { Product, Table, Sale, Shift, OrderItem, TaxComponent, BusinessSettings, StoreKeeper } from '../types';

interface PosTerminalProps {
  products: Product[];
  onUpdateInventory: (productId: string, qtySold: number) => void;
  tables: Table[];
  onUpdateTables: (tables: Table[]) => void;
  sales: Sale[];
  onAddSale: (sale: Sale) => void;
  activeShift: Shift | null;
  onCloseShift: (actualCash: number) => void;
  onNavigate: (route: 'landing' | 'pos' | 'backoffice') => void;
  businessSettings: BusinessSettings;
  storeKeepers: StoreKeeper[];
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  offlineSyncQueue: Sale[];
  setOfflineSyncQueue: React.Dispatch<React.SetStateAction<Sale[]>>;
}

export default function PosTerminal({
  products,
  onUpdateInventory,
  tables,
  onUpdateTables,
  sales,
  onAddSale,
  activeShift,
  onCloseShift,
  onNavigate,
  businessSettings,
  storeKeepers,
  isOnline,
  setIsOnline,
  offlineSyncQueue,
  setOfflineSyncQueue
}: PosTerminalProps) {
  // POS System Mode
  const [posMode, setPosMode] = useState<'hospitality' | 'retail'>('hospitality');
  
  // Terminal view states
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [retailCart, setRetailCart] = useState<OrderItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Cart customization & Customer Info
  const [cartDiscount, setCartDiscount] = useState<number>(0); // percent e.g. 5, 10
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [selectedWaiter, setSelectedWaiter] = useState<string>(storeKeepers[0]?.name || 'Ama Osei');

  // Checkout states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Mobile Money' | 'Card'>('Cash');
  const [momoProvider, setMomoProvider] = useState<'MTN' | 'Telecel' | 'AirtelTigo'>('MTN');
  const [momoPhoneNumber, setMomoPhoneNumber] = useState('');
  const [isMomoSimulating, setIsMomoSimulating] = useState(false);
  const [momoSimStatus, setMomoSimStatus] = useState<'idle' | 'triggered' | 'approved'>('idle');
  const [receivedCashAmount, setReceivedCashAmount] = useState<string>('');
  
  // Invoice Reciept display State
  const [createdReceipt, setCreatedReceipt] = useState<Sale | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Shift control modal
  const [isCloseShiftModalOpen, setIsCloseShiftModalOpen] = useState(false);
  const [actualDrawerCashInput, setActualDrawerCashInput] = useState('');

  // Exchange rate constants
  const GHS_USD_RATE = 14.50;

  // Active categories list
  const categories = useMemo(() => {
    const list = products
      .filter(p => p.type === posMode)
      .map(p => p.category);
    return ['All', ...Array.from(new Set(list))];
  }, [products, posMode]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (p.type !== posMode) return false;
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (searchQuery) {
        return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
               p.code.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });
  }, [products, posMode, categoryFilter, searchQuery]);

  // Current order state reference (points to active table's order or the retail cart)
  const currentCart: OrderItem[] = useMemo(() => {
    if (posMode === 'retail') {
      return retailCart;
    } else {
      return selectedTable?.currentOrder || [];
    }
  }, [posMode, retailCart, selectedTable]);

  // Handle updating cart quantities
  const updateCartQuantity = (product: Product, delta: number, itemNote?: string) => {
    if (posMode === 'retail') {
      const existingIdx = retailCart.findIndex(item => item.product.id === product.id);
      if (existingIdx > -1) {
        const revised = [...retailCart];
        const newQty = revised[existingIdx].quantity + delta;
        if (newQty <= 0) {
          revised.splice(existingIdx, 1);
        } else {
          revised[existingIdx].quantity = newQty;
          if (itemNote !== undefined) revised[existingIdx].note = itemNote;
        }
        setRetailCart(revised);
      } else if (delta > 0) {
        setRetailCart([...retailCart, { product, quantity: delta, note: itemNote }]);
      }
    } else {
      // Hospitality Table cart updates
      if (!selectedTable) return;
      
      const tableOrder = selectedTable.currentOrder || [];
      const existingIdx = tableOrder.findIndex(item => item.product.id === product.id);
      let revisedOrder = [...tableOrder];
      
      if (existingIdx > -1) {
        const newQty = revisedOrder[existingIdx].quantity + delta;
        if (newQty <= 0) {
          revisedOrder.splice(existingIdx, 1);
        } else {
          revisedOrder[existingIdx].quantity = newQty;
          if (itemNote !== undefined) revisedOrder[existingIdx].note = itemNote;
        }
      } else if (delta > 0) {
        revisedOrder.push({ product, quantity: delta, note: itemNote });
      }

      // Update table state
      const revisedTables = tables.map(t => {
        if (t.id === selectedTable.id) {
          return {
            ...t,
            status: revisedOrder.length > 0 ? (t.status === 'billing' ? 'billing' : 'occupied') : 'available',
            currentOrder: revisedOrder.length > 0 ? revisedOrder : undefined
          } as Table;
        }
        return t;
      });
      
      onUpdateTables(revisedTables);
      
      // Update our selected view pointer
      const updatedTable = revisedTables.find(t => t.id === selectedTable.id) || null;
      setSelectedTable(updatedTable);
    }
  };

  const removeCartItem = (product: Product) => {
    if (posMode === 'retail') {
      setRetailCart(retailCart.filter(item => item.product.id !== product.id));
    } else {
      if (!selectedTable) return;
      const revisedOrder = (selectedTable.currentOrder || []).filter(item => item.product.id !== product.id);
      const revisedTables = tables.map(t => {
        if (t.id === selectedTable.id) {
          return {
            ...t,
            status: revisedOrder.length > 0 ? t.status : 'available',
            currentOrder: revisedOrder.length > 0 ? revisedOrder : undefined
          } as Table;
        }
        return t;
      });
      onUpdateTables(revisedTables);
      setSelectedTable(revisedTables.find(t => t.id === selectedTable.id) || null);
    }
  };

  // Pricing calculations
  const totals = useMemo(() => {
    const subtotal = currentCart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const discountAmount = subtotal * (cartDiscount / 100);
    const taxableSubtotal = subtotal - discountAmount;

    // Standard calculations (Excluding complex GRA tax splits)
    const totalGHS = taxableSubtotal;
    const totalUSD = totalGHS / GHS_USD_RATE;

    const taxesArray: TaxComponent[] = [];

    return {
      subtotal,
      discountAmount,
      taxableSubtotal,
      getfund: 0,
      nhil: 0,
      covid: 0,
      vat: 0,
      totalGHS,
      totalUSD,
      taxes: taxesArray
    };
  }, [currentCart, cartDiscount]);

  // Reset current ordering session
  const clearCurrentCart = () => {
    if (posMode === 'retail') {
      setRetailCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setCartDiscount(0);
    } else {
      if (!selectedTable) return;
      const revisedTables = tables.map(t => {
        if (t.id === selectedTable.id) {
          return {
            ...t,
            status: 'available',
            currentOrder: undefined
          } as Table;
        }
        return t;
      });
      onUpdateTables(revisedTables);
      setSelectedTable(revisedTables.find(t => t.id === selectedTable.id) || null);
    }
  };

  const handleOpenCheckout = () => {
    if (currentCart.length === 0) return;
    setIsCheckoutOpen(true);
    setPaymentMethod('Cash');
    setMomoPhoneNumber(customerPhone || '');
    setReceivedCashAmount('');
    setMomoSimStatus('idle');
  };

  // Simulate USSD mobile money push notifications
  const handleTriggerMomoPush = () => {
    if (!momoPhoneNumber) return;
    setIsMomoSimulating(true);
    setMomoSimStatus('triggered');
    
    setTimeout(() => {
      setMomoSimStatus('approved');
      setIsMomoSimulating(false);
    }, 2800);
  };

  // Complete checkout & generate ticket
  const handleFinalizeSale = () => {
    const isMomoApproved = paymentMethod === 'Mobile Money' && momoSimStatus === 'approved';
    const isCashValid = paymentMethod === 'Cash' && (!receivedCashAmount || parseFloat(receivedCashAmount) >= totals.totalGHS);
    const isCard = paymentMethod === 'Card';

    if (paymentMethod === 'Mobile Money' && momoSimStatus !== 'approved') {
      alert("Please simulate the USSD MoMo validation approval first!");
      return;
    }

    // Prepare Sale ledger record
    const invoiceNum = `INV/2026/0603/0${sales.length + 124}`;
    const newSale: Sale = {
      id: `tx-loc-${Date.now()}`,
      invoiceNumber: invoiceNum,
      timestamp: new Date().toISOString(),
      items: currentCart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        cost: item.product.cost,
        quantity: item.quantity
      })),
      subtotal: totals.subtotal,
      taxes: totals.taxes,
      total: totals.totalGHS,
      totalUSD: totals.totalUSD,
      paymentMethod: paymentMethod === 'Mobile Money' ? 'Mobile Money' : (paymentMethod === 'Card' ? 'Card' : 'Cash'),
      momoProvider: paymentMethod === 'Mobile Money' ? momoProvider : undefined,
      customerName: customerName || 'Walk-in Guest',
      customerPhone: customerPhone || undefined,
      cashierName: activeShift?.cashierName || 'System Admin'
    };

    // Update global databases
    if (isOnline) {
      onAddSale(newSale);
    } else {
      setOfflineSyncQueue(prev => [...prev, newSale]);
      onAddSale(newSale); // Also update local active receipts so visual telemetry is correct
    }
    
    // Deduct stock levels in warehouse
    currentCart.forEach(item => {
      onUpdateInventory(item.product.id, item.quantity);
    });

    // Reset tables or carts
    if (posMode === 'hospitality' && selectedTable) {
      const revisedTables = tables.map(t => {
        if (t.id === selectedTable.id) {
          return {
            ...t,
            status: 'dirty', // Marks table as needing clearing
            currentOrder: undefined
          } as Table;
        }
        return t;
      });
      onUpdateTables(revisedTables);
      setSelectedTable(revisedTables.find(x => x.id === selectedTable.id) || null);
    } else {
      setRetailCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setCartDiscount(0);
    }

    // Set Receipt log for visual display printout trigger
    setCreatedReceipt(newSale);
    setIsCheckoutOpen(false);
    setIsReceiptModalOpen(true);
  };

  // Close shift balance log
  const handlePerformCloseShift = () => {
    const cashVal = parseFloat(actualDrawerCashInput);
    if (isNaN(cashVal)) return;
    onCloseShift(cashVal);
    setIsCloseShiftModalOpen(false);
    onNavigate('backoffice');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none">
      {/* POS Top Bar Controls */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 md:px-6 py-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('landing')}
            className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black tracking-tight text-white">Clemtrix POS</span>
            <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-400 rounded px-1.5 py-0.5 uppercase font-mono font-bold">FOH V4</span>
          </div>
          <div className="h-6 w-px bg-slate-800 hidden sm:block" />
          
          {/* Active Shift Info */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-brand" />
            <span className="font-medium mr-1">Cashier:</span>
            <span className="font-semibold text-slate-200">{activeShift?.cashierName || 'Demo Admin'}</span>
            <span className="w-1.5 h-1.5 bg-brand rounded-full animate-ping ml-1" />
          </div>

          {/* Real-time Connection / Sync controller */}
          <div className="hidden md:flex items-center gap-2 pl-3 ml-2 border-l border-slate-800">
            <button
              onClick={() => {
                if (!isOnline) {
                  // Simulate auto-sync on reconnect (automatic sync!)
                  const queueCount = offlineSyncQueue.length;
                  if (queueCount > 0) {
                    alert(`⚡ Connection Restored! Automatic sync triggered: successfully synchronized ${queueCount} buffered checkout record(s) with our cloud database ledger!`);
                    setOfflineSyncQueue([]);
                  }
                  setIsOnline(true);
                } else {
                  setIsOnline(false);
                }
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all text-left cursor-pointer ${
                isOnline 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 animate-pulse'
              }`}
              title="Click to simulate going offline or online"
            >
              <RefreshCw className={`w-3 h-3 ${isOnline ? 'animate-none' : 'animate-spin'}`} />
              <span>{isOnline ? 'CLOUD SYNC ONLINE' : 'WORKING OFFLINE READY'}</span>
            </button>
            {offlineSyncQueue.length > 0 && (
              <span className="text-[10px] bg-amber-500 text-slate-950 font-mono font-black px-1.5 py-0.5 rounded animate-bounce">
                {offlineSyncQueue.length} PENDING
              </span>
            )}
          </div>
        </div>

        {/* Sector Module Selector */}
        <div className="bg-slate-900 p-0.5 rounded-xl border border-slate-800 flex items-center gap-1">
          <button
            onClick={() => {
              setPosMode('hospitality');
              setCategoryFilter('All');
              setSelectedTable(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              posMode === 'hospitality' 
              ? 'bg-brand text-slate-950 shadow-md shadow-brand/10' 
              : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Hospitality FOH</span>
          </button>
          
          <button
            onClick={() => {
              setPosMode('retail');
              setCategoryFilter('All');
              setSelectedTable(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              posMode === 'retail' 
              ? 'bg-brand text-slate-950 shadow-md shadow-brand/10' 
              : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Retail Express</span>
          </button>
        </div>

        {/* End Day Shift Drawer */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('backoffice')}
            className="hidden lg:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 px-3.5 py-2 border border-slate-800 hover:border-slate-700 text-xs font-bold rounded-xl text-brand transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            Backoffice ERP
          </button>
          {activeShift ? (
            <button
              onClick={() => {
                setActualDrawerCashInput('');
                setIsCloseShiftModalOpen(true);
              }}
              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-slate-950 font-bold text-xs py-2 px-3 md:px-4 rounded-xl border border-red-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Close Drawer Shift</span>
            </button>
          ) : (
            <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1.5 rounded-lg border border-slate-750 font-mono">Shift Locked</span>
          )}
        </div>
      </header>

      {/* Main interactive terminal dashboard split */}
      <div className="flex-1 overflow-hidden grid lg:grid-cols-12">
        
        {/* LEFT COMPILER PANEL (60%): Table manager OR category product tiles */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900 border-r border-slate-850 overflow-hidden">
          
          {/* Segment: If Hospitality, and NO table is active, show Visual Floor Layout plan! */}
          {posMode === 'hospitality' && !selectedTable ? (
            <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-black text-white">Visual Floor & Seat Blueprint</h2>
                    <p className="text-slate-400 text-xs mt-0.5">Click a physical table coordinates map to load current guest billing session</p>
                  </div>
                  
                  {/* Color indications legends */}
                  <div className="flex flex-wrap gap-3 text-[10px] uppercase font-mono font-bold tracking-wider">
                    <span className="flex items-center gap-1.5 text-brand">
                      <span className="w-2 h-2 rounded-full bg-brand" />
                      <span>Free</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Busy</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-purple-400">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>Billing</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-slate-600 animate-pulse" />
                      <span>Dirty</span>
                    </span>
                  </div>
                </div>

                {/* Simulated visual restaurant physical layout bento coordinates map */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 my-4">
                  {tables.map(tbl => {
                    const orderItemCount = tbl.currentOrder?.reduce((s, i) => s + i.quantity, 0) || 0;
                    const orderValueStr = tbl.currentOrder?.reduce((s, i) => s + (i.product.price * i.quantity), 0).toFixed(2) || '0.00';
                    const activeColorClass = 
                      tbl.status === 'available' ? 'border-brand/20 bg-brand/5 hover:bg-brand/10 hover:border-brand' :
                      tbl.status === 'occupied' ? 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500' :
                      tbl.status === 'billing' ? 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500' :
                      'border-slate-800 bg-slate-950/20 text-slate-500';

                    return (
                      <button
                        key={tbl.id}
                        onClick={() => {
                          if (tbl.status === 'dirty') {
                            // Instantly reset dirty table to available status
                            onUpdateTables(tables.map(t => t.id === tbl.id ? { ...t, status: 'available' } : t));
                          } else {
                            setSelectedTable(tbl);
                          }
                        }}
                        className={`border-2 rounded-3xl p-5 text-left transition-all hover:scale-[1.02] flex flex-col justify-between min-h-[140px] shadow-lg cursor-pointer ${activeColorClass}`}
                      >
                        <div className="flex items-start justify-between w-full">
                          <span className="text-xl font-black text-slate-100">{tbl.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            tbl.status === 'available' ? 'bg-brand/10 text-brand' :
                            tbl.status === 'occupied' ? 'bg-amber-500/10 text-amber-400' :
                            tbl.status === 'billing' ? 'bg-purple-500/10 text-purple-400' :
                            'bg-slate-800 text-slate-500'
                          }`}>
                            {tbl.status}
                          </span>
                        </div>

                        {tbl.status === 'dirty' ? (
                          <div className="mt-4 text-xs font-medium text-slate-500 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 animate-spin" /> Clear & Set Ready
                          </div>
                        ) : tbl.currentOrder ? (
                          <div className="mt-4">
                            <p className="text-slate-300 text-xs font-bold leading-tight truncate">{tbl.waiterName || 'Ama'} &bull; {orderItemCount} Items</p>
                            <p className="text-sm font-black text-amber-400 font-mono mt-0.5">GHS {orderValueStr}</p>
                          </div>
                        ) : (
                          <div className="mt-4 text-slate-500 text-xs font-medium">
                            {tbl.capacity} Seats Available
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick instructions and tip footer widget */}
              <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-2xl flex items-start gap-3 mt-6">
                <AlertCircle className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                <div className="text-xs text-slate-400 leading-relaxed">
                  <span className="font-bold text-slate-200">Tip: </span> 
                  Waiters use this central floor status panel to coordinate assignments. Tab orders automatically update total drawer calculations, while checking out clears tables map instantly to <span className="text-slate-300 font-semibold">&ldquo;Dirty&rdquo; status</span> for sanitation queue logs.
                </div>
              </div>
            </div>
          ) : (
            // Retail Mode OR Hospitality view WITH a selected Active Table
            <>
              {/* Product catalog filter sub-header bar */}
              <div className="p-4 bg-slate-950 border-b border-slate-850 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  {/* Back button within Table selector if in Hospitality mode */}
                  {posMode === 'hospitality' && (
                    <button 
                      onClick={() => setSelectedTable(null)}
                      className="p-2 border border-slate-800 bg-slate-900 text-slate-300 hover:text-white rounded-lg flex items-center justify-center.5 gap-1.5 text-xs font-bold shrink-0 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Tables</span>
                    </button>
                  )}
                  
                  {/* Category Filter list */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-[320px] scrollbar-none">
                    {categories.map((cat, i) => (
                      <button
                        key={i}
                        onClick={() => setCategoryFilter(cat)}
                        className={`text-xs font-bold py-1.5 px-3 rounded-lg shrink-0 transition-colors cursor-pointer ${
                          categoryFilter === cat 
                          ? 'bg-slate-800 border-b-2 border-brand text-brand' 
                          : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* High precision alphanumeric search box */}
                <div className="relative w-full md:w-60 shrink-0">
                  <input
                    type="text"
                    placeholder="Search by SKU/Barcode..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-brand font-medium"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2 text-xs text-slate-500 hover:text-slate-300 py-0.5">×</button>
                  )}
                </div>
              </div>

              {/* Grid content of Products catalog cards */}
              <div className="flex-1 p-4 overflow-y-auto mt-2">
                
                {/* Active Header for selected table */}
                {posMode === 'hospitality' && selectedTable && (
                  <div className="mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-850 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold block">
                      Active billing: <span className="text-white text-base font-black ml-1 pr-2">{selectedTable.name}</span>
                      &bull; Waiter: <span className="text-slate-300 font-semibold">{selectedTable.waiterName || selectedWaiter}</span>
                    </span>
                    <button 
                      onClick={() => {
                        // Option to shift waiter staff
                        const nextW = selectedTable.waiterName === 'Kofi' ? 'Ama' : 'Kofi';
                        onUpdateTables(tables.map(t => t.id === selectedTable.id ? {...t, waiterName: nextW} : t));
                        setSelectedTable({...selectedTable, waiterName: nextW});
                      }}
                      className="text-[10px] font-mono bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-400 hover:text-brand cursor-pointer"
                    >
                      Re-allocate Staff
                    </button>
                  </div>
                )}

                {filteredProducts.length === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-slate-500 border border-dashed border-slate-800 rounded-3xl">
                    <AlertCircle className="w-8 h-8 text-slate-600 mb-2" />
                    <p className="text-sm font-semibold">No products matches found</p>
                    <p className="text-xs mt-1">Try changing category context or typing a different query</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 pb-8">
                    {filteredProducts.map(prod => {
                      // Work out quantity in cart
                      const cartMatch = currentCart.find(item => item.product.id === prod.id);
                      const currentCartQty = cartMatch ? cartMatch.quantity : 0;
                      const hasLowStock = prod.stock <= prod.minStock;

                      return (
                        <div 
                          key={prod.id}
                          className={`relative backdrop-blur-sm bg-slate-905 border rounded-2xl p-3 flex flex-col justify-between transition-all select-none hover:shadow-lg ${
                            currentCartQty > 0 
                            ? 'border-brand ring-2 ring-brand/10' 
                            : 'border-slate-850 hover:border-slate-750'
                          }`}
                        >
                          {/* Inner cart counter indicator bubble */}
                          {currentCartQty > 0 && (
                            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-brand text-slate-950 font-black text-xs rounded-full flex items-center justify-center shadow-md animate-pulse">
                              {currentCartQty}
                            </div>
                          )}

                          {/* Image box or high contrast fallback pattern */}
                          <div className="relative h-24 bg-slate-950 rounded-xl overflow-hidden mb-3 border border-slate-800.2 bg-gradient-to-tr from-slate-950 to-slate-900">
                            {prod.image ? (
                              <img 
                                src={prod.image} 
                                alt={prod.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover opacity-80"
                                onError={(e) => {
                                  // Fallback layout when image fails or loads on standard sandbox environment
                                  (e.target as any).style.display = 'none';
                                }}
                              />
                            ) : null}
                            <div className="absolute bottom-2 left-2 font-mono text-[9px] font-bold bg-slate-900/80 px-1.5 py-0.5 rounded text-slate-400 select-all">
                              {prod.code}
                            </div>
                            
                            {hasLowStock && (
                              <div className="absolute top-2 left-2 bg-red-500/20 text-red-400 border border-red-500/30 text-[8px] uppercase tracking-widest font-black px-1.5 py-0.5 rounded-full">
                                Low Stock: {prod.stock}
                              </div>
                            )}
                          </div>

                          <div>
                            <span className="text-[10px] text-brand font-mono tracking-wide uppercase font-bold">{prod.category}</span>
                            <h4 className="text-xs font-bold text-slate-200 mt-0.5 leading-snug line-clamp-2 min-h-[32px]">{prod.name}</h4>
                          </div>

                          <div className="flex items-center justify-between mt-4 border-t border-slate-850/60 pt-2.5">
                            <div>
                              <span className="text-[9px] text-slate-500 block">GH₵ Unit Price</span>
                              <span className="text-sm font-black text-slate-100 font-mono">GHS {prod.price.toFixed(2)}</span>
                            </div>

                            {/* Standard rapid adjustment control panel */}
                            <div className="flex items-center gap-1">
                              {currentCartQty > 0 ? (
                                <>
                                  <button
                                    onClick={() => updateCartQuantity(prod, -1)}
                                    className="w-7 h-7 bg-slate-800 hover:bg-slate-700/80 rounded-lg flex items-center justify-center text-slate-300 font-bold active:scale-90 transition-transform cursor-pointer"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => updateCartQuantity(prod, 1)}
                                    className="w-7 h-7 bg-brand hover:bg-brand text-slate-950 rounded-lg flex items-center justify-center font-bold active:scale-90 transition-transform cursor-pointer"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => updateCartQuantity(prod, 1)}
                                  disabled={prod.stock <= 0}
                                  className="py-1.5 px-3 bg-brand hover:bg-brand/90 text-slate-950 text-xs font-black rounded-lg shadow-sm active:scale-95 transition-all flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                                >
                                  Add
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* RIGHT ORDER SUMMARY DRAWERS PANEL (40%): Cart, taxes calculations, checkout buttons */}
        <div className="lg:col-span-5 flex flex-col bg-slate-950 overflow-hidden relative">
          
          <div className="p-4 border-b border-slate-850 bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-brand" />
              <h3 className="text-base font-black text-white">Active Order Invoice</h3>
            </div>
            
            {currentCart.length > 0 && (
              <button 
                onClick={clearCurrentCart}
                className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Cart
              </button>
            )}
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {currentCart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="bg-slate-900 p-4 rounded-3xl border border-slate-850 text-slate-700 animate-pulse mb-4">
                  <Calculator className="w-10 h-10" />
                </div>
                <p className="text-sm font-semibold text-slate-400">Cart Draft Is Empty</p>
                
                {posMode === 'hospitality' ? (
                  <p className="text-xs text-slate-500 mt-2 max-w-xs">Select any visual table on the floor plan of Hospitality mode first to draft items.</p>
                ) : (
                  <p className="text-xs text-slate-500 mt-2 max-w-xs">Select any retail products count from the grid directly to draft an invoice.</p>
                )}
              </div>
            ) : (
              currentCart.map(item => (
                <div 
                  key={item.product.id}
                  className="bg-slate-900/60 border border-slate-850 p-3 rounded-xl flex flex-col gap-2 relative hover:bg-slate-900 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-xs font-bold leading-snug text-slate-200 pr-6">{item.product.name}</h5>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                        {item.product.code} &bull; GHS {item.product.price.toFixed(2)} / {item.product.unit}
                      </span>
                    </div>

                    <p className="text-xs font-black text-slate-100 font-mono">
                      GHS {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Item note option and quantity controls inside cart card */}
                  <div className="flex items-center justify-between border-t border-slate-905 pt-2 mt-1">
                    <input 
                      type="text" 
                      placeholder="Add kitchen instructions note..." 
                      defaultValue={item.note || ''}
                      onBlur={(e) => updateCartQuantity(item.product, 0, e.target.value)}
                      className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-md max-w-[180px] focus:outline-none focus:border-slate-750 font-medium"
                    />

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateCartQuantity(item.product, -1)}
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-extrabold text-slate-200 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.product, 1)}
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => removeCartItem(item.product)}
                        className="text-red-400/60 hover:text-red-400 p-1 rounded hover:bg-red-500/10 ml-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout pricing sum totals drawers */}
          {currentCart.length > 0 && (
            <div className="bg-slate-900 border-t border-slate-850 p-4 space-y-3.5 z-10 shadow-inner">
              
              {/* Optional GHS Discout line selection */}
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-850/60">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-slate-500" /> Cart Discount:
                </span>
                <div className="flex gap-1.5">
                  {[0, 5, 10, 15].map(disc => (
                    <button
                      key={disc}
                      onClick={() => setCartDiscount(disc)}
                      className={`text-[9px] font-mono font-bold px-2 py-1 rounded-md transition-all cursor-pointer ${
                        cartDiscount === disc 
                        ? 'bg-brand text-slate-950' 
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                      }`}
                    >
                      {disc}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer tracking metadata options */}
              <div className="flex gap-2 text-xs">
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="Guest Name..."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 text-slate-200 px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-slate-800 text-[11px]"
                  />
                </div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="MoMo Phone..."
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 text-slate-200 px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-slate-800 text-[11px] font-mono"
                  />
                </div>
              </div>

              {/* Sequential item computations detailed display */}
              <div className="space-y-1.5 border-b border-slate-850/40 pb-3 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-300 font-medium">{businessSettings.currency} {totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-red-400">
                    <span>Discount Included ({cartDiscount}%)</span>
                    <span className="font-mono">-{businessSettings.currency} {totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
              </div>

              {/* Multi currency GHS & USD displaying main block */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-black tracking-wide">Grand Total ({businessSettings.currency})</span>
                  <span className="text-2xl font-black font-mono text-brand">{businessSettings.currencySymbol} {totals.totalGHS.toFixed(2)}</span>
                </div>
                {businessSettings.currency === 'GHS' ? (
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">US Dollar Offset</span>
                    <span className="text-base font-black font-mono text-slate-300">${totals.totalUSD.toFixed(2)}</span>
                    <span className="text-[8px] text-slate-600 block">Rate GHS {GHS_USD_RATE.toFixed(2)}</span>
                  </div>
                ) : (
                  <div className="text-right text-slate-500 text-[10px] font-mono font-semibold">
                    Synced online
                  </div>
                )}
              </div>

              {/* Complete drawer action button click triggers */}
              <button 
                onClick={handleOpenCheckout}
                className="w-full bg-brand hover:bg-brand/90 text-slate-950 font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-xl shadow-brand/15 active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>Proceed To Payment Billing</span>
                <ChevronRight className="w-4 h-4 text-slate-950 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: CHECKOUT INTERNET PROCESS SIMULATOR */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white">Consolidated Cashier Checkout Desk</h3>
                  <p className="text-xs text-slate-400">Configure client billing and finalize GHS transaction logs</p>
                </div>
                <button 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="text-slate-400 hover:text-slate-200 text-lg font-bold"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Bill Amount</span>
                    <span className="text-2xl font-black text-brand font-mono">GHS {totals.totalGHS.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">USD Balance Due</span>
                    <span className="text-lg font-black text-slate-300 font-mono">${totals.totalUSD.toFixed(2)}</span>
                  </div>
                </div>

                {/* Choose Payment system channel selector */}
                <div>
                  <span className="text-xs font-bold text-slate-300 block mb-3">Select Cash Checkout Mode</span>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { val: 'Cash', label: 'Cash Drawer', icon: Coins },
                      { val: 'Mobile Money', label: 'Mobile MoMo', icon: Smartphone },
                      { val: 'Card', label: 'Bank Card', icon: CreditCard },
                    ].map(pm => {
                      const Icon = pm.icon;
                      const isActive = paymentMethod === pm.val;
                      return (
                        <button
                          key={pm.val}
                          onClick={() => setPaymentMethod(pm.val as any)}
                          className={`p-4 border rounded-2xl text-center flex flex-col items-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                            isActive 
                            ? 'bg-brand/10 border-brand text-brand shadow-lg' 
                            : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 hover:bg-slate-950/60'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{pm.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Payment detail conditions panel render depending on selection */}
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl min-h-[140px] flex flex-col justify-center">
                  
                  {/* Option: Cashier change computer */}
                  {paymentMethod === 'Cash' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-slate-400 mb-1.5 block">Received Cash Amount (GHS):</label>
                        <input
                          type="number"
                          placeholder="e.g. 100, 200, 500 ghana cedis ..."
                          value={receivedCashAmount}
                          onChange={(e) => setReceivedCashAmount(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 p-3 rounded-xl focus:outline-none focus:border-brand text-sm font-semibold font-mono"
                        />
                      </div>
                      {receivedCashAmount && parseFloat(receivedCashAmount) >= totals.totalGHS ? (
                        <div className="flex justify-between text-xs text-slate-300 font-medium">
                          <span>Computed Change Drawer Due:</span>
                          <span className="text-brand font-extrabold font-mono text-sm block">
                            GHS {(parseFloat(receivedCashAmount) - totals.totalGHS).toFixed(2)}
                          </span>
                        </div>
                      ) : receivedCashAmount ? (
                        <div className="text-red-400 text-xs flex items-center gap-1.5 font-medium">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>Incomplete payment budget! Remaining Due: GHS {(totals.totalGHS - parseFloat(receivedCashAmount)).toFixed(2)}</span>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Option: Mobile Money processing simulation system */}
                  {paymentMethod === 'Mobile Money' && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        {[
                          { id: 'MTN', label: 'MTN MoMo', color: 'bg-yellow-400 text-slate-900' },
                          { id: 'Telecel', label: 'Telecel Cash', color: 'bg-red-650 text-white' },
                          { id: 'AirtelTigo', label: 'AirtelTigo', color: 'bg-blue-500 text-white' },
                        ].map(prov => (
                          <button
                            key={prov.id}
                            onClick={() => setMomoProvider(prov.id as any)}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold cursor-pointer ${
                              momoProvider === prov.id 
                              ? `${prov.color} ring-2 ring-brand/20 shadow-md` 
                              : 'bg-slate-900 text-slate-400 border border-slate-800'
                            }`}
                          >
                            {prov.label}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <label className="text-[10px] text-slate-500 block mb-1">Subscriber Sim Number:</label>
                          <input
                            type="text"
                            placeholder="+233 xx xxx xxxx"
                            value={momoPhoneNumber}
                            onChange={(e) => setMomoPhoneNumber(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-brand text-xs font-mono"
                          />
                        </div>
                        <button
                          onClick={handleTriggerMomoPush}
                          disabled={isMomoSimulating || !momoPhoneNumber}
                          className="px-4 py-2 bg-slate-900 border border-slate-805 hover:border-slate-700 font-bold text-xs text-brand hover:text-brand/80 rounded-xl flex items-center gap-2 shrink-0 transition-all disabled:opacity-40 cursor-pointer"
                        >
                          {isMomoSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                          Send USSD Push
                        </button>
                      </div>

                      {/* Interactive sandbox status logs simulating customer phone pop-ups */}
                      <div className="mt-4 border border-slate-800 bg-slate-900 p-3 rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-slate-950 rounded-lg text-slate-400">
                          <Smartphone className="w-4 h-4 animate-bounce" />
                        </div>
                        <div className="text-[11px] text-slate-400 flex-1 leading-normal pr-2">
                          <span className="font-bold text-slate-200">Terminal Push Simulation: </span>
                          {momoSimStatus === 'idle' && "Waiting for USSD phone push notification parameters..."}
                          {momoSimStatus === 'triggered' && `USSD PIN Request sent to ${momoPhoneNumber}. Simulating client entering secure Momo PIN on their cellular device...`}
                          {momoSimStatus === 'approved' && "Approved! Customer authorized 1-2 click transaction payment securely. Ready to print receipt!"}
                        </div>
                        {momoSimStatus === 'approved' && <CheckCircle2 className="w-5 h-5 text-brand shrink-0" />}
                      </div>
                    </div>
                  )}

                  {/* Option: Bank Card process simulations */}
                  {paymentMethod === 'Card' && (
                    <div className="text-center p-4">
                      <div className="w-10 h-10 bg-brand/15 text-brand rounded-full flex items-center justify-center mx-auto mb-3">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-200">Tap or Swipe Card Terminal Emulator</p>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-sm mx-auto">Requires hardware integration. Simulated visa/mastercard transactions proceed instantly when finalize is chosen.</p>
                    </div>
                  )}

                </div>
              </div>

              {/* Confirm submit row */}
              <div className="p-4 bg-slate-950 border-t border-slate-850 flex gap-3">
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Go Back
                </button>
                <button
                  onClick={handleFinalizeSale}
                  className="flex-1 py-3 bg-brand hover:bg-brand/90 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-brand/15 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Generate E-Invoice Receipt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: GORGEOUS SIMULATED THERMAL INVOICE PRINT OUT */}
      <AnimatePresence>
        {isReceiptModalOpen && createdReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-transparent w-full max-w-sm flex flex-col text-slate-900 border-0 shadow-none outline-none relative"
            >
              {/* Receipt Body with paper mockup look */}
              <div 
                id="printable-pos-bill"
                className="bg-neutral-50 p-6 rounded-t-3xl shadow-xl flex flex-col font-mono text-xs select-text border-x border-t border-slate-300"
              >
                {/* Simulated thermal bill paper serrated edge */}
                <div className="text-center pb-4 border-b border-dashed border-neutral-300">
                  <h3 className="text-sm font-black tracking-tight text-neutral-800 leading-tight uppercase">
                    {businessSettings.businessName}
                  </h3>
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 mt-1.5 block">Store Register Receipt</span>
                  <span className="text-[9px] text-neutral-400 block mt-0.5">Tel: {businessSettings.businessPhone}</span>
                </div>

                <div className="py-3 border-b border-dashed border-neutral-300 text-[10px] text-neutral-600 space-y-1">
                  <div>Invoice: <span className="font-bold text-neutral-800">{createdReceipt.invoiceNumber}</span></div>
                  <div>Date: {new Date(createdReceipt.timestamp).toLocaleString()}</div>
                  <div>Cashier: {createdReceipt.cashierName}</div>
                  <div>Customer: {createdReceipt.customerName}</div>
                  {createdReceipt.customerPhone && (
                    <div>MoMo Phone: {createdReceipt.customerPhone}</div>
                  )}
                </div>

                {/* Items grid loop */}
                <div className="py-4 border-b border-dashed border-neutral-350 space-y-2 text-[11px] text-neutral-700">
                  <div className="flex justify-between font-bold text-neutral-800 text-[10px] uppercase pb-1 border-b border-neutral-200">
                    <span>Item & Qty</span>
                    <span>Total ({businessSettings.currency})</span>
                  </div>
                  {createdReceipt.items.map((it, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="max-w-[180px] break-words">
                        {it.productName} (x{it.quantity})
                      </span>
                      <span className="font-bold">{(it.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Computational aggregates */}
                <div className="py-4 border-b border-dashed border-neutral-300 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Subtotal ({businessSettings.currency})</span>
                    <span>{createdReceipt.subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between font-black text-neutral-800 text-sm border-t border-neutral-200 pt-3 mt-1.5">
                    <span>TOTAL {businessSettings.currency}</span>
                    <span>{businessSettings.currencySymbol} {createdReceipt.total.toFixed(2)}</span>
                  </div>

                  {businessSettings.currency === 'GHS' && (
                    <div className="flex justify-between text-[11px] font-bold text-neutral-500">
                      <span>US DOLLAR EQUIV</span>
                      <span>${createdReceipt.totalUSD.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Receipt Notice Bar */}
                <div className="text-center pt-5 pb-1 text-[9px] text-neutral-400 uppercase leading-relaxed">
                  <div className="flex items-center justify-center gap-1.5 text-teal-850 font-bold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-800" />
                    <span>Transaction Verified & Secured</span>
                  </div>
                  
                  {businessSettings.isReceiptOptional && (
                    <div className="my-1.5 py-1 px-2 border border-slate-300 bg-slate-100 text-[8px] text-slate-500 rounded font-sans tracking-normal leading-normal">
                      * Printing is marked optional in ERP system settings.
                    </div>
                  )}

                  <p>Thank you for your business!</p>
                  <p>Powered by Clemtrix POS & ERP</p>
                  
                  {/* Decorative simulated receipt barcode */}
                  <div className="mt-4 h-6 bg-slate-900 rounded mx-auto overflow-hidden opacity-30 flex items-center justify-center font-serif text-[10px] tracking-[6px] text-neutral-200">
                    |||||||||||||||||||||||||||||
                  </div>
                </div>
              </div>

              {/* simulated receipt print drawer base */}
              <div className="bg-neutral-200 border-x border-b border-slate-350 p-4 rounded-b-3xl gap-2 flex flex-col">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      // Trigger native browser document printing
                      window.print();
                    }}
                    className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-50 text-neutral-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-neutral-350 active:scale-95 transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Bill Receipt</span>
                  </button>
                  <button
                    onClick={() => setIsReceiptModalOpen(false)}
                    className="flex-1 py-3 bg-slate-900 hover:bg-slate-850 text-white font-bold rounded-xl text-xs flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                  >
                    Close & Dismiss
                  </button>
                </div>
                {businessSettings.isReceiptOptional && (
                  <button
                    onClick={() => {
                      alert("Sale finalized! Physical paper print skipped as configured.");
                      setIsReceiptModalOpen(false);
                    }}
                    className="py-1.5 hover:underline text-[10px] text-slate-500 font-semibold cursor-pointer"
                  >
                    Skip & complete directly (receipt is optional)
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: CLOSE DRAWER SHIFT RECONCILIATION */}
      <AnimatePresence>
        {isCloseShiftModalOpen && activeShift && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 p-6 rounded-3xl w-full max-w-sm shadow-2xl space-y-4"
            >
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-400 animate-pulse" />
                  Close Shift Cash Drawer
                </h3>
                <p className="text-xs text-slate-400 mt-1">Audit ending registers and reconcile currency variances securely</p>
              </div>

              <div className="space-y-3.5 pt-2">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-xs space-y-1.5 font-sans">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cashier:</span>
                    <span className="font-semibold text-slate-200">{activeShift.cashierName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Shift Started At:</span>
                    <span className="font-mono text-slate-300">{new Date(activeShift.startTime).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-900 pt-1.5 mt-1">
                    <span className="text-slate-400">Starting Buffer balance:</span>
                    <span className="font-mono text-brand">GHS {activeShift.startingCash.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between opacity-80 font-medium">
                    <span className="text-slate-400">Completed Cash Sales:</span>
                    <span className="font-mono text-slate-300">
                      GHS {sales.filter(s => s.paymentMethod === 'Cash').reduce((sum, s) => sum + s.total, 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium block">De Facto Cash in Drawer (GHS):</label>
                  <input
                    type="number"
                    placeholder="Enter manual counter currency amount..."
                    value={actualDrawerCashInput}
                    onChange={(e) => setActualDrawerCashInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 p-3 text-slate-200 rounded-xl focus:outline-none focus:border-red-400 text-sm font-semibold font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 text-xs">
                <button
                  onClick={() => setIsCloseShiftModalOpen(false)}
                  className="flex-1 py-3 border border-slate-800 hover:border-slate-700 bg-slate-950 rounded-xl font-bold"
                >
                  Go Back
                </button>
                <button
                  onClick={handlePerformCloseShift}
                  disabled={!actualDrawerCashInput}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-40 font-bold rounded-xl text-slate-950 transition-colors"
                >
                  Lock Shift Logs
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
