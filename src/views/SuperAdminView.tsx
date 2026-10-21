import React, { useState } from 'react';
import { User, Shop, Product, ShopTemplate, OrderInquiry } from '../types';
import { CATEGORIES } from '../initialData';

interface SuperAdminViewProps {
  currentUser: User | null;
  users: User[];
  shops: Shop[];
  products: Product[];
  templates: ShopTemplate[];
  orders: OrderInquiry[];
  onToggleMerchantApproval: (userId: number) => void;
  onToggleShopActive: (shopId: number) => void;
  onCreateTemplate: (template: ShopTemplate) => void;
}

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({
  currentUser,
  users,
  shops,
  products,
  templates,
  orders,
  onToggleMerchantApproval,
  onToggleShopActive,
  onCreateTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'merchants' | 'templates'>('overview');

  // Metrics matching dashboard.html
  const totalCustomers = users.filter((u) => u.role === 'customer').length;
  const totalMerchants = users.filter((u) => u.role === 'merchant').length;
  const approvedShops = shops.filter((s) => s.active).length;
  const pendingApprovals = users.filter((u) => u.role === 'merchant' && !u.approved).length;
  const totalProducts = products.length;
  const totalOrders = orders.length;

  // New template form state
  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState('Beauty');
  const [templateDesc, setTemplateDesc] = useState('');
  const [templatePrice, setTemplatePrice] = useState(100000);
  const [templatePremium, setTemplatePremium] = useState(true);
  const [templatePublished, setTemplatePublished] = useState(true);
  const [templateImage, setTemplateImage] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const handleCreateTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName) return;

    const newTpl: ShopTemplate = {
      id: Date.now(),
      name: templateName,
      category: templateCategory,
      description: templateDesc || 'Custom theme template created for Ugandan enterprise storefronts.',
      price: Number(templatePrice) || 50000,
      preview_image: templateImage || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
      premium: templatePremium,
      published: templatePublished,
      active: true,
    };

    onCreateTemplate(newTpl);
    setTemplateName('');
    setTemplateDesc('');
    setTemplateImage('');
    setShowTemplateModal(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header matching dashboard.html .header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Welcome, <span className="text-[#0A3D91] dark:text-[#F4B400]">{currentUser?.name || 'SSAKA LIVINGSTONE'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            BizLink Super Administration & National Portal Operations
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-900 text-[#0A3D91] dark:text-[#F4B400] shadow'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('merchants')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'merchants'
                ? 'bg-white dark:bg-slate-900 text-[#0A3D91] dark:text-[#F4B400] shadow'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Merchants ({totalMerchants})
            {pendingApprovals > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-white dark:bg-slate-900 text-[#0A3D91] dark:text-[#F4B400] shadow'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Shop Templates ({templates.length})
          </button>
        </div>
      </div>

      {/* KPI Cards matching dashboard.html .cards & .card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Customers */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-[#F4B400] flex items-center justify-center text-2xl shrink-0">
            <i className="fa-solid fa-user" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{totalCustomers}</h2>
            <p className="text-xs text-slate-400 font-medium">Total Customers</p>
          </div>
        </div>

        {/* Total Merchants */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-[#0A3D91] dark:text-blue-400 flex items-center justify-center text-2xl shrink-0">
            <i className="fa-solid fa-store" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{totalMerchants}</h2>
            <p className="text-xs text-slate-400 font-medium">Total Merchants</p>
          </div>
        </div>

        {/* Approved Shops */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl shrink-0">
            <i className="fa-solid fa-circle-check" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{approvedShops}</h2>
            <p className="text-xs text-slate-400 font-medium">Approved Shops</p>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-[#F4B400] flex items-center justify-center text-2xl shrink-0">
            <i className="fa-solid fa-clock" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{pendingApprovals}</h2>
            <p className="text-xs text-slate-400 font-medium">Pending Approvals</p>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-2xl shrink-0">
            <i className="fa-solid fa-box" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{totalProducts}</h2>
            <p className="text-xs text-slate-400 font-medium">Total Products</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-2xl shrink-0">
            <i className="fa-solid fa-cart-shopping" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{totalOrders}</h2>
            <p className="text-xs text-slate-400 font-medium">Total Orders</p>
          </div>
        </div>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders Stream */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <i className="fa-solid fa-bolt text-[#F4B400]" />
                Recent Marketplace Activity
              </h3>
              <span className="text-xs text-slate-400">Live feeds</span>
            </div>

            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {ord.customer_name} &rarr; <span className="text-[#0A3D91] dark:text-amber-400">{ord.shop_name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {ord.items.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-slate-900 dark:text-white block">
                      UGX {ord.total_ugx.toLocaleString()}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-semibold uppercase">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Platform Controls */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-sliders text-[#0A3D91] dark:text-[#F4B400]" />
              Super Admin Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
              <button
                onClick={() => {
                  setActiveTab('templates');
                  setShowTemplateModal(true);
                }}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-left border border-slate-200 dark:border-slate-700 transition cursor-pointer flex flex-col justify-between h-28"
              >
                <i className="fa-solid fa-plus-circle text-xl text-purple-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-white">New Shop Template</div>
                  <div className="text-[10px] text-slate-400 font-normal">Add theme for merchants</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('merchants')}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-left border border-slate-200 dark:border-slate-700 transition cursor-pointer flex flex-col justify-between h-28"
              >
                <i className="fa-solid fa-user-check text-xl text-emerald-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-white">Review Merchants</div>
                  <div className="text-[10px] text-slate-400 font-normal">{pendingApprovals} pending verification</div>
                </div>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <i className="fa-solid fa-circle-info" />
                Ugandan Business Directory Status
              </div>
              All SQLite database records from <code className="font-mono">bizlink.db</code> (Users, David Store, Templates) are loaded and active.
            </div>
          </div>
        </div>
      )}

      {/* Tab: Merchants Management */}
      {activeTab === 'merchants' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                Registered Merchants Management
              </h3>
              <p className="text-xs text-slate-500">
                Approve, verify, or suspend merchant storefront accounts
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-5 font-bold">Merchant Name</th>
                  <th className="py-3 px-5 font-bold">Email / Contact</th>
                  <th className="py-3 px-5 font-bold">Location</th>
                  <th className="py-3 px-5 font-bold">Associated Shop</th>
                  <th className="py-3 px-5 font-bold">Approval Status</th>
                  <th className="py-3 px-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users
                  .filter((u) => u.role === 'merchant')
                  .map((merchant) => {
                    const shop = shops.find((s) => s.merchant_id === merchant.id);
                    return (
                      <tr key={merchant.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-4 px-5 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                          <img
                            src={merchant.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
                            alt={merchant.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span>{merchant.name}</span>
                        </td>
                        <td className="py-4 px-5 text-slate-600 dark:text-slate-300">
                          <div>{merchant.email}</div>
                          <div className="text-[10px] text-slate-400">{merchant.phone}</div>
                        </td>
                        <td className="py-4 px-5 text-slate-500">
                          {merchant.location || 'Kampala, Uganda'}
                        </td>
                        <td className="py-4 px-5 font-semibold text-slate-700 dark:text-slate-200">
                          {shop ? (
                            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                              <i className="fa-solid fa-store text-xs" />
                              {shop.name}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">No shop created yet</span>
                          )}
                        </td>
                        <td className="py-4 px-5">
                          {merchant.approved ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <i className="fa-solid fa-circle-check" /> Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              <i className="fa-solid fa-clock" /> Pending Review
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-right space-x-2">
                          <button
                            onClick={() => onToggleMerchantApproval(merchant.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                              merchant.approved
                                ? 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20'
                                : 'bg-emerald-600 text-white hover:bg-emerald-500'
                            }`}
                          >
                            {merchant.approved ? 'Suspend' : 'Approve'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Templates matching admin_templates.html */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-xl text-slate-900 dark:text-white">
                Shop Templates Builder
              </h3>
              <p className="text-xs text-slate-500">
                Design and publish store templates that merchants can apply to their storefronts
              </p>
            </div>

            <button
              onClick={() => setShowTemplateModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#0A3D91] hover:bg-[#072d6d] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <i className="fa-solid fa-plus" />
              Create New Template
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="h-44 bg-slate-800 relative">
                  <img
                    src={tpl.preview_image || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80'}
                    alt={tpl.name}
                    className="w-full h-full object-cover"
                  />
                  {tpl.premium && (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#F4B400] text-slate-950 shadow">
                      PREMIUM
                    </span>
                  )}
                  <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded text-[10px] font-bold bg-black/60 backdrop-blur text-white">
                    {tpl.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {tpl.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-black text-sm text-[#0A3D91] dark:text-[#F4B400]">
                      UGX {tpl.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                      {tpl.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal matching admin_templates.html */}
          {showTemplateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <i className="fa-solid fa-xmark text-lg" />
                </button>

                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">
                  Create New Shop Template
                </h3>

                <form onSubmit={handleCreateTemplateSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Template Name
                    </label>
                    <input
                      type="text"
                      required
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="e.g. Kampala Modern Artisan"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0A3D91]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                        Business Category
                      </label>
                      <select
                        value={templateCategory}
                        onChange={(e) => setTemplateCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none cursor-pointer"
                      >
                        {CATEGORIES.filter((c) => c.id !== 'All').map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                        Price (UGX)
                      </label>
                      <input
                        type="number"
                        value={templatePrice}
                        onChange={(e) => setTemplatePrice(Number(e.target.value))}
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
                      value={templateDesc}
                      onChange={(e) => setTemplateDesc(e.target.value)}
                      placeholder="Describe target businesses, layout highlights..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Preview Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={templateImage}
                      onChange={(e) => setTemplateImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-6 text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={templatePremium}
                        onChange={(e) => setTemplatePremium(e.target.checked)}
                        className="rounded text-[#0A3D91]"
                      />
                      <span>Premium Template</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={templatePublished}
                        onChange={(e) => setTemplatePublished(e.target.checked)}
                        className="rounded text-[#0A3D91]"
                      />
                      <span>Publish immediately</span>
                    </label>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#0A3D91] hover:bg-[#082e6d] text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                    >
                      Save Template to Database
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
