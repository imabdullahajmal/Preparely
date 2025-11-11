import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


export default function Navbar() {
    const { user, logoutUser } = useContext(AuthContext);


    return (
        <nav className="w-full flex justify-between items-center p-4 bg-gray-900 text-white shadow">
            <Link to="/" className="text-xl font-bold">Preparely</Link>
            <div className="flex gap-4 items-center">
                {user ? (
                    <>
                        <span>Hello, {user.username}</span>
                        <button
                            onClick={logoutUser}
                            className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
                        >Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}