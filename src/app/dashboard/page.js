"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth");
  };

  if (!user) return <p className="text-center text-black mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-r from-rose-100 to-teal-100 animate-gradient">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome, {user.name || user.email}
        </h2>

        <div className="text-left mb-4 text-gray-900">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Name:</strong> {user.name || "-"}</p>
          <p><strong>Roll No:</strong> {user.rollNo || "-"}</p>
          <p><strong>Branch:</strong> {user.branch || "-"}</p>
          <p><strong>Gender:</strong> {user.gender || "-"}</p>
          <p><strong>Date of Birth:</strong> {user.dob || "-"}</p>
          <p><strong>Phone:</strong> {user.phone || "-"}</p>
          <p><strong>Address:</strong> {user.address || "-"}</p>
        </div>

        {/* ✅ Account Approval Status */}
        <p
          className={`mb-4 font-semibold ${user.status === "approved"
              ? "text-green-600"
              : user.status === "rejected"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
        >
          {user.status === "approved"
            ? "✅ Account approved"
            : user.status === "rejected"
              ? "❌ Account rejected"
              : "⌛ Account approval pending"}
        </p>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
