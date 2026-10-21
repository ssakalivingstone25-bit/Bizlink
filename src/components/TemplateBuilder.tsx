import React, { useState } from 'react';
import { ShopTemplate, TemplateSection, TemplateTheme, Shop, Product } from '../types';
import { CATEGORIES } from '../initialData';

interface TemplateBuilderProps {
  initialTemplate?: ShopTemplate | null;
  shops: Shop[];
  products: Product[];
  onSave: (template: ShopTemplate) => void;
  onCancel: () => void;
}

const PALETTE_PRESETS = [
  {
    name: 'BizLink Signature',
    primary: '#081426',
    secondary: '#0A3D91',
    accent: '#F4B400',
    bg: '#F8FAFC',
  },
  {
    name: 'Kampala Commercial',
    primary: '#0F172A',
    secondary: '#2563EB',
    accent: '#D97706',
    bg: '#F8FAFC',
  },
  {
    name: 'Nile Emerald',
    primary: '#064E3B',
    secondary: '#059669',
    accent: '#F59E0B',
    bg: '#F0FDF4',
  },
  {
    name: 'Royal Uganda',
    primary: '#1E1B4B',
    secondary: '#4F46E5',
    accent: '#F59E0B',
    bg: '#FAF5FF',
  },
  {
    name: 'Sunset Victoria',
    primary: '#4A044E',
    secondary: '#9333EA',
    accent: '#F59E0B',
    bg: '#FDF4FF',
  },
];

const DEFAULT_SECTIONS: TemplateSection[] = [
  { section_name: 'announcement', label: 'Announcement Bar', icon: 'fa-bullhorn', position: 1, active: true },
  { section_name: 'store_header', label: 'Store Header & In-Shop Search', icon: 'fa-magnifying-glass', position: 2, active: true },
  { section_name: 'hero_cover', label: 'Shop Cover & Merchant Identity', icon: 'fa-id-card', position: 3, active: true },
  { section_name: 'category_chips', label: 'Quick Category Navigation', icon: 'fa-tags', position: 4, active: true },
  { section_name: 'featured_deals', label: 'Flash Deals & Featured Showcase', icon: 'fa-bolt', position: 5, active: true },
  { section_name: 'product_catalog', label: 'Main Product Catalog Grid', icon: 'fa-cubes', position: 6, active: true },
  { section_name: 'trust_guarantee', label: 'Trust, MoMo & Delivery Strip', icon: 'fa-shield-halved', position: 7, active: true },
  { section_name: 'merchant_contact', label: 'Merchant Location & WhatsApp CTA', icon: 'fa-map-location-dot', position: 8, active: true },
];

export const TemplateBuilder: React.FC<TemplateBuilderProps> = ({
  initialTemplate,
  shops,
  products,
  onSave,
  onCancel,
}) => {
  // Basic information
  const [name, setName] = useState(initialTemplate?.name || '');
  const [category, setCategory] = useState(initialTemplate?.category || 'Beauty');
  const [customCategory, setCustomCategory] = useState(initialTemplate?.custom_category || '');
  const [description, setDescription] = useState(
    initialTemplate?.description ||
      'Production-grade e-commerce storefront tailored for high-conversion Ugandan merchant retail.'
  );
  const [price, setPrice] = useState(initialTemplate?.price ?? 120000);
  const [premium, setPremium] = useState(initialTemplate?.premium ?? true);
  const [published, setPublished] = useState(initialTemplate?.published ?? true);
  const [active, setActive] = useState(initialTemplate?.active ?? true);

  // Uploaded images state (Data URLs or existing URLs + file metadata)
  const [logoUrl, setLogoUrl] = useState<string>(initialTemplate?.logo || '');
  const [logoMeta, setLogoMeta] = useState<{ name: string; size: string } | null>(
    initialTemplate?.logo ? { name: 'Current Logo', size: 'Saved Asset' } : null
  );

  const [coverUrl, setCoverUrl] = useState<string>(
    initialTemplate?.cover_image || initialTemplate?.preview_image || ''
  );
  const [coverMeta, setCoverMeta] = useState<{ name: string; size: string } | null>(
    initialTemplate?.cover_image ? { name: 'Current Cover Banner', size: 'Saved Asset' } : null
  );

  const [promoUrl, setPromoUrl] = useState<string>(initialTemplate?.preview_image || '');
  const [promoMeta, setPromoMeta] = useState<{ name: string; size: string } | null>(null);

  // Theme styling
  const [theme, setTheme] = useState<TemplateTheme>(
    initialTemplate?.theme || {
      primaryColor: '#081426',
      secondaryColor: '#0A3D91',
      accentColor: '#F4B400',
      backgroundColor: '#F8FAFC',
      layoutStyle: 'jumia_dense',
      bannerStyle: 'contained',
      cardStyle: 'price_first',
    }
  );

  // Sections
  const [sections, setSections] = useState<TemplateSection[]>(
    initialTemplate?.sections && initialTemplate.sections.length > 0
      ? [...initialTemplate.sections].sort((a, b) => a.position - b.position)
      : [...DEFAULT_SECTIONS]
  );

  // Preview state
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewShopId, setPreviewShopId] = useState<number>(shops[0]?.id || 1);
  const [previewTab, setPreviewTab] = useState<'split' | 'editor' | 'preview'>('split');
  const [activePreviewCategory, setActivePreviewCategory] = useState('All');
  const [previewSearch, setPreviewSearch] = useState('');

  const selectedPreviewShop = shops.find((s) => s.id === previewShopId) || shops[0];
  const shopProducts = products.filter((p) => p.shop_id === selectedPreviewShop?.id);

  // File Upload Handlers (Client-side FileReader for instant preview and zero external URL requirement)
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'cover' | 'promo'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be under 5MB.');
      return;
    }

    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (type === 'logo') {
        setLogoUrl(result);
        setLogoMeta({ name: file.name, size: formattedSize });
      } else if (type === 'cover') {
        setCoverUrl(result);
        setCoverMeta({ name: file.name, size: formattedSize });
      } else if (type === 'promo') {
        setPromoUrl(result);
        setPromoMeta({ name: file.name, size: formattedSize });
      }
    };
    reader.readAsDataURL(file);
  };

  // Section manipulation
  const toggleSectionActive = (sectionName: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.section_name === sectionName ? { ...s, active: !s.active } : s
      )
    );
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // re-assign position numbers
    const updated = newSections.map((sec, idx) => ({ ...sec, position: idx + 1 }));
    setSections(updated);
  };

  const handleApplyPalette = (preset: typeof PALETTE_PRESETS[0]) => {
    setTheme((prev) => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
      backgroundColor: preset.bg,
    }));
  };

  const handleSaveSubmit = (publishStatus: boolean) => {
    if (!name.trim()) {
      alert('Please enter a Template Name before saving.');
      return;
    }

    const templateToSave: ShopTemplate = {
      id: initialTemplate?.id || Date.now(),
      name: name.trim(),
      category: category === 'Other' ? customCategory || 'Custom' : category,
      custom_category: category === 'Other' ? customCategory : undefined,
      description: description.trim(),
      price: Number(price) || 0,
      logo: logoUrl || initialTemplate?.logo || '/bizlink-logo.png',
      cover_image: coverUrl || initialTemplate?.cover_image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
      preview_image: promoUrl || coverUrl || initialTemplate?.preview_image,
      premium,
      published: publishStatus,
      active,
      theme,
      sections,
    };

    onSave(templateToSave);
  };

  // Check section visibility helper for preview
  const isSectionActive = (secName: string) => {
    const sec = sections.find((s) => s.section_name === secName);
    return sec ? sec.active : true;
  };

  return (
    <div className="space-y-6">
      {/* Top action strip */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 transition cursor-pointer"
            title="Return to Templates List"
          >
            <i className="fa-solid fa-arrow-left text-sm" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#0A3D91]/10 text-[#0A3D91] dark:bg-[#F4B400]/20 dark:text-[#F4B400]">
                {initialTemplate ? 'Edit Template' : 'New Template Builder'}
              </span>
              {premium && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <i className="fa-solid fa-crown mr-1 text-[9px]" />
                  Premium
                </span>
              )}
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {name || 'Untitled Storefront Template'}
            </h2>
          </div>
        </div>

        {/* View toggles & action buttons */}
        <div className="flex items-center gap-3">
          {/* Responsive split mode selector (mobile/tablet buttons) */}
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setPreviewTab('split')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                previewTab === 'split'
                  ? 'bg-white dark:bg-slate-900 text-[#0A3D91] dark:text-[#F4B400] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <i className="fa-solid fa-table-columns mr-1.5" />
              Split View
            </button>
            <button
              onClick={() => setPreviewTab('editor')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                previewTab === 'editor'
                  ? 'bg-white dark:bg-slate-900 text-[#0A3D91] dark:text-[#F4B400] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <i className="fa-solid fa-sliders mr-1.5" />
              Editor Only
            </button>
            <button
              onClick={() => setPreviewTab('preview')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                previewTab === 'preview'
                  ? 'bg-white dark:bg-slate-900 text-[#0A3D91] dark:text-[#F4B400] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <i className="fa-solid fa-eye mr-1.5" />
              Live Preview
            </button>
          </div>

          <button
            onClick={() => handleSaveSubmit(false)}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSaveSubmit(true)}
            className="px-5 py-2 rounded-xl bg-[#0A3D91] hover:bg-[#081426] text-white text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
          >
            <i className="fa-solid fa-rocket text-[#F4B400]" />
            Publish Template
          </button>
        </div>
      </div>

      {/* Main Grid: Editor on Left, Live Interactive Preview on Right */}
      <div
        className={`grid gap-6 ${
          previewTab === 'split'
            ? 'grid-cols-1 lg:grid-cols-12'
            : previewTab === 'editor'
            ? 'grid-cols-1 max-w-4xl mx-auto'
            : 'grid-cols-1 max-w-6xl mx-auto'
        }`}
      >
        {/* ====================================================================
             LEFT COLUMN: THE MULTI-SECTION TEMPLATE EDITOR
             ==================================================================== */}
        {(previewTab === 'split' || previewTab === 'editor') && (
          <div
            className={`space-y-6 ${
              previewTab === 'split' ? 'lg:col-span-6 xl:col-span-6' : ''
            }`}
          >
            {/* SECTION A: BASIC INFORMATION */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0A3D91] dark:text-[#F4B400] flex items-center justify-center font-bold text-sm">
                  A
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Basic Information & Pricing
                  </h3>
                  <p className="text-xs text-slate-500">
                    Template identity, Ugandan market category, and licensing fee
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Template Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kampala Fast-Retail & Delivery Hub"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D91]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Business Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D91]"
                    >
                      {CATEGORIES.filter((c) => c.id !== 'All').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                      <option value="Other">Other / Custom Category</option>
                    </select>
                  </div>

                  {category === 'Other' && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        Custom Category Name
                      </label>
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="e.g. Artisanal Crafts & Woodwork"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D91]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Template License Price (UGX)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                        UGX
                      </span>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        step="5000"
                        min="0"
                        className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0A3D91]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Storefront Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explain the storefront UX focus, target merchant type, and conversion highlights..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D91]"
                  />
                </div>

                {/* Toggles */}
                <div className="pt-2 grid grid-cols-3 gap-3 border-t border-slate-100 dark:border-slate-800">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={premium}
                      onChange={(e) => setPremium(e.target.checked)}
                      className="rounded text-[#0A3D91] focus:ring-[#0A3D91] w-4 h-4 cursor-pointer"
                    />
                    <span>Premium Tier</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="rounded text-[#0A3D91] focus:ring-[#0A3D91] w-4 h-4 cursor-pointer"
                    />
                    <span>Published</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      className="rounded text-[#0A3D91] focus:ring-[#0A3D91] w-4 h-4 cursor-pointer"
                    />
                    <span>Active System</span>
                  </label>
                </div>
              </div>
            </div>

            {/* SECTION B: SHOP BRANDING & REAL IMAGE UPLOADS */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
                  B
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Shop Branding & Device Image Uploads
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select images directly from device gallery or computer with live preview
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* 1. Shop Logo Upload */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    1. Shop Logo Avatar
                  </label>
                  <div className="flex items-center gap-4 p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                    <div className="w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-inner">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt="Logo Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <i className="fa-solid fa-store text-slate-300 text-xl" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {logoMeta ? (
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            {logoMeta.name}
                          </p>
                          <p className="text-[11px] text-slate-500">{logoMeta.size}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            Square brand logo (PNG, JPG, WebP)
                          </p>
                          <p className="text-[10px] text-slate-400">Recommended 400x400 px</p>
                        </div>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <label className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#0A3D91] text-[#0A3D91] dark:text-[#F4B400] text-xs font-bold rounded-lg cursor-pointer transition">
                          <i className="fa-solid fa-arrow-up-from-bracket mr-1" />
                          {logoUrl ? 'Replace Logo' : 'Upload From Device'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'logo')}
                            className="hidden"
                          />
                        </label>
                        {logoUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setLogoUrl('');
                              setLogoMeta(null);
                            }}
                            className="px-2.5 py-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-medium rounded-lg transition"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Shop Cover / Banner */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    2. Shop Cover Hero Banner
                  </label>
                  <div className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                    {coverUrl ? (
                      <div className="relative w-full h-28 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 mb-3 shadow-sm">
                        <img
                          src={coverUrl}
                          alt="Cover Banner"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold">
                          {coverMeta?.name || 'Cover Banner'} ({coverMeta?.size || 'Loaded'})
                        </div>
                      </div>
                    ) : (
                      <div className="h-20 flex flex-col items-center justify-center text-slate-400">
                        <i className="fa-solid fa-panorama text-2xl mb-1 text-slate-300" />
                        <span className="text-xs">No cover image uploaded</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        Wide panoramic landscape (1200x400 px recommended)
                      </span>
                      <div className="flex items-center gap-2">
                        <label className="px-3 py-1.5 bg-[#0A3D91] hover:bg-[#081426] text-white text-xs font-bold rounded-lg cursor-pointer transition shadow-sm">
                          <i className="fa-solid fa-upload mr-1.5" />
                          {coverUrl ? 'Change Banner' : 'Select Banner Image'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'cover')}
                            className="hidden"
                          />
                        </label>
                        {coverUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setCoverUrl('');
                              setCoverMeta(null);
                            }}
                            className="px-2.5 py-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-medium rounded-lg transition"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Promotional Banner / Preview Image */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    3. Promotional / Marketplace Catalog Card Preview
                  </label>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {promoUrl ? (
                          <img
                            src={promoUrl}
                            alt="Promo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <i className="fa-solid fa-image text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {promoMeta?.name || (promoUrl ? 'Card Preview Ready' : 'Optional Promo Card')}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Shown on BizLink national directory card
                        </p>
                      </div>
                    </div>
                    <label className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 hover:border-[#0A3D91] text-xs font-bold rounded-lg cursor-pointer transition">
                      <i className="fa-solid fa-plus mr-1" />
                      Browse
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'promo')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION C: THEME STYLING & STOREFRONT LAYOUT CONTROLS */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                  C
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Template Styling & Theme Controls
                  </h3>
                  <p className="text-xs text-slate-500">
                    Color palettes, e-commerce layout mode, banner style, and product cards
                  </p>
                </div>
              </div>

              {/* Color Presets */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Ugandan Commercial Palette Presets
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PALETTE_PRESETS.map((p) => {
                      const isSelected =
                        theme.primaryColor === p.primary && theme.secondaryColor === p.secondary;
                      return (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => handleApplyPalette(p)}
                          className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1.5 ${
                            isSelected
                              ? 'border-[#0A3D91] bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-[#0A3D91]/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                              style={{ backgroundColor: p.primary }}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                              style={{ backgroundColor: p.secondary }}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                              style={{ backgroundColor: p.accent }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {p.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Pickers */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Primary (Navy)
                    </label>
                    <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl p-1.5 bg-slate-50 dark:bg-slate-800">
                      <input
                        type="color"
                        value={theme.primaryColor}
                        onChange={(e) =>
                          setTheme((prev) => ({ ...prev, primaryColor: e.target.value }))
                        }
                        className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono font-bold">{theme.primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Brand Blue
                    </label>
                    <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl p-1.5 bg-slate-50 dark:bg-slate-800">
                      <input
                        type="color"
                        value={theme.secondaryColor}
                        onChange={(e) =>
                          setTheme((prev) => ({ ...prev, secondaryColor: e.target.value }))
                        }
                        className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono font-bold">{theme.secondaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Accent Gold
                    </label>
                    <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl p-1.5 bg-slate-50 dark:bg-slate-800">
                      <input
                        type="color"
                        value={theme.accentColor}
                        onChange={(e) =>
                          setTheme((prev) => ({ ...prev, accentColor: e.target.value }))
                        }
                        className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono font-bold">{theme.accentColor}</span>
                    </div>
                  </div>
                </div>

                {/* Layout Style */}
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Storefront Commerce Layout
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setTheme((prev) => ({ ...prev, layoutStyle: 'jumia_dense' }))
                      }
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        theme.layoutStyle === 'jumia_dense'
                          ? 'border-[#0A3D91] bg-blue-50/60 dark:bg-blue-950/40 font-bold text-[#0A3D91] dark:text-[#F4B400]'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-cart-shopping text-sm" />
                        <span className="text-xs font-bold">Jumia-Style Commerce</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        High product density, deal ribbons, fast purchase CTA
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setTheme((prev) => ({ ...prev, layoutStyle: 'boutique_showcase' }))
                      }
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        theme.layoutStyle === 'boutique_showcase'
                          ? 'border-[#0A3D91] bg-blue-50/60 dark:bg-blue-950/40 font-bold text-[#0A3D91] dark:text-[#F4B400]'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-gem text-sm" />
                        <span className="text-xs font-bold">Boutique Showcase</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Editorial fashion cards, bespoke measurements & WhatsApp
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setTheme((prev) => ({ ...prev, layoutStyle: 'modern_grid' }))
                      }
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        theme.layoutStyle === 'modern_grid'
                          ? 'border-[#0A3D91] bg-blue-50/60 dark:bg-blue-950/40 font-bold text-[#0A3D91] dark:text-[#F4B400]'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-table-cells text-sm" />
                        <span className="text-xs font-bold">Modern Balanced Grid</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Clean category pills, prominent verified badges
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setTheme((prev) => ({ ...prev, layoutStyle: 'minimalist' }))
                      }
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        theme.layoutStyle === 'minimalist'
                          ? 'border-[#0A3D91] bg-blue-50/60 dark:bg-blue-950/40 font-bold text-[#0A3D91] dark:text-[#F4B400]'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-feather text-sm" />
                        <span className="text-xs font-bold">Clean Minimalist</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Spacious, photography-first, streamlined typography
                      </p>
                    </button>
                  </div>
                </div>

                {/* Banner Style & Product Card Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Hero Banner Format
                    </label>
                    <select
                      value={theme.bannerStyle}
                      onChange={(e) =>
                        setTheme((prev) => ({
                          ...prev,
                          bannerStyle: e.target.value as any,
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D91]"
                    >
                      <option value="contained">Contained Hero with Merchant Card</option>
                      <option value="full_bleed">Full-Bleed Panoramic Cover</option>
                      <option value="split_bio">Split Banner & Shop Bio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Product Card Presentation
                    </label>
                    <select
                      value={theme.cardStyle}
                      onChange={(e) =>
                        setTheme((prev) => ({
                          ...prev,
                          cardStyle: e.target.value as any,
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D91]"
                    >
                      <option value="price_first">Price-First + Instant WhatsApp Buy</option>
                      <option value="standard">Standard Catalog with Discount Badges</option>
                      <option value="showcase">Showcase with Specifications & Drawer</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION D: TEMPLATE SECTIONS CONFIGURATION */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                  D
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Storefront Sections Architecture
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enable, disable, and reorder dynamic components for this merchant template
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {sections.map((sec, idx) => (
                  <div
                    key={sec.section_name}
                    className={`flex items-center justify-between p-3 rounded-xl border transition ${
                      sec.active
                        ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                        : 'bg-slate-100/40 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        {sec.icon && <i className={`fa-solid ${sec.icon} text-slate-400 text-xs`} />}
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {sec.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Move Up/Down */}
                      <button
                        type="button"
                        onClick={() => moveSection(idx, 'up')}
                        disabled={idx === 0}
                        className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 flex items-center justify-center text-xs disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <i className="fa-solid fa-chevron-up text-[10px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(idx, 'down')}
                        disabled={idx === sections.length - 1}
                        className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 flex items-center justify-center text-xs disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <i className="fa-solid fa-chevron-down text-[10px]" />
                      </button>

                      {/* Active toggle */}
                      <button
                        type="button"
                        onClick={() => toggleSectionActive(sec.section_name)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          sec.active
                            ? 'bg-[#0A3D91] text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {sec.active ? 'Active' : 'Hidden'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
             RIGHT COLUMN: LIVE INTERACTIVE STOREFRONT PREVIEW
             ==================================================================== */}
        {(previewTab === 'split' || previewTab === 'preview') && (
          <div
            className={`space-y-4 ${
              previewTab === 'split' ? 'lg:col-span-6 xl:col-span-6' : ''
            }`}
          >
            {/* Preview Toolbar */}
            <div className="bg-[#081426] text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md sticky top-4 z-20">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-mobile-screen text-[#F4B400] text-sm" />
                <span className="text-xs font-black tracking-wide uppercase">
                  Live Storefront Preview
                </span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300">
                  Real Time
                </span>
              </div>

              {/* Viewport controls */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewport('desktop')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    viewport === 'desktop'
                      ? 'bg-[#0A3D91] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Desktop 100%"
                >
                  <i className="fa-solid fa-desktop text-[11px]" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewport('tablet')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    viewport === 'tablet'
                      ? 'bg-[#0A3D91] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tablet (768px)"
                >
                  <i className="fa-solid fa-tablet-screen-button text-[11px]" />
                  <span className="hidden sm:inline">Tablet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewport('mobile')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    viewport === 'mobile'
                      ? 'bg-[#0A3D91] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Android Phone (390px)"
                >
                  <i className="fa-solid fa-mobile text-[11px]" />
                  <span className="hidden sm:inline">Mobile</span>
                </button>
              </div>

              {/* Merchant Shop Data Selector for Preview */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 hidden xl:inline">Test Shop:</span>
                <select
                  value={previewShopId}
                  onChange={(e) => setPreviewShopId(Number(e.target.value))}
                  className="bg-slate-800 text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-700 focus:outline-none"
                >
                  {shops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Simulated Device Frame Container */}
            <div className="bg-slate-300 dark:bg-slate-950 p-3 sm:p-5 rounded-2xl flex justify-center shadow-inner overflow-hidden min-h-[640px]">
              <div
                style={{
                  width:
                    viewport === 'mobile'
                      ? '390px'
                      : viewport === 'tablet'
                      ? '768px'
                      : '100%',
                  transition: 'width 0.25s ease-in-out',
                }}
                className="bg-white rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col text-slate-800 text-xs"
              >
                {/* Simulated Browser Address Bar for Mobile */}
                <div className="bg-[#081426] text-white px-3 py-1.5 flex items-center justify-between text-[11px] border-b border-black/20">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono truncate">
                      bizlink.ug/shop/{selectedPreviewShop?.id}
                    </span>
                  </div>
                  <span className="text-[#F4B400] font-bold text-[10px]">BizLink Live</span>
                </div>

                {/* STOREFRONT PREVIEW RENDERING */}
                <div
                  className="overflow-y-auto max-h-[740px]"
                  style={{ backgroundColor: theme.backgroundColor }}
                >
                  {/* 1. ANNOUNCEMENT BAR */}
                  {isSectionActive('announcement') && (
                    <div
                      style={{ backgroundColor: theme.primaryColor }}
                      className="text-white py-1.5 px-3 border-b-2"
                      style-border-color={theme.accentColor}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 font-medium truncate">
                          <i
                            className="fa-solid fa-store"
                            style={{ color: theme.accentColor }}
                          />
                          <span className="truncate">
                            Official {selectedPreviewShop?.name} Storefront &bull; Kampala, Uganda
                          </span>
                        </div>
                        <span
                          className="font-bold flex-shrink-0 ml-2"
                          style={{ color: theme.accentColor }}
                        >
                          Verified Merchant
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 2. STORE HEADER & IN-SHOP SEARCH */}
                  {isSectionActive('store_header') && (
                    <div className="bg-white border-b border-slate-200 p-3 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={logoUrl || selectedPreviewShop?.logo_image || '/bizlink-logo.png'}
                          alt="Logo"
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200 shadow-xs"
                        />
                        <div>
                          <div className="font-black text-slate-900 text-xs flex items-center gap-1">
                            {selectedPreviewShop?.name}
                            <i className="fa-solid fa-circle-check text-blue-600 text-[10px]" />
                          </div>
                          <p className="text-[10px] text-slate-500">
                            {selectedPreviewShop?.location || 'Kampala, Uganda'}
                          </p>
                        </div>
                      </div>

                      {/* Mini Search */}
                      <div className="flex-1 max-w-[220px] relative">
                        <input
                          type="text"
                          value={previewSearch}
                          onChange={(e) => setPreviewSearch(e.target.value)}
                          placeholder="Search in store..."
                          className="w-full pl-7 pr-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-[11px] focus:outline-none"
                        />
                        <i className="fa-solid fa-magnifying-glass absolute left-2 top-2 text-slate-400 text-[10px]" />
                      </div>
                    </div>
                  )}

                  {/* 3. HERO COVER & MERCHANT IDENTITY */}
                  {isSectionActive('hero_cover') && (
                    <div className="relative">
                      {/* Banner image */}
                      <div
                        className="w-full h-32 sm:h-40 bg-cover bg-center relative"
                        style={{
                          backgroundImage: `url(${
                            coverUrl ||
                            selectedPreviewShop?.cover_image ||
                            'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'
                          })`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="absolute bottom-2.5 left-3 right-3 text-white flex items-end justify-between">
                          <div>
                            <span
                              className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
                              style={{ backgroundColor: theme.accentColor, color: '#081426' }}
                            >
                              {category}
                            </span>
                            <h3 className="text-base sm:text-lg font-black text-white mt-0.5 leading-tight drop-shadow-md">
                              {selectedPreviewShop?.name}
                            </h3>
                            <p className="text-[10px] text-slate-200 line-clamp-1">
                              {description}
                            </p>
                          </div>
                          <a
                            href={`https://wa.me/${selectedPreviewShop?.whatsapp || '256700000000'}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-md"
                          >
                            <i className="fa-brands fa-whatsapp text-xs" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. QUICK CATEGORY CHIPS */}
                  {isSectionActive('category_chips') && (
                    <div className="bg-white border-b border-slate-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                      {['All', 'Beauty', 'Fashion', 'Deals'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setActivePreviewCategory(cat)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition ${
                            activePreviewCategory === cat
                              ? 'text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          style={
                            activePreviewCategory === cat
                              ? { backgroundColor: theme.secondaryColor }
                              : {}
                          }
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 5. FLASH DEALS / FEATURED SHOWCASE */}
                  {isSectionActive('featured_deals') && (
                    <div className="p-3 bg-amber-500/10 border-b border-amber-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 font-black text-xs text-amber-800 dark:text-amber-300">
                          <i className="fa-solid fa-bolt text-amber-500" />
                          <span>BizLink Verified Deals &bull; Fast Delivery</span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-700">Save up to 25%</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {shopProducts.slice(0, 2).map((p) => (
                          <div
                            key={p.id}
                            className="bg-white p-2 rounded-xl border border-amber-200/80 shadow-xs flex items-center gap-2"
                          >
                            <img
                              src={p.image || '/bizlink-logo.png'}
                              alt={p.name}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-[11px] text-slate-900 truncate">
                                {p.name}
                              </p>
                              <p
                                className="font-black text-xs"
                                style={{ color: theme.secondaryColor }}
                              >
                                UGX {p.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. MAIN PRODUCT CATALOG GRID */}
                  {isSectionActive('product_catalog') && (
                    <div className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-xs text-slate-900 uppercase tracking-wide">
                          Store Catalog ({shopProducts.length} items)
                        </h4>
                        <span className="text-[10px] text-slate-500">
                          Sorted by: Recommended
                        </span>
                      </div>

                      {/* Products Grid based on chosen cardStyle & layoutStyle */}
                      <div
                        className={`grid gap-2.5 ${
                          theme.layoutStyle === 'jumia_dense'
                            ? 'grid-cols-2 sm:grid-cols-3'
                            : theme.layoutStyle === 'boutique_showcase'
                            ? 'grid-cols-1 sm:grid-cols-2'
                            : 'grid-cols-2'
                        }`}
                      >
                        {shopProducts.map((prod) => (
                          <div
                            key={prod.id}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                          >
                            <div className="relative">
                              <img
                                src={prod.image || '/bizlink-logo.png'}
                                alt={prod.name}
                                className={`w-full object-cover ${
                                  theme.layoutStyle === 'boutique_showcase' ? 'h-36' : 'h-24'
                                }`}
                              />
                              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-600 text-white">
                                In Stock
                              </span>
                            </div>

                            <div className="p-2 space-y-1">
                              <p className="font-bold text-[11px] text-slate-900 line-clamp-1">
                                {prod.name}
                              </p>
                              <div className="flex items-center justify-between">
                                <span
                                  className="font-black text-xs"
                                  style={{ color: theme.secondaryColor }}
                                >
                                  UGX {prod.price.toLocaleString()}
                                </span>
                              </div>

                              {/* Action button */}
                              <button
                                type="button"
                                style={{ backgroundColor: theme.primaryColor }}
                                className="w-full mt-1 py-1 rounded-lg text-white text-[10px] font-bold flex items-center justify-center gap-1 hover:opacity-95"
                              >
                                <i
                                  className="fa-brands fa-whatsapp text-xs"
                                  style={{ color: theme.accentColor }}
                                />
                                <span>Order on WhatsApp</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 7. TRUST, MOMO & DELIVERY STRIP */}
                  {isSectionActive('trust_guarantee') && (
                    <div className="bg-slate-100 border-t border-b border-slate-200 p-3">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="space-y-0.5">
                          <i className="fa-solid fa-motorcycle text-blue-600 text-xs" />
                          <p className="font-bold text-[10px] text-slate-800">Kampala Delivery</p>
                          <p className="text-[9px] text-slate-500">Same-day Boda</p>
                        </div>
                        <div className="space-y-0.5">
                          <i className="fa-solid fa-money-bill-transfer text-amber-600 text-xs" />
                          <p className="font-bold text-[10px] text-slate-800">MoMo / Airtel</p>
                          <p className="text-[9px] text-slate-500">Secure Payments</p>
                        </div>
                        <div className="space-y-0.5">
                          <i className="fa-solid fa-shield-check text-emerald-600 text-xs" />
                          <p className="font-bold text-[10px] text-slate-800">Verified Seller</p>
                          <p className="text-[9px] text-slate-500">BizLink Protected</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 8. MERCHANT CONTACT & WHATSAPP CTA */}
                  {isSectionActive('merchant_contact') && (
                    <div className="p-3 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-black text-[11px] text-slate-900">
                            Need help or bulk orders?
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Speak directly with {selectedPreviewShop?.merchant_name}
                          </p>
                        </div>
                        <a
                          href={`tel:${selectedPreviewShop?.phone || '+256700000000'}`}
                          className="px-2.5 py-1 rounded-lg border border-slate-300 text-slate-700 text-[10px] font-bold"
                        >
                          <i className="fa-solid fa-phone mr-1" />
                          Call Shop
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div
                    style={{ backgroundColor: theme.primaryColor }}
                    className="p-3 text-center text-white/70 text-[10px] border-t border-black/20"
                  >
                    Powered by{' '}
                    <strong className="text-white">BizLink Uganda</strong> Marketplace
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
