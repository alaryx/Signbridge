import React from 'react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 p-4 relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 -left-40 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-3xl text-center flex flex-col items-center space-y-8 z-10">
                <div className="flex justify-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <img
                        src="/logos/aksha_logo_nobg.png"
                        alt="Aksha Logo"
                        className="h-32 md:h-48 w-auto object-contain drop-shadow-xl transform hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm">
                    Welcome to <span className="bg-gradient-to-r from-brand-600 to-emerald-500 bg-clip-text text-transparent">SignBridge</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
                    Bridging Communication Through Indian Sign Language
                </p>
                <p className="text-lg text-gray-500 max-w-xl mx-auto">
                    Experience seamless two-way communication between Indian Sign Language (ISL) and spoken languages. Start translating instantly or dive into our interactive learning platform.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                    <a href="/translation" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-brand-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-600 hover:bg-brand-700 hover:scale-105 active:scale-95 shadow-lg shadow-brand-500/30">
                        Start Translating
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </a>
                    <a href="/learn" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-brand-700 transition-all duration-200 bg-brand-50 border border-brand-200 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-600 hover:bg-brand-100 hover:border-brand-300 hover:scale-105 active:scale-95 shadow-sm">
                        Learn ISL
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Home;
