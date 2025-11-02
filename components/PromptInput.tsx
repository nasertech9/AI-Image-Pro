
import React from 'react';

interface SparklesIconProps {
  className?: string;
}

const SparklesIcon: React.FC<SparklesIconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" clipRule="evenodd" />
    <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z" />
  </svg>
);

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  mode: 'image' | 'video';
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onSubmit, isLoading, mode }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex items-center gap-2 sm:gap-4 p-2 bg-slate-800/50 border border-white/10 rounded-full"
    >
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          mode === 'image'
            ? "A futuristic cityscape at dusk, neon reflections..."
            : "A cinematic shot of a robot surfing on a data wave..."
        }
        rows={1}
        className="flex-grow bg-transparent focus:outline-none placeholder:text-slate-400 text-slate-100 px-4 py-2 resize-none leading-tight scrollbar-hide"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !prompt}
        className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-sky-500 text-white disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 ease-in-out hover:bg-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/50 shadow-lg hover:shadow-sky-500/40 transform hover:scale-105 disabled:transform-none"
        aria-label="Generate"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
        ) : (
          <SparklesIcon className="w-6 h-6" />
        )}
      </button>
    </form>
  );
};
