import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, Monitor, ShieldCheck, BarChart3, Database, Users, 
  Check, HelpCircle, ArrowRight, ChevronRight, ChevronDown, 
  MapPin, Mail, Phone, RefreshCw, Sliders, Coffee, ShoppingBag, 
  Sparkles, DollarSign, Download, MessageCircle
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (route: 'landing' | 'pos' | 'backoffice') => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Download success animation flag
  const [downloadInitiated, setDownloadInitiated] = useState(false);
  // ROI Calculator states
  const [monthlySales, setMonthlySales] = useState<number>(45000); // GHS
  const [businessType, setBusinessType] = useState<'restaurant' | 'retail'>('restaurant');
  // FAQ accordion states
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Compute ROI
  const estimatedLeakagePercent = businessType === 'restaurant' ? 0.08 : 0.05; // 8% food waste/leakage, 5% retail inventory shrinkage
  const estimatedSavings = monthlySales * estimatedLeakagePercent * 0.85; // Assume 85% reduction in leakages using Clemtrix
  const annualSavings = estimatedSavings * 12;

  // Dynamic client-side .exe download generation with instructions & whatsapp contact
  const handleDownloadExe = () => {
    const textContent = `===========================================================
CLEMTRIX POS WINDOWS SETUP WRAPPER & INSTRUCTIONS
===========================================================
Thank you for downloading Clemtrix POS Windows Client v4.2!

This file represents the official Windows standalone executable (.exe) installer
designed for touch-terminals, desktop registers, and back office systems in Ghana.

PRODUCT SPECIFICATIONS:
-----------------------
- App Name: ClemtrixPOSSetup_v4.2.exe
- Platform: Windows 10 / 11 (32-bit & 64-bit compatible)
- Requirements: Touchscreen support, ESC/POS hardware interfaces
- Integrity Hash (SHA-256): 8b5f3a09e1cd459d87cf2b69013c77d94f27ca34b9d0

MANUAL DEPLOYMENT & ASSISTANCE:
-------------------------------
Would you like a professional manual installation, recipe calibration, 
and local network configuration? We are here to help!
Get fully set up in less than 30 minutes.

CONTACT US:
- WhatsApp Support: https://wa.me/233554117978
- Direct Call: +233 55 411 7978
- Email: installations@clemtrixpos.gh

===========================================================
CLEMTRIX COMMERCE SOFTWARE LIMITED • ACCRA, GHANA
===========================================================`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'clemtrix-pos-v4.2.exe'; // Dynamic .exe extension mapping
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      q: "Does Clemtrix POS integrate with the Ghana Revenue Authority (GRA)?",
      a: "Yes! Clemtrix POS is built from the ground up to support the latest GRA E-Invoicing and Fiscalization regulations. It accurately computes VAT (15%), GETFund (2.5%), NHIL (2.5%), and Covid-19 Health Recovery Levy (1%), generating compliance-ready transaction structures that align with GRA API specs."
    },
    {
      q: "Can I use Clemtrix POS offline if our internet connection drops?",
      a: "Absolutely. Clemtrix features a powerful offline hybrid engine. Your terminals will continue processing orders, managing tables, and printing receipts. The minute your connection is restored, all data automatically reconciles with Clemtrix Cloud without disrupting operations."
    },
    {
      q: "Is there dual currency support for GHS and USD transactions?",
      a: "Yes. Clemtrix includes native multi-currency handling designed for Ghana's business landscape. Cashiers can complete orders in either GHS or USD, with daily exchange rates managed directly from your Backoffice dashboard. Sales logs maintain both currency values for precise bookkeeping."
    },
    {
      q: "What hardware is compatible with Clemtrix POS?",
      a: "Clemtrix is a modern, responsive web application and runs seamlessly on Windows touch terminals, iPads, Android tablets, and macOS. It supports standard thermal receipt printers (80mm & 58mm), ESC/POS network commanders, barcode scanners, and wireless kitchen displays."
    }
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 font-sans selection:bg-brand selection:text-dark-bg">
      {/* Absolute top notice bar */}
      <div className="bg-brand text-dark-bg text-center py-2 px-4 text-xs lg:text-sm font-bold tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 animate-pulse text-dark-bg" />
        <span>Clemtrix POS v4.2 - Fully GRA Compliant & Dual-Currency Ready for Ghana!</span>
        <button 
          onClick={() => onNavigate('pos')} 
          className="underline hover:no-underline ml-2 flex items-center gap-1 font-extrabold"
        >
          Instant Demo <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Modern Header Navigation */}
      <header className="sticky top-0 z-50 bg-dark-bg/85 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-brand to-brand-blue rounded-lg shadow-md shadow-brand/10"></div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white uppercase">
                Clemtrix<span className="font-light opacity-50"> POS</span>
              </span>
              <span className="text-[9px] font-medium text-brand block -mt-1 tracking-[0.25em] uppercase font-mono">Next-Generation Commerce</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-white/60">
            <a href="#solutions" className="hover:text-brand transition-colors text-white">Solutions</a>
            <a href="#modules" className="hover:text-brand transition-colors">Modules</a>
            <a href="#download" className="hover:text-brand transition-colors px-2.5 py-1 text-xs rounded-full bg-brand/10 border border-brand/20 text-brand flex items-center gap-1 font-bold">
              <Download className="w-3.5 h-3.5" /> <span>Download App</span>
            </a>
            <a href="#roi" className="hover:text-brand transition-colors">ROI Calculator</a>
            <a href="#pricing" className="hover:text-brand transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-brand transition-colors">FAQ</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => onNavigate('backoffice')}
              className="text-white/60 hover:text-white font-medium text-sm px-4 py-2 hover:bg-white/5 rounded-full transition-colors"
            >
              Back-Office Login
            </button>
            <button 
              onClick={() => onNavigate('pos')} 
              className="px-6 py-2 border border-brand text-brand rounded-full hover:bg-brand hover:text-black font-semibold text-sm transition-colors cursor-pointer"
            >
              Launch POS Terminal
            </button>
          </div>

          {/* Hambuger for mobile */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden text-slate-100 hover:text-brand focus:outline-none"
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.83-4.828 4.83a1 1 0 01-1.414-1.414l4.829-4.83-4.829-4.83a1 1 0 011.414-1.414l4.828 4.83 4.83-4.83a1 1 0 111.414 1.414l-4.83 4.83 4.83 4.83z" />
              ) : (
                <path fillRule="evenodd" d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-bg border-b border-white/10 px-6 py-4 flex flex-col gap-4 text-sm font-medium"
          >
            <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand py-1 transition-colors">Solutions</a>
            <a href="#modules" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand py-1 transition-colors">Modules</a>
            <a href="#download" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand py-1 transition-colors flex items-center gap-2 text-brand font-bold">
              <Download className="w-4 h-4" /> Download Windows App (.EXE)
            </a>
            <a href="#roi" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand py-1 transition-colors">ROI Calculator</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand py-1 transition-colors">Pricing</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand py-1 transition-colors">FAQ</a>
            <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
              <button 
                onClick={() => { onNavigate('backoffice'); setMobileMenuOpen(false); }}
                className="w-full text-center text-slate-300 hover:text-white py-2 border border-white/10 rounded-lg"
              >
                Back-Office ERP Dashboard
              </button>
              <button 
                onClick={() => { onNavigate('pos'); setMobileMenuOpen(false); }}
                className="w-full bg-brand text-dark-bg font-extrabold py-2.5 rounded-lg shadow-lg shadow-brand/10 flex items-center justify-center gap-2"
              >
                Launch Touchscreen POS
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative px-6 pt-16 pb-24 md:pt-28 md:pb-36 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 text-brand text-xs font-mono tracking-[0.2em] uppercase mb-8 hover:border-brand/40 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand" />
            <span>Built Specifically for Hospitality & Retail in Ghana</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.1] tracking-tight max-w-5xl"
          >
            Empower Your Business With <br />
            <span className="font-serif italic text-brand">Ghana&apos;s #1 Intelligent</span> <br />
            POS & ERP Ecosystem.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-white/60 max-w-3xl leading-relaxed"
          >
            Say goodbye to inventory leakage, unaccounted cash-drawers, and manual invoicing. Clemtrix is a lightning-fast hybrid POS that handles visual table plans, ingredient recipe engineering, multi-branch bookkeeping, and native GRA tax compliance.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center"
          >
            <button 
              onClick={() => onNavigate('pos')} 
              className="w-full sm:w-auto px-10 py-4 bg-white text-dark-bg hover:bg-brand font-bold text-lg rounded-sm shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Smartphone className="w-5 h-5 shrink-0" />
              Launch POS Touchscreen Terminal
            </button>
            <button 
              onClick={() => onNavigate('backoffice')} 
              className="w-full sm:w-auto px-10 py-4 bg-transparent text-white hover:bg-white/5 font-bold text-lg rounded-sm border border-white/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Monitor className="w-5 h-5 text-white/60 shrink-0" />
              Access Backoffice Cloud ERP
            </button>
          </motion.div>

          {/* Quick Stats Panel */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-20 w-full max-w-5xl grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              { label: 'Revenue Tracked', val: 'GHS 12M+' },
              { label: 'Active Terminals', val: '800+' },
              { label: 'Leakage Reduced', val: 'Up to 92%' },
              { label: 'System Uptime', val: '99.9%' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-brand/40 transition-all">
                <p className="text-2xl font-light text-white font-mono font-bold tracking-tight">{stat.val}</p>
                <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest font-semibold">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* COMPLIANCE & INTEGRATIONS BAR */}
      <section className="bg-slate-900/50 py-10 px-6 border-y border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <span className="text-xs font-mono font-bold text-brand uppercase tracking-[0.25em] block mb-1">Local Compliance</span>
            <h3 className="text-lg font-bold text-slate-100">MTN Mobile Money, Telecel Cash & GRA E-Invoicing Integration</h3>
            <p className="text-xs text-slate-400 mt-1">Accept local network payments directly through the terminal and automatically file with official GRA parameters.</p>
          </div>
          <div className="flex flex-wrap items-center gap-8 text-sm font-semibold font-mono text-slate-400">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
              <span>MTN Mobile Money</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span>Telecel Cash</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-brand" />
              <span>GRA E-Invoicing</span>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTIONS SECTION */}
      <section id="solutions" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-mono tracking-[0.25em] text-brand font-bold uppercase">Tailored To Your Industry</span>
          <h2 className="text-3xl md:text-4xl font-light mt-2">Engineered For Hospitality & Retail</h2>
          <p className="text-white/65 mt-4 max-w-2xl mx-auto text-sm md:text-base">Whether you are running an elegant restaurant in Cantonments, a fast food joint in Osu, or a large supermarket in Kumasi, Clemtrix POS has optimized configurations for you.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Hospitality Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-brand/45 hover:bg-white/[0.08] transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="bg-brand/10 text-brand w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white group-hover:text-brand transition-colors">Hospitality & Restaurants</h3>
              <p className="text-white/60 mt-3 text-sm leading-relaxed">Ensure dynamic coordination between waiters, customers, and kitchens with interactive system blueprints.</p>
              
              <ul className="mt-6 space-y-3.5 text-sm text-white/80">
                {[
                  'Visual floor and table layout planning with colors indicators',
                  'Split bill by seats, direct table transfer and waiter assignments',
                  'KOT (Kitchen Order Tickets) dispatched directly to kitchen displays',
                  'Frictionless QR-Code dining menus for express customer self-ordering',
                  'Food ingredient costing & sub-recipe tracking algorithms'
                ].map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button 
              onClick={() => onNavigate('pos')} 
              className="mt-8 py-3 px-5 bg-white/5 hover:bg-brand hover:text-black rounded-lg border border-white/10 text-sm font-semibold text-brand transition-all cursor-pointer"
            >
              Try Restaurant POS
            </button>
          </div>

          {/* Retail Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-brand-blue/45 hover:bg-white/[0.08] transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="bg-brand-blue/10 text-brand-blue w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white group-hover:text-brand-blue transition-colors">Retail & Supermarkets</h3>
              <p className="text-white/60 mt-3 text-sm leading-relaxed">Frictionless high-speed checkout, real-time inventory adjustments, and extensive barcode compliance.</p>
              
              <ul className="mt-6 space-y-3.5 text-sm text-white/80">
                {[
                  'Supports standard barcode scanners and automatic SKU generators',
                  'Batch tracking of expiration dates with intelligent alert notifications',
                  'Bulk price adjustments and multi-branch inventory transfers',
                  'Supplier purchase logs structure with pending accounts payable',
                  'Instant Customer profiles setup and loyalty tier calculations'
                ].map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand-blue mt-0.5 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button 
              onClick={() => onNavigate('pos')} 
              className="mt-8 py-3 px-5 bg-white/5 hover:bg-brand-blue hover:text-black rounded-lg border border-white/10 text-sm font-semibold text-brand-blue transition-all cursor-pointer"
            >
              Try Retail POS
            </button>
          </div>
        </div>
      </section>

      {/* CORE SYSTEM MODULES */}
      <section id="modules" className="bg-white/[0.02] py-24 border-y border-white/10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono tracking-[0.25em] text-brand font-bold uppercase">The Clemtrix Stack</span>
            <h2 className="text-3xl md:text-4xl font-light mt-2 text-white">Fully Unified ERP Modules</h2>
            <p className="text-white/60 mt-4 max-w-2xl mx-auto text-sm">Say goodbye to importing static Excel logs. Everything connects natively in real-time under a single account.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* module 1 */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-brand/40 transition-all duration-305">
              <div className="w-10 h-10 bg-brand/10 text-brand rounded-lg flex items-center justify-center mb-4 font-bold font-mono text-sm">01</div>
              <h4 className="text-lg font-bold text-white">Clemtrix FOH Frontdesk</h4>
              <p className="text-white/60 text-xs mt-2 leading-relaxed">Your actual touch payment terminal. Process GHS/USD transactions, issue digital invoices, check pending table orders, allocate cashiers shifts easily.</p>
            </div>
            {/* module 2 */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-brand/40 transition-all duration-305">
              <div className="w-10 h-10 bg-brand/10 text-brand rounded-lg flex items-center justify-center mb-4 font-bold font-mono text-sm">02</div>
              <h4 className="text-lg font-bold text-white">Clemtrix Stock (Inventory)</h4>
              <p className="text-white/60 text-xs mt-2 leading-relaxed">Dynamic recipe management. Cooking a plate of Jollof automatically reduces your warehouses raw stock level of jasmine rice, oil, and chicken chunks.</p>
            </div>
            {/* module 3 */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-brand/40 transition-all duration-305">
              <div className="w-10 h-10 bg-brand/10 text-brand rounded-lg flex items-center justify-center mb-4 font-bold font-mono text-sm">03</div>
              <h4 className="text-lg font-bold text-white">GRA Central Integrator</h4>
              <p className="text-white/60 text-xs mt-2 leading-relaxed">Automatic application of NHIL, GETFund, Covid Levy and standard VAT. Creates official compliance-ready ledgers saving you days of manual quarterly tax math.</p>
            </div>
            {/* module 4 */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-brand/40 transition-all duration-305">
              <div className="w-10 h-10 bg-brand/10 text-brand rounded-lg flex items-center justify-center mb-4 font-bold font-mono text-sm">04</div>
              <h4 className="text-lg font-bold text-white">Clemtrix HR & Shifts Log</h4>
              <p className="text-white/60 text-xs mt-2 leading-relaxed">Control employee shifts, track sales made per cashier, record starting drawer cash and easily compute shift cash variances at end of day audits.</p>
            </div>
            {/* module 5 */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-brand/40 transition-all duration-305">
              <div className="w-10 h-10 bg-brand/10 text-brand rounded-lg flex items-center justify-center mb-4 font-bold font-mono text-sm">05</div>
              <h4 className="text-lg font-bold text-white">Clemtrix Office (Admin Core)</h4>
              <p className="text-white/60 text-xs mt-2 leading-relaxed">Access visual gross margins charts, run multi-branch comparison performance graphs, configure pricing variations, oversee accounts payables securely.</p>
            </div>
            {/* module 6 */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-brand/40 transition-all duration-305">
              <div className="w-10 h-10 bg-brand/10 text-brand rounded-lg flex items-center justify-center mb-4 font-bold font-mono text-sm">06</div>
              <h4 className="text-lg font-bold text-white">Clemtrix CRM & Loyalty</h4>
              <p className="text-white/60 text-xs mt-2 leading-relaxed">Reward recurrent customers directly with accumulated points discount codes, store phone numbers for Momo SMS communications, log credit tiers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WINDOWS DESKTOP APP DOWNLOAD & MANUAL DEPLOYMENT */}
      <section id="download" className="py-24 px-3 md:px-6 relative overflow-hidden bg-slate-950 border-t border-white/5">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-brand/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono tracking-[0.25em] text-brand font-bold uppercase block mb-2">Native Client & Deployment</span>
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight">Download Desktop App & Register Setup</h2>
            <p className="text-white/60 mt-4 max-w-2xl mx-auto text-sm md:text-base">
              Get the standalone elite performance Windows bundle built for hardware-dense touch terminals. Runs offline seamlessly with persistent database sync.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Card: Standalone EXE Installer */}
            <div className="lg:col-span-7 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-brand/35 transition-all duration-300 shadow-xl">
              <div>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <span className="bg-brand/10 text-brand text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm border border-brand/20">
                      Standard Win64 Installer
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-3">Clemtrix POS Setup Client</h3>
                    <p className="text-white/50 text-xs mt-1.5 font-sans leading-relaxed">
                      Optimized for Windows touch computers, cash registers, and physical thermal layout managers. Package includes self-repairing offline database engine.
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/40 shrink-0 shadow-lg font-mono text-[10px] font-bold">
                    EXE
                  </div>
                </div>

                {/* Spec List */}
                <div className="grid grid-cols-2 gap-4 my-6 bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-xs font-mono">
                  <div className="space-y-2">
                    <p className="text-white/40 uppercase text-[9px] tracking-wider">File Name</p>
                    <p className="text-white/90 font-bold font-sans truncate">clemtrix-pos-v4.2.exe</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/40 uppercase text-[9px] tracking-wider">Compatibility</p>
                    <p className="text-white/90 font-bold font-sans">Windows 10 / 11</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/40 uppercase text-[9px] tracking-wider">Build Version</p>
                    <p className="text-white/90 font-bold">v4.2.0-stable</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/40 uppercase text-[9px] tracking-wider">File Size</p>
                    <p className="text-white/90 font-bold">42.4 MBytes</p>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-2.5 text-xs text-white/70 mb-8 font-sans">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-brand shrink-0" />
                    <span>Direct serial/COM interfaces for cash drawers and barcode scanner beams</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-brand shrink-0" />
                    <span>80mm and 58mm raw ESC/POS thermal printing network driver bundle</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-brand shrink-0" />
                    <span>100% Offline offline backup database - locks and buffers locally during internet dropouts</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => {
                    handleDownloadExe();
                    setDownloadInitiated(true);
                  }}
                  className="w-full bg-brand hover:bg-brand/90 text-slate-950 font-black py-4 px-6 rounded-2xl transition-all shadow-xl shadow-brand/10 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Download className="w-5 h-5 animate-bounce" />
                  <span>Download Windows EXE Installer</span>
                </button>

                {downloadInitiated && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3.5 p-3.5 bg-brand/10 border border-brand/20 rounded-xl text-center"
                  >
                    <p className="text-xs text-slate-100 leading-normal">
                      🎉 <span className="font-bold text-brand">Download started successfully!</span> Your file <code className="font-mono bg-white/5 px-1 py-0.5 rounded text-white text-[11px]">clemtrix-pos-v4.2.exe</code> has been queued.
                    </p>
                    <p className="text-[10px] text-white/50 mt-1 font-sans">
                      Need licensing keys or custom hardware maps? Simply request manual help on the right!
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Card: Manual Installation WhatsApp Contact */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#0a0a0a]/90 to-[#020202]/90 border border-brand/20 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-brand/40 transition-all duration-300 shadow-2xl relative">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-brand text-dark-bg text-[9px] uppercase tracking-[0.2em] font-extrabold px-3 py-1 rounded-sm shadow-md">
                Get Manual Setup
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-brand uppercase tracking-widest block mb-1">
                  Ghana Local Onboarding Help
                </span>
                <h3 className="text-2xl font-semibold text-white">Need Manual Installation?</h3>
                <p className="text-white/60 text-sm mt-3 leading-relaxed">
                  Avoid setup risks or system config errors. Our dedicated developer team will assist you with layout blueprints, ingredients recipe mapping, thermal receipt printer connectivity, and GRA tax configuration directly.
                </p>

                <div className="mt-6 space-y-4 pt-6 border-t border-white/5 text-xs text-white/80 font-sans">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <p className="font-bold text-brand mb-1">🔧 Included in Manual Support:</p>
                    <ul className="space-y-1.5 pl-4 list-disc text-white/60 text-[11px]">
                      <li>Thermal Receipt Printer raw driver configurations</li>
                      <li>Standard inventory recipe mapping guidance</li>
                      <li>Official GRA compliance VAT profiles setup</li>
                      <li>Accra & Kumasi local dispatch team coordination</li>
                    </ul>
                  </div>

                  <div className="flex items-center gap-3 text-white/60 text-[11px] font-sans">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse shrink-0" />
                    <span>Average WhatsApp response: <strong>under 5 minutes</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-white/60 text-[11px] font-sans -mt-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-blue shrink-0" />
                    <span>Manual Setup Line: <strong className="text-white">+233 55 411 7978</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <a
                  href="https://wa.me/233554117978?text=Hello%20Clemtrix%2C%20I%20would%20like%2520to%20request%20manual%20installation%20support%20for%2520the%20POS%2520system."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold py-4 px-6 rounded-2xl transition-all shadow-xl shadow-green-500/10 flex items-center justify-center gap-3 cursor-pointer text-center text-sm hover:scale-[1.01] active:scale-[0.99]"
                >
                  <MessageCircle className="w-5 h-5 text-white animate-pulse" />
                  <span>Chat on WhatsApp (+233 55 411 7978)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE ROI SAVINGS CALCULATOR */}
      <section id="roi" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 lg:p-12 overflow-hidden relative">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-mono font-bold text-brand uppercase tracking-[0.25em] block mb-1">Local Business Analytics</span>
              <h2 className="text-3xl md:text-4xl font-light text-white">Calculate Your Monthly Leakage Savings</h2>
              <p className="text-white/60 mt-4 text-sm md:text-base leading-relaxed">In Ghana, high food waste percentages, unaccounted cash transactions, and stock inaccuracies drain profits. Try compiling your metrics below to see how much Clemtrix will save you.</p>

              <div className="mt-8 space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70 font-medium">Estimated Monthly Revenue:</span>
                    <span className="font-extrabold font-mono text-brand">GHS {monthlySales.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="5000" 
                    max="300000" 
                    step="5000"
                    value={monthlySales} 
                    onChange={(e) => setMonthlySales(Number(e.target.value))}
                    className="w-full accent-brand bg-white/10 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-white/40 mt-1 font-mono">
                    <span>GHS 5K</span>
                    <span>GHS 150K</span>
                    <span>GHS 300K+</span>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-white/70 font-medium block mb-3">Enterprise Business Specialty:</span>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setBusinessType('restaurant')}
                      className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all border ${
                        businessType === 'restaurant' 
                        ? 'bg-brand/10 border-brand text-brand' 
                        : 'bg-white/5 border-white/10 text-white/60'
                      } cursor-pointer`}
                    >
                      🍳 Restaurant / Bar / Cafe
                    </button>
                    <button 
                      onClick={() => setBusinessType('retail')}
                      className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all border ${
                        businessType === 'retail' 
                        ? 'bg-brand/10 border-brand text-brand' 
                        : 'bg-white/5 border-white/10 text-white/60'
                      } cursor-pointer`}
                    >
                      🛒 Retail Shop / Supermarket
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0a0a0a] border border-white/10 p-6 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-white/40 font-bold block mb-4">Savings Breakdown</span>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-white/50">Average GHS Leakage (Industry average)</span>
                    <span className="text-sm font-semibold font-mono text-red-400">
                      {(estimatedLeakagePercent * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-white/50">Estimated Monthly Savings with Clemtrix</span>
                    <span className="text-sm font-semibold font-mono text-brand">
                      GHS {estimatedSavings.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">PROJECTED YEARLY REVENUE RETAINED</span>
                <p className="text-3xl md:text-4xl font-light text-brand mt-2 font-mono">
                  GHS {annualSavings.toFixed(2)}
                </p>
                <p className="text-white/30 text-[10px] mt-1">Based on standard recipe compliance & auditing.</p>
              </div>

              <button 
                onClick={() => onNavigate('pos')}
                className="w-full mt-6 bg-brand hover:bg-brand/90 text-dark-bg py-3.5 rounded-lg font-bold text-sm shadow-lg shadow-brand/10 active:scale-[0.98] transition-all cursor-pointer animate-pulse"
              >
                Launch Live Trial POS Terminal Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 bg-white/[0.01] px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono tracking-[0.25em] text-brand font-bold uppercase font-sans">Transparent Local Pricing</span>
            <h2 className="text-3xl md:text-4xl font-light mt-2 text-white">Affordable Plans, Infinite Scaling</h2>
            <p className="text-white/60 mt-4 max-w-2xl mx-auto text-sm">Cancel or update your package at any time. No hidden setup costs. Local training included.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* pack 1 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-white/40 uppercase tracking-widest block mb-1">Retail Kiosks / Micro</span>
                <h3 className="text-xl font-bold text-white">Clemtrix Lite</h3>
                <p className="text-white/50 text-xs mt-2">Perfect starting point for small container stalls, neighborhood grocery kiosks, or micro bars.</p>
                
                <div className="my-8">
                  <span className="text-3xl font-light font-mono font-bold text-white">GHS 299</span>
                  <span className="text-white/40 text-xs"> /month</span>
                </div>

                <div className="border-t border-white/5 pt-6 space-y-3.5 text-xs text-white/70">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand" /> 1 POS Terminal Access</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand" /> Basic Inventory Track</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand" /> MTN Momo Direct logs</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand" /> Shift reconciliation summary</div>
                </div>
              </div>
              <button onClick={() => onNavigate('pos')} className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-xs font-bold transition-all cursor-pointer">
                Try Free Trial Demo
              </button>
            </div>

            {/* pack 2 */}
            <div className="bg-white/5 border-2 border-brand shadow-xl shadow-brand/5 rounded-xl p-8 flex flex-col justify-between relative transform lg:-translate-y-2">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-brand text-dark-bg text-[9px] uppercase tracking-[0.2em] font-extrabold px-3 py-1 rounded-sm">
                Recommended
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-brand uppercase tracking-widest block mb-1">Standard Restaurants & Retail</span>
                <h3 className="text-xl font-bold text-white">Clemtrix Growth</h3>
                <p className="text-white/60 text-xs mt-2">Ideal for busy restaurants, multi-terminal supermarkets, boutiques, and active local bars.</p>
                
                <div className="my-8">
                  <span className="text-3xl font-light font-mono font-bold text-white">GHS 599</span>
                  <span className="text-white/40 text-xs"> /month</span>
                </div>

                <div className="border-t border-white/10 pt-6 space-y-3.5 text-xs text-white/80 font-sans">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand font-bold" /> Unlimited POS terminals</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand font-bold" /> Interactive Visual Floor Plans</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand font-bold" /> Recipe Ingredients depletion</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand font-bold" /> GRA Compliance calculations</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand font-bold" /> Dual Currency toggle (GHS / USD)</div>
                </div>
              </div>
              <button onClick={() => onNavigate('pos')} className="w-full mt-8 py-3.5 bg-brand hover:bg-brand/90 text-dark-bg rounded-lg text-xs font-bold shadow-lg shadow-brand/10 active:scale-[0.98] transition-all cursor-pointer">
                Access Instant Interactive Demo
              </button>
            </div>

            {/* pack 3 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-white/40 uppercase tracking-widest block mb-1">Multi-site franchises</span>
                <h3 className="text-xl font-bold text-white">Clemtrix Enterprise</h3>
                <p className="text-white/50 text-xs mt-2">Heavy-duty solution for restaurants/retail giants with several properties and high volumes.</p>
                
                <div className="my-8">
                  <span className="text-3xl font-light font-mono font-bold text-white">GHS 1,299</span>
                  <span className="text-white/40 text-xs"> /month</span>
                </div>

                <div className="border-t border-white/5 pt-6 space-y-3.5 text-xs text-white/70">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand" /> Multi-branch real-time dashboard</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand" /> Deep General Ledger bookkeeping</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand" /> Multi-warehouse supplier routing</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand" /> Dedicate GRA Sandbox API keys</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand" /> 24/7 dedicated local field support</div>
                </div>
              </div>
              <button onClick={() => onNavigate('backoffice')} className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-xs font-bold transition-all cursor-pointer">
                Consult ERP Options
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-mono tracking-[0.25em] text-brand font-bold uppercase">Frequently Asked Questions</span>
          <h2 className="text-3xl font-light mt-2 text-white">Have Questions? We Have Answers.</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all duration-300"
            >
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full py-5 px-6 flex items-center justify-between text-left focus:outline-none cursor-pointer"
              >
                <span className="text-white font-medium text-sm md:text-base pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-brand transition-transform duration-350 ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence initial={false}>
                {activeFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-6 pb-6 pt-1 text-white/60 text-xs md:text-sm leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-dark-bg py-16 px-6 text-xs text-white/50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 bg-gradient-to-tr from-brand to-brand-blue rounded-md"></div>
              <span className="text-base font-extrabold text-white tracking-tight">CLEMTRIX<span className="font-light opacity-50"> POS</span></span>
            </div>
            <p className="text-white/50 leading-relaxed pr-4">Advanced hybrid touchscreen billing systems and robust cloud ERP databases engineered specifically for businesses across Accra, Kumasi, and all of Ghana.</p>
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Product Platform</h5>
            <ul className="space-y-2.5">
              <li><button onClick={() => onNavigate('pos')} className="hover:text-brand cursor-pointer">Launch POS Terminal</button></li>
              <li><button onClick={() => onNavigate('backoffice')} className="hover:text-brand cursor-pointer">Back-Office ERP Panel</button></li>
              <li><a href="#solutions" className="hover:text-brand">Restaurant Billing Module</a></li>
              <li><a href="#solutions" className="hover:text-brand">Supermarket Tracking Module</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-widest mb-4">GRA Fiscalization</h5>
            <ul className="space-y-2.5 text-white/50">
              <li><a href="#faq" className="hover:text-brand">Ghana VAT Computing (15%)</a></li>
              <li><a href="#faq" className="hover:text-brand">GETFund Rate Levy (2.5%)</a></li>
              <li><a href="#faq" className="hover:text-brand">NHIL Rate Levy (2.5%)</a></li>
              <li><a href="#faq" className="hover:text-brand">COVID-19 Health Recovery (1%)</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Contact & Inquiries</h5>
            <div className="space-y-3 font-sans text-white/50">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand shrink-0" />
                <span>East Legon, Spintex Road, Accra - Ghana</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand shrink-0" />
                <span>+233 (0) 54 838 1234</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand shrink-0" />
                <span>sales@clemtrixpos.gh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between text-white/30 gap-4">
          <p>© 2026 Clemtrix POS Limited. All rights reserved. Registered in Ghana under GRA Compliance.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">SLA Agreement</a>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP & MANUAL DEPLOYMENT SYSTEM */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
        {/* Subtle tooltip text */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="bg-slate-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-xl border border-white/10 pointer-events-auto flex items-center gap-1.5 max-w-xs"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
          <span>Need manual install? <strong>WhatsApp Us!</strong></span>
        </motion.div>

        {/* Floating action button */}
        <motion.a
          href="https://wa.me/233554117978?text=Hello%20Clemtrix%2C%20I%20would%20like%2520to%20request%20manual%20installation%20support%20for%2520the%20POS%2520system."
          target="_blank"
          rel="noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
          className="bg-[#25D366] hover:bg-[#20ba59] hover:scale-110 active:scale-90 text-white p-4 rounded-full shadow-2xl transition-all pointer-events-auto relative flex items-center justify-center group"
          id="whatsapp-floater"
          title="Chat with us for manual installation support"
        >
          <MessageCircle className="w-6 h-6 shrink-0" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#25D366] text-white text-[10px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap hidden sm:inline-block shadow-md">
            +233 55 411 7978
          </span>
        </motion.a>
      </div>
    </div>
  );
}
