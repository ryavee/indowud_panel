import React, { useContext } from "react";
import {
  Users,
  CreditCard,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Download,
  Building2,
  Factory,
  UserCheck,
  MapPin,
} from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { DashboardContext } from "../Context/DashboardContext";

const COLORS = [
  "#169698",
  "#D7145D",
  "#22C55E",
  "#EAB308",
  "#8B5CF6",
  "#F97316",
];

const Dashboard = () => {
  const { dashboardData, loading, error } = useContext(DashboardContext);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#169698] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <h2 className="text-red-800 font-semibold text-lg mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No dashboard data available</p>
        </div>
      </div>
    );
  }

  const {
    totalUsers,
    totalDealers,
    totalFactories,
    totalCustomers,
    totalKycApproved,
    totalGeneratedPoints,
    totalRedeemedPoints,
    dealerQRStats,
    redemptionByCity,
    topScanners,
    registrationsByState,
  } = dashboardData;

  // Calculate KYC percentage
  const kycPercentage =
    totalUsers > 0 ? ((totalKycApproved / totalCustomers) * 100).toFixed(1) : 0;
  const kycPending = totalCustomers - totalKycApproved;

  // Prepare pie chart data for KYC
  const kycPieData = [
    { name: "KYC Verified", value: totalKycApproved },
    { name: "Pending KYC", value: kycPending },
  ];

  // Refresh handler
  const handleRefresh = () => {
    window.location.reload();
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 sm:px-6 lg:px-8 py-6 space-y-8 transition-all duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>

      </div>

      {/* Quick Stats - Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            title: "Total Users",
            value: totalUsers.toLocaleString(),
            icon: <Users className="w-8 h-8 text-[#169698]" />,
            border: "border-[#169698]",
          },
          {
            title: "Total Dealers",
            value: totalDealers.toLocaleString(),
            icon: <Building2 className="w-8 h-8 text-[#8B5CF6]" />,
            border: "border-[#8B5CF6]",
          },
          {
            title: "Total Factories",
            value: totalFactories.toLocaleString(),
            icon: <Factory className="w-8 h-8 text-[#F97316]" />,
            border: "border-[#F97316]",
          },
          {
            title: "Total Customers",
            value: totalCustomers.toLocaleString(),
            icon: <UserCheck className="w-8 h-8 text-[#22C55E]" />,
            border: "border-[#22C55E]",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`bg-white rounded-xl shadow-sm border-l-4 ${card.border} p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300`}
          >
            <div className="bg-[#F9FAFB] p-3 rounded-lg">{card.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats - Bottom Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          {
            title: "Points Generated",
            value: totalGeneratedPoints.toLocaleString(),
            icon: <CreditCard className="w-8 h-8 text-[#22C55E]" />,
            border: "border-[#22C55E]",
          },
          {
            title: "Points Redeemed",
            value: totalRedeemedPoints.toLocaleString(),
            icon: <TrendingUp className="w-8 h-8 text-[#D7145D]" />,
            border: "border-[#D7145D]",
          },
          {
            title: "KYC Verified",
            value: `${totalKycApproved} (${kycPercentage}%)`,
            icon: <CheckCircle className="w-8 h-8 text-[#EAB308]" />,
            border: "border-[#EAB308]",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`bg-white rounded-xl shadow-sm border-l-4 ${card.border} p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300`}
          >
            <div className="bg-[#F9FAFB] p-3 rounded-lg">{card.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart - Registrations by State */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Registrations by State
          </h2>
          <div className="h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={registrationsByState}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="state"
                  stroke="#9ca3af"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="count" fill="#169698" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - KYC Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            KYC Status Overview
          </h2>
          <div className="h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={kycPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {kycPieData.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Dealer QR Stats & Redemption by City */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dealer QR Statistics */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-[#169698]" /> Dealer QR
            Statistics
          </h2>
          {dealerQRStats && dealerQRStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-left border-b">
                    <th className="pb-2">Dealer ID</th>
                    <th className="pb-2">Dealer Name</th>
                    <th className="pb-2">QR Count</th>
                  </tr>
                </thead>
                <tbody>
                  {dealerQRStats.map((dealer, idx) => (
                    <tr
                      key={idx}
                      className="border-t hover:bg-[#169698]/5 transition"
                    >
                      <td className="py-2 font-medium text-gray-800">
                        {dealer.dealerId}
                      </td>
                      <td className="py-2">{dealer.dealerName}</td>
                      <td className="py-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#169698]/10 text-[#169698]">
                          {dealer.qrsCount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No dealer QR data available</p>
          )}
        </div>

        {/* Redemption by City */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#D7145D]" /> Redemption by City
          </h2>
          {redemptionByCity && redemptionByCity.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-left border-b">
                    <th className="pb-2">City</th>
                    <th className="pb-2">Points Redeemed</th>
                  </tr>
                </thead>
                <tbody>
                  {redemptionByCity.map((city, idx) => (
                    <tr
                      key={idx}
                      className="border-t hover:bg-[#D7145D]/5 transition"
                    >
                      <td className="py-2 font-medium text-gray-800">
                        {city.city}
                      </td>
                      <td className="py-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#D7145D]/10 text-[#D7145D]">
                          {city.points} pts
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No redemption data available
            </p>
          )}
        </div>
      </div>

      {/* Top Scanners */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Top Scanners
        </h2>
        {topScanners && topScanners.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-left border-b">
                  <th className="pb-2">User Name</th>
                  <th className="pb-2">City</th>
                  <th className="pb-2">State</th>
                  <th className="pb-2">Points Redeemed</th>
                </tr>
              </thead>
              <tbody>
                {topScanners.map((scanner, idx) => (
                  <tr
                    key={idx}
                    className="border-t hover:bg-[#169698]/5 transition"
                  >
                    <td className="py-2 font-medium text-gray-800">
                      {scanner.userName}
                    </td>
                    <td className="py-2">{scanner.city}</td>
                    <td className="py-2">{scanner.state}</td>
                    <td className="py-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {scanner.pointsRedeemed} pts
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No top scanners data available
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
