import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

const TranslationInput = ({ onSubmit, isLoading }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim() && !isLoading) {
            onSubmit(text.trim());
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                </div>

                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type an English sentence to translate to ISL..."
                    disabled={isLoading}
                    className="block w-full pl-12 pr-32 py-5 bg-white border-2 border-gray-100 rounded-2xl leading-5 shadow-lg shadow-gray-100/50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-400 transition-all sm:text-lg font-medium text-gray-900 disabled:opacity-60"
                />

                <div className="absolute inset-y-2 right-2 flex">
                    <button
                        type="submit"
                        disabled={!text.trim() || isLoading}
                        className="inline-flex items-center px-6 py-2 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                Translating...
                            </>
                        ) : (
                            'Translate'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TranslationInput;
