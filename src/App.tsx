/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import LandingPage from './components/LandingPage';
import PosTerminal from './components/PosTerminal';
import BackOffice from './components/BackOffice';
import { INITIAL_PRODUCTS, INITIAL_TABLES, INITIAL_SHIFTS, SAMPLE_SALES } from './data/mockData';
import { Product, Table, Sale, Shift, BusinessSettings, StoreKeeper } from './types';

export default function App() {
  // Navigation State: 'landing' | 'pos' | 'backoffice'
  const [currentRoute, setCurrentRoute] = useState<'landing' | 'pos' | 'backoffice'>('landing');

  // Application database states
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [sales, setSales] = useState<Sale[]>(SAMPLE_SALES);
  const [shifts, setShifts] = useState<Shift[]>(INITIAL_SHIFTS);

  // Global settings for customization (currency customization, printing choice, company details)
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    businessName: 'Clemtrix Foods & Retail Ltd',
    businessPhone: '+233 55 411 7978',
    currency: 'GHS',
    currencySymbol: 'GH₵',
    isReceiptOptional: false,
  });

  // Store Keepers roster (owners can manage keepers, who can log as active cashiers)
  const [storeKeepers, setStoreKeepers] = useState<StoreKeeper[]>([
    { id: 'sk-1', name: 'Ama Osei', role: 'Senior Cashier', phone: '+233 554 117 900', status: 'active' },
    { id: 'sk-2', name: 'Kofi Mensah', role: 'Store Keeper', phone: '+233 244 556 221', status: 'active' },
    { id: 'sk-3', name: 'Ekow Essien', role: 'Associate Staff', phone: '+233 201 113 445', status: 'active' },
  ]);

  // Physical offline database logs sync state
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineSyncQueue, setOfflineSyncQueue] = useState<Sale[]>([]);

  // Computed state pointers
  const activeShift = shifts.find(sh => sh.status === 'open') || null;

  // Stocks deducting triggers
  const handleUpdateInventory = (productId: string, qtySold: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          stock: Math.max(0, p.stock - qtySold)
        };
      }
      return p;
    }));
  };

  // Restock inventory trigger
  const handleRestockProduct = (productId: string, quantity: number, note?: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          stock: p.stock + quantity
        };
      }
      return p;
    }));
  };

  // Add brand new custom products ID
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
  };

  // Set visual tables layout configs
  const handleUpdateTables = (updatedTables: Table[]) => {
    setTables(updatedTables);
  };

  // Submit complete invoice sales
  const handleAddSale = (newSale: Sale) => {
    setSales(prev => [...prev, newSale]);
  };

  // End day registers lockouts
  const handleCloseShift = (actualCash: number) => {
    setShifts(prev => prev.map(sh => {
      if (sh.status === 'open') {
        // sum up actual expected math cash sale totals (start balance + cashier cash sales sum)
        const expectedSalesCash = sh.startingCash + sales
          .filter(s => s.paymentMethod === 'Cash')
          .reduce((sum, s) => sum + s.total, 0);

        return {
          ...sh,
          status: 'closed',
          endTime: new Date().toISOString(),
          actualCash: actualCash,
          expectedCash: expectedSalesCash
        };
      }
      return sh;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      {currentRoute === 'landing' && (
        <LandingPage onNavigate={setCurrentRoute} />
      )}

      {currentRoute === 'pos' && (
        <PosTerminal 
          products={products}
          onUpdateInventory={handleUpdateInventory}
          tables={tables}
          onUpdateTables={handleUpdateTables}
          sales={sales}
          onAddSale={handleAddSale}
          activeShift={activeShift}
          onCloseShift={handleCloseShift}
          onNavigate={setCurrentRoute}
          businessSettings={businessSettings}
          storeKeepers={storeKeepers}
          isOnline={isOnline}
          setIsOnline={setIsOnline}
          offlineSyncQueue={offlineSyncQueue}
          setOfflineSyncQueue={setOfflineSyncQueue}
        />
      )}

      {currentRoute === 'backoffice' && (
        <BackOffice 
          products={products}
          onAddProduct={handleAddProduct}
          onRestockProduct={handleRestockProduct}
          sales={sales}
          shifts={shifts}
          onNavigate={setCurrentRoute}
          businessSettings={businessSettings}
          onUpdateSettings={setBusinessSettings}
          storeKeepers={storeKeepers}
          onUpdateStoreKeepers={setStoreKeepers}
          isOnline={isOnline}
          setIsOnline={setIsOnline}
          offlineSyncQueue={offlineSyncQueue}
          onClearOfflineQueue={() => setOfflineSyncQueue([])}
        />
      )}
    </div>
  );
}

