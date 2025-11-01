// App.jsx - Role-based Dynamic Providers

import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import AppRoutes from "./Routes/AppRoutes";

// Context Providers
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

// 🔧 Mapping provider names to components
const providerComponents = {
  Dashboard: DashboardProvider,
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
};

// 🎯 Define which providers each role needs
const roleProviders = {
  "Super Admin": [
    "Dashboard",
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
  ],
  Admin: [
    "Dashboard",
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
  ],
  "QR Generate": [
    "Dealers",
    "Product",
    "Codes",
  ],
  Guest: [],
};

// 🔧 DynamicProviders Component
const DynamicProviders = ({ children }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const role = storedUser?.role || storedUser?.user?.role || "Guest";
      console.log("🎭 User Role:", role);
      setUserRole(role);
    } catch (error) {
      console.error("⚠️ Failed to parse user from localStorage:", error);
      setUserRole("Guest");
    }
  }, []);

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

  // Get allowed providers for this role
  const allowedProviders = roleProviders[userRole] || [];
  console.log(`📦 Loading ${allowedProviders.length} providers for role: ${userRole}`);

  // Wrap children with nested providers
  let wrappedChildren = children;

  // Reverse to wrap from innermost to outermost
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

// 🔹 App Component
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
