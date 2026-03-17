import React, { useContext, useState } from "react";
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

/* ---------------- DEMO DATA ---------------- */

const topSellingProducts = [
  {
    product: "Indowud MR Board 10mm thick",
    productId: "NFC12",
    category: "MR Board",
    scans: 6324
  },
  {
    product: "Indowud MR Board 12mm thick",
    productId: "NFC18",
    category: "MR Board",
    scans: 5925
  },
  {
    product: "Indowud MR Board 16mm thick",
    productId: "NFC08",
    category: "MR Board",
    scans: 1780
  },
  {
    product: "Zerowud Board 18mm thick",
    productId: "ZWC18",
    category: "Zerowud",
    scans: 1504
  },
  {
    product: "Indowud MR Board 6mm thick",
    productId: "NFC06",
    category: "MR Board",
    scans: 817
  },
  {
    product: "Premium Laminate Sheet",
    productId: "LAM22",
    category: "Laminate",
    scans: 619
  }
];
const demoTrend = [
  { value: 10 },
  { value: 20 },
  { value: 18 },
  { value: 25 },
  { value: 30 }
];

const demoPointsTrend = [
  { date: "Mon", earned: 1200, redeemed: 800 },
  { date: "Tue", earned: 1500, redeemed: 900 },
  { date: "Wed", earned: 1800, redeemed: 1000 },
  { date: "Thu", earned: 1400, redeemed: 700 },
  { date: "Fri", earned: 2000, redeemed: 1200 }
];

const statisticsData = [
  {
    title: "Registered Customers",
    value: 46,
    color: "#6366F1",
    data: [{ value: 10 }, { value: 20 }, { value: 30 }, { value: 40 }, { value: 46 }]
  },
  {
    title: "Earn Points",
    value: 170000,
    color: "#22C55E",
    data: [{ value: 20000 }, { value: 60000 }, { value: 90000 }, { value: 140000 }, { value: 170000 }]
  },
  {
    title: "Redeem Points",
    value: 180000,
    color: "#EF4444",
    data: [{ value: 20000 }, { value: 50000 }, { value: 90000 }, { value: 140000 }, { value: 180000 }]
  },
  {
    title: "Scan Count",
    value: 500,
    color: "#F59E0B",
    data: [{ value: 120 }, { value: 200 }, { value: 350 }, { value: 420 }, { value: 500 }]
  }
];

const monthlyPoints = [
  { month: "Jan", earn: 5000, redeem: 2000 },
  { month: "Feb", earn: 6500, redeem: 2500 },
  { month: "Mar", earn: 7000, redeem: 3000 },
  { month: "Apr", earn: 8500, redeem: 3500 },
  { month: "May", earn: 9000, redeem: 4200 },
  { month: "Jun", earn: 11000, redeem: 5200 },
  { month: "Jul", earn: 10000, redeem: 4500 },
  { month: "Aug", earn: 9500, redeem: 4300 },
  { month: "Sep", earn: 8700, redeem: 3900 },
  { month: "Oct", earn: 9200, redeem: 4100 },
  { month: "Nov", earn: 9800, redeem: 4600 },
  { month: "Dec", earn: 12000, redeem: 6000 }
];

const kycStatusData = [
  { name: "Rejected", value: 24, color: "#DC2626" }, // inner
  { name: "Pending", value: 34, color: "#FACC15" },  // middle
  { name: "Approved", value: 139, color: "#16A34A" } // outer
];

const kycLabelData = [
  { name: "Approved", value: 139, color: "#16A34A" },
  { name: "Pending", value: 34, color: "#FACC15" },
  { name: "Rejected", value: 24, color: "#DC2626" }
];
const MAX_VALUE = Math.max(...kycStatusData.map(i => i.value), 1);
const TOTAL_KYC = kycStatusData.reduce((sum, item) => sum + item.value, 0);

const scanReportData = [
  { day: 1, scans: 10 },
  { day: 2, scans: 30 },
  { day: 3, scans: 20 },
  { day: 4, scans: 5 },
  { day: 5, scans: 65 },
  { day: 6, scans: 95 },
  { day: 7, scans: 15 },
  { day: 8, scans: 25 },
  { day: 9, scans: 80 },
  { day: 10, scans: 40 },
  { day: 11, scans: 70 },
  { day: 12, scans: 10 },
  { day: 13, scans: 5 },
  { day: 14, scans: 15 },
  { day: 15, scans: 8 }
];


const productScanReport = [
  { product: "Plywood 12mm", scans: 120 },
  { product: "Plywood 18mm", scans: 95 },
  { product: "Laminate A", scans: 75 },
  { product: "Laminate B", scans: 60 },
  { product: "Board Classic", scans: 48 },
  { product: "Board Premium", scans: 35 }
];
/* ---------------- COMPONENT ---------------- */

const Dashboard = () => {

  const context = useContext(DashboardContext);
  const [dateFilter, setDateFilter] = useState("all");
  const [exportType, setExportType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = [
    "All",
    ...new Set(topSellingProducts.map(p => p.category))
  ];

  const filteredProducts =
    (selectedCategory === "All"
      ? topSellingProducts
      : topSellingProducts.filter(p => p.category === selectedCategory)
    ).sort((a, b) => b.scans - a.scans);
  const exportData = (type) => {

    const data = topSellingProducts; // you can change to any dataset

    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(row => Object.values(row).join(",")).join("\n");

    const csv = headers + "\n" + rows;

    const blob = new Blob([csv], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = type === "xls" ? "dashboard-data.xls" : "dashboard-data.csv";

    a.click();
  };

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

  const stats = [
    {
      title: "Total Carpenters",
      value: totalCustomers || 0,
      trend: customerTrend || demoTrend,
      color: "#22C55E",
      icon: <UserCheck className="w-6 h-6 text-[#22C55E]" />
    },
    {
      title: "Total Dealers",
      value: totalDealers || 0,
      trend: dealerTrend || demoTrend,
      color: "#8B5CF6",
      icon: <Building2 className="w-6 h-6 text-[#8B5CF6]" />
    },
    {
      title: "Admin Users",
      value: totalFactories || 0,
      trend: adminTrend || demoTrend,
      color: "#F97316",
      icon: <Factory className="w-6 h-6 text-[#F97316]" />
    },

    {
      title: "QR Generated",
      value: totalQrGenerated || 0,
      trend: qrGeneratedTrend || demoTrend,
      color: "#6366F1",
      icon: <QrCode className="w-6 h-6 text-indigo-500" />
    },
    {
      title: "QR Scanned",
      value: totalQrScanned || 0,
      trend: qrScannedTrend || demoTrend,
      color: "#EC4899",
      icon: <TrendingUp className="w-6 h-6 text-pink-500" />
    }
  ];
  const hasQrData = totalQrGenerated || totalQrScanned;
  const qrPending = (totalQrGenerated || 0) - (totalQrScanned || 0);

  const qrStatusData = [
    { name: "QR Generated", value: totalQrGenerated || 0, color: "#6366F1" },
    { name: "QR Scanned", value: totalQrScanned || 0, color: "#22C55E" },
    { name: "Scan Pending", value: qrPending > 0 ? qrPending : 0, color: "#F59E0B" }
  ];

  const pointsTrendData = pointsTrend || demoPointsTrend;

  return (

    <div className="min-h-screen bg-gray-50 p-6 space-y-8">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">QR Reward System Overview</p>
        </div>

        <div className="flex items-center gap-3">

          {/* DATE FILTER */}

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >

            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom</option>

          </select>


          {/* EXPORT BUTTON */}

          <select
            onChange={(e) => exportData(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >

            <option value="">Export</option>
            <option value="csv">Export CSV</option>
            <option value="xls">Export XLS</option>

          </select>

        </div>

      </div>

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {stats.map((card, i) => (

          <div
            key={i}
            className="bg-white p-5 rounded-xl shadow-sm flex flex-col gap-3"
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

            <div className="h-14">

              <ResponsiveContainer width="100%" height="100%">

                <AreaChart data={card.trend}>

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
              Statistics of 2026
            </h2>

          </div>

          {[
            {
              label: "Registered Customer",
              value: 43,
              percent: 40
            },
            {
              label: "Earn Points",
              value: "77110",
              percent: 80
            },
            {
              label: "Redeem Points",
              value: "53060",
              percent: 60
            },
            {
              label: "Scan Count",
              value: 1061,
              percent: 90
            },
            {
              label: "Balance",
              value: "INR 1061",
              percent: 50
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
            Earn / Redeem Points By Month - 2026
          </h2>

          <div className="h-96">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={monthlyPoints} barCategoryGap={30}>

                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

                <XAxis axisLine={false} tickLine={false} dataKey="month" />

                <YAxis axisLine={false} tickLine={false} />

                <Tooltip />

                <Legend />

                <Bar dataKey="earn" name="Loyalty Points" fill="#374151" barSize={12} radius={[4, 4, 0, 0]} />

                <Bar dataKey="redeem" name="Redemption Points" fill="#9ca3af" barSize={12} radius={[4, 4, 0, 0]} />

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

              {kycLabelData.map((item, i) => (

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

                  {kycStatusData.map((item, index) => {

                    const inner = 40 + index * 22;
                    const outer = inner + 12;

                    return (

                      <React.Fragment key={index}>

                        {/* BACKGROUND SHADOW TRACK */}

                        <Pie
                          data={[{ value: MAX_VALUE }]}
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
                          endAngle={90 - (item.value / TOTAL_KYC) * 270}
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
            Customer Scan Report of 2026
          </h2>

          <div className="h-70">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart data={scanReportData}>

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
          Product Scan Report of 2026
        </h2>

        <div className="h-96">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              layout="vertical"
              data={productScanReport}
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis type="number" />

              <YAxis
                dataKey="product"
                type="category"
                width={120}
              />

              <Tooltip />

              <Bar
                dataKey="scans"
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

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>

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