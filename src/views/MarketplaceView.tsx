import React, { useState } from 'react';
import { Shop, Product } from '../types';
import { CATEGORIES } from '../initialData';

interface MarketplaceViewProps {
  shops: Shop[];
  products: Product[];
  searchQuery: string;
  onSelectShop: (shop: Shop) => void;
  onSelectCategory: (cat: string) => void;
  selectedCategory: string;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  shops,
  products,
  searchQuery,
  onSelectShop,
  onSelectCategory,
  selectedCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'shops' | 'products'>('shops');

  // Filter shops
  const filteredShops = shops.filter((shop) => {
    const matchesCategory =
      selectedCategory === 'All' || shop.category === selectedCategory;
    const matchesSearch =
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter products
  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.description &&
        prod.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner matching marketplace.css .hero */}
      <div className="rounded-3xl p-8 sm:p-12 text-white bg-gradient-to-r from-[#081426] via-[#0A3D91] to-[#2E8B57] shadow-xl relative overflow-hidden border border-slate-700/50">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-[#F4B400] text-xs font-bold uppercase tracking-wider mb-4">
            <i className="fa-solid fa-flag text-red-500" />
            Uganda's Premier Commerce Gateway
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Welcome to BizLink Marketplace
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
            Discover verified Ugandan businesses, local artisan products, and professional services across Kampala, Jinja, Entebbe, and beyond.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('shops')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'shops'
                  ? 'bg-[#F4B400] text-slate-950 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <i className="fa-solid fa-store" />
              Explore Shops ({shops.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#F4B400] text-slate-950 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <i className="fa-solid fa-box" />
              Direct Product Catalog ({products.length})
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid matching marketplace.html .categories */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <i className="fa-solid fa-layer-group text-[#0A3D91] dark:text-[#F4B400]" />
            Business Categories
          </h2>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => onSelectCategory('All')}
              className="text-xs font-semibold text-[#0A3D91] dark:text-amber-400 hover:underline cursor-pointer"
            >
              Reset to All
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORIES.slice(0, 10).map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`p-4 rounded-2xl border transition text-center flex flex-col items-center justify-center gap-2 cursor-pointer group ${
                  isSelected
                    ? 'bg-[#0A3D91] text-white border-[#0A3D91] shadow-lg shadow-blue-900/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400 dark:hover:border-amber-400/50 hover:bg-amber-50/50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg transition ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-[#0A3D91] dark:text-[#F4B400] group-hover:scale-110'
                  }`}
                >
                  <i className={`fa-solid ${cat.icon}`} />
                </div>
                <span className="text-xs font-bold leading-tight line-clamp-1">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Shops View */}
      {activeTab === 'shops' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <i className="fa-solid fa-certificate text-emerald-500" />
                Featured Shops in Uganda
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Registered and approved merchant stores ready for commerce
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {filteredShops.length} {filteredShops.length === 1 ? 'Store' : 'Stores'}
            </span>
          </div>

          {filteredShops.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
              <i className="fa-solid fa-store-slash text-4xl text-slate-400 mb-3" />
              <h3 className="font-bold text-slate-700 dark:text-slate-200">No shops found</h3>
              <p className="text-xs text-slate-400 mt-1">
                Try clearing your search terms or picking a different category.
              </p>
              <button
                onClick={() => {
                  onSelectCategory('All');
                }}
                className="mt-4 px-4 py-2 bg-[#0A3D91] text-white text-xs font-bold rounded-lg"
              >
                Show All Shops
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShops.map((shop) => (
                <div
                  key={shop.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Shop Cover Image */}
                  <div className="h-44 w-full relative overflow-hidden bg-slate-800">
                    <img
                      src={shop.cover_image}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                    {/* Category pill */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur text-white border border-white/20">
                      {shop.category}
                    </span>

                    {/* Rating badge */}
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#F4B400] text-slate-950 flex items-center gap-1 shadow">
                      <i className="fa-solid fa-star text-xs" />
                      <span>{shop.rating}</span>
                    </div>

                    {/* Logo thumbnail */}
                    {shop.logo_image && (
                      <div className="absolute -bottom-4 left-4 w-12 h-12 rounded-xl bg-white p-1 shadow-lg border border-slate-200 overflow-hidden">
                        <img
                          src={shop.logo_image}
                          alt="Logo"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  {/* Shop Info matching marketplace.html .info */}
                  <div className="p-5 pt-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-[#0A3D91] dark:group-hover:text-amber-400 transition">
                          {shop.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                        <i className="fa-solid fa-circle-check text-xs" />
                        <span>Verified BizLink Shop</span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {shop.description}
                      </p>

                      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <i className="fa-solid fa-location-dot text-rose-500" />
                        <span className="truncate">{shop.location}</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-400">
                        Merchant: <strong className="text-slate-700 dark:text-slate-300">{shop.merchant_name}</strong>
                      </span>

                      {/* Visit Shop Button from marketplace.html .visit */}
                      <button
                        onClick={() => onSelectShop(shop)}
                        className="px-4 py-2 rounded-xl bg-[#0A3D91] hover:bg-[#072c69] text-white text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
                      >
                        <i className="fa-solid fa-eye" />
                        Visit Shop
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Products Catalog View */}
      {activeTab === 'products' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <i className="fa-solid fa-boxes-stacked text-[#F4B400]" />
                Direct Products Catalog
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Browse products directly available across all BizLink merchants
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {filteredProducts.length} Products
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((prod) => {
              const shop = shops.find((s) => s.id === prod.shop_id);
              return (
                <div
                  key={prod.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="h-40 bg-slate-800 relative">
                    <img
                      src={prod.image || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80'}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#F4B400] text-slate-950">
                      {prod.category}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                        {prod.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {prod.description}
                      </p>
                      <div className="mt-2 text-xs text-slate-500">
                        Sold by:{' '}
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {shop?.name || 'Uganda Merchant'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-[#0A3D91] dark:text-[#F4B400]">
                        UGX {prod.price.toLocaleString()}
                      </span>

                      {shop && (
                        <button
                          onClick={() => onSelectShop(shop)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#0A3D91] hover:text-white text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
                        >
                          View Shop
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
