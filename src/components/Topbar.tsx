import React from 'react';
import { User } from '../types';

interface TopbarProps {
  currentUser: User | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
  onToggleMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentUser,
  searchQuery,
  onSearchChange,
  onNavigate,
  onOpenAuth,
  onToggleMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Ugandan National Flag Color Accent Strip */}
      <div className="h-1 w-full flex">
        <div className="h-full flex-1 bg-black" />
        <div className="h-full flex-1 bg-[#F4B400]" />
        <div className="h-full flex-1 bg-[#d92626]" />
        <div className="h-full flex-1 bg-black" />
        <div className="h-full flex-1 bg-[#F4B400]" />
        <div className="h-full flex-1 bg-[#d92626]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Mobile Hamburger + Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Toggle navigation drawer"
          >
            <i className="fa-solid fa-bars text-lg" />
          </button>

          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => onNavigate('marketplace')}
          >
            <img
              src="/images/bizlink-logo.png"
              alt="BizLink Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain bg-white rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 shadow-sm"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-[#0A3D91] dark:text-[#F4B400] leading-none">
                BizLink <span className="text-slate-900 dark:text-white">Uganda</span>
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Connecting Businesses &middot; Building Futures
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md relative hidden md:block">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search verified shops, products, or Kampala merchants..."
            className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A3D91] dark:focus:ring-[#F4B400]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>

        {/* User Account & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {currentUser.role === 'super_admin' && (
                <button
                  onClick={() => onNavigate('super-admin')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition cursor-pointer"
                >
                  <i className="fa-solid fa-shield-halved text-amber-500 text-xs" />
                  Admin Console
                </button>
              )}

              {currentUser.role === 'merchant' && (
                <button
                  onClick={() => onNavigate('merchant')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30 hover:bg-blue-500/20 transition cursor-pointer"
                >
                  <i className="fa-solid fa-shop text-blue-500 text-xs" />
                  My Shop
                </button>
              )}

              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <img
                  src={
                    currentUser.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'
                  }
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                />
                <div className="text-left hidden xl:block">
                  <span className="text-xs font-bold text-slate-800 dark:text-white block leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                </div>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-[#0A3D91] hover:bg-[#072d6d] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <i className="fa-solid fa-arrow-right-to-bracket" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
