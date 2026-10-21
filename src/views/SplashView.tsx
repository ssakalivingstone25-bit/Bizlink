import React, { useEffect, useState } from 'react';

interface SplashViewProps {
  onEnter: () => void;
  onLogin: () => void;
}

export const SplashView: React.FC<SplashViewProps> = ({ onEnter, onLogin }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#041E42] via-[#0A3D91] to-[#007A5E] text-white">
      {/* Decorative blurred backdrops */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center px-6 max-w-lg w-full relative z-10 animate-fade-in">
        {/* BizLink Logo with border and drop shadow from splash.html */}
        <div className="mx-auto w-48 h-48 sm:w-56 sm:h-56 bg-white rounded-3xl p-4 shadow-2xl border-4 border-white flex items-center justify-center transform transition duration-700 hover:scale-105">
          <img
            src="/images/bizlink-logo.png"
            alt="BizLink Uganda Logo"
            className="w-full h-full object-contain filter drop-shadow-md"
            onError={(e) => {
              // Fallback logo if file missing
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        {/* Title & Tagline matching splash.html */}
        <h1 className="mt-8 text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
          BizLink <span className="text-[#F4B400]">Uganda</span>
        </h1>

        <h3 className="mt-3 text-lg sm:text-xl font-normal text-[#F4B400] tracking-wide">
          Connecting Businesses. Building Futures.
        </h3>

        {/* Loading Bar matching splash.html .loader */}
        <div className="w-64 sm:w-80 h-2.5 bg-white/20 mx-auto mt-8 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-[#F4B400] transition-all duration-75 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-slate-300 mt-2 font-mono">
          Loading Ugandan commerce directory &middot; {Math.round(progress)}%
        </p>

        {/* Action Controls */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onEnter}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#F4B400] hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-store" />
            Enter Marketplace
          </button>

          <button
            onClick={onLogin}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm transition cursor-pointer flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-right-to-bracket" />
            Portal Login
          </button>
        </div>
      </div>
    </div>
  );
};
