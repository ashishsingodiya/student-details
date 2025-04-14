"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setMsg(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Admin login failed");

      // Save admin token if needed
      localStorage.setItem("adminToken", data.token);
      setMsg("Admin login successful, redirecting...");
      setTimeout(() => router.push("/admin/dashboard"), 1000);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleAdminLogin} className="w-full max-w-md bg-white p-8 rounded shadow text-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
        {msg && <p className="text-sm text-red-500 mb-4">{msg}</p>}
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-900"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-6 border border-gray-300 rounded rounded text-gray-900"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 text-white rounded ${
            isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
