
import React from 'react';

interface LoaderProps {
  prompt: string;
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ prompt, message }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <div className="w-16 h-16 border-4 border-sky-400/30 border-t-sky-400 rounded-full animate-spin mb-4"></div>
    <p className="text-lg font-semibold text-slate-200">{message}</p>
    <p className="text-slate-400 mt-1 max-w-md truncate">{prompt}</p>
  </div>
);

interface PlaceholderProps {
  mode: 'image' | 'video';
}

const Placeholder: React.FC<PlaceholderProps> = ({ mode }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-semibold text-slate-300">Your generated {mode} will appear here</p>
        <p className="text-sm mt-1">Enter a prompt below and let the AI bring it to life.</p>
    </div>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
);

interface ImageDisplayProps {
  resultUrl: string | null;
  isLoading: boolean;
  prompt: string;
  mode: 'image' | 'video';
  loadingMessage: string;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ resultUrl, isLoading, prompt, mode, loadingMessage }) => {
    const handleDownload = () => {
        if (!resultUrl) return;

        const filename = prompt
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .slice(0, 50) || `ai-generated-${mode}`;
        
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = mode === 'image' ? `${filename}.jpeg` : `${filename}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

  return (
    <div className={`relative ${mode === 'image' ? 'aspect-square' : 'aspect-video'} w-full bg-slate-800/50 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-300`}>
      {isLoading ? (
        <Loader prompt={prompt} message={loadingMessage || (mode === 'image' ? 'Generating your vision...' : 'Generating your video...')} />
      ) : resultUrl ? (
        <>
            {mode === 'image' ? (
                <img
                    src={resultUrl}
                    alt={prompt}
                    className="w-full h-full object-cover animate-fade-in"
                />
            ) : (
                <video
                    src={resultUrl}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-cover animate-fade-in"
                />
            )}
            <button
                onClick={handleDownload}
                className="absolute top-4 right-4 z-10 p-2.5 bg-slate-900/40 border border-white/10 rounded-full backdrop-blur-sm hover:bg-slate-900/60 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sky-400"
                aria-label="Download"
                title="Download"
            >
                <DownloadIcon className="w-5 h-5 text-white" />
            </button>
        </>
      ) : (
        <Placeholder mode={mode} />
      )}
       <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};
