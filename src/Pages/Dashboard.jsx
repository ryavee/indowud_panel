import React from "react";
import {
  Users,
  CreditCard,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

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

const COLORS = ["#169698", "#D7145D"];

const topUsers = [
  { name: "Ravi Raj", points: 1200, status: "Verified" },
  { name: "Nashi", points: 950, status: "Pending" },
  { name: "Pravat", points: 870, status: "Verified" },
];

const recentTransactions = [
  { user: "Ravi Raj", type: "Redeemed", amount: 500, date: "2025-09-29" },
  { user: "Nashi", type: "Claimed", amount: 200, date: "2025-09-28" },
  { user: "Pravat", type: "Redeemed", amount: 300, date: "2025-09-28" },
];

const recentActivity = [
  "User Ravi claimed 50 points",
  "User Nashi redeemed 100 points",
  "New user Pravat registered",
  "KYC approved for Abhi",
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 sm:px-6 lg:px-8 py-6 space-y-8 transition-all duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Here’s what’s happening today.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-white bg-[#169698] rounded-lg hover:bg-[#128083] transition">
            Refresh Data
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition">
            Export
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            title: "Total Users",
            value: "1,245",
            icon: <Users className="w-8 h-8 sm:w-10 sm:h-10 text-[#169698]" />,
            border: "border-[#169698]",
          },
          {
            title: "Points Claimed",
            value: "8,540",
            icon: (
              <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-[#22c55e]" />
            ),
            border: "border-[#22c55e]",
          },
          {
            title: "Points Redeemed",
            value: "6,230",
            icon: <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-[#D7145D]" />,
            border: "border-[#D7145D]",
          },
          {
            title: "KYC Verified",
            value: "780",
            icon: <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-[#eab308]" />,
            border: "border-[#eab308]",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`bg-white rounded-xl shadow-sm border-l-4 ${card.border} p-4 sm:p-5 flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
          >
            <div className="bg-gray-50 p-3 rounded-lg">{card.icon}</div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">{card.title}</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-800">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            Points Earned vs Redeemed
          </h2>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="earned"
                  stroke="#169698"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="redeemed"
                  stroke="#D7145D"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            KYC Status Overview
          </h2>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  label
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity + Top Users */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#169698]" /> Recent
            Activity
          </h2>
          <ul className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <li
                key={idx}
                className="text-sm sm:text-base text-gray-700 border-b pb-2 last:border-b-0 flex items-start gap-2"
              >
                <div className="w-2 h-2 mt-1 bg-[#169698] rounded-full"></div>
                {activity}
              </li>
            ))}
          </ul>
        </div>

        {/* Top Users */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            Top Users
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base">
              <thead>
                <tr className="text-gray-500 text-left">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Points</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {topUsers.map((user, idx) => (
                  <tr
                    key={idx}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="py-2 font-medium text-gray-700">
                      {user.name}
                    </td>
                    <td className="py-2">{user.points}</td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          user.status === "Verified"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
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
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
          Latest Transactions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm sm:text-base">
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
                <tr
                  key={idx}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-2">{tx.user}</td>
                  <td className="py-2">{tx.type}</td>
                  <td className="py-2 font-semibold text-gray-800">
                    ₹{tx.amount}
                  </td>
                  <td className="py-2 text-gray-500">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;