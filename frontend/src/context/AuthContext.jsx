import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for existing session on mount
        const storedUser = localStorage.getItem('signbridge_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        // In a real app, this would be an API call
        const isAdmin = userData.email?.toLowerCase().includes('admin');
        const mockUser = {
            id: userData.email || '1',
            name: userData.name || (isAdmin ? 'Admin User' : 'Student'),
            email: userData.email,
            role: isAdmin ? 'admin' : 'student',
            ...userData
        };
        setUser(mockUser);
        localStorage.setItem('signbridge_user', JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('signbridge_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
