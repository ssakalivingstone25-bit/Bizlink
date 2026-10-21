/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Shop, Product, ShopTemplate, OrderInquiry, UserRole } from './types';
import {
  INITIAL_USERS,
  INITIAL_SHOPS,
  INITIAL_PRODUCTS,
  INITIAL_TEMPLATES,
  INITIAL_ORDERS,
} from './initialData';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { SplashView } from './views/SplashView';
import { AuthView } from './views/AuthView';
import { MarketplaceView } from './views/MarketplaceView';
import { ShopDetailView } from './views/ShopDetailView';
import { SuperAdminView } from './views/SuperAdminView';
import { MerchantView } from './views/MerchantView';
import { ProfileView } from './views/ProfileView';

export default function App() {
  // App state
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  // Default to Super Admin SSAKA LIVINGSTONE from bizlink.db
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);
  const [shops, setShops] = useState<Shop[]>(INITIAL_SHOPS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [templates, setTemplates] = useState<ShopTemplate[]>(INITIAL_TEMPLATES);
  const [orders, setOrders] = useState<OrderInquiry[]>(INITIAL_ORDERS);

  // Navigation & UI state
  const [currentView, setCurrentView] = useState<string>('marketplace');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle switching views
  const handleNavigate = (view: string) => {
    if (view === 'splash') {
      setShowSplash(true);
      return;
    }
    if (view === 'shop-detail' && !selectedShop) {
      setSelectedShop(shops[0]);
    }
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick Role Switcher
  const handleRoleSwitch = (role: UserRole) => {
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      if (role === 'super_admin') {
        setCurrentView('super-admin');
      } else if (role === 'merchant') {
        setCurrentView('merchant');
      } else {
        setCurrentView('marketplace');
      }
    }
  };

  // Auth callbacks
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthOpen(false);
    if (user.role === 'super_admin') {
      setCurrentView('super-admin');
    } else if (user.role === 'merchant') {
      setCurrentView('merchant');
    } else {
      setCurrentView('marketplace');
    }
  };

  const handleRegisterSuccess = (newUser: User) => {
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthOpen(false);
    if (newUser.role === 'merchant') {
      const newShop: Shop = {
        id: Date.now(),
        name: `${newUser.name}'s Enterprise`,
        merchant_id: newUser.id,
        merchant_name: newUser.name,
        template_id: 1,
        category: 'Services',
        description: 'New verified merchant enterprise registered on BizLink Uganda.',
        location: newUser.location || 'Kampala, Uganda',
        phone: newUser.phone || '+256 700 000 000',
        whatsapp: (newUser.phone || '256700000000').replace(/[^0-9]/g, ''),
        cover_image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
        active: true,
        verified: true,
        status: 'paid',
        rating: 5.0,
        reviewsCount: 1,
      };
      setShops((prev) => [...prev, newShop]);
      setCurrentView('merchant');
    } else {
      setCurrentView('marketplace');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('marketplace');
  };

  // Shop / Product mutations
  const handleSelectShop = (shop: Shop) => {
    setSelectedShop(shop);
    setCurrentView('shop-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = (newOrder: OrderInquiry) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleToggleProductStock = (productId: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: 'pending' | 'confirmed' | 'delivered'
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleUpdateShopInfo = (shopId: number, updates: Partial<Shop>) => {
    setShops((prev) =>
      prev.map((s) => (s.id === shopId ? { ...s, ...updates } : s))
    );
  };

  // Super Admin mutations
  const handleToggleMerchantApproval = (userId: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, approved: !u.approved } : u))
    );
  };

  const handleToggleShopActive = (shopId: number) => {
    setShops((prev) =>
      prev.map((s) => (s.id === shopId ? { ...s, active: !s.active } : s))
    );
  };

  const handleCreateTemplate = (template: ShopTemplate) => {
    setTemplates((prev) => [...prev, template]);
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070e1b] text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-400/30 selection:text-amber-300">
      {/* Fullscreen Splash Screen */}
      {showSplash && (
        <SplashView
          onEnter={() => {
            setShowSplash(false);
            setCurrentView('marketplace');
          }}
          onLogin={() => {
            setShowSplash(false);
            setIsAuthOpen(true);
          }}
        />
      )}

      {/* Auth Dialog Modal */}
      {isAuthOpen && (
        <AuthView
          users={users}
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
          onClose={() => setIsAuthOpen(false)}
        />
      )}

      {/* Main App Layout */}
      <div className="flex">
        {/* Sidebar Component */}
        <Sidebar
          currentUser={currentUser}
          currentView={currentView}
          onNavigate={handleNavigate}
          onRoleSwitch={handleRoleSwitch}
          onLogout={handleLogout}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Content Wrapper */}
        <div className="flex-1 lg:ml-64 min-w-0 transition-all duration-300 flex flex-col min-h-screen">
          {/* Topbar */}
          <Topbar
            currentUser={currentUser}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNavigate={handleNavigate}
            onOpenAuth={() => setIsAuthOpen(true)}
            onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          />

          {/* Main View Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {currentView === 'marketplace' && (
              <MarketplaceView
                shops={shops}
                products={products}
                searchQuery={searchQuery}
                onSelectShop={handleSelectShop}
                onSelectCategory={setSelectedCategory}
                selectedCategory={selectedCategory}
              />
            )}

            {currentView === 'shop-detail' && selectedShop && (
              <ShopDetailView
                shop={selectedShop}
                products={products}
                currentUser={currentUser}
                onBack={() => setCurrentView('marketplace')}
                onPlaceOrder={handlePlaceOrder}
                onNavigate={handleNavigate}
              />
            )}

            {(currentView === 'super-admin' || currentView === 'super-admin-templates') && (
              <SuperAdminView
                currentUser={currentUser}
                users={users}
                shops={shops}
                products={products}
                templates={templates}
                orders={orders}
                onToggleMerchantApproval={handleToggleMerchantApproval}
                onToggleShopActive={handleToggleShopActive}
                onCreateTemplate={handleCreateTemplate}
              />
            )}

            {currentView === 'merchant' && (
              <MerchantView
                currentUser={currentUser}
                shops={shops}
                products={products}
                orders={orders}
                onAddProduct={handleAddProduct}
                onDeleteProduct={handleDeleteProduct}
                onToggleProductStock={handleToggleProductStock}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onUpdateShopInfo={handleUpdateShopInfo}
                onViewShop={handleSelectShop}
              />
            )}

            {currentView === 'profile' && (
              <ProfileView
                currentUser={currentUser}
                onUpdateUser={handleUpdateUser}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
              />
            )}

            {currentView === 'orders' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      Marketplace Inquiries & Orders
                    </h2>
                    <p className="text-xs text-slate-400">
                      Live inquiry log across all registered shops
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {orders.length} Inquiries
                  </span>
                </div>

                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-500">{ord.id}</span>
                          <span className="text-xs text-slate-400">&middot; {ord.created_at}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                          Buyer: {ord.customer_name} &rarr; <span className="text-[#0A3D91] dark:text-amber-400">{ord.shop_name}</span>
                        </h4>
                        <div className="text-xs text-slate-400 mt-1">
                          Phone: {ord.customer_phone}
                        </div>
                        <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                          {ord.items.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-[#0A3D91] dark:text-[#F4B400] block">
                          UGX {ord.total_ugx.toLocaleString()}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 py-6 px-4 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">BizLink Uganda</span>
                <span>&middot;</span>
                <span>Connecting Businesses. Building Futures.</span>
              </div>
              <div>
                Kampala, Uganda &middot; All Rights Reserved
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
