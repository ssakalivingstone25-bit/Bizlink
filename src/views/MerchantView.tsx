import React, { useState } from 'react';
import { User, Shop, Product, OrderInquiry } from '../types';

interface MerchantViewProps {
  currentUser: User | null;
  shops: Shop[];
  products: Product[];
  orders: OrderInquiry[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onToggleProductStock: (productId: number) => void;
  onUpdateOrderStatus: (orderId: string, status: 'pending' | 'confirmed' | 'delivered') => void;
  onUpdateShopInfo: (shopId: number, updates: Partial<Shop>) => void;
  onViewShop: (shop: Shop) => void;
}

export const MerchantView: React.FC<MerchantViewProps> = ({
  currentUser,
  shops,
  products,
  orders,
  onAddProduct,
  onDeleteProduct,
  onToggleProductStock,
  onUpdateOrderStatus,
  onUpdateShopInfo,
  onViewShop,
}) => {
  // Find shop for this merchant
  const merchantShop =
    shops.find((s) => s.merchant_id === currentUser?.id) || shops[0];
  const merchantProducts = products.filter(
    (p) => p.shop_id === merchantShop?.id
  );
  const merchantOrders = orders.filter(
    (o) => o.shop_id === merchantShop?.id
  );

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'shop'>('products');
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Add Product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(30000);
  const [newProdCategory, setNewProdCategory] = useState(merchantShop?.category || 'Beauty');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');

  // Edit Shop form state
  const [shopName, setShopName] = useState(merchantShop?.name || '');
  const [shopDesc, setShopDesc] = useState(merchantShop?.description || '');
  const [shopPhone, setShopPhone] = useState(merchantShop?.phone || '');
  const [shopWhatsapp, setShopWhatsapp] = useState(merchantShop?.whatsapp || '');
  const [shopLocation, setShopLocation] = useState(merchantShop?.location || '');
  const [shopSavedNotice, setShopSavedNotice] = useState(false);

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !merchantShop) return;

    const newProduct: Product = {
      id: Date.now(),
      shop_id: merchantShop.id,
      name: newProdName,
      price: Number(newProdPrice) || 10000,
      category: newProdCategory,
      description: newProdDesc || 'Locally verified Ugandan merchant product.',
      image:
        newProdImage ||
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
      inStock: true,
      featured: false,
    };

    onAddProduct(newProduct);
    setNewProdName('');
    setNewProdDesc('');
    setNewProdImage('');
    setShowAddProductModal(false);
  };

  const handleShopSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantShop) return;

    onUpdateShopInfo(merchantShop.id, {
      name: shopName,
      description: shopDesc,
      phone: shopPhone,
      whatsapp: shopWhatsapp,
      location: shopLocation,
    });

    setShopSavedNotice(true);
    setTimeout(() => setShopSavedNotice(false), 2500);
  };

  const totalRevenue = merchantOrders.reduce((sum, o) => sum + o.total_ugx, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome Banner matching merchant.html */}
      <div className="bg-gradient-to-r from-[#081426] via-[#0A3D91] to-[#041E42] text-white p-8 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <i className="fa-solid fa-store" />
            Merchant Operations Center
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Welcome to BizLink Merchant Dashboard
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Hello, <strong className="text-amber-400">{currentUser?.name || 'David'}</strong> &mdash; Managing{' '}
            <strong className="text-white underline">{merchantShop?.name || 'My Shop'}</strong>
          </p>
        </div>

        {merchantShop && (
          <button
            onClick={() => onViewShop(merchantShop)}
            className="relative z-10 px-5 py-3 rounded-2xl bg-[#F4B400] hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <i className="fa-solid fa-arrow-up-right-from-square" />
            Preview Customer Storefront
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-[#0A3D91] dark:text-blue-400 flex items-center justify-center text-xl shrink-0">
            <i className="fa-solid fa-box" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {merchantProducts.length}
            </h3>
            <p className="text-xs text-slate-400">Total Products</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-[#F4B400] flex items-center justify-center text-xl shrink-0">
            <i className="fa-solid fa-clock" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {merchantOrders.filter((o) => o.status === 'pending').length}
            </h3>
            <p className="text-xs text-slate-400">Pending Orders</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl shrink-0">
            <i className="fa-solid fa-circle-check" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {merchantOrders.length}
            </h3>
            <p className="text-xs text-slate-400">Total Orders</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-xl shrink-0">
            <i className="fa-solid fa-money-bill-wave" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              UGX {totalRevenue.toLocaleString()}
            </h3>
            <p className="text-xs text-slate-400">Inquired Value</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-sm font-bold gap-4">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'products'
              ? 'border-[#0A3D91] text-[#0A3D91] dark:border-[#F4B400] dark:text-[#F4B400]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <i className="fa-solid fa-boxes-stacked" />
          Products & Inventory ({merchantProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'orders'
              ? 'border-[#0A3D91] text-[#0A3D91] dark:border-[#F4B400] dark:text-[#F4B400]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <i className="fa-solid fa-cart-shopping" />
          Customer Inquiries & Orders ({merchantOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('shop')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'shop'
              ? 'border-[#0A3D91] text-[#0A3D91] dark:border-[#F4B400] dark:text-[#F4B400]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <i className="fa-solid fa-sliders" />
          Shop Profile & Contact Settings
        </button>
      </div>

      {/* Tab: Products */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-lg text-slate-900 dark:text-white">
              Storefront Product Inventory
            </h3>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 bg-[#0A3D91] hover:bg-[#072d6d] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <i className="fa-solid fa-plus" />
              Add Product
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-5 font-bold">Product</th>
                    <th className="py-3 px-5 font-bold">Category</th>
                    <th className="py-3 px-5 font-bold">Price (UGX)</th>
                    <th className="py-3 px-5 font-bold">Stock Status</th>
                    <th className="py-3 px-5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {merchantProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-4 px-5 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <img
                          src={prod.image || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=100&q=80'}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div>{prod.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal line-clamp-1 max-w-xs">
                            {prod.description}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-slate-500">{prod.category}</td>
                      <td className="py-4 px-5 font-extrabold text-[#0A3D91] dark:text-[#F4B400]">
                        UGX {prod.price.toLocaleString()}
                      </td>
                      <td className="py-4 px-5">
                        <button
                          onClick={() => onToggleProductStock(prod.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                            prod.inStock
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                              : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                          }`}
                        >
                          {prod.inStock ? 'In Stock (Click to toggle)' : 'Out of Stock'}
                        </button>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => onDeleteProduct(prod.id)}
                          className="text-rose-500 hover:text-rose-700 p-1.5 hover:bg-rose-500/10 rounded-lg transition"
                          title="Delete Product"
                        >
                          <i className="fa-solid fa-trash-can" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Product Modal */}
          {showAddProductModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <i className="fa-solid fa-xmark" />
                </button>

                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
                  Add New Product to Store
                </h3>

                <form onSubmit={handleAddProductSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="e.g. Pure Shea Butter Soap"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0A3D91]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                        Price (UGX)
                      </label>
                      <input
                        type="number"
                        required
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                        Category
                      </label>
                      <input
                        type="text"
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      placeholder="Details on product size, ingredients, usage..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Product Photo URL
                    </label>
                    <input
                      type="url"
                      value={newProdImage}
                      onChange={(e) => setNewProdImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#0A3D91] hover:bg-[#082e6d] text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                    >
                      Publish Product to Storefront
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="font-black text-lg text-slate-900 dark:text-white">
            Customer Inquiries & Order Requests
          </h3>

          {merchantOrders.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900">
              <i className="fa-solid fa-inbox text-4xl text-slate-400 mb-3" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                No orders or customer inquiries yet.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                When buyers order products from your storefront, they appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {merchantOrders.map((ord) => (
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
                      Customer: {ord.customer_name}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <a
                        href={`tel:${ord.customer_phone}`}
                        className="text-blue-500 hover:underline flex items-center gap-1"
                      >
                        <i className="fa-solid fa-phone text-xs" />
                        {ord.customer_phone}
                      </a>
                    </div>

                    <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                      <strong>Items: </strong>
                      {ord.items.map((i) => `${i.quantity}x ${i.product_name} (UGX ${i.price.toLocaleString()})`).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-semibold">Total Value:</span>
                      <span className="text-base font-black text-[#0A3D91] dark:text-[#F4B400]">
                        UGX {ord.total_ugx.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          onUpdateOrderStatus(
                            ord.id,
                            e.target.value as 'pending' | 'confirmed' | 'delivered'
                          )
                        }
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Shop Profile Settings */}
      {activeTab === 'shop' && merchantShop && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl">
          <h3 className="font-black text-xl text-slate-900 dark:text-white mb-2">
            Storefront Settings & Details
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Configure how your shop appears to buyers across Uganda
          </p>

          {shopSavedNotice && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20 flex items-center gap-2">
              <i className="fa-solid fa-circle-check" />
              Shop settings updated successfully!
            </div>
          )}

          <form onSubmit={handleShopSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Shop Name
              </label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Business Bio / Description
              </label>
              <textarea
                rows={3}
                value={shopDesc}
                onChange={(e) => setShopDesc(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={shopPhone}
                  onChange={(e) => setShopPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  WhatsApp Number (with country code, e.g. 256772...)
                </label>
                <input
                  type="text"
                  value={shopWhatsapp}
                  onChange={(e) => setShopWhatsapp(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Physical Location / Market
              </label>
              <input
                type="text"
                value={shopLocation}
                onChange={(e) => setShopLocation(e.target.value)}
                placeholder="e.g. Ntinda Shopping Centre, Kampala"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0A3D91] hover:bg-[#072c69] text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
