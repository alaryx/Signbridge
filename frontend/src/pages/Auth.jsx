import React, { useState } from 'react';
import { Mail, Lock, User, LogIn, ArrowRight } from 'lucide-react';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 relative z-10">

                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4 shadow-sm">
                        <LogIn className="text-teal-600 w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        {isLogin ? 'Welcome back' : 'Create an account'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isLogin ? 'Sign in to access your saved progress and history.' : 'Join SignBridge to unlock full features.'}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-4">
                        {!isLogin && (
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input type="text" required
                                    className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm transition-colors"
                                    placeholder="Full Name"
                                />
                            </div>
                        )}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input type="email" required
                                className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm transition-colors"
                                placeholder="Email address"
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input type="password" required
                                className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm transition-colors"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {isLogin && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-teal-600 hover:text-teal-500">Forgot your password?</a>
                            </div>
                        </div>
                    )}

                    <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors shadow-md">
                        {isLogin ? 'Sign in' : 'Create Account'}
                        <ArrowRight className="absolute right-4 h-5 w-5 text-teal-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="text-center mt-4">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                    </button>
                </div>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue as</span>
                        </div>
                    </div>

                    <button className="mt-6 w-full flex justify-center py-3 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors">
                        Guest User (Limited Access)
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Auth;
