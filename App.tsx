import React, { useState } from 'react';
import { Header } from './components/Header';
import { VideoInput } from './components/VideoInput';
import { ResultsView } from './components/ResultsView';
import { analyzeVideo } from './services/geminiService';
import { VideoFile, AnalysisStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
  const [resultMarkdown, setResultMarkdown] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [additionalContext, setAdditionalContext] = useState("");

  const handleAnalyze = async () => {
    if (!videoFile || !videoFile.base64Data) return;

    setStatus(AnalysisStatus.ANALYZING);
    setErrorMsg("");

    try {
      const result = await analyzeVideo(
        videoFile.base64Data, 
        videoFile.file.type,
        additionalContext
      );
      setResultMarkdown(result);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred during analysis.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleReset = () => {
    setVideoFile(null);
    setResultMarkdown("");
    setStatus(AnalysisStatus.IDLE);
    setAdditionalContext("");
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a]">
      <Header />

      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
        
        {/* Hero Section */}
        {status === AnalysisStatus.IDLE && (
          <div className="text-center mb-12 max-w-2xl animate-fade-in-up">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-6">
              Turn Video Demos into Reality
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Upload a video walkthrough of any app. Our AI analyzes the UI, flow, and features to generate a complete technical specification and prompt for rebuilding it.
            </p>
          </div>
        )}

        {/* Input Section */}
        {status === AnalysisStatus.IDLE && (
          <div className="w-full flex flex-col items-center gap-8 animate-fade-in">
            <VideoInput 
              onVideoSelected={setVideoFile} 
              disabled={false}
            />
            
            {videoFile && (
              <div className="w-full max-w-3xl space-y-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                   <label className="block text-sm font-medium text-slate-300 mb-2">
                     Additional Context (Optional)
                   </label>
                   <textarea
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-24 resize-none text-sm placeholder-slate-600"
                      placeholder="e.g., 'Focus heavily on the mobile responsiveness' or 'Use Supabase for the backend'"
                      value={additionalContext}
                      onChange={(e) => setAdditionalContext(e.target.value)}
                   />
                </div>

                <button
                  onClick={handleAnalyze}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/20 transform transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span className="material-icons">auto_fix_high</span>
                  Analyze Video & Generate Specs
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {status === AnalysisStatus.ANALYZING && (
          <div className="flex flex-col items-center justify-center py-20 space-y-8 animate-pulse">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-slate-700 border-t-indigo-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-icons text-3xl text-indigo-500">visibility</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold text-white">Analyzing Video Content...</h3>
              <p className="text-slate-400 max-w-md">
                Gemini 3.0 Pro is watching your video, identifying UI components, user flows, and inferring backend logic. This may take a minute.
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === AnalysisStatus.ERROR && (
          <div className="w-full max-w-2xl bg-red-900/20 border border-red-500/50 rounded-2xl p-8 text-center space-y-4">
            <div className="inline-flex p-3 rounded-full bg-red-500/20 text-red-400 mb-2">
              <span className="material-icons text-3xl">error_outline</span>
            </div>
            <h3 className="text-xl font-bold text-white">Analysis Failed</h3>
            <p className="text-red-200">{errorMsg}</p>
            <button
              onClick={() => setStatus(AnalysisStatus.IDLE)}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results State */}
        {status === AnalysisStatus.COMPLETED && (
          <div className="w-full flex flex-col items-center gap-8">
            <ResultsView markdown={resultMarkdown} />
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-medium rounded-full transition-colors flex items-center gap-2"
            >
              <span className="material-icons text-sm">refresh</span>
              Analyze Another Video
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;