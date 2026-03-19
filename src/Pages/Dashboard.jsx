import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  TrendingUp,
  CheckCircle,
  Building2,
  Factory,
  UserCheck,
  QrCode
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
  Legend,
  AreaChart,
  Area,
} from "recharts";

import { DashboardContext } from "../Context/DashboardContext";
import LoadingSpinner from "../Components/Reusable/LoadingSpinner";

/* ---------------- VISUAL CONSTANTS ---------------- */

const visualPlaceholderTrend = [
  { value: 10 }, { value: 25 }, { value: 15 }, { value: 30 }, { value: 20 }, { value: 40 }
];

/* ---------------- COMPONENT ---------------- */
/* ---------------- COMPONENT ---------------- */

const Dashboard = () => {

  const navigate = useNavigate();
  const context = useContext(DashboardContext);

  const [selectedCategory, setSelectedCategory] = useState("All");


  if (!context) return <div>No dashboard access</div>;

  const { dashboardData, loading, error } = context;

  if (loading)
    return <LoadingSpinner centered message="Loading Dashboard..." />;

  if (error) return <div>{error}</div>;

  if (!dashboardData) return <div>No data</div>;

  const {
    totalUsers,
    totalDealers,
    totalFactories,
    totalCustomers,
    totalQrGenerated,
    totalQrScanned,
    totalKycApproved,
    totalGeneratedPoints,
    totalRedeemedPoints,
    currentYearStats,
    pointsByMonth,
    customerScanReport,
    topSellingProducts: liveTopSellingProducts,
    dealerTrend,
    adminTrend,
    customerTrend,
    qrGeneratedTrend,
    qrScannedTrend,
    qrApprovedTrend,
    qrRejectedTrend,
    pointsTrend,

    registrationsByState,
    dealerQRStats,
    redemptionByCity,
    topScanners

  } = dashboardData;

  const currentTopSellingProducts = liveTopSellingProducts || [];

  const categories = [
    "All",
    ...new Set(currentTopSellingProducts.map(p => p.category))
  ];

  const filteredProducts =
    (selectedCategory === "All"
      ? currentTopSellingProducts
      : currentTopSellingProducts.filter(p => p.category === selectedCategory)
    ).sort((a, b) => b.scans - a.scans);

  const stats = [
    {
      title: "Total Carpenters",
      value: totalCustomers || 0,
      trend: customerTrend?.length ? customerTrend : visualPlaceholderTrend,
      color: "#22C55E",
      icon: <UserCheck className="w-6 h-6 text-[#22C55E]" />,
      action: () => navigate("/customers")
    },
    {
      title: "Total Dealers",
      value: totalDealers || 0,
      trend: dealerTrend?.length ? dealerTrend : visualPlaceholderTrend,
      color: "#8B5CF6",
      icon: <Building2 className="w-6 h-6 text-[#8B5CF6]" />,
      action: () => navigate("/dealers")
    },
    {
      title: "Admin Users",
      value: totalFactories || 0,
      trend: adminTrend?.length ? adminTrend : visualPlaceholderTrend,
      color: "#F97316",
      icon: <Factory className="w-6 h-6 text-[#F97316]" />,
      action: () => navigate("/factoryUsers") // IMPORTANT
    },
    {
      title: "QR Generated",
      value: totalQrGenerated || 0,
      trend: qrGeneratedTrend?.length ? qrGeneratedTrend : visualPlaceholderTrend,
      color: "#6366F1",
      icon: <QrCode className="w-6 h-6 text-indigo-500" />,
      action: () => navigate("/qr")
    },
    {
      title: "QR Scanned",
      value: totalQrScanned || 0,
      trend: qrScannedTrend?.length ? qrScannedTrend : visualPlaceholderTrend,
      color: "#EC4899",
      icon: <TrendingUp className="w-6 h-6 text-pink-500" />,
      action: () => navigate("/track")
    },
    {
      title: "KYC Approved",
      value: totalKycApproved || 0,
      trend: qrApprovedTrend?.length ? qrApprovedTrend : visualPlaceholderTrend,
      color: "#16A34A",
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      action: () => navigate("/customers") // or create dedicated KYC page
    }
  ];
  const hasQrData = totalQrGenerated || totalQrScanned;
  const qrPending = (totalQrGenerated || 0) - (totalQrScanned || 0);

  const qrStatusData = [
    { name: "QR Generated", value: totalQrGenerated || 0, color: "#6366F1" },
    { name: "QR Scanned", value: totalQrScanned || 0, color: "#22C55E" },
    { name: "Scan Pending", value: qrPending > 0 ? qrPending : 0, color: "#F59E0B" }
  ];

  const pointsTrendData = pointsTrend || [];

  const currentKycStatusData = [
    { name: "Approved", value: totalKycApproved || 0, color: "#16A34A" },
    { name: "Pending", value: 0, color: "#FACC15" }
  ];

  const currentKycLabelData = [
    { name: "Approved", value: totalKycApproved || 0, color: "#16A34A" },
    { name: "Pending", value: 0, color: "#FACC15" }
  ];

  const currentTotalKyc = currentKycStatusData.reduce((sum, item) => sum + item.value, 0);
  const currentMaxValue = Math.max(...currentKycStatusData.map(i => i.value), 1);

  return (

    <div className="min-h-screen bg-gray-50 p-6 space-y-8">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">QR Reward System Overview</p>
        </div>


      </div>

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 cursor-pointer">

        {stats.map((card, i) => (
          <div
            key={i}
            onClick={card.action}
            className="bg-white p-5 rounded-xl shadow-sm flex flex-col gap-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            style={{ borderLeft: `4px solid ${card.color}` }}
          >

            <div className="flex items-center gap-3">

              <div className="bg-gray-100 p-2 rounded-lg">
                {card.icon}
              </div>

              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-xl font-bold">{card.value}</p>
              </div>

            </div>

            <div className="h-14 ">

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={card.trend}
                  style={{ pointerEvents: "none" }}
                >
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={card.color}
                    fill={card.color}
                    fillOpacity={0.15}
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>

            </div>

          </div>

        ))}

      </div>

      {/* EARN VS REDEEM + QR STATUS */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Earn vs Redeem */}

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-lg font-semibold mb-4">
            Points Earned vs Redeemed
          </h2>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart data={pointsTrendData}>

                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

                <XAxis axisLine={false} tickLine={false} dataKey="date" />

                <YAxis axisLine={false} tickLine={false} />

                <Tooltip />

                <Legend />

                <Area dataKey="earned" stroke="#374151" fill="#374151" fillOpacity={0.1} strokeWidth={2} />

                <Area dataKey="redeemed" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.1} strokeWidth={2} />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* QR STATUS */}


        <div className="bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-lg font-semibold mb-4">
            QR Lifecycle Overview
          </h2>

          <div className="h-80">

            {hasQrData ? (
              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={qrStatusData}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {qrStatusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />

                </PieChart>

              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No QR Data Available
              </div>
            )}

          </div>

        </div>

      </div>

      {/* KPI + MONTHLY GRAPH */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* KPI CARDS */}

        {/* STATISTICS OF 2026 */}

        <div className="bg-white rounded-xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-lg font-semibold">
              Statistics of {currentYearStats?.year || 2026}
            </h2>

          </div>

          {[
            {
              label: "Registered Customer",
              value: currentYearStats?.registeredCustomers || 0,
              percent: 100
            },
            {
              label: "Earn Points",
              value: currentYearStats?.earnPoints || 0,
              percent: 100
            },
            {
              label: "Redeem Points",
              value: currentYearStats?.redeemPoints || 0,
              percent: Math.min(100, ((currentYearStats?.redeemPoints || 0) / (currentYearStats?.earnPoints || 1)) * 100)
            },
            {
              label: "Scan Count",
              value: currentYearStats?.scanCount || 0,
              percent: 100
            },
            {
              label: "Balance Points",
              value: currentYearStats?.balancePoints || 0,
              percent: 100
            }
          ].map((item, index) => (

            <div key={index} className="mb-6">

              <div className="flex justify-between text-sm mb-2">

                <span className="text-gray-500">
                  {item.label}
                </span>

                <span className="font-semibold text-gray-800">
                  {item.value}
                </span>

              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">

                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${item.percent}%` }}
                ></div>

              </div>

            </div>

          ))}

        </div>

        {/* MONTHLY GRAPH */}

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-lg font-semibold mb-4">
            Earn / Redeem Points By Month - {currentYearStats?.year || 2026}
          </h2>

          <div className="h-96">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={pointsByMonth || []} barCategoryGap={30}>

                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

                <XAxis axisLine={false} tickLine={false} dataKey="month" />

                <YAxis axisLine={false} tickLine={false} />

                <Tooltip />

                <Legend />

                <Bar dataKey="earned" name="Loyalty Points" fill="#374151" barSize={12} radius={[4, 4, 0, 0]} />

                <Bar dataKey="redeemed" name="Redemption Points" fill="#9ca3af" barSize={12} radius={[4, 4, 0, 0]} />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* KYC Status + Customer Scan Report */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* KYC STATUS */}
        <div className="bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-lg font-semibold mb-6">
            KYC Status Chart
          </h2>

          <div className="flex items-center justify-between">

            {/* LEFT LEGEND */}

            <div className="space-y-3 text-sm">

              {currentKycLabelData.map((item, i) => (

                <div key={i} className="flex items-center gap-2">

                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: item.color }}
                  ></div>

                  <span className="text-gray-600">
                    {item.name} {item.value}
                  </span>

                </div>

              ))}

            </div>


            {/* RIGHT CHART */}

            <div className="h-56 w-56">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  {currentKycStatusData.map((item, index) => {

                    const inner = 40 + index * 22;
                    const outer = inner + 12;

                    return (

                      <React.Fragment key={index}>

                        {/* BACKGROUND SHADOW TRACK */}

                        <Pie
                          data={[{ value: currentMaxValue }]}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-180}
                          innerRadius={inner}
                          outerRadius={outer}
                          fill="#f1f5f9"
                          cornerRadius={10}
                          stroke="none"
                        />

                        {/* ACTUAL VALUE ARC */}

                        <Pie
                          data={[{ value: item.value }]}
                          dataKey="value"
                          startAngle={90}
                          endAngle={90 - (item.value / (currentTotalKyc || 1)) * 270}
                          innerRadius={inner}
                          outerRadius={outer}
                          fill={item.color}
                          cornerRadius={10}
                          stroke="none"
                        />

                      </React.Fragment>

                    );

                  })}


                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>


        {/* CUSTOMER SCAN REPORT */}

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-lg font-semibold mb-4">
            Customer Scan Report of {currentYearStats?.year || 2026}
          </h2>

          <div className="h-70">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart data={customerScanReport || []}>

                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="scans"
                  stroke="#111827"
                  fill="#111827"
                  fillOpacity={0.08}
                  strokeWidth={2}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>
      {/* PRODUCT SCAN REPORT */}

      <div className="bg-white rounded-xl shadow-sm p-6">

        <h2 className="text-lg font-semibold mb-4">
          Dealer QR Statistics Report
        </h2>

        <div className="h-96">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              layout="vertical"
              data={dealerQRStats}
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis type="number" />

              <YAxis
                dataKey="dealerName"
                type="category"
                width={120}
              />

              <Tooltip />

              <Bar
                dataKey="qrsCount"
                fill="#6366F1"
                radius={[0, 10, 10, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* REGISTRATIONS BY STATE */}

      <div className="bg-white rounded-xl shadow-sm p-6">

        <h2 className="text-lg font-semibold mb-4">
          Registrations by State
        </h2>

        <div className="h-96">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={registrationsByState}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="state"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="count"
                fill="#374151"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* TOP SELLING PRODUCTS */}

      <div className="bg-white rounded-xl shadow-sm p-6">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-lg font-semibold">
            Top Selling Products
          </h2>

        </div>

        <div className="overflow-y-auto max-h-80">

          <table className="w-full text-sm">

            <thead className="sticky top-0 bg-white border-b">

              <tr className="text-gray-500 text-left">

                <th className="py-2">Product</th>
                <th className="py-2">Product ID</th>
                <th className="py-2">Category</th>
                <th className="py-2 text-right">Scan Count</th>

              </tr>

            </thead>

            <tbody>

              {filteredProducts.map((item, index) => (

                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition"
                >

                  <td className="py-3 font-medium text-gray-800">
                    {item.product}
                  </td>

                  <td className="py-3 text-gray-600">
                    {item.productId}
                  </td>

                  <td className="py-3 text-gray-600">
                    {item.category}
                  </td>

                  <td className="py-3 text-right font-semibold">
                    {item.scans}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
      {/* DEALER QR + CITY SCAN */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Dealer QR Stats */}

        <div className="bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-lg font-semibold mb-4">
            Dealer QR Statistics
          </h2>

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b text-gray-500">
                <th className="text-left pb-2">Dealer</th>
                <th className="text-left pb-2">QR Count</th>
              </tr>
            </thead>

            <tbody>

              {dealerQRStats?.map((dealer, i) => (
                <tr key={i} className="border-t">

                  <td className="py-2">{dealer.dealerName}</td>

                  <td className="py-2">
                    <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs">
                      {dealer.qrsCount}
                    </span>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>


        {/* City of Scan */}

        <div className="bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-lg font-semibold mb-4">
            City of Scan
          </h2>

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b text-gray-500">
                <th className="text-left pb-2">City</th>
                <th className="text-left pb-2">Points</th>
              </tr>
            </thead>

            <tbody>

              {redemptionByCity?.map((city, i) => (
                <tr key={i} className="border-t">

                  <td className="py-2">{city.city}</td>

                  <td className="py-2">
                    <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-xs">
                      {city.points}
                    </span>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* TOP SCANNERS */}

      <div className="bg-white rounded-xl shadow-sm p-6">

        <h2 className="text-lg font-semibold mb-4">
          Top Scanners
        </h2>

        <table className="w-full text-sm">

          <thead>

            <tr className="border-b text-gray-500">

              <th className="text-left pb-2">User</th>
              <th className="text-left pb-2">City</th>
              <th className="text-left pb-2">State</th>
              <th className="text-left pb-2">Points</th>

            </tr>

          </thead>

          <tbody>

            {topScanners?.map((user, i) => (
              <tr key={i} className="border-t">

                <td className="py-2">{user.userName}</td>
                <td className="py-2">{user.city}</td>
                <td className="py-2">{user.state}</td>

                <td className="py-2">
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                    {user.pointsRedeemed}
                  </span>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default Dashboard;