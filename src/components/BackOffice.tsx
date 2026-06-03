import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Database, ShieldCheck, TrendingUp, Plus, RefreshCw, 
  AlertCircle, CheckCircle2, DollarSign, Sliders, Download, Search, 
  Building2, Users, Layers, Settings, LogOut, ArrowLeft, Trash2,
  Edit3, Filter, ShoppingCart, Percent, Phone
} from 'lucide-react';
import { Product, Sale, Shift, InventoryLog, BusinessSettings, StoreKeeper } from '../types';

interface BackOfficeProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onRestockProduct: (productId: string, quantity: number, note?: string) => void;
  sales: Sale[];
  shifts: Shift[];
  onNavigate: (route: 'landing' | 'pos' | 'backoffice') => void;
  businessSettings: BusinessSettings;
  onUpdateSettings: React.Dispatch<React.SetStateAction<BusinessSettings>>;
  storeKeepers: StoreKeeper[];
  onUpdateStoreKeepers: React.Dispatch<React.SetStateAction<StoreKeeper[]>>;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  offlineSyncQueue: Sale[];
  onClearOfflineQueue: () => void;
}

export default function BackOffice({
  products,
  onAddProduct,
  onRestockProduct,
  sales,
  shifts,
  onNavigate,
  businessSettings,
  onUpdateSettings,
  storeKeepers,
  onUpdateStoreKeepers,
  isOnline,
  setIsOnline,
  offlineSyncQueue,
  onClearOfflineQueue
}: BackOfficeProps) {
  // Navigation tabs in BackOffice: 'dashboard' | 'inventory' | 'sales' | 'shifts' | 'settings'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'sales' | 'shifts' | 'settings'>('dashboard');

  // Filter and search variables for inventories
  const [invSearchQuery, setInvSearchQuery] = useState('');
  const [invTypeFilter, setInvTypeFilter] = useState<'all' | 'hospitality' | 'retail'>('all');
  
  // Custom states for Add Product Form modal
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCode, setNewProductCode] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductCost, setNewProductCost] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductMinStock, setNewProductMinStock] = useState('');
  const [newProductUnit, setNewProductUnit] = useState('Serving');
  const [newProductType, setNewProductType] = useState<'hospitality' | 'retail'>('hospitality');

  // Custom states for Restock Form modal
  const [selectedRestockItem, setSelectedRestockItem] = useState<Product | null>(null);
  const [restockQtyInput, setRestockQtyInput] = useState('');
  const [restockNoteInput, setRestockNoteInput] = useState('');

  // Secure compliance connection state
  const [graSyncStatus, setGraSyncStatus] = useState<'unverified' | 'syncing' | 'verified'>('verified');

  // Multi branch context values for lookups
  const [branchFilter, setBranchFilter] = useState<'all' | 'accra' | 'kumasi'>('all');

  // Calculate ERP metrics
  const totals = useMemo(() => {
    let rawRevenue = 0;
    let rawCost = 0;
    let totalTaxAmount = 0;
    
    // Tax aggregations
    let getfundSum = 0;
    let nhilSum = 0;
    let covidSum = 0;
    let vatSum = 0;

    sales.forEach(sale => {
      rawRevenue += sale.total;
      
      // Calculate costs from nested item logs
      sale.items.forEach(it => {
        // Fallback cost calculation if missing
        const itemCost = it.cost || (it.price * 0.4);
        rawCost += (itemCost * it.quantity);
      });

      sale.taxes.forEach(t => {
        totalTaxAmount += t.amount;
        if (t.name.includes('GETFund')) getfundSum += t.amount;
        else if (t.name.includes('NHIL')) nhilSum += t.amount;
        else if (t.name.includes('Covid')) covidSum += t.amount;
        else if (t.name.includes('VAT')) vatSum += t.amount;
      });
    });

    const netProfit = rawRevenue - rawCost - totalTaxAmount;
    const grossMargin = rawRevenue > 0 ? ((rawRevenue - rawCost) / rawRevenue) * 100 : 0;

    return {
      revenue: rawRevenue,
      cost: rawCost,
      tax: totalTaxAmount,
      profit: netProfit,
      margin: grossMargin,
      getfund: getfundSum,
      nhil: nhilSum,
      covid: covidSum,
      vat: vatSum
    };
  }, [sales]);

  // Alert counters: Stock values below set limits
  const lowStockAlerts = useMemo(() => {
    return products.filter(p => p.stock <= p.minStock);
  }, [products]);

  // Custom Chart Coordinates calculation
  // Computes a path of points representing sale logs.
  const chartCoordinates = useMemo(() => {
    if (sales.length === 0) return '';
    const points: { x: number; y: number }[] = [];
    const width = 600;
    const height = 150;
    
    // Group sales into 6 sequential intervals
    const segmentsCount = 6;
    const intervals = Array(segmentsCount).fill(0);
    const stepSize = Math.ceil(sales.length / segmentsCount);

    for (let i = 0; i < segmentsCount; i++) {
      const chunk = sales.slice(i * stepSize, (i + 1) * stepSize);
      intervals[i] = chunk.reduce((sum, s) => sum + s.total, 0);
    }

    const maxVal = Math.max(...intervals, 500); // minimum scale limit
    const padding = 20;

    intervals.forEach((val, i) => {
      const x = padding + (i * ((width - (padding * 2)) / (segmentsCount - 1)));
      // SVG represents 0 as upper-left. Squeeze graph into viewBox
      const y = (height - padding) - ((val / maxVal) * (height - (padding * 2)));
      points.push({ x, y });
    });

    return points.map(p => `${p.x},${p.y}`).join(' ');
  }, [sales]);

  // Format currencies safely
  const formatGHS = (val: number) => `${businessSettings.currencySymbol} ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Submit Restock triggers
  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestockItem) return;
    const qty = parseInt(restockQtyInput);
    if (isNaN(qty) || qty <= 0) return;

    onRestockProduct(selectedRestockItem.id, qty, restockNoteInput || 'Restocked via BOH Manager');
    setSelectedRestockItem(null);
    setRestockQtyInput('');
    setRestockNoteInput('');
  };

  // Submit Add Product triggers
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newProductPrice);
    const costNum = parseFloat(newProductCost);
    const stockNum = parseInt(newProductStock);
    const minStockNum = parseInt(newProductMinStock);

    if (isNaN(priceNum) || isNaN(costNum) || isNaN(stockNum)) {
      alert("Please fill in valid pricing metrics");
      return;
    }

    const generatedCode = newProductCode.trim() || `RET-NEW-${Math.floor(100 + Math.random() * 900)}`;

    const freshProd: Product = {
      id: `p-gen-${Date.now()}`,
      name: newProductName,
      code: generatedCode,
      category: newProductCategory || 'General',
      price: priceNum,
      cost: costNum,
      stock: stockNum,
      minStock: isNaN(minStockNum) ? 5 : minStockNum,
      unit: newProductUnit,
      type: newProductType
    };

    onAddProduct(freshProd);
    setIsNewProductModalOpen(false);

    // Clear and reset forms
    setNewProductName('');
    setNewProductCode('');
    setNewProductCategory('');
    setNewProductPrice('');
    setNewProductCost('');
    setNewProductStock('');
    setNewProductMinStock('');
    setNewProductUnit('Serving');
  };

  const handleSimulateGraSync = () => {
    setGraSyncStatus('syncing');
    setTimeout(() => {
      setGraSyncStatus('verified');
    }, 2000);
  };

  // Filter inventory items dynamically
  const filteredInventory = useMemo(() => {
    return products.filter(p => {
      if (invTypeFilter !== 'all' && p.type !== invTypeFilter) return false;
      if (invSearchQuery) {
        return p.name.toLowerCase().includes(invSearchQuery.toLowerCase()) ||
               p.code.toLowerCase().includes(invSearchQuery.toLowerCase()) ||
               p.category.toLowerCase().includes(invSearchQuery.toLowerCase());
      }
      return true;
    });
  }, [products, invTypeFilter, invSearchQuery]);

  return (
    <div className="min-h-screen bg-dark-bg text-slate-200 flex flex-col font-sans">
      
      {/* ERP HEADER BAR CONTEXT */}
      <header className="bg-dark-card border-b border-slate-850 text-white px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('landing')}
            className="p-2 bg-slate-900 hover:bg-slate-800 transition-colors rounded-xl text-slate-400 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-slate-350" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="bg-brand/10 border border-brand/20 p-2 rounded-xl text-brand shadow-md">
              <BarChart3 className="w-5 h-5 text-brand" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-brand to-brand-blue bg-clip-text text-transparent">
                Clemtrix ERP
              </span>
              <span className="text-xs font-semibold text-slate-400 block -mt-1">Back-Office Central Administration</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="hidden lg:flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800 text-sm">
          {[
            { id: 'dashboard', label: 'KPI Summary', icon: Sliders },
            { id: 'inventory', label: 'Inventory & Recipe', icon: Database },
            { id: 'sales', label: 'Sales Receipts Ledger', icon: ShoppingCart },
            { id: 'shifts', label: 'Cashier Shifts', icon: Users },
            { id: 'settings', label: 'Settings & Cloud', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-4 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  isSel 
                  ? 'bg-brand text-slate-950 shadow-md shadow-brand/15' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* FOH launching back key */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('pos')}
            className="bg-brand hover:bg-brand/90 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-brand/15 active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" />
            Launch POS Checkout
          </button>
        </div>
      </header>

      {/* Mobile tabs row for smaller screens */}
      <div className="lg:hidden bg-slate-950 border-b border-slate-850 p-2 flex gap-1 overflow-x-auto scrollbar-none">
        {[
          { id: 'dashboard', label: 'KPIs', icon: Sliders },
          { id: 'inventory', label: 'Inventory', icon: Database },
          { id: 'sales', label: 'Sales', icon: ShoppingCart },
          { id: 'shifts', label: 'Shifts', icon: Users },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-1.5 px-3 rounded-lg font-bold text-[10px] shrink-0 cursor-pointer ${
              activeTab === tab.id 
              ? 'bg-brand text-slate-950' 
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-850'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN DATA RENDERS BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 overflow-y-auto space-y-6">

        {/* TAB 1: OVERVIEW METRIC KPI GRAPHS PANEL */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Quick alert bar for low materials */}
            {lowStockAlerts.length > 0 && (
              <div className="bg-amber-500/10 border-l-4 border-amber-500 border-y border-r border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-550 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-amber-400">Inventory Alarms: </span> 
                    {lowStockAlerts.length} ingredients and items are currently below reorder levels (e.g. {lowStockAlerts.slice(0, 2).map(x => x.name).join(', ')}). High risk of menu omission!
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('inventory')}
                  className="font-bold text-[10px] uppercase bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  Replenish Stock
                </button>
              </div>
            )}

            {/* Metrics cards grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { title: 'Gross POS Revenue', val: formatGHS(totals.revenue), desc: 'All local completed GHS receipts', icon: DollarsignIcon, color: 'text-brand bg-brand/10' },
                { title: 'Calculated Cost of Sales', val: formatGHS(totals.cost), desc: 'Recipe items & material costs', icon: Database, color: 'text-amber-450 bg-amber-500/10' },
                { title: 'Total Invoices Issued', val: `${sales.length} Bills`, desc: 'Consolidated sales ticket volume', icon: ShoppingCart, color: 'text-brand-blue bg-brand-blue/10' },
                { title: 'Gross Profit Margin', val: `${totals.margin.toFixed(1)}%`, desc: 'Average gross markup margin', icon: TrendingUp, color: 'text-purple-400 bg-purple-500/10' }
              ].map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                  <div key={idx} className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 flex items-start justify-between shadow-lg">
                    <div className="space-y-1">
                      <span className="text-slate-500 text-xs font-bold block">{kpi.title}</span>
                      <p className="text-lg md:text-2xl font-black text-slate-100 font-mono tracking-tight">{kpi.val}</p>
                      <span className="text-[10px] text-slate-400 block leading-tight">{kpi.desc}</span>
                    </div>
                    <div className={`p-2.5 rounded-xl ${kpi.color}`}>
                      <Icon className="w-5 h-5 shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom SVG Sales Area Chart with motion animation */}
            <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-black text-slate-100">Sales Area Performance Logs</h3>
                  <p className="text-[11px] text-slate-450">Past sequential intervals representing overall store transaction sums</p>
                </div>
                
                <div className="flex gap-2">
                  <div className="text-xs bg-slate-950 hover:bg-slate-900 border border-slate-850 p-2 rounded-xl text-slate-300 font-bold flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <select 
                      value={branchFilter} 
                      onChange={(e) => setBranchFilter(e.target.value as any)}
                      className="bg-transparent focus:outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-slate-950">All Branches (Accra, Kumasi)</option>
                      <option value="accra" className="bg-slate-950">Accra Mall HQ</option>
                      <option value="kumasi" className="bg-slate-950">Kumasi City Mall</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Graphic custom SVG container */}
              <div className="relative">
                {sales.length === 0 ? (
                  <div className="h-40 flex items-center justify-center text-slate-500 font-medium text-xs">No transaction records generated for charting yet. Run sales inside FOH.</div>
                ) : (
                  <svg viewBox="0 0 600 150" className="w-full h-40 overflow-visible text-brand">
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(0, 245, 212)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="rgb(0, 245, 212)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    {/* SVG Coordinates fill area */}
                    <path 
                      d={`M 20,130 L ${chartCoordinates} L 580,130 Z`} 
                      fill="url(#gradient)" 
                    />
 
                    {/* Glowing Stroke line */}
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      points={chartCoordinates}
                      className="stroke-brand"
                    />

                    {/* Nodes representing data markers */}
                    {chartCoordinates.split(' ').map((pt, i) => {
                      const [x, y] = pt.split(',');
                      return (
                        <g key={i}>
                          <circle 
                            cx={x} 
                            cy={y} 
                            r="5" 
                            className="fill-slate-950 stroke-brand stroke-2 cursor-pointer hover:r-6" 
                          />
                        </g>
                      );
                    })}
                  </svg>
                )}
                
                {/* Horizontal segment timeline nodes */}
                <div className="flex justify-between text-[9px] font-mono text-slate-450 mt-2 border-t border-slate-850 pt-2 px-4">
                  <span>SEG 1: 07:00 AM</span>
                  <span>SEG 2: 07:15 AM</span>
                  <span>SEG 3: 07:30 AM</span>
                  <span>SEG 4: 07:45 AM</span>
                  <span>SEG 5: 08:00 AM</span>
                  <span>SEG 6: LATEST TX</span>
                </div>
              </div>
            </div>

            {/* Bento bottom layout: Top Selling menu items and low margin warnings */}
            <div className="grid lg:grid-cols-12 gap-5">
              
              <div className="lg:col-span-8 bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-black text-slate-100 uppercase tracking-wider mb-4">Latest Store Receipts Ledger</h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-2.5">Invoice</th>
                        <th className="py-2.5">Customer / Time</th>
                        <th className="py-2.5 text-right">Subtotal</th>
                        <th className="py-2.5 text-right">Taxes Sum</th>
                        <th className="py-2.5 text-right text-brand">Total GHS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {sales.slice(-4).reverse().map((s, idx) => (
                        <tr key={idx} className="hover:bg-slate-950/40 transition-colors">
                          <td className="py-3 font-mono font-bold text-slate-300">{s.invoiceNumber}</td>
                          <td className="py-3">
                            <span className="font-semibold block text-slate-200">{s.customerName || 'Walk-In'}</span>
                            <span className="text-[10px] text-slate-500 block">{new Date(s.timestamp).toLocaleTimeString()} &bull; {s.paymentMethod}</span>
                          </td>
                          <td className="py-3 text-right font-mono font-medium text-slate-400">GHS {s.subtotal.toFixed(2)}</td>
                          <td className="py-3 text-right font-mono font-medium text-slate-405">GHS {s.taxes.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</td>
                          <td className="py-3 text-right font-mono font-extrabold text-brand">GHS {s.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CRM/Loyalty overview list widgets */}
              <div className="lg:col-span-4 bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-100 uppercase tracking-wider mb-4">Momo Payment Channels</h4>
                  
                  <div className="space-y-3">
                    {[
                      { provider: 'MTN Mobile Money', count: sales.filter(s => s.paymentMethod === 'Mobile Money' && s.momoProvider === 'MTN').length, bg: 'bg-yellow-400/10 border-yellow-450/20 text-yellow-300' },
                      { provider: 'Telecel Cash', count: sales.filter(s => s.paymentMethod === 'Mobile Money' && s.momoProvider === 'Telecel').length, bg: 'bg-red-500/10 border-red-500/20 text-red-400' },
                      { provider: 'Standard Cash Desk', count: sales.filter(s => s.paymentMethod === 'Cash').length, bg: 'bg-brand/10 border-brand/20 text-brand' },
                      { provider: 'Bank Cards (Visa)', count: sales.filter(s => s.paymentMethod === 'Card').length, bg: 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue' }
                    ].map((momo, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl border border-slate-850">
                        <span className="text-xs text-slate-300 font-bold">{momo.provider}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${momo.bg}`}>
                          {momo.count} sales
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-850 pt-4 mt-4 text-center">
                  <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">Consolidated Base Currency:</span>
                  <p className="text-xs font-mono font-bold text-slate-400 mt-1">Ghanaian Cedis (GHS GH₵)</p>
                </div>
              </div>

            </div>

          </div>
        )}


        {/* TAB 2: INVENTORY & RECIPES GRID LIST */}
        {activeTab === 'inventory' && (
          <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-100">Dynamic Warehouse Inventory Logs</h3>
                <p className="text-[11px] text-slate-450">Real-time stock ingredients depletion synchronized directly to frontdesk ticket prints</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by SKU code..."
                    value={invSearchQuery}
                    onChange={(e) => setInvSearchQuery(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-200 font-medium pl-8 pr-4 py-2 rounded-xl text-xs w-52 focus:outline-none focus:border-brand"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                {/* Type filters */}
                <div className="bg-slate-950 p-0.5 rounded-xl border border-slate-800 flex text-xs">
                  {[
                    { id: 'all', label: 'All Items' },
                    { id: 'hospitality', label: 'Hospitality' },
                    { id: 'retail', label: 'Retail' }
                  ].map(fl => (
                    <button
                      key={fl.id}
                      onClick={() => setInvTypeFilter(fl.id as any)}
                      className={`py-1.5 px-3 rounded-lg font-bold text-[10px] cursor-pointer ${
                        invTypeFilter === fl.id 
                        ? 'bg-slate-900 text-white' 
                        : 'text-slate-400 hover:text-slate-205'
                      }`}
                    >
                      {fl.label}
                    </button>
                  ))}
                </div>

                {/* Add new product modal triggers */}
                <button
                  onClick={() => setIsNewProductModalOpen(true)}
                  className="bg-brand hover:bg-brand/90 text-slate-950 font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>Add New Product SKU</span>
                </button>
              </div>
            </div>

            {/* Inventory table logs */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-400 font-black tracking-wider uppercase">
                    <th className="py-2.5">SKU Code</th>
                    <th className="py-2.5">Product Name</th>
                    <th className="py-2.5">Category context</th>
                    <th className="py-2.5 text-right font-medium">Cost Price</th>
                    <th className="py-2.5 text-right font-medium">Sale Price</th>
                    <th className="py-2.5 text-center font-bold">Standard Stock</th>
                    <th className="py-2.5 text-center">Alert levels</th>
                    <th className="py-2.5 text-center">Control Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredInventory.map(prod => {
                    const hasLow = prod.stock <= prod.minStock;
                    return (
                      <tr key={prod.id} className="hover:bg-slate-950/40 transition-all font-sans">
                        <td className="py-3 font-mono font-bold text-slate-300">{prod.code}</td>
                        <td className="py-3">
                          <span className="font-semibold text-slate-200 block">{prod.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono block">Unit Type: {prod.unit} &bull; Sector: {prod.type}</span>
                        </td>
                        <td className="py-3 text-slate-400 font-semibold">{prod.category}</td>
                        <td className="py-3 text-right font-mono text-slate-400">GHS {prod.cost.toFixed(2)}</td>
                        <td className="py-3 text-right font-mono font-bold text-slate-100">GHS {prod.price.toFixed(2)}</td>
                        <td className="py-3 text-center">
                          <span className={`font-mono text-sm font-bold ${hasLow ? 'text-red-400 font-extrabold text-base' : 'text-slate-205'}`}>
                            {prod.stock}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full ${
                            hasLow 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse' 
                            : 'bg-brand/10 text-brand border border-brand/20'
                          }`}>
                            {hasLow ? `Reorder (min: ${prod.minStock})` : 'Healthy count'}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => setSelectedRestockItem(prod)}
                            className="bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-300 hover:text-brand text-[10px] font-black px-3 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer"
                          >
                            Restock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {/* TAB 3: SALES RECEIPTS LEDGER GENERAL LIST */}
        {activeTab === 'sales' && (
          <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-6">
            
            <div>
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest mb-1">Fiscalized Sales Receipts Journal</h3>
              <p className="text-[11px] text-slate-450">Secure record of completed checkout tickets, dual currencies balances, and server timestamps</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-400 font-bold uppercase pb-3">
                    <th className="py-3">Invoice Code</th>
                    <th className="py-3">Timestamp</th>
                    <th className="py-3">Subscribers Detail</th>
                    <th className="py-3">Checkout items list</th>
                    <th className="py-3 text-right">Taxes split</th>
                    <th className="py-3 text-right">Subtotal</th>
                    <th className="py-3 text-right text-brand font-bold">Total GHS Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 font-sans">
                  {sales.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400 font-bold">No receipt logs reported. Fill a customer order inside POS first!</td>
                    </tr>
                  ) : (
                    sales.slice().reverse().map((s, i) => {
                      const taxSum = s.taxes.reduce((sum, item) => sum + item.amount, 0);
                      return (
                        <tr key={i} className="hover:bg-slate-950/40 transition-colors">
                          <td className="py-4 font-mono font-bold text-slate-300">{s.invoiceNumber}</td>
                          <td className="py-4 text-slate-500 text-[10px]">
                            {new Date(s.timestamp).toLocaleDateString()}<br />
                            {new Date(s.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="py-4">
                            <span className="font-semibold text-slate-200 block">{s.customerName || 'Walk-In Customer'}</span>
                            <span className="text-[10px] text-slate-500 font-mono block">Method: {s.paymentMethod} {s.momoProvider ? `(${s.momoProvider})` : ''}</span>
                          </td>
                          <td className="py-4 pr-4">
                            <div className="max-w-xs space-y-0.5">
                              {s.items.map((it, idx) => (
                                <span key={idx} className="inline-block bg-slate-950 border border-slate-850 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-md mr-1 mt-1 truncate">
                                  {it.productName} (x{it.quantity})
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 text-right font-mono text-slate-400">GHS {taxSum.toFixed(2)}</td>
                          <td className="py-4 text-right font-mono text-slate-400">GHS {s.subtotal.toFixed(2)}</td>
                          <td className="py-4 text-right font-mono font-extrabold text-brand">GHS {s.total.toFixed(2)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: ACTIVE CASHIER SHIFT AUDIT LIST */}
        {activeTab === 'shifts' && (
          <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-6">
            
            <div>
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest mb-1">Cashier Shift Auditing Logs</h3>
              <p className="text-[11px] text-slate-450">Review register starting cash parameters, submitted drawer amounts, and completed mathematical sales variances</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-400 font-bold uppercase pb-3">
                    <th className="py-2.5">Shift Session</th>
                    <th className="py-2.5">Cashier Personnel Name</th>
                    <th className="py-2.5">Start Time</th>
                    <th className="py-2.5 text-right">Starting Floating cash</th>
                    <th className="py-2.5 text-right">Computed Cash Sales</th>
                    <th className="py-2.5 text-right">Submitted Cash Drawer</th>
                    <th className="py-2.5 text-center">Auditing variance balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 font-sans">
                  {shifts.slice().reverse().map((sh, index) => {
                    // Compute expected mathematical sales cash made during the shift
                    const expectedTotalVal = sh.status === 'open' 
                      ? sh.startingCash + sales.filter(s => s.paymentMethod === 'Cash').reduce((sum, s) => sum + s.total, 0)
                      : (sh.expectedCash || sh.startingCash);

                    const finalVarianceVal = (sh.actualCash !== undefined) 
                      ? (sh.actualCash - expectedTotalVal) 
                      : 0;

                    return (
                      <tr key={index} className="hover:bg-slate-950/40 transition-colors">
                        <td className="py-4 font-mono font-bold text-slate-300">
                          SHFT-0{index + 1}<br />
                          <span className={`inline-block text-[9px] uppercase font-mono px-2 py-0.5 rounded-full mt-1.5 ${
                            sh.status === 'open' 
                            ? 'bg-brand/10 text-brand border border-brand/20 animate-pulse' 
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {sh.status}
                          </span>
                        </td>
                        <td className="py-4 font-semibold text-slate-200 font-mono">{sh.cashierName}</td>
                        <td className="py-4 text-slate-500 font-mono text-[10px]">
                          {new Date(sh.startTime).toLocaleDateString()} &bull; {new Date(sh.startTime).toLocaleTimeString()}
                        </td>
                        <td className="py-4 text-right font-mono font-medium text-slate-400">GHS {sh.startingCash.toFixed(2)}</td>
                        <td className="py-4 text-right font-mono font-semibold text-slate-205">
                          GHS {sales.filter(s => s.paymentMethod === 'Cash').reduce((su, s) => su + s.total, 0).toFixed(2)}
                        </td>
                        <td className="py-4 text-right font-mono font-semibold text-slate-205">
                          {sh.actualCash !== undefined ? `GHS ${sh.actualCash.toFixed(2)}` : '-- Pending count --'}
                        </td>
                        <td className="py-4 text-center">
                          {sh.actualCash !== undefined ? (
                            <span className={`inline-block font-mono text-xs font-extrabold px-3 py-1 rounded-lg ${
                              Math.abs(finalVarianceVal) < 0.1 
                              ? 'bg-brand/10 text-brand border border-brand/20' 
                              : finalVarianceVal > 0 
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' // overage
                                : 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse' // shortage
                            }`}>
                              {finalVarianceVal === 0 ? 'Match (GHS 0.00)' : `GHS ${finalVarianceVal.toFixed(2)}`}
                            </span>
                          ) : (
                            <span className="text-slate-500 text-xs italic font-semibold">Active active drawer session</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: GLOBAL SETTINGS & CHANNELS */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
                <div>
                  <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Settings className="w-5 h-5 text-brand" />
                    Global System Configuration
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Configure company credentials, select active currencies, manage store keepers, and monitor local database synchronization.</p>
                </div>
                {/* 15-day Trial Indicator Banner */}
                <div className="bg-brand/10 border border-brand/20 py-2 px-3.5 rounded-xl text-right">
                  <span className="text-[10px] uppercase font-black tracking-widest text-brand block">15-Day Free Trial Account</span>
                  <span className="text-xs text-slate-200 block font-bold font-mono">Day 8 of 15 Active (7 Days Remaining)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Form column 1: Base settings */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    Business details on printed receipt
                  </h3>
                  
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Business Name (shown on receipt):</label>
                      <input
                        type="text"
                        value={businessSettings.businessName}
                        onChange={(e) => onUpdateSettings(prev => ({ ...prev, businessName: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-850 p-2.5 text-xs font-semibold rounded-lg focus:outline-none focus:border-brand text-slate-205"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Support Phone number / WhatsApp (shown on receipt):</label>
                      <input
                        type="text"
                        value={businessSettings.businessPhone}
                        onChange={(e) => onUpdateSettings(prev => ({ ...prev, businessPhone: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-850 p-2.5 text-xs font-semibold rounded-lg focus:outline-none focus:border-brand text-slate-205"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Select Home Currency:</label>
                        <select
                          value={businessSettings.currency}
                          onChange={(e) => {
                            const val = e.target.value;
                            let sym = 'GH₵';
                            if (val === 'USD') sym = '$';
                            else if (val === 'EUR') sym = '€';
                            else if (val === 'GBP') sym = '£';
                            else if (val === 'NGN') sym = '₦';
                            onUpdateSettings(prev => ({ ...prev, currency: val, currencySymbol: sym }));
                          }}
                          className="w-full bg-slate-950 border border-slate-850 p-2.5 text-xs font-semibold rounded-lg focus:outline-none focus:border-brand text-slate-205"
                        >
                          <option value="GHS">GHS (Ghana Cedi)</option>
                          <option value="USD">USD (US Dollar)</option>
                          <option value="EUR">EUR (Euro)</option>
                          <option value="GBP">GBP (British Pound)</option>
                          <option value="NGN">NGN (Nigerian Naira)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Currency Symbol:</label>
                        <input
                          type="text"
                          disabled
                          value={businessSettings.currencySymbol}
                          className="w-full bg-slate-950/40 border border-slate-850 p-2.5 text-xs font-bold font-mono rounded-lg text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300 font-bold">Optional Receipt Printing:</span>
                        <button
                          type="button"
                          onClick={() => onUpdateSettings(prev => ({ ...prev, isReceiptOptional: !prev.isReceiptOptional }))}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${businessSettings.isReceiptOptional ? 'bg-brand' : 'bg-slate-800'}`}
                        >
                          <span className={`absolute top-1 w-4 h-4 rounded-full bg-slate-950 transition-all ${businessSettings.isReceiptOptional ? 'left-6' : 'left-1'}`} />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        When enabled, printing thermal bills will become optional. Cashiers can close and checkout new orders instantly, or select skip print to conserve paper in hot environments.
                      </p>
                    </div>

                  </div>
                </div>

                {/* Form column 2: Store keepers management */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5 flex items-center justify-between gap-1.5">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        Manage registered Store Keepers
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const name = prompt("Enter new storekeeper name:");
                          if (!name) return;
                          const phone = prompt("Enter phone number:", "+233 ");
                          if (!phone) return;
                          const role = prompt("Enter role (e.g. Cashier, Store Keeper, Supervisor):", "Cashier");
                          if (!role) return;

                          const newKeeper: StoreKeeper = {
                            id: `sk-${Date.now()}`,
                            name,
                            role,
                            phone,
                            status: 'active'
                          };
                          onUpdateStoreKeepers(prev => [...prev, newKeeper]);
                          alert(`Successfully registered storekeeper ${name}!`);
                        }}
                        className="text-[10px] bg-brand text-slate-950 hover:bg-brand/90 font-bold px-2.5 py-1 rounded cursor-pointer uppercase flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Keeper
                      </button>
                    </h3>

                    <div className="space-y-2.5 mt-3 max-h-[170px] overflow-y-auto pr-1">
                      {storeKeepers.map(keeper => (
                        <div key={keeper.id} className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-200 block">{keeper.name}</span>
                            <span className="text-[10px] text-blue-400 font-medium">{keeper.role} • {keeper.phone}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold tracking-wide ${
                              keeper.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {keeper.status.toUpperCase()}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateStoreKeepers(prev => prev.map(k => {
                                  if (k.id === keeper.id) {
                                    return { ...k, status: k.status === 'active' ? 'suspended' : 'active' };
                                  }
                                  return k;
                                }));
                              }}
                              className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                              title="Toggle status"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${keeper.name} from the database roster?`)) {
                                  onUpdateStoreKeepers(prev => prev.filter(k => k.id !== keeper.id));
                                }
                              }}
                              className="text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Real-time sync dashboard queue logs */}
                  <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-200 font-bold flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
                        Internet connection sync queue
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (!isOnline) {
                            const count = offlineSyncQueue.length;
                            if (count > 0) {
                              alert(`⚡ Live Signal Recovered! Synchronizing offline ledger bundles: automatically uploaded ${count} invoices.`);
                              onClearOfflineQueue();
                            }
                          }
                          setIsOnline(!isOnline);
                        }}
                        className={`text-[9px] font-mono font-bold py-1 px-2.5 rounded border cursor-pointer ${
                          isOnline 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {isOnline ? 'CLOUD SYNC ONLINE' : 'WORKING OFFLINE READY'}
                      </button>
                    </div>
                    
                    <div className="text-[11px] text-slate-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Local Offline Queue Buffer:</span>
                        <span className="font-mono font-bold text-slate-300">{offlineSyncQueue.length} records</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Database Sync Protocol:</span>
                        <span className="text-blue-400 font-semibold">Offline client-side local first, auto Broadcaster on reconnect</span>
                      </div>
                    </div>

                    {offlineSyncQueue.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          alert(`Successfully broadcasted ${offlineSyncQueue.length} buffered sales receipts offline cache bundles securely to ERP backend servers!`);
                          onClearOfflineQueue();
                        }}
                        className="w-full py-1.5 mt-1 bg-brand text-slate-950 font-black rounded-lg text-[10px] uppercase cursor-pointer"
                      >
                        ⚡ Re-Sync pending Sales records immediately ({offlineSyncQueue.length} tickets)
                      </button>
                    )}
                  </div>

                </div>

              </div>
            </div>

            {/* Visual breakdown of pricing and product subscriptions */}
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                Merchant Application Subscription Model
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-slate-400">
                
                {/* Ghanaian clients pricing box */}
                <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-amber-400 font-black tracking-wider uppercase text-[10px] block mb-1">Local manual installations (Ghana users only)</span>
                    <h4 className="text-lg font-black text-slate-100 mb-2">GHS 1,500 <span className="text-xs font-medium text-slate-400">One-time installation setup</span></h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                      Comes with a manual layout technician visit to set up thermal drawers, printers, local servers, and 1-on-1 staff training.
                    </p>
                  </div>
                  <div className="border-t border-slate-900 pt-3 space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span>Professional training fee:</span>
                      <span className="font-bold text-slate-200">GHS 300</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual contract renewal fee:</span>
                      <span className="font-bold text-slate-200">GHS 800 / Year</span>
                    </div>
                  </div>
                </div>

                {/* International clients pricing box */}
                <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-blue-400 font-black tracking-wider uppercase text-[10px] block mb-1">Online download installation (Rest of world)</span>
                    <h4 className="text-lg font-black text-slate-100 mb-2">$200 <span className="text-xs font-medium text-slate-400">One-time digital download license</span></h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                      Self-installing executable installation bundle for Windows and Linux. Installs in 3 minutes with native offline buffers and local database.
                    </p>
                  </div>
                  <div className="border-t border-slate-900 pt-3 space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span>15-Day trial status:</span>
                      <span className="font-bold text-emerald-400">Free Trial pre-approved</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual contract renewal fee:</span>
                      <span className="font-bold text-slate-200">$100 / Year</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Developer contact triggers */}
              <div className="p-4 bg-brand/5 border border-brand/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs mt-3">
                <div className="space-y-1">
                  <span className="font-bold text-slate-100 block">Need custom modules or manual deployment help?</span>
                  <p className="text-[11px] text-slate-400">Contact the Clemtrix core system engineers directly via WhatsApp for swift assistance.</p>
                </div>
                <a
                  href="https://wa.me/233554117978"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba56] text-white font-black py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Phone className="w-4 h-4 stroke-[2.5]" />
                  <span>WhatsApp manual installer developers (+233554117978)</span>
                </a>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* MODAL I: WAREHOUSE STOCK ADJUSTMENTS / REPLENISHMENTS */}
      <AnimatePresence>
        {selectedRestockItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 text-slate-100 rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl border border-slate-800"
            >
              <div>
                <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
                  <Database className="w-5 h-5 text-brand animate-bounce" />
                  Adjust Stock parameters
                </h3>
                <p className="text-[11px] text-slate-450 font-medium">Replenish raw food ingredients or general retail unit volumes instantly</p>
              </div>

              <form onSubmit={handleRestockSubmit} className="space-y-4">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-xs space-y-1">
                  <div>Product: <span className="font-bold text-slate-200">{selectedRestockItem.name}</span></div>
                  <div>SKU: <span className="font-mono text-slate-400 font-bold">{selectedRestockItem.code}</span></div>
                  <div>Warehouse Count: <span className="font-mono text-brand font-extrabold text-[13px]">{selectedRestockItem.stock}</span> units</div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold">Additional units to add:</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 10, 50, 100 units..."
                    value={restockQtyInput}
                    onChange={(e) => setInvSearchQuery('') || setRestockQtyInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 p-3 text-sm font-semibold font-mono rounded-xl focus:outline-none focus:border-brand text-slate-205"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold">Restocking audit note:</label>
                  <input
                    type="text"
                    placeholder="e.g. Received shipment from supplier"
                    value={restockNoteInput}
                    onChange={(e) => setRestockNoteInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 p-3 text-xs font-semibold rounded-xl focus:outline-none focus:border-brand text-slate-205"
                  />
                </div>

                <div className="flex gap-2 pt-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedRestockItem(null)}
                    className="flex-1 py-3 border border-slate-850 bg-slate-950 hover:bg-slate-900 rounded-xl font-bold font-sans text-slate-355 cursor-pointer animate-none"
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-brand hover:bg-brand/90 text-slate-950 font-black rounded-xl cursor-pointer"
                  >
                    Replenish Count
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL II: REGISTER FRESH SKU CATALOG ID */}
      <AnimatePresence>
        {isNewProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 text-slate-100 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl border border-slate-800 flex flex-col"
            >
              <div className="border-b border-slate-850 pb-3">
                <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
                  <Plus className="w-5 h-5 text-brand animate-spin-slow" />
                  Add Custom Product / SKU
                </h3>
                <p className="text-[11px] text-slate-450 mt-1">Directly inject novel ingredients or commodities maps to POS and Backoffice tables</p>
              </div>

              <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs font-medium">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">Sector Segment Type:</label>
                    <div className="flex gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-850 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setNewProductType('hospitality')}
                        className={`flex-1 py-1 px-2.5 rounded-lg font-bold cursor-pointer ${newProductType === 'hospitality' ? 'bg-brand text-slate-955' : 'text-slate-450 hover:text-slate-200'}`}
                      >
                        Hospitality food
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewProductType('retail')}
                        className={`flex-1 py-1 px-2.5 rounded-lg font-bold cursor-pointer ${newProductType === 'retail' ? 'bg-brand text-slate-955' : 'text-slate-450 hover:text-slate-200'}`}
                      >
                        Retail item
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Catalog Category Name:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Desserts, Baking supplies"
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-2 text-xs font-semibold rounded-lg focus:outline-none focus:border-brand text-slate-205"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">System SKU Barcode Code:</label>
                    <input
                      type="text"
                      placeholder="e.g. RET-FLR-109, HOSP-DES-08"
                      value={newProductCode}
                      onChange={(e) => setNewProductCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-2 text-xs font-mono font-bold rounded-lg focus:outline-none focus:border-brand text-slate-205"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Measurement Unit Label:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Serving, Wrap, Bottle, Piece"
                      value={newProductUnit}
                      onChange={(e) => setNewProductUnit(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-2 text-xs font-semibold rounded-lg focus:outline-none focus:border-brand text-slate-205"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Human Readable Item Title:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kelewele Spicy Platter (Gong)"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 p-2.5 text-xs font-semibold rounded-lg focus:outline-none focus:border-brand text-slate-205"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-850 pt-3.5 mt-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Base cost of goods (GHS):</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g. 15.00"
                      value={newProductCost}
                      onChange={(e) => setNewProductCost(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-2 text-xs font-mono font-semibold rounded-lg focus:outline-none focus:border-brand text-slate-205"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Billing sales price (GHS):</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g. 35.00"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-2 text-xs font-mono font-semibold rounded-lg focus:outline-none focus:border-brand text-slate-205"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">Immediate Initial stock count:</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 20"
                      value={newProductStock}
                      onChange={(e) => setNewProductStock(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-2 text-xs font-mono font-semibold rounded-lg focus:outline-none focus:border-brand text-slate-205"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Minimum safety threshold filter:</label>
                    <input
                      type="number"
                      placeholder="e.g. 5"
                      value={newProductMinStock}
                      onChange={(e) => setNewProductMinStock(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-2 text-xs font-mono font-semibold rounded-lg focus:outline-none focus:border-brand text-slate-205"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-850 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsNewProductModalOpen(false)}
                    className="flex-1 py-3 border border-slate-850 bg-slate-955 text-slate-355 hover:bg-slate-900 rounded-xl font-bold cursor-pointer"
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-brand text-slate-955 hover:bg-brand/90 font-black rounded-xl cursor-pointer"
                  >
                    Register SKU ID
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Compact helper components to avoid typescript standard class discrepancies
function DollarsignIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
