import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch the latest user profile + progress from the backend
    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem('signbridge_token');
        if (!token) return;

        try {
            const res = await fetch(`${API_URL}/api/learning/me/progress`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const json = await res.json();
                if (json.status === 'success') {
                    const freshUser = json.data;
                    setUser(freshUser);
                    localStorage.setItem('signbridge_user', JSON.stringify(freshUser));
                }
            } else if (res.status === 401) {
                // Token expired or invalid – log the user out
                setUser(null);
                localStorage.removeItem('signbridge_user');
                localStorage.removeItem('signbridge_token');
            }
        } catch (err) {
            console.error('Failed to refresh user from server:', err);
        }
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('signbridge_user');
        const storedToken = localStorage.getItem('signbridge_token');

        if (storedUser && storedToken) {
            // Set immediately from cache for fast paint, then refresh from server
            setUser(JSON.parse(storedUser));
            setLoading(false);
            refreshUser();
        } else {
            localStorage.removeItem('signbridge_user');
            localStorage.removeItem('signbridge_token');
            setLoading(false);
        }
    }, [refreshUser]);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('signbridge_user', JSON.stringify(userData));
        if (token) {
            localStorage.setItem('signbridge_token', token);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('signbridge_user');
        localStorage.removeItem('signbridge_token');
    };

    const updateUser = (data) => {
        if (!user) return;
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('signbridge_user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, refreshUser, isAuthenticated: !!user, loading }}>
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
