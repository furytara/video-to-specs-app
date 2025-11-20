import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { VideoFile } from '../types';
import { fileToBase64 } from '../services/geminiService';

interface VideoInputProps {
  onVideoSelected: (video: VideoFile) => void;
  disabled: boolean;
}

export const VideoInput: React.FC<VideoInputProps> = ({ onVideoSelected, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const videoId = extractVideoId(youtubeUrl);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please upload a valid video file.');
      return;
    }

    // Limit file size to ~25MB for client-side base64 handling
    if (file.size > 25 * 1024 * 1024) {
      alert('For this browser-only demo, please keep video files under 25MB.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setFileName(file.name);

    try {
      const base64 = await fileToBase64(file);
      onVideoSelected({
        file,
        previewUrl: objectUrl,
        base64Data: base64
      });
    } catch (err) {
      console.error("Error reading file", err);
      alert("Failed to process video file.");
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearVideo = () => {
    setPreview(null);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      
      {/* YouTube Input Section */}
      {!preview && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-1 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-indigo-500">
          <div className="flex items-center px-4 py-2 gap-3">
            <span className="material-icons text-red-500">play_circle_filled</span>
            <input
              type="text"
              placeholder="Paste YouTube Video URL..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              disabled={disabled}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 text-sm h-10"
            />
          </div>
        </div>
      )}

      {videoId && !preview && (
        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start animate-fade-in">
           <img 
             src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} 
             alt="Thumbnail" 
             className="w-40 rounded-lg shadow-lg"
           />
           <div className="flex-1 space-y-2">
             <h3 className="text-indigo-300 font-semibold text-sm flex items-center gap-2">
               <span className="material-icons text-base">check_circle</span>
               Video Detected
             </h3>
             <p className="text-slate-300 text-xs leading-relaxed">
               To perform a deep visual analysis of this video, please <strong>download the file</strong> (e.g., using a tool or browser extension) and upload it below. The AI needs raw video access to generate accurate specifications.
             </p>
           </div>
        </div>
      )}

      {/* Video Upload Area */}
      {!preview ? (
        <div
          className={`relative group cursor-pointer flex flex-col items-center justify-center w-full h-64 rounded-2xl border-2 border-dashed transition-all duration-300 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="video/*"
            onChange={onInputChange}
            disabled={disabled}
          />
          
          <div className="flex flex-col items-center gap-4 p-6 text-center">
            <div className="p-4 rounded-full bg-slate-700/50 group-hover:bg-slate-700 transition-colors">
              <span className="material-icons text-4xl text-slate-400 group-hover:text-indigo-400">cloud_upload</span>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-medium text-white">
                Upload App Demo Video
              </p>
              <p className="text-sm text-slate-400">
                Drag & drop or click to browse (MP4, MOV, WebM)
              </p>
            </div>
            <p className="text-xs text-slate-500 max-w-xs">
              * Max size 25MB for browser analysis
            </p>
          </div>
        </div>
      ) : (
        <div className="relative w-full bg-black rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
          <video 
            src={preview} 
            controls 
            className="w-full h-auto max-h-[400px] mx-auto"
          />
          <button
            onClick={clearVideo}
            disabled={disabled}
            className="absolute top-4 right-4 p-2 bg-black/70 hover:bg-red-500/80 text-white rounded-full backdrop-blur-sm transition-all"
            title="Remove video"
          >
            <span className="material-icons text-sm">close</span>
          </button>
          <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 rounded-lg backdrop-blur-md text-xs text-white flex items-center gap-2">
            <span className="material-icons text-sm text-green-400">check_circle</span>
            {fileName}
          </div>
        </div>
      )}
    </div>
  );
};