import React, { useState, useMemo } from 'react';
import { Shop, Product, OrderInquiry, User } from '../types';

interface ShopDetailViewProps {
  shop: Shop;
  products: Product[];
  currentUser?: User | null;
  onBack: () => void;
  onPlaceOrder: (order: OrderInquiry) => void;
  onNavigate?: (view: string) => void;
}

export const ShopDetailView: React.FC<ShopDetailViewProps> = ({
  shop,
  products,
  currentUser,
  onBack,
  onPlaceOrder,
  onNavigate,
}) => {
  const shopProducts = useMemo(
    () => products.filter((p) => p.shop_id === shop.id),
    [products, shop.id]
  );

  // In-shop search and sorting state
  const [inShopSearch, setInShopSearch] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'name_asc'>('default');

  // Filter and sort products
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

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name_asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [shopProducts, inShopSearch, sortBy]);

  // Order Inquiry state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [quantity, setQuantity] = useState(1);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const newOrder: OrderInquiry = {
      id: `ORD-UG-${Math.floor(1000 + Math.random() * 9000)}`,
      shop_id: shop.id,
      shop_name: shop.name,
      customer_name: customerName || 'Valued Customer',
      customer_phone: customerPhone || '+256 700 000 000',
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
    setTimeout(() => {
      setSelectedProduct(null);
      setOrderPlacedSuccess(false);
      setQuantity(1);
    }, 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${shop.name}, I am contacting you through your BizLink Uganda storefront regarding your products.`
  );

  return (
    <div className="bg-[#f8fafc] text-[#1e293b] rounded-2xl overflow-hidden border border-slate-200 shadow-sm font-sans -m-4 sm:-m-6 lg:-m-8">
      {/* ====================================================================
           A. ANNOUNCEMENT BAR
           ==================================================================== */}
      <div className="bg-[#081426] text-slate-100 text-xs py-2 px-4 border-b-2 border-[#F4B400]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <i className="fa-solid fa-store text-[#F4B400]" />
            <span>Official Storefront on BizLink Uganda Marketplace</span>
            {shop.verified && (
              <span className="hidden sm:inline text-[#F4B400] ml-1">
                &bull; Verified Commercial Merchant
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <button
              onClick={onBack}
              className="hover:text-[#F4B400] transition flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left" />
              <span>All Ugandan Shops</span>
            </button>

            {currentUser && onNavigate && (
              <button
                onClick={() => onNavigate('profile')}
                className="hover:text-[#F4B400] transition flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-user" />
                <span>{currentUser.name}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ====================================================================
           B. STORE HEADER
           ==================================================================== */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Shop Brand & Logo */}
          <div className="flex items-center gap-3">
            <img
              src={shop.logo_image || '/images/bizlink-logo.png'}
              alt={shop.name}
              className="w-11 h-11 object-contain bg-white rounded-lg p-1 border border-slate-200 shadow-xs"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/bizlink-logo.png';
              }}
            />
            <div>
              <h2 className="text-lg font-extrabold text-[#081426] leading-tight flex items-center gap-1.5">
                {shop.name}
                {shop.verified && (
                  <i
                    className="fa-solid fa-circle-check text-[#007A5E] text-sm"
                    title="Verified BizLink Merchant"
                  />
                )}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                BizLink Uganda Verified Store &middot; {shop.location}
              </p>
            </div>
          </div>

          {/* In-Shop Product Search Form */}
          <div className="flex-1 max-w-md w-full order-3 md:order-2">
            <div className="relative flex items-center bg-slate-100 border border-slate-300 rounded-lg overflow-hidden focus-within:border-[#0A3D91] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0A3D91]/20 transition">
              <input
                type="text"
                value={inShopSearch}
                onChange={(e) => setInShopSearch(e.target.value)}
                placeholder={`Search products in ${shop.name}...`}
                className="w-full pl-3 pr-8 py-2 text-xs text-slate-900 bg-transparent outline-none"
              />
              {inShopSearch ? (
                <button
                  type="button"
                  onClick={() => setInShopSearch('')}
                  className="p-2 text-slate-400 hover:text-rose-500"
                >
                  <i className="fa-solid fa-xmark text-xs" />
                </button>
              ) : (
                <span className="p-2 text-slate-400">
                  <i className="fa-solid fa-magnifying-glass text-xs" />
                </span>
              )}
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 order-2 md:order-3">
            <button
              onClick={onBack}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 transition flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-globe text-[#F4B400]" />
              <span>Marketplace</span>
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================================
           C. SHOP IDENTITY & COVER
           ==================================================================== */}
      <section className="bg-gradient-to-r from-[#081426] via-[#0A3D91] to-[#007A5E] text-white p-6 sm:p-10 relative overflow-hidden">
        {/* Cover image backdrop */}
        {shop.cover_image && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 filter saturate-125"
            style={{ backgroundImage: `url(${shop.cover_image})` }}
          />
        )}

        <div className="max-w-7xl mx-auto relative z-10 flex flex-wrap items-center gap-6">
          <img
            src={shop.logo_image || '/images/bizlink-logo.png'}
            alt={shop.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white p-2 border-3 border-[#F4B400] shadow-xl object-contain shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/bizlink-logo.png';
            }}
          />

          <div className="flex-1 min-w-[280px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F4B400]/20 text-[#F4B400] border border-[#F4B400]/40 uppercase tracking-wider">
                <i className="fa-solid fa-tag text-[9px] mr-1" />
                {shop.category}
              </span>

              {shop.verified && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#007A5E] text-white flex items-center gap-1">
                  <i className="fa-solid fa-circle-check text-[9px]" /> Verified Store
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {shop.name}
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              {shop.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-200">
              <div className="flex items-center gap-1.5">
                <i className="fa-solid fa-user-tie text-[#F4B400]" />
                <span>Merchant: <strong>{shop.merchant_name}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <i className="fa-solid fa-location-dot text-rose-400" />
                <span>{shop.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <i className="fa-solid fa-boxes-stacked text-[#F4B400]" />
                <span>{shopProducts.length} Products Listed</span>
              </div>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0 w-full sm:w-auto">
            <a
              href={`https://wa.me/${shop.whatsapp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#25D366] hover:bg-[#1eb956] text-white text-xs font-bold rounded-lg shadow-md transition flex items-center justify-center gap-2"
            >
              <i className="fa-brands fa-whatsapp text-sm" />
              <span>WhatsApp Store</span>
            </a>

            <a
              href={`tel:${shop.phone}`}
              className="w-full sm:w-auto px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5"
            >
              <i className="fa-solid fa-phone text-xs" />
              <span>Call Merchant</span>
            </a>
          </div>
        </div>
      </section>

      {/* ====================================================================
           D. CATEGORY NAVIGATION
           ==================================================================== */}
      <nav className="bg-white border-b border-slate-200 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 py-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setInShopSearch('')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              !inShopSearch
                ? 'bg-[#0A3D91] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <i className="fa-solid fa-border-all mr-1.5 text-[10px]" />
            All Products ({shopProducts.length})
          </button>

          <button
            onClick={() => setInShopSearch(shop.category)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              inShopSearch.toLowerCase() === shop.category.toLowerCase()
                ? 'bg-[#0A3D91] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <i className="fa-solid fa-tag mr-1.5 text-[10px]" />
            {shop.category}
          </button>
        </div>
      </nav>

      {/* ====================================================================
           E. PROMOTIONAL BANNER
           ==================================================================== */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="bg-white border border-slate-200 border-l-4 border-l-[#F4B400] rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-[#081426] flex items-center justify-center text-lg shrink-0">
              <i className="fa-solid fa-shield-halved text-[#F4B400]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#081426]">
                BizLink Uganda Verified Merchant Guarantee
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                All items in {shop.name} are backed by direct seller communication and authentic local trade fulfillment.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#0A3D91] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            Authentic Local Commerce
          </span>
        </div>
      </div>

      {/* ====================================================================
           F. PRODUCT DISCOVERY & LISTING
           ==================================================================== */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Discovery Toolbar */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 sm:px-5 sm:py-3.5 mb-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="text-xs sm:text-sm font-semibold text-slate-700">
            Showing <strong className="text-[#081426]">{displayedProducts.length}</strong>{' '}
            {displayedProducts.length === 1 ? 'product' : 'products'}
            {inShopSearch && (
              <span className="text-slate-400 font-normal ml-2">
                for search: <em>"{inShopSearch}"</em>
              </span>
            )}
          </div>

          {/* Real In-Shop Sort */}
          <div className="flex items-center gap-2 text-xs">
            <label htmlFor="shop-sort" className="text-slate-500 font-semibold">
              Sort By:
            </label>
            <select
              id="shop-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0A3D91] cursor-pointer"
            >
              <option value="default">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Product Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* ================================================================
             G. PRODUCT GRID & PRODUCT CARDS
             ================================================================ */}
        {displayedProducts.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center">
            <i className="fa-solid fa-boxes-packing text-4xl text-slate-400 mb-3" />
            <h3 className="text-base font-extrabold text-[#081426]">
              No Products Found
            </h3>
            {inShopSearch ? (
              <p className="text-xs text-slate-500 mt-1">
                No products in {shop.name} matched your search for "{inShopSearch}".
              </p>
            ) : (
              <p className="text-xs text-slate-500 mt-1">
                {shop.name} has not added products to this category yet.
              </p>
            )}
            <button
              onClick={() => setInShopSearch('')}
              className="mt-4 px-4 py-2 bg-[#0A3D91] hover:bg-[#082d6d] text-white text-xs font-bold rounded-lg cursor-pointer transition"
            >
              Clear Search Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayedProducts.map((product) => (
              <article
                key={product.id}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md hover:border-slate-300 transition duration-200"
              >
                {/* Product Media */}
                <div className="w-full h-52 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-3 relative overflow-hidden">
                  <img
                    src={product.image || '/images/bizlink-logo.png'}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain transition duration-300 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/bizlink-logo.png';
                    }}
                  />
                  {product.inStock && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[9px] font-bold bg-[#007A5E] text-white shadow-xs">
                      In Stock
                    </span>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className="font-bold text-sm text-[#081426] line-clamp-2 min-h-[38px] leading-tight"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    {product.description && (
                      <p
                        className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed"
                        title={product.description}
                      >
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* Price & Primary Action */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        Price
                      </span>
                      <span className="text-base font-black text-[#0A3D91] leading-none mt-0.5">
                        <span className="text-xs font-bold mr-1">UGX</span>
                        {product.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="px-3.5 py-2 bg-[#0A3D91] hover:bg-[#081426] text-white rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <i className="fa-solid fa-cart-shopping text-xs" />
                      <span>Inquire</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* ====================================================================
           H. STORE INFORMATION SECTION
           ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
            <i className="fa-solid fa-circle-info text-[#0A3D91] text-base" />
            <h3 className="text-sm font-extrabold text-[#081426]">
              About {shop.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div>
              <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                Merchant Proprietor
              </h4>
              <p className="text-slate-800 font-semibold text-sm">
                {shop.merchant_name}
              </p>
              <p className="text-slate-500 mt-0.5">
                Registered Merchant on BizLink Uganda Network
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                Verification & Trust
              </h4>
              <div className="flex items-center gap-1.5 text-[#007A5E] font-bold">
                <i className="fa-solid fa-circle-check" />
                <span>Verified Commercial Store</span>
              </div>
              <p className="text-slate-500 mt-0.5">
                Operating under BizLink merchant compliance guidelines.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                Direct Contact & Inquiries
              </h4>
              <p className="text-slate-700 font-medium">
                Phone: <strong>{shop.phone}</strong><br />
                Location: <strong>{shop.location}</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
           I. FOOTER
           ==================================================================== */}
      <footer className="bg-[#081426] text-slate-300 border-t-3 border-[#0A3D91] pt-8 pb-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-white/10 text-xs">
          <div>
            <h4 className="text-base font-black text-white">
              BizLink <span className="text-[#F4B400]">Uganda</span>
            </h4>
            <p className="text-slate-400 mt-2 leading-relaxed">
              Connecting trusted businesses, certified merchants, and shoppers across Uganda.
              Building the digital future of Ugandan commerce.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-2">
              Marketplace Navigation
            </h5>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={onBack}
                  className="hover:text-[#F4B400] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <i className="fa-solid fa-store text-xs" />
                  <span>All Ugandan Stores</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onBack}
                  className="hover:text-[#F4B400] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <i className="fa-solid fa-tags text-xs" />
                  <span>Explore Categories</span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-2">
              Customer Services
            </h5>
            <ul className="space-y-1.5 text-slate-400">
              <li>Verified merchant order dispatch</li>
              <li>Direct WhatsApp communication</li>
              <li>Kampala, Jinja, Entebbe, Mbarara regional delivery</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>&copy; BizLink Uganda &mdash; Storefront for {shop.name}. All Rights Reserved.</span>
          <span>Verified Local Commerce</span>
        </div>
      </footer>

      {/* Order Inquiry Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <i className="fa-solid fa-xmark text-base" />
            </button>

            {orderPlacedSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center text-xl">
                  <i className="fa-solid fa-check" />
                </div>
                <h3 className="text-base font-bold text-[#081426]">
                  Order Inquiry Submitted!
                </h3>
                <p className="text-xs text-slate-500">
                  {shop.name} has received your inquiry for{' '}
                  <strong>{selectedProduct.name}</strong> and will follow up with you directly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
                <div>
                  <span className="font-bold text-[#F4B400] uppercase tracking-wider text-[10px] block">
                    Product Inquiry & Order
                  </span>
                  <h3 className="text-base font-black text-[#081426] mt-0.5">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    Store: <strong>{shop.name}</strong>
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-600">Unit Price:</span>
                  <span className="font-black text-[#0A3D91] text-sm">
                    UGX {selectedProduct.price.toLocaleString()}
                  </span>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. David Sakalund"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#0A3D91]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">
                    Your WhatsApp or Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. +256 772 000 000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#0A3D91]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded bg-slate-100 text-slate-700 font-bold"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm w-6 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 rounded bg-slate-100 text-slate-700 font-bold"
                    >
                      +
                    </button>
                    <span className="text-slate-500 ml-auto font-semibold">
                      Total: <strong className="text-[#0A3D91] text-sm">UGX {(selectedProduct.price * quantity).toLocaleString()}</strong>
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0A3D91] hover:bg-[#081426] text-white rounded-lg font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <i className="fa-solid fa-paper-plane text-xs" />
                    Submit Inquiry to {shop.name}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
