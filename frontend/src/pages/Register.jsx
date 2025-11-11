import React, { useState } from "react";
import { register } from "../api/index"
export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState(null);


    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await register({ username, password });
            setMsg("Account created! You can now login.");
        } catch (err) {
            setMsg(err.error || "Registration failed");
        }
    }


    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            {msg && <p className="mb-2">{msg}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input className="border p-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input className="border p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="bg-green-600 text-white p-2 rounded">Register</button>
            </form>
        </div>
    );
}