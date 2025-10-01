import React, { useState } from "react";

const RedemptionManagement = () => {
  // Dummy data
  const [redemptions, setRedemptions] = useState([
    { id: 101, user: "Ravi", reward: "Coupon", points: 100, date: "2025-10-01", status: "Pending" },
    { id: 102, user: "Nashi", reward: "Gift Card", points: 200, date: "2025-09-30", status: "Approved" },
    { id: 103, user: "Amit", reward: "Voucher", points: 150, date: "2025-09-28", status: "Rejected" },
    { id: 104, user: "User", reward: "Coupon", points: 50, date: "2025-09-29", status: "Pending" },
  ]);

  const [filter, setFilter] = useState("All");

  const handleStatusChange = (id, newStatus) => {
    setRedemptions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const filteredData =
    filter === "All" ? redemptions : redemptions.filter((r) => r.status === filter);

  // Stats
  const total = redemptions.length;
  const pending = redemptions.filter((r) => r.status === "Pending").length;
  const approved = redemptions.filter((r) => r.status === "Approved").length;
  const rejected = redemptions.filter((r) => r.status === "Rejected").length;

  const getStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-semibold";
      case "Approved":
        return "bg-green-100 text-green-700 px-2 py-1 rounded font-semibold";
      case "Rejected":
        return "bg-red-100 text-red-700 px-2 py-1 rounded font-semibold";
      default:
        return "";
    }
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-1">Redemption Management</h1>
      <p className="text-gray-600 mb-6">
        Manage user redemptions, track status, and take action.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          className={`p-6 rounded-lg shadow text-center cursor-pointer transition ${
            filter === "All" ? "bg-blue-200" : "bg-blue-100 hover:bg-blue-200"
          }`}
          onClick={() => setFilter("All")}
        >
          <h2 className="text-xl font-bold text-blue-700">{total}</h2>
          <p className="text-gray-600">Total Redemptions</p>
        </div>

        <div
          className={`p-6 rounded-lg shadow text-center cursor-pointer transition ${
            filter === "Pending" ? "bg-yellow-200" : "bg-yellow-100 hover:bg-yellow-200"
          }`}
          onClick={() => setFilter("Pending")}
        >
          <h2 className="text-xl font-bold text-yellow-700">{pending}</h2>
          <p className="text-gray-600">Pending</p>
        </div>

        <div
          className={`p-6 rounded-lg shadow text-center cursor-pointer transition ${
            filter === "Approved" ? "bg-green-200" : "bg-green-100 hover:bg-green-200"
          }`}
          onClick={() => setFilter("Approved")}
        >
          <h2 className="text-xl font-bold text-green-700">{approved}</h2>
          <p className="text-gray-600">Approved</p>
        </div>

        <div
          className={`p-6 rounded-lg shadow text-center cursor-pointer transition ${
            filter === "Rejected" ? "bg-red-200" : "bg-red-100 hover:bg-red-200"
          }`}
          onClick={() => setFilter("Rejected")}
        >
          <h2 className="text-xl font-bold text-red-700">{rejected}</h2>
          <p className="text-gray-600">Rejected</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input
          type="text"
          placeholder="Search by user or reward..."
          className="border border-gray-300 rounded px-3 py-2 flex-1"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">ID</th>
              <th className="border p-3 text-left">User</th>
              <th className="border p-3 text-left">Reward</th>
              <th className="border p-3 text-left">Points</th>
              <th className="border p-3 text-left">Date</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="border p-3">{r.id}</td>
                <td className="border p-3">{r.user}</td>
                <td className="border p-3">{r.reward}</td>
                <td className="border p-3">{r.points}</td>
                <td className="border p-3">{r.date}</td>
                <td className="border p-3">
                  <span className={getStatusClasses(r.status)}>{r.status}</span>
                </td>
                <td className="border p-3 text-center space-x-2">
                  {r.status === "Pending" ? (
                    <>
                      <button
                        onClick={() => handleStatusChange(r.id, "Approved")}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(r.id, "Rejected")}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RedemptionManagement;
