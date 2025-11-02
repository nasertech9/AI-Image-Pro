
import React, { useState, useCallback } from 'react';
import { generateImage, generateVideo } from './services/geminiService';
import { PromptInput } from './components/PromptInput';
import { ImageDisplay } from './components/ImageDisplay';
import { Header } from './components/Header';
import { ErrorDisplay } from './components/ErrorDisplay';

const VideoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0  24 24" fill="currentColor" className={className}>
        <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 8.598a2.25 2.25 0 0 0-3.182 0l-3.182 3.182a2.25 2.25 0 0 0 0 3.182l3.182 3.182a2.25 2.25 0 0 0 3.182 0l3.182-3.182a2.25 2.25 0 0 0 0-3.182l-3.182-3.182Z" />
    </svg>
);
const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="m2.25 13.5 6.94-6.94a.75.75 0 0 1 1.06 0l2.97 2.97.057-.057a.75.75 0 0 1 1.06 0l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 12.56l-2.22 2.22a.75.75 0 0 1-1.06 0L2.25 14.56a.75.75 0 0 1 0-1.06ZM1.5 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H2.25A.75.75 0 0 1 1.5 12ZM2.25 3.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H2.25ZM1.5 6a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H2.25A.75.75 0 0 1 1.5 6ZM2.25 20.25a.75.75 0 0 0 0 1.5h19.5a.75.75 0 0 0 0-1.5H2.25ZM20.25 9a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H21a.75.75 0 0 1-.75-.75ZM21 12a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 1.5 0v-1.5A.75.75 0 0 0 21 12ZM20.25 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H21a.75.75 0 0 1-.75-.75ZM21 6a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 1.5 0V6.75A.75.75 0 0 0 21 6ZM3.75 2.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75ZM3.75 9a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
    </svg>
);


const App: React.FC = () => {
  const [mode, setMode] = useState<'image' | 'video'>('image');
  const [prompt, setPrompt] = useState<string>('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isKeyReadyForVideo, setIsKeyReadyForVideo] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  React.useEffect(() => {
    return () => {
      if (resultUrl && resultUrl.startsWith('blob:')) {
        URL.revokeObjectURL(resultUrl);
      }
    };
  }, [resultUrl]);

  React.useEffect(() => {
    const checkKey = async () => {
      if (mode === 'video') {
        // @ts-ignore
        if (window.aistudio && window.aistudio.hasSelectedApiKey) {
          // @ts-ignore
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setIsKeyReadyForVideo(hasKey);
        }
      }
    };
    checkKey();
  }, [mode]);

  const handleSelectKey = async () => {
     // @ts-ignore
    if (window.aistudio && window.aistudio.openSelectKey) {
       // @ts-ignore
      await window.aistudio.openSelectKey();
      setIsKeyReadyForVideo(true);
    } else {
      setError("API key selection utility is not available in this environment.");
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResultUrl(null);

    try {
      if (mode === 'image') {
        setLoadingMessage('Generating your vision...');
        const imageUrl = await generateImage(prompt);
        setResultUrl(imageUrl);
      } else {
        if (!isKeyReadyForVideo) {
          throw new Error("Please select an API key to generate videos.");
        }
        setLoadingMessage('Initiating video generation...');
        const videoUrl = await generateVideo(prompt, (message) => setLoadingMessage(message));
        setResultUrl(videoUrl);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      if (errorMessage.includes("API key is invalid") || errorMessage.includes("Requested entity was not found")) {
        setIsKeyReadyForVideo(false);
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [prompt, isLoading, mode, isKeyReadyForVideo]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-900 text-slate-100 font-sans p-4 flex items-center justify-center">
      {/* Background Gradient Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-sky-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <main className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          <Header />

          <div className="flex justify-center p-1 bg-slate-800/50 border border-white/10 rounded-full">
            {(['image', 'video'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                  mode === m ? 'bg-sky-500 text-white' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {m === 'image' ? <ImageIcon className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
                <span className="capitalize">{m}</span>
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <ImageDisplay 
              resultUrl={resultUrl} 
              isLoading={isLoading} 
              prompt={prompt}
              mode={mode}
              loadingMessage={loadingMessage}
            />
            <ErrorDisplay error={error} />
            
            {mode === 'video' && !isKeyReadyForVideo ? (
              <div className="text-center p-4 bg-slate-800/50 rounded-lg animate-fade-in">
                <h3 className="font-semibold text-slate-100">Video Generation Requires an API Key</h3>
                <p className="text-sm text-slate-400 mt-1 mb-4">
                  Select your project's API key to use the video model. 
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline ml-1">Learn about billing.</a>
                </p>
                <button 
                  onClick={handleSelectKey}
                  className="px-4 py-2 bg-sky-500 text-white rounded-full text-sm font-semibold hover:bg-sky-400 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-sky-500/50"
                >
                  Select API Key
                </button>
              </div>
            ) : (
              <PromptInput 
                prompt={prompt}
                setPrompt={setPrompt}
                onSubmit={handleGenerate}
                isLoading={isLoading}
                mode={mode}
              />
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default App;
