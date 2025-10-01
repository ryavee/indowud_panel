// src/pages/Dashboard.jsx
import React from "react";
import {
  Users,
  CreditCard,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

// Dummy Data
const lineData = [
  { day: "Mon", earned: 120, redeemed: 90 },
  { day: "Tue", earned: 200, redeemed: 150 },
  { day: "Wed", earned: 180, redeemed: 130 },
  { day: "Thu", earned: 220, redeemed: 170 },
  { day: "Fri", earned: 260, redeemed: 210 },
  { day: "Sat", earned: 300, redeemed: 260 },
  { day: "Sun", earned: 280, redeemed: 230 },
];

const pieData = [
  { name: "KYC Verified", value: 65 },
  { name: "Pending KYC", value: 35 },
];

const COLORS = ["#22c55e", "#facc15"];

const topUsers = [
  { name: "Ravi raj", points: 1200, status: "Verified" },
  { name: "Nashi ", points: 950, status: "Pending" },
  { name: "Pravat", points: 870, status: "Verified" },
];

const recentTransactions = [
  { user: "Ravi raj", type: "Redeemed", amount: 500, date: "2025-09-29" },
  { user: "Nashi", type: "Claimed", amount: 200, date: "2025-09-28" },
  { user: "Pravat", type: "Redeemed", amount: 300, date: "2025-09-28" },
];

const recentActivity = [
  "User Ravi claimed 50 points",
  "User Nashi redeemed 100 points",
  "New user pravat registered",
  "KYC approved for Abhi",
];

const Dashboard = () => {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-5 flex items-center space-x-4">
          <Users className="w-10 h-10 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-xl font-semibold">1,245</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center space-x-4">
          <CreditCard className="w-10 h-10 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Points Claimed</p>
            <p className="text-xl font-semibold">8,540</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center space-x-4">
          <TrendingUp className="w-10 h-10 text-purple-500" />
          <div>
            <p className="text-sm text-gray-500">Points Redeemed</p>
            <p className="text-xl font-semibold">6,230</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center space-x-4">
          <CheckCircle className="w-10 h-10 text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">KYC Verified</p>
            <p className="text-xl font-semibold">780</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6 col-span-2">
          <h2 className="text-lg font-semibold mb-4">Points Earned vs Redeemed</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="earned" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="redeemed" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">KYC Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity + Top Users */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <li
                key={idx}
                className="flex items-center text-sm text-gray-700 border-b pb-2"
              >
                <ArrowRight className="w-4 h-4 text-blue-500 mr-2" />
                {activity}
              </li>
            ))}
          </ul>
        </div>

        {/* Top Users */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Top Users</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-left">
                <th className="pb-2">Name</th>
                <th className="pb-2">Points</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((user, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2">{user.name}</td>
                  <td className="py-2 font-medium">{user.points}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === "Verified"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Latest Transactions</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-left">
              <th className="pb-2">User</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Amount</th>
              <th className="pb-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((tx, idx) => (
              <tr key={idx} className="border-t">
                <td className="py-2">{tx.user}</td>
                <td className="py-2">{tx.type}</td>
                <td className="py-2 font-medium">₹{tx.amount}</td>
                <td className="py-2">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
