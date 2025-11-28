import React, { useState } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("userInfo")) || null
    );
    const [token, setToken] = useState(
        localStorage.getItem("userToken") || null
    );

    const login = (userData) => {
        localStorage.setItem("userToken", userData.token);
        localStorage.setItem(
            "userInfo",
            JSON.stringify({ _id: userData._id, email: userData.email })
        );
        setToken(userData.token);
        setUser({ _id: userData._id, email: userData.email });
    };

    const logout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider
            value={{ user, token, isAuthenticated, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};
