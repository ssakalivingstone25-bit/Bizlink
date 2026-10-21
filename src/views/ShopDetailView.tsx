import React, { useState, useMemo } from 'react';
import { Shop, Product, OrderInquiry, User, ShopTemplate } from '../types';

interface ShopDetailViewProps {
  shop: Shop;
  products: Product[];
  templates?: ShopTemplate[];
  currentUser?: User | null;
  onBack: () => void;
  onPlaceOrder: (order: OrderInquiry) => void;
  onNavigate?: (view: string) => void;
}

export const ShopDetailView: React.FC<ShopDetailViewProps> = ({
  shop,
  products,
  templates = [],
  currentUser,
  onBack,
  onPlaceOrder,
  onNavigate,
}) => {
  // Find assigned template
  const assignedTemplate = useMemo(() => {
    return templates.find((t) => t.id === shop.template_id) || templates[0];
  }, [templates, shop.template_id]);

  const theme = assignedTemplate?.theme || {
    primaryColor: '#081426',
    secondaryColor: '#0A3D91',
    accentColor: '#F4B400',
    backgroundColor: '#F8FAFC',
    layoutStyle: 'jumia_dense',
    bannerStyle: 'contained',
    cardStyle: 'price_first',
  };

  const sections = assignedTemplate?.sections || [];

  const isSectionActive = (secName: string) => {
    if (!sections || sections.length === 0) return true;
    const found = sections.find((s) => s.section_name === secName);
    return found ? found.active : true;
  };

  const shopProducts = useMemo(
    () => products.filter((p) => p.shop_id === shop.id),
    [products, shop.id]
  );

  // In-shop search and filter states
  const [inShopSearch, setInShopSearch] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'name_asc'>('default');

  // Product categories within this shop
  const shopCategories = useMemo(() => {
    const set = new Set<string>();
    shopProducts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [shopProducts]);

  // Filtered and sorted products
  const displayedProducts = useMemo(() => {
    let result = [...shopProducts];

    if (inShopSearch.trim()) {
      const q = inShopSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (selectedSubCategory !== 'All') {
      result = result.filter((p) => p.category === selectedSubCategory);
    }

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name_asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [shopProducts, inShopSearch, selectedSubCategory, sortBy]);

  // Featured / deals products
  const featuredProducts = useMemo(
    () => shopProducts.filter((p) => p.featured || p.price > 40000).slice(0, 3),
    [shopProducts]
  );

  // Modal State for Product Details / Direct Inquiry
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.location || 'Kampala Central / Boda delivery');
  const [quantity, setQuantity] = useState(1);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const newOrder: OrderInquiry = {
      id: `ORD-UG-${Math.floor(1000 + Math.random() * 9000)}`,
      shop_id: shop.id,
      shop_name: shop.name,
      customer_name: customerName || 'Valued Customer',
      customer_phone: customerPhone || '+256 700 000 000',
      delivery_address: deliveryAddress,
      payment_method: 'momo',
      items: [
        {
          product_name: selectedProduct.name,
          quantity: quantity,
          price: selectedProduct.price,
        },
      ],
      total_ugx: selectedProduct.price * quantity,
      status: 'pending',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    onPlaceOrder(newOrder);
    setOrderPlacedSuccess(true);
    showToast(`Order for ${selectedProduct.name} sent to ${shop.name}!`);

    setTimeout(() => {
      setSelectedProduct(null);
      setOrderPlacedSuccess(false);
      setQuantity(1);
    }, 2200);
  };

  // WhatsApp Order Link generator
  const createWhatsAppOrderLink = (product: Product, qty: number = 1) => {
    const cleanedNumber = (shop.whatsapp || shop.phone || '256700000000').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${shop.name}! I would like to order:
- Product: ${product.name}
- Quantity: ${qty}
- Unit Price: UGX ${product.price.toLocaleString()}
- Total Amount: UGX ${(product.price * qty).toLocaleString()}
Please confirm availability and Kampala delivery schedule via BizLink Uganda.`
    );
    return `https://wa.me/${cleanedNumber}?text=${message}`;
  };

  return (
    <div
      style={{ backgroundColor: theme.backgroundColor }}
      className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm font-sans -m-4 sm:-m-6 lg:-m-8 transition-colors"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#081426] text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-[#F4B400] flex items-center gap-3 animate-bounce">
          <i className="fa-solid fa-circle-check text-[#F4B400] text-lg" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* ====================================================================
           A. ANNOUNCEMENT BAR
           ==================================================================== */}
      {isSectionActive('announcement') && (
        <div
          style={{ backgroundColor: theme.primaryColor }}
          className="text-white text-xs py-2 px-4 border-b-2"
          style-border-color={theme.accentColor}
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-medium">
              <i className="fa-solid fa-store" style={{ color: theme.accentColor }} />
              <span className="font-semibold">Official BizLink Uganda Merchant Storefront</span>
              {shop.verified && (
                <span
                  style={{ color: theme.accentColor }}
                  className="hidden sm:inline font-bold ml-1"
                >
                  &bull; Verified Commercial Merchant
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-slate-300 text-[11px]">
              <button
                onClick={onBack}
                className="hover:text-white transition flex items-center gap-1.5 cursor-pointer font-bold"
              >
                <i className="fa-solid fa-arrow-left" />
                <span>All Ugandan Shops</span>
              </button>

              <span className="text-slate-600">|</span>

              <a
                href={`tel:${shop.phone || '+256700000000'}`}
                className="hover:text-white transition flex items-center gap-1 font-bold"
              >
                <i className="fa-solid fa-phone" style={{ color: theme.accentColor }} />
                <span>{shop.phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
           B. STORE HEADER & IN-SHOP SEARCH
           ==================================================================== */}
      {isSectionActive('store_header') && (
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              <img
                src={
                  shop.logo_image ||
                  assignedTemplate?.logo ||
                  '/bizlink-logo.png'
                }
                alt={shop.name}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/bizlink-logo.png';
                }}
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {shop.name}
                  </h1>
                  {shop.verified && (
                    <i
                      className="fa-solid fa-circle-check text-blue-600 text-sm"
                      title="BizLink Verified Merchant"
                    />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-location-dot text-red-500 text-[10px]" />
                    {shop.location || 'Kampala, Uganda'}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    Open Now
                  </span>
                </div>
              </div>
            </div>

            {/* In-Shop Instant Search */}
            <div className="flex-1 max-w-md min-w-[260px]">
              <div className="relative">
                <input
                  type="text"
                  value={inShopSearch}
                  onChange={(e) => setInShopSearch(e.target.value)}
                  placeholder={`Search ${shop.name} products...`}
                  className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D91]"
                />
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs" />
                {inShopSearch && (
                  <button
                    onClick={() => setInShopSearch('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                )}
              </div>
            </div>

            {/* Header Direct Actions */}
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${(shop.whatsapp || '256700000000').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <i className="fa-brands fa-whatsapp text-sm" />
                <span className="hidden sm:inline">WhatsApp Merchant</span>
              </a>

              <button
                onClick={onBack}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
                title="Back to Marketplace"
              >
                <i className="fa-solid fa-store mr-1 text-slate-400" />
                <span className="hidden md:inline">Marketplace</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ====================================================================
           C. SHOP IDENTITY & HERO BANNER
           ==================================================================== */}
      {isSectionActive('hero_cover') && (
        <section className="relative">
          {/* Banner container styled according to template.bannerStyle */}
          <div
            className={`w-full relative overflow-hidden bg-slate-900 ${
              theme.bannerStyle === 'full_bleed'
                ? 'h-52 sm:h-72'
                : theme.bannerStyle === 'split_bio'
                ? 'h-48 sm:h-60'
                : 'h-44 sm:h-64'
            }`}
          >
            <img
              src={
                shop.cover_image ||
                assignedTemplate?.cover_image ||
                'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'
              }
              alt={shop.name}
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#081426] via-[#081426]/60 to-transparent" />

            {/* Content overlay */}
            <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap items-end justify-between gap-4 text-white">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                    style={{ backgroundColor: theme.accentColor, color: '#081426' }}
                  >
                    <i className="fa-solid fa-tag mr-1" />
                    {shop.category}
                  </span>
                  {shop.verified && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/90 text-white flex items-center gap-1">
                      <i className="fa-solid fa-circle-check text-[10px]" />
                      Verified Merchant
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/90 text-white">
                    <i className="fa-solid fa-motorcycle mr-1" />
                    Kampala Same-Day Boda Delivery
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black drop-shadow-md">
                  {shop.name}
                </h2>

                <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 drop-shadow-sm">
                  {shop.description}
                </p>

                {/* Quick Store Trust Indicators */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-user-tie text-[#F4B400]" />
                    Merchant: <strong className="text-white">{shop.merchant_name}</strong>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-star text-amber-400" />
                    <strong>{shop.rating || '4.9'}</strong> ({shop.reviewsCount || '35'}+ reviews)
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-clock text-slate-400" />
                    Response: <strong>&lt; 20 mins</strong>
                  </span>
                </div>
              </div>

              {/* Direct Quick Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${(shop.whatsapp || '256700000000').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition"
                >
                  <i className="fa-brands fa-whatsapp text-base" />
                  <span>Inquire on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
           D. QUICK CATEGORY FILTER BAR
           ==================================================================== */}
      {isSectionActive('category_chips') && shopCategories.length > 1 && (
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mr-1">
                <i className="fa-solid fa-filter text-[10px]" />
                Filters:
              </span>
              {shopCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedSubCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedSubCategory === cat
                      ? 'text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  style={
                    selectedSubCategory === cat
                      ? { backgroundColor: theme.secondaryColor }
                      : {}
                  }
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs flex-shrink-0">
              <span className="text-slate-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none"
              >
                <option value="default">Featured / Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* ====================================================================
             E. FLASH DEALS / FEATURED SHOWCASE (Jumia-Inspired)
             ==================================================================== */}
        {isSectionActive('featured_deals') && featuredProducts.length > 0 && !inShopSearch && (
          <section className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-900/50 rounded-2xl p-4 sm:p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#F4B400] text-[#081426] flex items-center justify-center font-bold text-sm shadow-sm">
                  <i className="fa-solid fa-bolt" />
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    BizLink Verified Top Deals
                  </h3>
                  <p className="text-xs text-slate-500">
                    Handpicked bestselling items with direct Kampala dispatch
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs">
                Guaranteed Genuine Stock
              </span>
            </div>

            {/* Deals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-amber-200/80 dark:border-slate-800 p-3 shadow-xs hover:shadow-md transition flex items-center gap-3.5"
                >
                  <img
                    src={prod.image || '/bizlink-logo.png'}
                    alt={prod.name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-slate-100 dark:border-slate-800"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 mb-1">
                      Save 15%
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {prod.name}
                    </h4>
                    <p
                      className="text-sm font-black mt-0.5"
                      style={{ color: theme.secondaryColor }}
                    >
                      UGX {prod.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <a
                        href={createWhatsAppOrderLink(prod)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs"
                      >
                        <i className="fa-brands fa-whatsapp text-xs" />
                        <span>Buy Now</span>
                      </a>
                      <button
                        onClick={() => setSelectedProduct(prod)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ====================================================================
             F. MAIN PRODUCT CATALOG GRID
             ==================================================================== */}
        {isSectionActive('product_catalog') && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Shop Catalog
                </h3>
                <p className="text-xs text-slate-500">
                  Showing {displayedProducts.length} product{displayedProducts.length === 1 ? '' : 's'} available at {shop.name}
                </p>
              </div>

              {inShopSearch && (
                <div className="flex items-center gap-2 text-xs bg-blue-50 dark:bg-blue-950/50 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900 text-[#0A3D91] dark:text-[#F4B400] font-bold">
                  <span>Search results for: "{inShopSearch}"</span>
                  <button
                    onClick={() => setInShopSearch('')}
                    className="hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {displayedProducts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <i className="fa-solid fa-box-open text-4xl text-slate-300 dark:text-slate-700" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  No products matched your search
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing your search term or selecting another category filter.
                </p>
                <button
                  onClick={() => {
                    setInShopSearch('');
                    setSelectedSubCategory('All');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0A3D91] text-white text-xs font-bold cursor-pointer hover:bg-[#081426] transition"
                >
                  Reset Catalog Filters
                </button>
              </div>
            ) : (
              /* Grid dynamically adjusts based on theme.layoutStyle */
              <div
                className={`grid gap-4 sm:gap-6 ${
                  theme.layoutStyle === 'jumia_dense'
                    ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                    : theme.layoutStyle === 'boutique_showcase'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                }`}
              >
                {displayedProducts.map((product) => {
                  return (
                    <div
                      key={product.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                    >
                      {/* Image container */}
                      <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={product.image || '/bizlink-logo.png'}
                          alt={product.name}
                          className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                            theme.layoutStyle === 'boutique_showcase'
                              ? 'h-60 sm:h-72'
                              : 'h-40 sm:h-48'
                          }`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/bizlink-logo.png';
                          }}
                        />

                        {/* Stock Badge */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                          {product.inStock ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-600 text-white shadow-xs">
                              In Stock
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-600 text-white shadow-xs">
                              Out of Stock
                            </span>
                          )}
                        </div>

                        {/* Quick View Button overlay */}
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
                        >
                          <i className="fa-solid fa-eye" />
                          <span>Quick View</span>
                        </button>
                      </div>

                      {/* Details */}
                      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {product.category || shop.category}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5 leading-snug">
                            {product.name}
                          </h4>

                          {product.description && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                              {product.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                          <div className="flex items-baseline justify-between mb-2.5">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                                Price (UGX)
                              </span>
                              <span
                                className="text-sm sm:text-base font-black"
                                style={{ color: theme.secondaryColor }}
                              >
                                UGX {product.price.toLocaleString()}
                              </span>
                            </div>
                            {product.original_price && (
                              <span className="text-xs text-slate-400 line-through">
                                UGX {product.original_price.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2">
                            <a
                              href={createWhatsAppOrderLink(product)}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-xs"
                            >
                              <i className="fa-brands fa-whatsapp text-xs" />
                              <span>WhatsApp</span>
                            </a>
                            <button
                              onClick={() => setSelectedProduct(product)}
                              style={{ backgroundColor: theme.primaryColor }}
                              className="w-full py-2 rounded-xl text-white text-[11px] font-bold hover:opacity-90 transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                            >
                              <i
                                className="fa-solid fa-cart-plus text-xs"
                                style={{ color: theme.accentColor }}
                              />
                              <span>Order</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ====================================================================
             G. TRUST GUARANTEE & MOMO PAYMENT STRIP
             ==================================================================== */}
        {isSectionActive('trust_guarantee') && (
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0A3D91] dark:text-[#F4B400] flex items-center justify-center font-bold text-lg flex-shrink-0">
                  <i className="fa-solid fa-motorcycle" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Kampala Express Delivery
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Same-day boda delivery across Kampala, Wakiso, Entebbe & Mukono.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  <i className="fa-solid fa-money-bill-transfer" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    MTN MoMo & Airtel Money
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pay securely on delivery or mobile merchant till numbers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  <i className="fa-solid fa-shield-halved" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Verified Merchant
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Physical location vetted and approved by BizLink Super Admin.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  <i className="fa-solid fa-headset" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Direct Merchant Support
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Fast response via direct phone call or WhatsApp messaging.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ====================================================================
             H. ABOUT MERCHANT & PHYSICAL LOCATION
             ==================================================================== */}
        {isSectionActive('merchant_contact') && (
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      shop.logo_image ||
                      assignedTemplate?.logo ||
                      '/bizlink-logo.png'
                    }
                    alt={shop.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                  />
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      About {shop.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Operated by <strong>{shop.merchant_name}</strong> &bull; Member since 2026
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {shop.description} All items listed on this storefront are available for direct purchase with reliable dispatch. Customers are welcome to contact us via WhatsApp for custom specifications or bulk order pricing.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                    <span className="font-bold text-slate-400 text-[10px] uppercase block mb-1">
                      Physical Location
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <i className="fa-solid fa-location-dot text-red-500" />
                      {shop.location || 'Kampala, Uganda'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                    <span className="font-bold text-slate-400 text-[10px] uppercase block mb-1">
                      Opening Hours
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <i className="fa-solid fa-clock text-blue-500" />
                      Mon &ndash; Sat: 8:00 AM &ndash; 7:30 PM EAT
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-[#081426] text-white p-6 rounded-2xl space-y-4 shadow-lg text-center">
                <i className="fa-solid fa-comments text-3xl text-[#F4B400]" />
                <div>
                  <h4 className="text-base font-black">Ready to Order?</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Connect immediately with {shop.merchant_name} on WhatsApp or by phone call.
                  </p>
                </div>

                <div className="space-y-2">
                  <a
                    href={`https://wa.me/${(shop.whatsapp || '256700000000').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
                  >
                    <i className="fa-brands fa-whatsapp text-sm" />
                    <span>Chat on WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${shop.phone || '+256700000000'}`}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <i className="fa-solid fa-phone text-xs" />
                    <span>Call {shop.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ====================================================================
           I. INTERACTIVE PRODUCT DETAIL & CHECKOUT MODAL
           ==================================================================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative">
            {/* Close button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-sm" />
            </button>

            {orderPlacedSuccess ? (
              <div className="p-8 sm:p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center text-2xl animate-bounce">
                  <i className="fa-solid fa-check" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Order Successfully Placed!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Your order for <strong>{selectedProduct.name}</strong> (Qty: {quantity}) has been forwarded to <strong>{shop.name}</strong>. The merchant will call you on <strong>{customerPhone}</strong> to arrange delivery.
                </p>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300">
                  Total Payable: <strong>UGX {(selectedProduct.price * quantity).toLocaleString()}</strong>
                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Left: Product Image */}
                  <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <img
                      src={selectedProduct.image || '/bizlink-logo.png'}
                      alt={selectedProduct.name}
                      className="w-full h-64 sm:h-72 object-cover"
                    />
                  </div>

                  {/* Right: Product Details */}
                  <div className="space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                        {selectedProduct.category || shop.category}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                        {selectedProduct.name}
                      </h3>
                      <p className="text-xl font-black text-[#0A3D91] dark:text-[#F4B400] mt-1">
                        UGX {selectedProduct.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                        {selectedProduct.description ||
                          'Authentic Ugandan commercial inventory verified and stocked at the merchant store.'}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-600 dark:text-slate-400">
                          Quantity:
                        </span>
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 text-xs font-bold">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => setQuantity((q) => q + 1)}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold pt-1">
                        <span>Total Payable:</span>
                        <span className="text-sm font-black text-[#0A3D91] dark:text-[#F4B400]">
                          UGX {(selectedProduct.price * quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct WhatsApp Order Fast Option */}
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <i className="fa-brands fa-whatsapp text-2xl text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                        Fastest: Direct WhatsApp Order
                      </p>
                      <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                        Opens WhatsApp with product details prefilled for immediate reply
                      </p>
                    </div>
                  </div>
                  <a
                    href={createWhatsAppOrderLink(selectedProduct, quantity)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Send Order to WhatsApp</span>
                    <i className="fa-solid fa-arrow-right text-[11px]" />
                  </a>
                </div>

                {/* Or Complete In-App BizLink Inquiry Form */}
                <form
                  onSubmit={handleInquirySubmit}
                  className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Or Place BizLink Order Inquiry
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Kato Livingstone"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D91]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Phone / WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+256 700 000 000"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D91]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Delivery Address / Kampala Drop-off Location
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. Bukoto Street Plot 14, Kampala / Pay on delivery"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D91]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(null)}
                      className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#0A3D91] hover:bg-[#081426] text-white text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <i className="fa-solid fa-paper-plane text-[#F4B400]" />
                      <span>Confirm & Place Order</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        style={{ backgroundColor: theme.primaryColor }}
        className="text-white/80 py-8 px-4 sm:px-6 border-t-2"
        style-border-color={theme.accentColor}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <img
              src="/bizlink-logo.png"
              alt="BizLink Logo"
              className="w-8 h-8 rounded-lg bg-white p-1"
            />
            <div>
              <p className="font-bold text-white">BizLink Uganda</p>
              <p className="text-[11px] text-slate-300">
                Uganda&apos;s National Digital Commerce & Enterprise Directory
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()} BizLink Uganda &bull; Storefront for {shop.name}
          </p>
        </div>
      </footer>
    </div>
  );
};
