
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-500">
                AI Glass Image Generator
            </h1>
            <p className="mt-2 text-slate-300 max-w-md mx-auto">
                Craft stunning visuals from your imagination. Describe anything, and watch our AI create it in a futuristic glass interface.
            </p>
        </header>
    );
}
