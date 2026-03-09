import React from 'react';
import { Users, Target, Shield, ExternalLink } from 'lucide-react';

const About = () => {
    return (
        <div className="w-full bg-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-indigo-900 py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 relative z-10">About SignBridge</h1>
                <p className="text-xl text-brand-100 max-w-3xl mx-auto font-medium relative z-10">
                    An Impact Driven Project (SP 2026) by Team AKSHA designed to create an inclusive society through technology.
                </p>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

                {/* Our Mission */}
                <section className="text-center space-y-6">
                    <div className="inline-flex justify-center items-center w-16 h-16 rounded-2xl bg-brand-100 text-brand-600 mb-2">
                        <Target size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        SignBridge aims to eliminate the communication barrier between the Deaf community and the hearing world in India. By providing a real-time, two-way translation platform for Indian Sign Language (ISL) alongside an interactive learning module, we strive to make everyday interactions seamless and accessible to everyone.
                    </p>
                </section>

                {/* Features Split */}
                <section className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">Why SignBridge?</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4">
                                <Shield className="text-brand-500 shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-gray-900">Accessibility First</h4>
                                    <p className="text-gray-600 text-sm">Designed specifically for Indian users with mobile-first layouts, high contrast, and offline fallbacks.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <Users className="text-brand-500 shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-gray-900">Unified Experience</h4>
                                    <p className="text-gray-600 text-sm">No clunky mode-switching. Converse naturally in a single, intuitive interface combining camera input and text output.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-gray-100 rounded-3xl p-8 flex items-center justify-center min-h-[300px]">
                        <p className="text-gray-400 font-medium">[ Descriptive Infographic Placeholder ]</p>
                    </div>
                </section>

                {/* Team */}
                <section className="text-center bg-gray-50 rounded-3xl py-12 px-4 shadow-sm border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Team AKSHA</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Driven by a shared passion for social impact and inclusive technology.
                    </p>
                    <button className="inline-flex items-center gap-2 text-brand-600 font-bold hover:text-brand-700 transition-colors">
                        Read Technical Documentation <ExternalLink size={18} />
                    </button>
                </section>
            </div>
        </div>
    );
};

export default About;
