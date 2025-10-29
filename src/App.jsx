// App.jsx - Optimized with role-based context providers

import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes";
import { AuthProvider } from "./Context/AuthContext";
import { UserProvider } from "./Context/userContext";
import { CustomerProvider } from "./Context/CustomerContext";
import { AnnouncementProvider } from "./Context/AnnouncementContext";
import { TicketProvider } from "./Context/TicketsContext";
import { FeedProvider } from "./Context/FeedContext";
import { PromotionalProvider } from "./Context/PromotionalContext";
import { ProductProvider } from "./Context/ProductsContext";
import { DealersContextProvider } from "./Context/DealersContext";
import { CodesProvider } from "./Context/CodesContext";
import { TrackQRDataProvider } from "./Context/TrackQRDataContext";
import { RedemptionsContextProvider } from "./Context/RedemptionContext";
import { CatalogProvider } from "./Context/CatalogContext";
import { DashboardProvider } from "./Context/DashboardContext";
import { SettingsProvider } from "./Context/SettingsContext";
import { useEffect, useState } from "react";

// 🎯 Define which providers each role needs
const roleProviders = {
  Admin: [
    "Settings",
    "Catalog",
    "Redemptions",
    "TrackQRData",
    "Codes",
    "Dealers",
    "Product",
    "Promotional",
    "Feed",
    "Ticket",
    "Announcement",
    "Customer",
    "User",
    "Dashboard",
  ],
  "QR Generate": [
    "Dealers", // For Dealers page
    "Product", // For Products page
    "Codes", // For QR Generation page
  ],
  // Add more roles as needed
};

// 🧩 Provider component mapping
const providerComponents = {
  Settings: SettingsProvider,
  Catalog: CatalogProvider,
  Redemptions: RedemptionsContextProvider,
  TrackQRData: TrackQRDataProvider,
  Codes: CodesProvider,
  Dealers: DealersContextProvider,
  Product: ProductProvider,
  Promotional: PromotionalProvider,
  Feed: FeedProvider,
  Ticket: TicketProvider,
  Announcement: AnnouncementProvider,
  Customer: CustomerProvider,
  User: UserProvider,
  Dashboard: DashboardProvider,
};

// 🔧 Dynamic Provider Wrapper Component
const DynamicProviders = ({ children }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Get user role from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || user?.user?.role || "Guest";
    setUserRole(role);
    console.log("🎭 User Role:", role);
  }, []);

  // Wait for role to be determined
  if (!userRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#169698] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Get providers for this role
  const allowedProviders = roleProviders[userRole] || [];
  console.log(
    `📦 Loading ${allowedProviders.length} providers for role: ${userRole}`
  );

  // Build nested providers dynamically
  let wrappedChildren = children;

  // Reverse the array to wrap from innermost to outermost
  [...allowedProviders].reverse().forEach((providerName) => {
    const Provider = providerComponents[providerName];
    if (Provider) {
      wrappedChildren = <Provider>{wrappedChildren}</Provider>;
    } else {
      console.warn(`⚠️ Provider "${providerName}" not found`);
    }
  });

  return wrappedChildren;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DynamicProviders>
          <AppRoutes />
        </DynamicProviders>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
