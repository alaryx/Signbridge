import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Camera, BookOpen, Home, Info, Mail, LogIn, LogOut, Settings, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { isAuthenticated, logout, user } = useAuth();

    const navLinks = [
        { name: 'Home', path: '/', icon: <Home size={20} /> },
        { name: 'Translation', path: '/translation', icon: <Camera size={20} /> },
        { name: 'Learn ISL', path: '/learn', icon: <BookOpen size={20} /> },
        { name: 'About', path: '/about', icon: <Info size={20} /> },
        ...(user?.role === 'admin'
            ? [{ name: 'Admin Console', path: '/admin', icon: <Settings size={20} /> }]
            : []
        ),
        ...(isAuthenticated
            ? [
                { name: 'Profile', path: '/profile', icon: <UserCircle size={20} /> },
                { name: 'Logout', path: '#', icon: <LogOut size={20} />, action: logout }
            ]
            : [{ name: 'Login', path: '/auth', icon: <LogIn size={20} /> }]
        )
    ];

    const toggleNavbar = () => setIsOpen(!isOpen);

    return (
        <nav className="bg-white shadow-sm fixed w-full z-50 top-0 left-0 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-3">
                            <img src="/logos/aksha_logo_nobg.png" alt="Aksha Logo" className="h-10 w-auto object-contain" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent hidden sm:block">SignBridge</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex space-x-1 items-center">
                        {navLinks.map((link) => {
                            if (link.action) {
                                return (
                                    <button
                                        key={link.name}
                                        onClick={link.action}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50 transition-colors"
                                    >
                                        {link.icon}
                                        {link.name}
                                    </button>
                                );
                            }
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${location.pathname === link.path
                                            ? 'text-brand-600 bg-brand-50'
                                            : 'text-gray-600 hover:text-brand-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {link.icon}
                                    {link.name}
                                </Link>
                            );
                        })}
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

            {isOpen && (
                <div className="md:hidden border-t border-gray-100 absolute w-full bg-white shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => {
                            if (link.action) {
                                return (
                                    <button
                                        key={link.name}
                                        onClick={() => {
                                            link.action();
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-red-500 w-full text-left"
                                    >
                                        {link.icon}
                                        {link.name}
                                    </button>
                                );
                            }
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium
                      ${location.pathname === link.path
                                            ? 'text-brand-600 bg-brand-50'
                                            : 'text-gray-600 hover:text-white hover:bg-brand-500'
                                        }`}
                                >
                                    {link.icon}
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
