import React from 'react';

interface HeaderProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ apiKey, onApiKeyChange }) => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="material-icons text-indigo-500 text-3xl">video_library</span>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-white tracking-tight">Video Understanding</h1>
            <p className="text-xs text-slate-400">Video to Builder Prompt</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 flex-1 justify-end">
           <div className="relative w-full max-w-md">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <span className="material-icons text-slate-500 text-sm">vpn_key</span>
             </div>
             <input
                type="password"
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder="Enter Gemini API Key"
                className="block w-full pl-10 pr-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg leading-5 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out"
             />
           </div>

           <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 flex-shrink-0">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             <span className="text-xs text-slate-300 font-mono">gemini-3-pro-preview</span>
           </div>
        </div>
      </div>
    </header>
  );
};