"use client"; // This is a client component

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Simple Modal component for displaying user details
const Modal = ({ user, onClose }) => {
  if (!user) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-gradient-to-br from-blue-100 to-white p-4">
      <div className="bg-white p-6 rounded shadow-lg w-full mx-4 sm:mx-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700 text-center">User Details</h2>
        <div className="flex justify-center space-x-2 text-gray-700">
        <div className="space-y-2 text-gray-700 text-left">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Roll No:</strong> {user.rollNo}</p>
          <p><strong>Branch:</strong> {user.branch}</p>
          <p><strong>DOB:</strong> {user.dob}</p>
          <p><strong>Gender:</strong> {user.gender}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Address:</strong> {user.address}</p>
        </div>
        </div>
        <button
          className="mt-4 w-full py-2 rounded text-white transition-colors duration-300 bg-blue-500 hover:bg-blue-600 cursor-pointer"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [users, setUsers] = useState([]); // All users data
  const [search, setSearch] = useState(""); // Search query
  const [selectedUser, setSelectedUser] = useState(null); // For modal details
  const [loading, setLoading] = useState(false); // Loading for fetching users
  const [selectedFilter, setSelectedFilter] = useState("All"); // "All" | "Pending" | "Approved" | "Rejected"
  const [notification, setNotification] = useState(null); // { message: string, type: 'success'|'error' }
  const [updatingUser, setUpdatingUser] = useState(null); // email currently being updated
  const router = useRouter();

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      } else {
        showNotification("Failed to fetch users", "error");
      }
    } catch (error) {
      showNotification("Error fetching users", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Show a notification for feedback; hide automatically after 3 seconds
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Handle logout
  const handleLogout = () => {
    router.push("/");
  };

  // Filter users based on search and selected filter
  const filteredUsers = users.filter((user) => {
    const lowerSearch = search.toLowerCase();
    const matchesSearch =
      (user.email && user.email.toLowerCase().includes(lowerSearch)) ||
      (user.name && user.name.toLowerCase().includes(lowerSearch)) ||
      (user.rollNo && user.rollNo.toLowerCase().includes(lowerSearch));

    let matchesFilter = true;
    if (selectedFilter === "Pending") {
      matchesFilter = user.status === "pending";
    } else if (selectedFilter === "Approved") {
      matchesFilter = user.status === "approved";
    } else if (selectedFilter === "Rejected") {
      matchesFilter = user.status === "rejected";
    }
    return matchesSearch && matchesFilter;
  });

  // Update a user's status and provide feedback
  const updateUserStatus = async (email, newStatus) => {
    setUpdatingUser(email);
    try {
      const res = await fetch("/api/admin/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: newStatus }),
      });

      if (res.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.email === email ? { ...user, status: newStatus } : user
          )
        );
        showNotification(`User updated successfully!`);
      } else {
        showNotification("Failed to update user status", "error");
      }
    } catch (error) {
      showNotification("Error updating user", "error");
    }
    setUpdatingUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white p-6 rounded-xl shadow-md w-full h-full max-w-[calc(200vw-200px)] max-h-[calc(200vh-200px)] mx-auto my-auto text-center">
        <div className="w-full max-w-full sm:max-w-6xl">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-700">
              Admin Dashboard - User Management
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded text-white transition-colors duration-300 bg-red-500 hover:bg-red-600 cursor-pointer text-sm sm:text-base"
            >
              Logout
            </button>
          </div>

          {/* Notification */}
          {notification && (
            <div
              className={`mb-4 p-3 rounded text-center text-white ${notification.type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
            >
              {notification.message}
            </div>
          )}

          {/* Filter Options */}
          <div className="mb-4 flex flex-wrap gap-2 sm:space-x-4">
            {["All", "Pending", "Approved", "Rejected"].map((filterOption) => (
              <button
                key={filterOption}
                className={`px-3 py-2 rounded border border-gray-300 text-gray-700 transition-colors duration-300 cursor-pointer text-sm sm:text-base ${selectedFilter === filterOption
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-100"
                  }`}
                onClick={() => setSelectedFilter(filterOption)}
              >
                {filterOption} Users
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by email, name, or roll number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded text-gray-700 text-sm sm:text-base"
            />
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center text-gray-700 py-4 text-sm sm:text-base">
              No {selectedFilter.toLowerCase()} users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border hidden sm:table">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border text-gray-700 text-sm">Email</th>
                    <th className="px-4 py-2 border text-gray-700 text-sm">Name</th>
                    <th className="px-4 py-2 border text-gray-700 text-sm">Roll No</th>
                    <th className="px-4 py-2 border text-gray-700 text-sm">Status</th>
                    {selectedFilter !== "All" && (
                      <th className="px-4 py-2 border text-gray-700 text-sm">Actions</th>
                    )}
                    <th className="px-4 py-2 border text-gray-700 text-sm">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.email}>
                      <td className="px-4 py-2 border text-gray-700 text-sm">{user.email}</td>
                      <td className="px-4 py-2 border text-gray-700 text-sm">{user.name}</td>
                      <td className="px-4 py-2 border text-gray-700 text-sm">{user.rollNo}</td>
                      <td className="px-4 py-2 border text-gray-700 text-sm">
                        {user.status
                          ? user.status.charAt(0).toUpperCase() + user.status.slice(1)
                          : "Unknown"}
                      </td>
                      {selectedFilter !== "All" && (
                        <td className="px-4 py-2 border space-x-2">
                          {selectedFilter === "Pending" && (
                            <>
                              <button
                                onClick={() => updateUserStatus(user.email, "approve")}
                                disabled={updatingUser === user.email}
                                className="px-2 py-1 w-auto rounded text-white transition Colors duration-300 bg-green-600 hover:bg-green-500 cursor-pointer disabled:opacity-50 text-sm"
                              >
                                {updatingUser === user.email ? (
                                  <div className="flex justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                ) : (
                                  "Approve"
                                )}
                              </button>
                              <button
                                onClick={() => updateUserStatus(user.email, "reject")}
                                disabled={updatingUser === user.email}
                                className="px-2 py-1 w-auto rounded text-white transition-colors duration-300 bg-red-600 hover:bg-red-500 cursor-pointer disabled:opacity-50 text-sm"
                              >
                                {updatingUser === user.email ? (
                                  <div className="flex justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                ) : (
                                  "Reject"
                                )}
                              </button>
                            </>
                          )}
                          {selectedFilter === "Approved" && (
                            <button
                              onClick={() => updateUserStatus(user.email, "reject")}
                              disabled={updatingUser === user.email}
                              className="px-2 py-1 w-auto rounded text-white transition-colors duration-300 bg-red-600 hover:bg-red-500 cursor-pointer disabled:opacity-50 text-sm"
                            >
                              {updatingUser === user.email ? (
                                <div className="flex justify-center">
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              ) : (
                                "Reject"
                              )}
                            </button>
                          )}
                          {selectedFilter === "Rejected" && (
                            <button
                              onClick={() => updateUserStatus(user.email, "approve")}
                              disabled={updatingUser === user.email}
                              className="px-2 py-1 w-auto rounded text-white transition-colors duration-300 bg-green-600 hover:bg-green-500 cursor-pointer disabled:opacity-50 text-sm"
                            >
                              {updatingUser === user.email ? (
                                <div className="flex justify-center">
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              ) : (
                                "Approve"
                              )}
                            </button>
                          )}
                        </td>
                      )}
                      <td className="px-4 py-2 border">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer transition-colors duration-300 text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile view: Card layout */}
              <div className="sm:hidden space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.email} className="bg-white p-4 rounded shadow border">
                    <div className="space-y-2 text-gray-700 text-sm">
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Name:</strong> {user.name}</p>
                      <p><strong>Roll No:</strong> {user.rollNo}</p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {user.status
                          ? user.status.charAt(0).toUpperCase() + user.status.slice(1)
                          : "Unknown"}
                      </p>
                    </div>
                    {selectedFilter !== "All" && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {selectedFilter === "Pending" && (
                          <>
                            <button
                              onClick={() => updateUserStatus(user.email, "approve")}
                              disabled={updatingUser === user.email}
                              className="px-2 py-1 rounded text-white transition-colors duration-300 bg-green-600 hover:bg-green-500 cursor-pointer disabled:opacity-50 text-sm"
                            >
                              {updatingUser === user.email ? (
                                <div className="flex justify-center">
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              ) : (
                                "Approve"
                              )}
                            </button>
                            <button
                              onClick={() => updateUserStatus(user.email, "reject")}
                              disabled={updatingUser === user.email}
                              className="px-2 py-1 rounded text-white transition-colors duration-300 bg-red-600 hover:bg-red-500 cursor-pointer disabled:opacity-50 text-sm"
                            >
                              {updatingUser === user.email ? (
                                <div className="flex justify-center">
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              ) : (
                                "Reject"
                              )}
                            </button>
                          </>
                        )}
                        {selectedFilter === "Approved" && (
                          <button
                            onClick={() => updateUserStatus(user.email, "reject")}
                            disabled={updatingUser === user.email}
                            className="px-2 py-1 rounded text-white transition-colors duration-300 bg-red-600 hover:bg-red-500 cursor-pointer disabled:opacity-50 text-sm"
                          >
                            {updatingUser === user.email ? (
                              <div className="flex justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            ) : (
                              "Reject"
                            )}
                          </button>
                        )}
                        {selectedFilter === "Rejected" && (
                          <button
                            onClick={() => updateUserStatus(user.email, "approve")}
                            disabled={updatingUser === user.email}
                            className="px-2 py-1 rounded text-white transition-colors duration-300 bg-green-600 hover:bg-green-500 cursor-pointer disabled:opacity-50 text-sm"
                          >
                            {updatingUser === user.email ? (
                              <div className="flex justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            ) : (
                              "Approve"
                            )}
                          </button>
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="mt-4 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer transition-colors duration-300 text-sm"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal for User Details */}
          {selectedUser && (
            <Modal
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;