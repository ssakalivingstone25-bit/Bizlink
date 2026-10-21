import React, { useState } from 'react';
import { User } from '../types';

interface ProfileViewProps {
  currentUser: User | null;
  onUpdateUser: (updated: Partial<User>) => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onUpdateUser,
  onNavigate,
  onLogout,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-400">Please sign in to view your profile.</p>
        <button
          onClick={() => onNavigate('marketplace')}
          className="mt-4 px-4 py-2 bg-[#0A3D91] text-white rounded-xl text-xs font-bold"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      phone,
      location,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      {/* Top Bar matching profile.html */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('marketplace')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left" />
          Back to Marketplace
        </button>

        <span className="text-xs font-mono text-slate-400">
          User ID: #{currentUser.id}
        </span>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-xl border border-emerald-500/20 flex items-center gap-2">
          <i className="fa-solid fa-circle-check" />
          Profile updated successfully!
        </div>
      )}

      {/* Profile Card matching profile.html .profile-card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
        <div className="h-24 w-full bg-gradient-to-r from-[#081426] via-[#0A3D91] to-[#2E8B57] absolute top-0 left-0" />

        <div className="relative pt-8">
          <div className="w-24 h-24 mx-auto rounded-full p-1 bg-white dark:bg-slate-900 shadow-xl border-4 border-amber-400 overflow-hidden relative">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={currentUser.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <h2 className="mt-4 text-2xl font-black text-slate-900 dark:text-white">
            {currentUser.name}
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {currentUser.email}
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F4B400]/20 text-amber-700 dark:text-[#F4B400] border border-[#F4B400]/40 uppercase tracking-wider">
            <i className="fa-solid fa-shield" />
            {currentUser.role.replace('_', ' ')}
          </div>
        </div>

        {/* Details list */}
        {!isEditing ? (
          <div className="mt-8 text-left divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-400 font-semibold">Account Role</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">
                {currentUser.role}
              </span>
            </div>

            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-400 font-semibold">Phone / WhatsApp</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {currentUser.phone || '+256 700 000 000'}
              </span>
            </div>

            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-400 font-semibold">Region / Location</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {currentUser.location || 'Kampala, Uganda'}
              </span>
            </div>

            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-400 font-semibold">Verification Status</span>
              <span className="font-bold text-emerald-500 flex items-center gap-1">
                <i className="fa-solid fa-circle-check" /> Verified Member
              </span>
            </div>

            <div className="pt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 rounded-xl bg-[#0A3D91] hover:bg-[#072a64] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
              >
                <i className="fa-solid fa-pen-to-square" />
                Edit Profile
              </button>

              <button
                onClick={onLogout}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-600 dark:text-slate-300 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-right-from-bracket" />
                Log Out
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-8 text-left space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                City / Region
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#2E8B57] hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Save Updates
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
