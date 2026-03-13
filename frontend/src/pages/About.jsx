import React from 'react';
import { Users, Target, Shield, ExternalLink, Hand, BookOpen } from 'lucide-react';

const AKSHA_LOGO = "/logos/aksha_logo_nobg.png";

const teamMembers = [
    { name: 'Samridhi Arora',    role: 'Team Leader',  initials: 'SA', bg: '#EFF6FF', color: '#1D4ED8' },
    { name: 'Khushal Sharma',    role: 'Team Member',  initials: 'KS', bg: '#EFF6FF', color: '#2563EB' },
    { name: 'Anzel Gupta',       role: 'Team Member',  initials: 'AG', bg: '#EFF6FF', color: '#3B82F6' },
    { name: 'Himanshu Gautam',   role: 'Team Member',  initials: 'HG', bg: '#EFF6FF', color: '#1E40AF' },
    { name: 'Aditya Kumar Singh',role: 'Team Member',  initials: 'AK', bg: '#EFF6FF', color: '#1D4ED8' },
];

const About = () => {
    return (
        <div className="w-full min-h-screen" style={{ backgroundColor: '#F3F4F6' }}>

            {/* Hero Section */}
            <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #3B82F6 100%)' }}
                className="py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>

                {/* AKSHA Logo */}
                <div className="flex flex-col items-center justify-center mb-6 relative z-10">
                    <img
                        src={AKSHA_LOGO}
                        alt="AKSHA Logo"
                        className="w-20 h-20 object-contain mb-3 drop-shadow-lg"
                        
                    />
                    <span className="text-blue-200 text-xs font-semibold tracking-[0.25em] uppercase">Team AKSHA</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 relative z-10">About SignBridge</h1>
                <p className="text-lg text-blue-100 max-w-3xl mx-auto font-medium relative z-10">
                    An Impact Driven Project (SP 2026) — bridging the Deaf community and the hearing world through Indian Sign Language technology.
                </p>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">

                {/* Our Mission */}
                <section className="bg-white rounded-2xl p-10 text-center shadow-sm border border-blue-50">
                    <div className="inline-flex justify-center items-center w-14 h-14 rounded-2xl mb-4"
                        style={{ backgroundColor: '#EFF6FF' }}>
                        <Target size={28} color="#2563EB" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: '#1E3A5F' }}>Our Mission</h2>
                    <p className="text-gray-500 max-w-3xl mx-auto leading-relaxed">
                        SignBridge aims to eliminate the communication barrier between the Deaf community and the hearing world in India. By providing a real-time, two-way translation platform for Indian Sign Language (ISL) alongside an interactive learning module, we strive to make everyday interactions seamless and accessible to everyone.
                    </p>
                </section>

                {/* Features Split */}
                <section>
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-blue-50 space-y-6">
                        <h2 className="text-2xl font-bold" style={{ color: '#1E3A5F' }}>Why SignBridge?</h2>
                        <ul className="space-y-5">
                            {[
                                { icon: <Hand size={20} color="#2563EB" />, title: 'Bidirectional ISL Translation', desc: 'Sign-to-text recognition using your camera, and text-to-ISL animation output — a complete two-way communication loop.' },
                                { icon: <BookOpen size={20} color="#2563EB" />, title: 'Interactive Learning Module', desc: 'Learn ISL at your own pace with structured lessons and instant visual feedback — built for beginners and everyday users alike.' },
                                { icon: <Shield size={20} color="#2563EB" />, title: 'Accessibility First', desc: 'Designed for Indian users with mobile-first layouts, high contrast, and offline fallbacks.' },
                                { icon: <Users size={20} color="#2563EB" />, title: 'Unified Experience', desc: 'No mode-switching. Converse naturally in a single interface combining camera input and text output.' },
                            ].map(f => (
                                <li key={f.title} className="flex items-start gap-4">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                                        style={{ backgroundColor: '#EFF6FF' }}>
                                        {f.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 text-sm">{f.title}</h4>
                                        <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{f.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                   
                </section>

                {/* Team */}
                <section className="bg-white rounded-2xl py-12 px-6 shadow-sm border border-blue-50 text-center">

                    {/* Logo + Title */}
                    <div className="flex flex-col items-center mb-8">
                        <img
                            src={AKSHA_LOGO}
                            alt="AKSHA"
                            className="w-16 h-16 object-contain mb-3"
                        />
                        <h2 className="text-2xl font-bold" style={{ color: '#1E3A5F' }}>Team AKSHA</h2>
                        <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm">
                            Driven by a shared passion for social impact and inclusive technology.
                        </p>
                    </div>

                    {/* Members Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-10">
                        {teamMembers.map((m, i) => (
                            <div key={m.name} className="flex flex-col items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-base font-bold"
                                    style={{ backgroundColor: m.bg, color: m.color }}>
                                    {m.initials}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm leading-tight">{m.name}</p>
                                    {i === 0
                                        ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block"
                                            style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}>Team Leader</span>
                                        : <p className="text-xs text-gray-400 mt-1">{m.role}</p>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                   <a
                   href="https://github.com/alaryx/Signbridge"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl border transition-colors"
                    style={{ color: '#2563EB', borderColor: '#BFDBFE', backgroundColor: '#EFF6FF' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#DBEAFE'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#EFF6FF'}>
                    Read Technical Documentation <ExternalLink size={15} />
                </a>
                </section>

            </div>
        </div>
    );
};

export default About;