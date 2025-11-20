import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-icons text-indigo-500 text-3xl">video_library</span>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Video Understanding</h1>
            <p className="text-xs text-slate-400">Video to Builder Prompt</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             <span className="text-xs text-slate-300 font-mono">gemini-3-pro-preview</span>
           </div>
        </div>
      </div>
    </header>
  );
};