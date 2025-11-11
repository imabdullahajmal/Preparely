import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { me as apiMe, logout as apiLogout } from "../api/index";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const s = localStorage.getItem("user");
        return s ? JSON.parse(s) : null;
    });
    const navigate = useNavigate();

    // On mount, validate session with backend `/api/auth/me` which reads the HTTP-only cookie
    useEffect(() => {
        let mounted = true;
        async function check() {
            try {
                const res = await apiMe();
                if (mounted && res && res.user) {
                    setUser(res.user);
                    localStorage.setItem('user', JSON.stringify(res.user));
                } else if (mounted) {
                    setUser(null);
                    localStorage.removeItem('user');
                }
            } catch (e) {
                if (mounted) {
                    setUser(null);
                    localStorage.removeItem('user');
                }
            }
        }
        check();
        return () => { mounted = false };
    }, []);

    // Called after a successful login API call. Backend sets cookie; we store user object locally for UI.
    function loginUser(userObj) {
        setUser(userObj);
        localStorage.setItem("user", JSON.stringify(userObj));
        navigate("/");
    }

    async function logoutUser() {
        try {
            await apiLogout();
        } catch (e) {
            // ignore network errors during logout
        }
        setUser(null);
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
}