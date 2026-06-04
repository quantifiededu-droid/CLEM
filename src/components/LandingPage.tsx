import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, Monitor, ShieldCheck, BarChart3, Database, Users, 
  Check, HelpCircle, ArrowRight, ChevronRight, ChevronDown, 
  MapPin, Mail, Phone, RefreshCw, Sliders, Coffee, ShoppingBag, 
  Sparkles, DollarSign, Download, MessageCircle, Building2,
  Pill, Store
} from 'lucide-react';
import { ClemLogoIcon, ClemLogoFull } from './ClemLogo';

// Import high-fidelity terminal screenshot assets
import posRetailImg from '../assets/images/pos_retail_1780476724543.png';
import posRestaurantImg from '../assets/images/pos_restaurant_1780476705295.png';
import posDashboardImg from '../assets/images/pos_dashboard_1780476740840.png';

interface LandingPageProps {
  onNavigate: (route: 'landing' | 'pos' | 'backoffice') => void;
}

const SHOP_SLIDES = [
  {
    type: 'Pharmacies & Chemists',
    tagline: 'Track medicinal stock expiration dates, batch numbers, dosage units, and process lightning-fast customer prescriptions.',
    image: posRetailImg,
    icon: Pill,
    badge: '100% Expiry Assurance',
    colorClass: 'from-blue-600/20 to-blue-900/30 border-blue-500/20 text-blue-400'
  },
  {
    type: 'Grocery Stores & Local Shops',
    tagline: 'Instant item lookup lanes, customized shelf barcode scans, cash counter tracking, and persistent offline database logs.',
    image: posDashboardImg,
    icon: Store,
    badge: 'Zero Register Variance',
    colorClass: 'from-purple-600/20 to-purple-900/30 border-purple-500/20 text-purple-400'
  },
  {
    type: 'Supermarkets & Wholesales',
    tagline: 'Dual-currency tax invoicing, multi-lane checkout buffers, robust warehouse restock logs, and supplier ledger systems.',
    image: posRetailImg,
    icon: ShoppingBag,
    badge: 'Dual-Currency Secure GHS / USD',
    colorClass: 'from-emerald-600/20 to-emerald-950/30 border-emerald-500/20 text-emerald-400'
  },
  {
    type: 'Drinks & Liquor Shops',
    tagline: 'Crate stock counts, empty bottle returns tracker, cold-room temperature sales modifiers, and wholesale price catalogs.',
    image: posRestaurantImg,
    icon: Database,
    badge: 'Crate & Empty Bottle Ledger',
    colorClass: 'from-amber-600/20 to-amber-900/30 border-amber-500/20 text-amber-400'
  }
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  // Slideshow active index
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto cycling timer
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SHOP_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

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

  // Downloads the actual Windows standalone executable (Clemtrix.exe) served from public/Clemtrix.exe
  const handleDownloadExe = () => {
    const link = document.createElement('a');
    link.href = '/Clemtrix.exe';
    link.download = 'Clemtrix.exe';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const faqs = [
    {
      q: "How does the recipe and ingredients tracking system benefit my kitchen?",
      a: "Clemtrix matches real-time inventory levels to every menu item bought. When a guest orders a cocktail or burger, the system automatically subtracts precise quantities of raw ingredients, helping you control cost-of-goods-sold and spot kitchen leaks instantly."
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
      {/* Absolute top notice bar - ultra premium styling */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-slate-950 text-white text-center py-2 px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 border-b border-brand/20 relative overflow-hidden">
        <div className="absolute inset-x-0 h-px bg-white/10 top-0" />
        <Sparkles className="w-4 h-4 animate-bounce text-brand" />
        <span>Clemtrix POS v4.2 &mdash; <strong className="text-brand font-black">Offline Hybrid Engine</strong> & Dual-Currency Optimized for Ghana!</span>
        <button 
          onClick={() => onNavigate('pos')} 
          className="ml-3 px-3 py-1 bg-brand text-slate-950 rounded-full text-[10px] font-black uppercase hover:bg-white hover:text-blue-950 transition-all shadow-md flex items-center gap-1 active:scale-95"
        >
          Instant Demo <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Floating Glass Capsule Navigation bar */}
      <div className="sticky top-4 z-50 px-4 md:px-6 w-full max-w-7xl mx-auto">
        <header className="rounded-full bg-slate-950/80 backdrop-blur-xl border border-white/10 px-6 py-3 shadow-2xl shadow-blue-950/30">
          <div className="flex items-center justify-between">
            {/* Logo area */}
            <div className="flex items-center gap-3">
              <ClemLogoIcon size={38} className="drop-shadow-lg" />
              <div>
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  CLEMTRIX <span className="text-[10px] bg-brand/10 border border-brand/40 text-brand px-2 py-0.5 rounded-full font-mono uppercase tracking-widest">POS</span>
                </span>
                <span className="text-[8px] font-bold text-slate-400 block -mt-0.5 tracking-[0.25em] uppercase font-mono">
                  Next-Gen <span className="text-brand">Hybrid</span> Commerce
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links - White styling with brand yellow hover effects */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-bold tracking-wider uppercase text-slate-350">
              <a href="#solutions" className="hover:text-white transition-colors relative py-1 group">
                Solutions
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all group-hover:w-full" />
              </a>
              <a href="#showcase" className="hover:text-white transition-colors relative py-1 group">
                Hardware
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all group-hover:w-full" />
              </a>
              <a href="#modules" className="hover:text-white transition-colors relative py-1 group">
                Modules
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all group-hover:w-full" />
              </a>
              <a href="#testimonials" className="hover:text-white transition-colors relative py-1 group">
                Testimonials
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all group-hover:w-full" />
              </a>
              <a href="#roi" className="hover:text-white transition-colors relative py-1 group">
                Gain Calculator
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all group-hover:w-full" />
              </a>
              <a href="#pricing" className="hover:text-white transition-colors relative py-1 group">
                Plans
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all group-hover:w-full" />
              </a>
              <a href="#faq" className="hover:text-white transition-colors relative py-1 group">
                FAQ
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all group-hover:w-full" />
              </a>
              <a href="#download" className="hover:text-white transition-colors flex items-center gap-1.5 bg-blue-600/10 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-full hover:bg-blue-600/20 transition-all font-mono normal-case tracking-normal">
                <Download className="w-3.5 h-3.5" /> <span>Win64 App</span>
              </a>
            </nav>

            {/* Premium Call to Action buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={handleDownloadExe}
                className="text-white hover:text-brand font-extrabold text-xs tracking-wider uppercase px-4 py-2 hover:bg-white/5 rounded-full transition-all border border-transparent hover:border-slate-800 cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Desktop App
              </button>
              <a 
                href="https://wa.me/233554117978?text=Hello%20Clem%2C%20I%20would%20like%20to%20contact%20you%20regarding%20Clemtrix%20POS." 
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-[#25D366] hover:bg-white text-white hover:text-slate-950 rounded-full font-black text-xs tracking-wider uppercase transition-all duration-300 transform scale-100 hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-brand/10 border border-brand/50 flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp Clem
              </a>
            </div>

            {/* Hambuger for mobile */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden text-slate-150 hover:text-brand focus:outline-none p-1.5 rounded-full bg-white/5 border border-white/5 cursor-pointer"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.83-4.828 4.83a1 1 0 01-1.414-1.414l4.829-4.83-4.829-4.83a1 1 0 011.414-1.414l4.828 4.83 4.83-4.83a1 1 0 111.414 1.414l-4.83 4.83 4.83 4.83z" />
                ) : (
                  <path fillRule="evenodd" d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z" />
                )}
              </svg>
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-950 border-b border-white/10 px-6 py-4 flex flex-col gap-4 text-sm font-medium"
          >
            <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand py-1 transition-colors">Solutions</a>
            <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand py-1 transition-colors">Hardware Showcase</a>
            <a href="#modules" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand py-1 transition-colors">Modules</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand py-1 transition-colors">Testimonials</a>
            <a href="#roi" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand py-1 transition-colors">Gain Calculator</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand py-1 transition-colors">Pricing Plans</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand py-1 transition-colors">FAQ</a>
            <a href="#download" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand py-1 transition-colors flex items-center gap-2 text-brand font-bold">
              <Download className="w-4 h-4" /> Download Windows App (.EXE)
            </a>
             <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
              <button 
                onClick={() => { handleDownloadExe(); setMobileMenuOpen(false); }}
                className="w-full bg-slate-900 border border-white/15 text-white hover:text-brand font-extrabold py-2.5 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Desktop App
              </button>
              <a 
                href="https://wa.me/233554117978?text=Hello%20Clem%2C%20I%20would%20like%20to%20contact%20you%20regarding%20Clemtrix%20POS."
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold py-2.5 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Clem
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative px-6 pt-4 pb-12 md:pt-6 md:pb-16 overflow-hidden min-h-[80vh] flex items-center">
        {/* Fullscreen Slideshow background layers */}
        <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.22, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${SHOP_SLIDES[activeSlide].image})` }}
            />
          </AnimatePresence>
          {/* Subtle gradient overlays to guarantee pristine readability of text */}
          <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/95 via-dark-bg/60 to-dark-bg z-10" />
        </div>

        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[140px] pointer-events-none z-10" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none z-10" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-20 w-full pt-1 sm:-mt-4">
          
          {/* Majestic Interactive Touchscreen Slideshow Device at Top Fold */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="w-full max-w-4xl px-2 sm:px-4 z-25 relative mb-8 shadow-2xl"
          >
            {/* Premium Metallic Bezel Device containing screenshots */}
            <div className="relative bg-slate-950 p-2 sm:p-4 rounded-[2rem] border-4 border-slate-800 shadow-2xl shadow-blue-995/50 overflow-hidden group/device">
              
              {/* Device Notch Ambient Shine and Speaker indicator */}
              <div className="absolute top-0 inset-x-0 h-4 flex items-center justify-center pointer-events-none z-35">
                <div className="w-16 h-1 bg-slate-800 rounded-full" />
              </div>

              {/* Terminal Viewport */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-slate-900 rounded-[1.3rem] overflow-hidden border border-slate-750">
                
                {/* Smooth Slide Background Switcher */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${SHOP_SLIDES[activeSlide].image})` }}
                  />
                </AnimatePresence>

                {/* Brand Overlay sitting beautifully in the center of the active slideshow screenshot */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-15 pointer-events-none">
                  <div className="bg-slate-950/85 backdrop-blur-md px-6 py-5 sm:px-10 sm:py-6 rounded-[2rem] border border-brand/20 shadow-2xl shadow-brand/5 text-center pointer-events-auto max-w-md scale-95 sm:scale-100 flex flex-col items-center justify-center">
                    <ClemLogoFull iconSize="md" showText={true} />
                  </div>
                </div>

                {/* Dark Vignette Overlay for aesthetic shine and high read-contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none z-10" />

                {/* Live System Class Indicator */}
                <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 z-20 shadow-lg select-none">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] sm:text-[9px] font-mono font-bold tracking-widest text-[#efc15f] uppercase">
                    Live Demo &bull; Use Controls Below to Browse
                  </span>
                </div>

                {/* Bottom Overlay Text Box & Nav Buttons */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 flex flex-col md:flex-row md:items-end justify-between gap-3 z-20">
                  
                  {/* Informational description panel */}
                  <div className="text-left max-w-md bg-slate-950/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-slate-850 shadow-2xl">
                    <span className="text-[8px] sm:text-[9px] font-mono font-black tracking-widest text-brand uppercase bg-brand/10 px-2 py-0.5 rounded border border-brand/25 inline-block mb-1">
                      {SHOP_SLIDES[activeSlide].badge}
                    </span>
                    <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                      {React.createElement(SHOP_SLIDES[activeSlide].icon, { className: "w-3.5 h-3.5 text-brand shrink-0" })}
                      {SHOP_SLIDES[activeSlide].type}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-300 mt-1 leading-relaxed">
                      {SHOP_SLIDES[activeSlide].tagline}
                    </p>
                  </div>

                  {/* Nav Chevrons Panel */}
                  <div className="flex items-center gap-1.5 self-end bg-slate-950/90 backdrop-blur-md p-1 rounded-full border border-slate-850 shadow-md">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlide((prev) => (prev - 1 + SHOP_SLIDES.length) % SHOP_SLIDES.length);
                      }}
                      className="w-7 h-7 rounded-full bg-white/5 hover:bg-brand hover:text-slate-950 text-white flex items-center justify-center transition-all border border-white/5 active:scale-95 cursor-pointer text-xs font-black shadow-md"
                      title="Previous"
                    >
                      &larr;
                    </button>
                    
                    <div className="flex gap-1 px-0.5 items-center">
                      {SHOP_SLIDES.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSlide(idx);
                          }}
                          className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                            activeSlide === idx ? 'bg-brand w-4' : 'bg-white/25 hover:bg-white/40'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlide((prev) => (prev + 1) % SHOP_SLIDES.length);
                      }}
                      className="w-7 h-7 rounded-full bg-white/5 hover:bg-brand hover:text-slate-950 text-white flex items-center justify-center transition-all border border-white/5 active:scale-95 cursor-pointer text-xs font-black shadow-md"
                      title="Next"
                    >
                      &rarr;
                    </button>
                  </div>

                </div>

                {/* Bezel Gloss Reflection Overlays */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 -translate-y-full group-hover/device:translate-y-full transition-all duration-1000 ease-in-out pointer-events-none z-10" />

              </div>
            </div>

            <p className="text-center text-[10px] text-white/45 mt-3 font-mono">
              * Use the navigation controls inside the screen to tour screenshot modules: pharmacy itemizers, retail registries, and manager dashboards.
            </p>
          </motion.div>

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
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.12] tracking-tight max-w-5xl"
          >
            Empower Your Business With <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-white to-blue-400 drop-shadow-sm font-extrabold">
              Ghana&apos;s #1 Intelligent
            </span> <br />
            <span className="font-serif italic font-medium text-brand">POS & ERP Ecosystem.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed"
          >
            Say goodbye to inventory leakage, unaccounted cash-drawers, and manual invoicing. Clemtrix is a lightning-fast hybrid POS that handles visual table plans, ingredient recipe engineering, multi-branch bookkeeping, and native multi-currency accounting.
          </motion.p>

          {/* Dynamic Segment Tagline details showcase */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="mt-6 flex flex-col items-center max-w-2xl"
            >
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-650/20 text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-950/20">
                <span className="w-1.5 h-1.5 bg-brand rounded-full animate-ping" />
                Active Class: {SHOP_SLIDES[activeSlide].badge}
              </div>
              <p className="text-white text-xs sm:text-sm mt-3.5 font-bold tracking-wide bg-slate-900/80 px-6 py-3 rounded-2xl backdrop-blur-md border border-slate-800 shadow-xl">
                &ldquo;{SHOP_SLIDES[activeSlide].tagline}&rdquo;
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center w-full max-w-md mx-auto"
          >
            <button 
              onClick={() => onNavigate('pos')} 
              className="w-full px-8 py-4 bg-blue-600 hover:bg-brand text-white hover:text-slate-950 font-black text-sm tracking-wider uppercase rounded-full shadow-2xl shadow-blue-650/20 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-blue-500/20"
            >
              <Smartphone className="w-4 h-4 shrink-0" />
              Launch Live Terminal
            </button>
            <button 
              onClick={() => onNavigate('backoffice')} 
              className="w-full px-8 py-4 bg-slate-950/40 text-white hover:text-brand font-black text-xs tracking-wider uppercase rounded-full border border-slate-800 hover:border-brand-blue/40 transition-all flex items-center justify-center gap-2.5 cursor-pointer backdrop-blur-md"
            >
              <Monitor className="w-4 h-4 text-brand shrink-0" />
              Backoffice Cloud ERP
            </button>
          </motion.div>

          {/* Quick Stats Panel with modern styling */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-20 w-full max-w-5xl grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              { label: 'Revenue Tracked', val: 'GHS 12M+', color: 'text-brand' },
              { label: 'Active Terminals', val: '800+', color: 'text-blue-400' },
              { label: 'Leakage Reduced', val: 'Up to 92%', color: 'text-brand' },
              { label: 'System Uptime', val: '99.9%', color: 'text-emerald-400' }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-950/60 border border-slate-850 rounded-2xl p-6 text-center hover:border-brand-blue/30 transition-all hover:bg-slate-950/90 shadow-xl hover:shadow-blue-950/10 group">
                <p className={`text-2xl font-black font-mono tracking-tight ${stat.color} group-hover:scale-105 transition-transform`}>{stat.val}</p>
                <p className="text-[9px] text-slate-400 mt-2.5 uppercase tracking-widest font-black font-mono">{stat.label}</p>
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
            <h3 className="text-lg font-bold text-slate-100">MTN Mobile Money & Telecel Cash Network Integration</h3>
            <p className="text-xs text-slate-400 mt-1">Accept local network payments directly through the terminal to streamline customer checkouts.</p>
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

      {/* REAL-WORLD VISUAL SHOWCASE */}
      <section id="showcase" className="py-24 border-t border-white/5 bg-slate-950 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono tracking-[0.25em] text-brand font-bold uppercase block mb-2">Ghanaian Hardware & Deployments</span>
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight">Our POS System in Active Operations</h2>
            <p className="text-white/60 mt-4 max-w-2xl mx-auto text-sm md:text-base">
              Explore how the Clemtrix premium touch terminal interface operates dynamically in busy local merchant environments across Accra, Kumasi, and Tema.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Environment 1 */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-[#0c0c0c] border border-white/10 rounded-2xl overflow-hidden group hover:border-brand/35 transition-all duration-300"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-900 border-b border-white/10">
                <img 
                  src="/src/assets/images/pos_restaurant_1780476705295.png" 
                  alt="Clemtrix POS running in an elegant restaurant setup in Cantonments, Accra"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-4">
                  <span className="bg-brand/20 backdrop-blur-md text-brand text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded-sm border border-brand/25">
                    Hospitality & Fine Dining
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white group-hover:text-brand transition-colors">Restaurant Touch Terminals</h3>
                <p className="text-white/50 text-xs mt-2 leading-relaxed">
                  Engineered with large touch targets, real-time ticket statuses (KOT), high contrast menus, and multi-currency registers designed for rapid service.
                </p>
                <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                  <a href="#download" className="text-brand text-xs font-bold hover:underline flex items-center gap-1.5 uppercase tracking-wider font-mono">
                    <Download className="w-3.5 h-3.5" /> <span>Get Client Setup</span>
                  </a>
                  <span className="text-white/30 text-[10px] font-mono">Accra, Ghana</span>
                </div>
              </div>
            </motion.div>

            {/* Environment 2 */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-[#0c0c0c] border border-white/10 rounded-2xl overflow-hidden group hover:border-brand-blue/35 transition-all duration-300"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-900 border-b border-white/10">
                <img 
                  src="/src/assets/images/pos_retail_1780476724543.png" 
                  alt="Clemtrix POS running in a luxury boutique checkout register"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-4">
                  <span className="bg-brand-blue/20 backdrop-blur-md text-brand-blue text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded-sm border border-brand-blue/25">
                    Retail & Supermarket Counters
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white group-hover:text-brand-blue transition-colors">Boutique Checkout Tablets</h3>
                <p className="text-white/50 text-xs mt-2 leading-relaxed">
                  Support for continuous wireless barcode scanner beams, peripheral cash drawers, and high-speed receipt prints with custom thermal layouts.
                </p>
                <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                  <a href="#download" className="text-brand-blue text-xs font-bold hover:underline flex items-center gap-1.5 uppercase tracking-wider font-mono">
                    <Download className="w-3.5 h-3.5" /> <span>Download Now</span>
                  </a>
                  <span className="text-white/30 text-[10px] font-mono">Kumasi, Ghana</span>
                </div>
              </div>
            </motion.div>

            {/* Environment 3 */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-[#0c0c0c] border border-white/10 rounded-2xl overflow-hidden group hover:border-brand/35 transition-all duration-300"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-900 border-b border-white/10">
                <img 
                  src="/src/assets/images/pos_dashboard_1780476740840.png" 
                  alt="Clemtrix Backoffice secure analytics engine"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-4">
                  <span className="bg-[#a855f7]/20 backdrop-blur-md text-[#c084fc] text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded-sm border border-[#c084fc]/25">
                    Backoffice Analytics Cloud
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white group-hover:text-[#c084fc] transition-colors">Owner & Admin Telemetry</h3>
                <p className="text-white/50 text-xs mt-2 leading-relaxed">
                  Monitor real-time sales curves, track tax splits (VAT/COVID Levy), view active cashier margins, and prevent inventory leakages online from anywhere.
                </p>
                <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                  <a href="https://wa.me/233554117978" target="_blank" rel="noreferrer" className="text-[#c084fc] text-xs font-bold hover:underline flex items-center gap-1.5 uppercase tracking-wider font-mono">
                    <MessageCircle className="w-3.5 h-3.5" /> <span>Request Demo</span>
                  </a>
                  <span className="text-white/30 text-[10px] font-mono">Real-Time Sync</span>
                </div>
              </div>
            </motion.div>
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
              <h4 className="text-lg font-bold text-white">Clemtrix Accounts Ledger</h4>
              <p className="text-white/60 text-xs mt-2 leading-relaxed">Automatic calculation of profit margin, revenue shares, discounts, and visual performance charts. Creates official business-ready ledger records saving you hours of ledger tracking.</p>
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
                    <p className="text-white/90 font-bold font-sans truncate">Clemtrix.exe</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/40 uppercase text-[9px] tracking-wider">Compatibility</p>
                    <p className="text-white/90 font-bold font-sans">Windows 10 / 11</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/40 uppercase text-[9px] tracking-wider">Build Version</p>
                    <p className="text-white/90 font-bold">v4.2.0-stable</p>
                  </div>
                  <div className="space-y-1">
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
                      🎉 <span className="font-bold text-brand">Download started successfully!</span> Your file <code className="font-mono bg-white/5 px-1 py-0.5 rounded text-white text-[11px]">Clemtrix.exe</code> has been queued.
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
                  Avoid setup risks or system config errors. Our dedicated developer team will assist you with layout blueprints, ingredients recipe mapping, thermal receipt printer connectivity, and backend cloud configuration directly.
                </p>

                <div className="mt-6 space-y-4 pt-6 border-t border-white/5 text-xs text-white/80 font-sans">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <p className="font-bold text-brand mb-1">🔧 Included in Manual Support:</p>
                    <ul className="space-y-1.5 pl-4 list-disc text-white/60 text-[11px]">
                      <li>Thermal Receipt Printer raw driver configurations</li>
                      <li>Standard inventory recipe mapping guidance</li>
                      <li>Official company invoice credentials setup</li>
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

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-24 bg-slate-950/40 px-6 border-t border-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <span className="text-xs font-mono tracking-[0.25em] text-brand font-bold uppercase">
              Proven Across Hospitality & Retail
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Loved by Ghanaian Business Owners
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-xs sm:text-sm">
              Discover how restaurants, high-traffic retailers, and local boutiques trimmed down inventory leakages and accelerated register checks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Testimonial 1 */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-700/60 transition-all">
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="w-3.5 h-3.5 text-brand" />
                  ))}
                </div>
                <p className="text-slate-300 text-xs sm:text-sm italic leading-relaxed">
                  &ldquo;Mapping recipes was our biggest administrative hurdle. With Clemtrix, when our bartenders check out a signature drink, the exact quantities of spirits and garnishes deplete automatically. Our inventory leaks dropped to absolutely zero in month one.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3.5 mt-8 pt-6 border-t border-slate-800/60">
                <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-black text-xs">
                  CM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Mrs. Comfort Mensah</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Foyer & Garden Lounge &bull; Airport Residential, Accra</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-700/60 transition-all">
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="w-3.5 h-3.5 text-brand" />
                  ))}
                </div>
                <p className="text-slate-300 text-xs sm:text-sm italic leading-relaxed">
                  &ldquo;In Kumasi, fiber breakdowns can interrupt operations for hours. Clemtrix is legendary because its hybrid server runs fully locally, buffering sales logs in active internal sync queues. The moment connectivity gets restored, everything syncs instantly without packet loss.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3.5 mt-8 pt-6 border-t border-slate-800/60">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-xs">
                  KO
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Kofi Owusu</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Adum Wholesalers &bull; Adum, Kumasi</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-700/60 transition-all">
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="w-3.5 h-3.5 text-brand" />
                  ))}
                </div>
                <p className="text-slate-300 text-xs sm:text-sm italic leading-relaxed">
                  &ldquo;Switching raw rates between GHS and USD seamlessly at checkouts keeps our boutiques pricing completely fluid. It is visually stunning, easy to learn for young cashiers, and generates flawless multi-branch backoffice ledger coordinates.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3.5 mt-8 pt-6 border-t border-slate-800/60">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black text-xs">
                  EA
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Evelyn Appiah</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Satori Boutique &bull; Osu Mall / East Legon</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 bg-slate-950/60 px-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <span className="text-xs font-mono tracking-[0.25em] text-brand font-bold uppercase">
              Interactive License & Subscription Guides
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Honest transparent rates. Built to scale your business.
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-xs sm:text-sm">
              Deploy our bulletproof local software offline or cloud-connected. Select the setup model that fits your business environment best.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* CARD 1: LOCAL MANUAL INSTALLATION */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between transition-all hover:border-slate-700 hover:bg-slate-900/60">
              <div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-black text-brand uppercase tracking-widest bg-brand/10 px-2.5 py-1 rounded-md block w-fit mb-3">
                      Onsite Setup (Ghana)
                    </span>
                    <h3 className="text-xl font-bold text-white">Local Manual Installation</h3>
                  </div>
                  <Building2 className="w-5 h-5 text-slate-500 shrink-0" />
                </div>
                <p className="text-slate-400 text-xs mt-3 leading-normal">
                  Our professional dispatch technicians come directly to your store, set up thermal drawers, connect thermal printers, configure local routers, and train your crew.
                </p>
                
                <div className="my-8 space-y-1 bg-slate-950/50 p-4 rounded-xl border border-slate-850">
                  <span className="text-xs text-slate-500 block uppercase font-bold font-mono">One-time installation</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white font-mono">GHS 1,500</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6 space-y-3.5 text-xs text-slate-350">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span><strong>GHS 300</strong> mandatory 1-on-1 professional staff training fee</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span><strong>GHS 800</strong> annual license & contract renewal fee</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span>Unlimited offline POS terminal access with internal recipe mapping support</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span>Full physical support dispatcher dispatch visits within Accra & Kumasi</span>
                  </div>
                </div>
              </div>
              
              <a
                href="https://wa.me/233554117978"
                target="_blank"
                rel="noreferrer"
                className="w-full text-center mt-8 py-3.5 bg-slate-950 hover:bg-slate-900 text-white border border-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer block"
              >
                Book Accra/Kumasi Installers
              </a>
            </div>

            {/* CARD 2: ONLINE SELF-INSTALLATION */}
            <div className="bg-slate-900/40 border-2 border-brand/50 shadow-2xl shadow-brand/5 rounded-3xl p-8 flex flex-col justify-between relative transform lg:-translate-y-2 hover:bg-slate-900/60 transition-all">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-brand text-slate-950 text-[9px] uppercase tracking-[0.2em] font-black px-3.5 py-1 rounded-full shadow-lg">
                Recommended Global Download
              </div>

              <div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-md block w-fit mb-3">
                      Digital Executable
                    </span>
                    <h3 className="text-xl font-bold text-white">Online Self-Installation</h3>
                  </div>
                  <Download className="w-5 h-5 text-brand shrink-0" />
                </div>
                <p className="text-slate-350 text-xs mt-3 leading-normal">
                  Instantly download the standalone secure client installer. Boot your own terminal hardware on Windows/Linux in under 3 minutes, with auto dual-currency.
                </p>
                
                <div className="my-8 space-y-1 bg-slate-950/50 p-4 rounded-xl border border-slate-850">
                  <span className="text-xs text-slate-500 block uppercase font-bold font-mono">Download license</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white font-mono">$200</span>
                    <span className="text-slate-400 text-xs">one-time digital bundle</span>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-6 space-y-3.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span><strong>$100</strong> yearly software contract & backup renewal fee</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span>Credit & Debit card payment setup pre-built in terminal settings</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span>Instant automatic updates over secure global server nodes</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span>Hybrid offline synchronization with absolute zero sales packet drop</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleDownloadExe}
                className="w-full mt-8 py-3.5 bg-brand hover:bg-brand/90 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-brand/10 transition-all cursor-pointer active:scale-[0.98]"
              >
                Download Client File (.exe)
              </button>
            </div>

            {/* CARD 3: 15-DAY FREE TRIAL INFO */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between transition-all hover:border-slate-700 hover:bg-slate-900/60">
              <div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-md block w-fit mb-3">
                      Risk-Free Evaluation
                    </span>
                    <h3 className="text-xl font-bold text-white">15-Day Free Trial</h3>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                </div>
                <p className="text-slate-400 text-xs mt-3 leading-normal">
                  Evaluate all Clemtrix POS features with completely zero credit card or upfront deposit required. All local registers, visual tables, and shift ledger analytics are active.
                </p>
                
                {/* Static Pricing Box */}
                <div className="my-8 space-y-1 bg-slate-950/50 p-4 rounded-xl border border-slate-850">
                  <span className="text-xs text-slate-500 block uppercase font-bold font-mono">Starter License</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white font-mono">GHS 0</span>
                    <span className="text-slate-400 text-xs">/ 15 days access</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6 space-y-3.5 text-xs text-slate-350">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Instant automatic activation, pre-approved for developers and owners</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Real-time local inventory buffers & catalog recipe depletes fully tested</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Allows mock MTN Momo direct checkouts and shifts cash drawer audits</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onNavigate('pos')}
                className="w-full mt-8 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Launch Instant Free Trial Register
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
            <div className="flex items-center gap-2.5 mb-4">
              <ClemLogoIcon size={30} className="drop-shadow-md" />
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
            <h5 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Core Systems</h5>
            <ul className="space-y-2.5 text-white/50">
              <li><a href="#faq" className="hover:text-brand">Visual Floor Maps</a></li>
              <li><a href="#faq" className="hover:text-brand">Recipe Cost Depletion</a></li>
              <li><a href="#faq" className="hover:text-brand">Multi-Branch Sync</a></li>
              <li><a href="#faq" className="hover:text-brand">Offline Hybrid Node</a></li>
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
          <p>© 2026 Clemtrix POS Limited. All rights reserved. Locally Hosted & Enterprise Caliber.</p>
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
          <span><strong>Contact the developer</strong></span>
        </motion.div>

        {/* Floating action button */}
        <motion.a
          href="https://wa.me/233554117978?text=Hello%20Clem%2C%20I%20would%20like%20to%20contact%20you%20regarding%20Clemtrix%20POS."
          target="_blank"
          rel="noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
          className="bg-[#25D366] hover:bg-[#20ba59] hover:scale-110 active:scale-90 text-white p-4 rounded-full shadow-2xl transition-all pointer-events-auto relative flex items-center justify-center group"
          id="whatsapp-floater"
          title="Contact the developer"
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
