import React, { useState, useContext } from "react";
import { login } from "../api/index";
import { AuthContext } from "../context/AuthContext";


export default function Login() {
    const { loginUser } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);


    async function handleSubmit(e) {
        e.preventDefault();
        try {
                const data = await login({ username, password });
                // backend sets an HTTP-only cookie and returns the user object
                loginUser(data.user);
            } catch (err) {
            setError(err.error || "Login failed");
        }
    }


    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            {error && <p className="text-red-500 mb-2">{error}</p>}


            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input className="border p-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input className="border p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="bg-blue-600 text-white p-2 rounded">Login</button>
            </form>
        </div>
    );
}