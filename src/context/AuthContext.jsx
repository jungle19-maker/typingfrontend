import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data);
                    // Also update localStorage to keep it fresh
                    localStorage.setItem('user', JSON.stringify(res.data));
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                    // If token is invalid, maybe logout? For now, fallback to local or null
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) setUser(JSON.parse(storedUser));
                }
            } else {
                const storedUser = localStorage.getItem('user');
                if (storedUser) setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = async (email, password) => {
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data));
        setUser(res.data);
    };

    const register = async (username, email, password) => {
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, { username, email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data));
        setUser(res.data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const hasFeature = (featureName) => {
        if (!user || !user.allowedFeatures) return false;
        // Super admin or specific overrides could go here
        return user.allowedFeatures.includes(featureName);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, setUser, hasFeature }}>
            {children}
        </AuthContext.Provider>
    );
};
