import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface AuthViewProps {
  users: User[];
  onLoginSuccess: (user: User) => void;
  onRegisterSuccess: (newUser: User) => void;
  onClose: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  users,
  onLoginSuccess,
  onRegisterSuccess,
  onClose,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('ssakalivingstone25@gmail.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('merchant');
  const [regPhone, setRegPhone] = useState('');
  const [regError, setRegError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const found = users.find(
      (u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (found) {
      onLoginSuccess(found);
    } else {
      setLoginError('Invalid email or password. Please try a registered email or select one below.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName || !regEmail || !regPassword) {
      setRegError('Please fill in all required fields.');
      return;
    }

    const exists = users.find(
      (u) => u.email.toLowerCase() === regEmail.trim().toLowerCase()
    );

    if (exists) {
      setRegError('This email is already registered in BizLink Uganda.');
      return;
    }

    const newUser: User = {
      id: Date.now(),
      name: regName,
      email: regEmail,
      role: regRole,
      phone: regPhone || '+256 700 000 000',
      location: 'Kampala, Uganda',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      approved: regRole === 'customer',
    };

    onRegisterSuccess(newUser);
  };

  const quickLoginAs = (user: User) => {
    onLoginSuccess(user);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      {/* Container card matching auth.html .container */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200 dark:border-slate-800 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition"
          title="Close dialog"
        >
          <i className="fa-solid fa-xmark text-sm" />
        </button>

        {/* Left Side: Brand Panel matching auth.html .left */}
        <div className="md:w-5/12 bg-gradient-to-b from-[#081426] via-[#0A3D91] to-[#041E42] text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-20 h-20 bg-white rounded-2xl p-2 shadow-xl border-2 border-amber-400 mb-6 flex items-center justify-center">
              <img
                src="/images/bizlink-logo.png"
                alt="BizLink Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              BizLink <span className="text-[#F4B400]">Uganda</span>
            </h2>

            <p className="text-amber-300 text-sm mt-1 font-medium">
              Connecting Businesses. Building Futures.
            </p>

            <p className="text-xs text-slate-300 mt-4 leading-relaxed">
              Uganda's verified commercial directory, merchant storefront network, and local trade platform.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-[#F4B400]" />
                <span>Verified Ugandan merchants & shops</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-[#F4B400]" />
                <span>Seamless WhatsApp order inquiries</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-[#F4B400]" />
                <span>Super Admin oversight & shop templates</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 text-[11px] text-slate-400">
            Powered by BizLink Uganda Commerce Engine
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="md:w-7/12 p-8 sm:p-10 flex flex-col justify-center bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
            <button
              onClick={() => setTab('login')}
              className={`pb-3 text-sm font-bold transition border-b-2 cursor-pointer flex items-center gap-2 px-3 ${
                tab === 'login'
                  ? 'border-[#0A3D91] text-[#0A3D91] dark:border-[#F4B400] dark:text-[#F4B400]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <i className="fa-solid fa-arrow-right-to-bracket" />
              Sign In
            </button>
            <button
              onClick={() => setTab('register')}
              className={`pb-3 text-sm font-bold transition border-b-2 cursor-pointer flex items-center gap-2 px-3 ${
                tab === 'register'
                  ? 'border-[#0A3D91] text-[#0A3D91] dark:border-[#F4B400] dark:text-[#F4B400]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <i className="fa-solid fa-user-plus" />
              Create Account
            </button>
          </div>

          {/* Quick Demo Logins Box (From bizlink.db) */}
          <div className="mb-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Quick Test Accounts (From bizlink.db)</span>
              <span className="text-[10px] text-amber-500 font-semibold">1-Click Login</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  const u = users.find((x) => x.role === 'super_admin');
                  if (u) quickLoginAs(u);
                }}
                className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition cursor-pointer"
              >
                <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 truncate">
                  SSAKA (Admin)
                </div>
                <div className="text-[9px] text-slate-500 truncate">Super Admin</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  const u = users.find((x) => x.role === 'merchant');
                  if (u) quickLoginAs(u);
                }}
                className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-left transition cursor-pointer"
              >
                <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 truncate">
                  David (Store)
                </div>
                <div className="text-[9px] text-slate-500 truncate">Merchant</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  const u = users.find((x) => x.role === 'customer');
                  if (u) quickLoginAs(u);
                }}
                className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left transition cursor-pointer"
              >
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 truncate">
                  David (Customer)
                </div>
                <div className="text-[9px] text-slate-500 truncate">Customer</div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 text-xs bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg flex items-center gap-2">
                  <i className="fa-solid fa-triangle-exclamation" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. ssakalivingstone25@gmail.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-[#0A3D91] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-[#0A3D91] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#0A3D91] hover:bg-[#082f70] text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-900/20 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <i className="fa-solid fa-right-to-bracket" />
                Sign In to BizLink
              </button>
            </form>
          ) : (
            /* Register Form matching register.html */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {regError && (
                <div className="p-3 text-xs bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg flex items-center gap-2">
                  <i className="fa-solid fa-triangle-exclamation" />
                  <span>{regError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Full Name / Business Name
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Mukasa Livingstone"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-[#0A3D91] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. name@example.ug"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-[#0A3D91] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Account Role
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-[#0A3D91] outline-none cursor-pointer"
                  >
                    <option value="merchant">Merchant (Shop Owner)</option>
                    <option value="customer">Customer / Buyer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+256 700..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-[#0A3D91] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-[#0A3D91] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#2E8B57] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <i className="fa-solid fa-user-check" />
                Register Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
