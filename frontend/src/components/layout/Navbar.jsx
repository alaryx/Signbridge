import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Camera, BookOpen, Home, Info, Mail, LogIn } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/', icon: <Home size={20} /> },
        { name: 'Translation', path: '/translation', icon: <Camera size={20} /> },
        { name: 'Learn ISL', path: '/learn', icon: <BookOpen size={20} /> },
        { name: 'About', path: '/about', icon: <Info size={20} /> },
        { name: 'Login', path: '/auth', icon: <LogIn size={20} /> }
    ];

    const toggleNavbar = () => setIsOpen(!isOpen);

    return (
        <nav className="bg-white shadow-sm fixed w-full z-50 top-0 left-0 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">SignBridge</span>
                            <span className="text-xs font-semibold px-2 py-1 bg-teal-50 text-teal-700 rounded-full hidden sm:block">AKSHA</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-1 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${location.pathname === link.path
                                        ? 'text-teal-600 bg-teal-50'
                                        : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                                    }`}
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleNavbar}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-gray-100 absolute w-full bg-white shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium
                  ${location.pathname === link.path
                                        ? 'text-teal-600 bg-teal-50'
                                        : 'text-gray-600 hover:text-white hover:bg-teal-500'
                                    }`}
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
