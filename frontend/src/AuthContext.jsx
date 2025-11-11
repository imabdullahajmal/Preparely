import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


const AuthContext = createContext();


export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        return token ? { loggedIn: true } : null;
    });
    const nav = useNavigate();


    function login(token) {
        localStorage.setItem('token', token);
        setUser({ loggedIn: true });
    }


    function logout() {
        localStorage.removeItem('token');
        setUser(null);
        nav('/login');
    }


    useEffect(() => {
        // optional: you could validate token by calling backend here
    }, []);


    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}


export function useAuth() {
    return useContext(AuthContext);
}