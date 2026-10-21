import React, { useState } from 'react';
import { User } from '../types';

interface SidebarProps {
  currentUser: User | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onRoleSwitch: (role: 'super_admin' | 'merchant' | 'customer') => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onRoleSwitch,
  onLogout,
  mobileOpen,
  onCloseMobile,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleNavClick = (view: string) => {
    onNavigate(view);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 bg-[#081426] text-white z-50 transition-all duration-300 flex flex-col border-r border-slate-800 shadow-2xl ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Top Header / Logo */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-slate-800/80 bg-[#06101e]">
          {(!collapsed || mobileOpen) && (
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => handleNavClick('marketplace')}
            >
              <img
                src="/images/bizlink-logo.png"
                alt="BizLink Logo"
                className="w-10 h-10 object-contain bg-white rounded-lg p-1 border border-amber-400"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <div className="font-extrabold text-xl tracking-tight text-[#F4B400] leading-none">
                  BizLink
                </div>
                <span className="text-[10px] text-slate-400 tracking-wider font-semibold uppercase">
                  Uganda Hub
                </span>
              </div>
            </div>
          )}

          {collapsed && !mobileOpen && (
            <div
              className="mx-auto cursor-pointer"
              onClick={() => handleNavClick('marketplace')}
            >
              <div className="w-10 h-10 bg-[#F4B400] text-slate-950 font-black rounded-lg flex items-center justify-center text-lg shadow-md">
                BU
              </div>
            </div>
          )}

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 text-xs transition cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <i className={`fa-solid ${collapsed ? 'fa-angles-right' : 'fa-angles-left'}`} />
          </button>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-md hover:bg-slate-800 text-sm transition cursor-pointer"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* User Info Capsule */}
        {currentUser && (
          <div
            className={`p-4 border-b border-slate-800/60 bg-slate-900/40 ${
              collapsed && !mobileOpen ? 'text-center' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={
                  currentUser.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                }
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-amber-400/80 shrink-0 shadow-sm"
              />
              {(!collapsed || mobileOpen) && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate">
                    {currentUser.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        currentUser.role === 'super_admin'
                          ? 'bg-amber-400'
                          : currentUser.role === 'merchant'
                          ? 'bg-blue-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
                      {currentUser.role === 'super_admin'
                        ? 'Super Admin'
                        : currentUser.role === 'merchant'
                        ? 'Merchant'
                        : 'Customer'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Menu Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
          {/* Marketplace */}
          <button
            onClick={() => handleNavClick('marketplace')}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
              currentView === 'marketplace'
                ? 'bg-[#0A3D91] text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-store w-5 text-center text-[#F4B400]" />
            {(!collapsed || mobileOpen) && <span>Marketplace</span>}
          </button>

          {/* Super Admin Dashboard */}
          {currentUser?.role === 'super_admin' && (
            <button
              onClick={() => handleNavClick('super-admin')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
                currentView.startsWith('super-admin')
                  ? 'bg-[#0A3D91] text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <i className="fa-solid fa-gauge-high w-5 text-center text-amber-400" />
              {(!collapsed || mobileOpen) && <span>Admin Dashboard</span>}
            </button>
          )}

          {/* Merchant Dashboard */}
          {currentUser?.role === 'merchant' && (
            <button
              onClick={() => handleNavClick('merchant')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
                currentView === 'merchant'
                  ? 'bg-[#0A3D91] text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <i className="fa-solid fa-shop w-5 text-center text-emerald-400" />
              {(!collapsed || mobileOpen) && <span>Merchant Dashboard</span>}
            </button>
          )}

          {/* Profile */}
          <button
            onClick={() => handleNavClick('profile')}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
              currentView === 'profile'
                ? 'bg-[#0A3D91] text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-user w-5 text-center text-sky-400" />
            {(!collapsed || mobileOpen) && <span>Profile</span>}
          </button>

          {/* Shop Templates Builder */}
          {currentUser?.role === 'super_admin' && (
            <button
              onClick={() => handleNavClick('super-admin-templates')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
                currentView === 'super-admin-templates'
                  ? 'bg-[#0A3D91] text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <i className="fa-solid fa-layer-group w-5 text-center text-purple-400" />
              {(!collapsed || mobileOpen) && <span>Shop Templates</span>}
            </button>
          )}

          {/* Orders / Inquiries */}
          <button
            onClick={() =>
              handleNavClick(
                currentUser?.role === 'merchant' ? 'merchant' : 'orders'
              )
            }
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
              currentView === 'orders'
                ? 'bg-[#0A3D91] text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-cart-shopping w-5 text-center text-teal-400" />
            {(!collapsed || mobileOpen) && <span>Orders & Inquiries</span>}
          </button>
        </nav>

        {/* Role Switcher Sandbox */}
        {(!collapsed || mobileOpen) && (
          <div className="p-3 mx-3 mb-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center justify-between">
              <span>Quick Role Switch</span>
              <i className="fa-solid fa-wand-magic-sparkles text-amber-400" />
            </p>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => {
                  onRoleSwitch('super_admin');
                  onCloseMobile();
                }}
                className={`py-1 px-1.5 rounded text-[10px] font-semibold transition cursor-pointer text-center ${
                  currentUser?.role === 'super_admin'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => {
                  onRoleSwitch('merchant');
                  onCloseMobile();
                }}
                className={`py-1 px-1.5 rounded text-[10px] font-semibold transition cursor-pointer text-center ${
                  currentUser?.role === 'merchant'
                    ? 'bg-blue-500 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Merchant
              </button>
              <button
                onClick={() => {
                  onRoleSwitch('customer');
                  onCloseMobile();
                }}
                className={`py-1 px-1.5 rounded text-[10px] font-semibold transition cursor-pointer text-center ${
                  currentUser?.role === 'customer'
                    ? 'bg-emerald-500 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Customer
              </button>
            </div>
          </div>
        )}

        {/* Logout / Splash Trigger */}
        <div className="p-3 border-t border-slate-800/80 bg-[#06101e] space-y-1">
          <button
            onClick={() => handleNavClick('splash')}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition cursor-pointer"
          >
            <i className="fa-solid fa-circle-play w-5 text-center text-amber-400" />
            {(!collapsed || mobileOpen) && <span>Splash Screen</span>}
          </button>

          <button
            onClick={() => {
              onLogout();
              onCloseMobile();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
          >
            <i className="fa-solid fa-right-from-bracket w-5 text-center" />
            {(!collapsed || mobileOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
