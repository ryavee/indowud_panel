// App.jsx - Stable version (always load all providers)
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes";

// ✅ Import all context providers
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

// ✅ Wrap everything once — always load all providers
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DashboardProvider>
          <SettingsProvider>
            <CatalogProvider>
              <RedemptionsContextProvider>
                <TrackQRDataProvider>
                  <CodesProvider>
                    <DealersContextProvider>
                      <ProductProvider>
                        <PromotionalProvider>
                          <FeedProvider>
                            <TicketProvider>
                              <AnnouncementProvider>
                                <CustomerProvider>
                                  <UserProvider>
                                    {/* ✅ All providers always available */}
                                    <AppRoutes />
                                  </UserProvider>
                                </CustomerProvider>
                              </AnnouncementProvider>
                            </TicketProvider>
                          </FeedProvider>
                        </PromotionalProvider>
                      </ProductProvider>
                    </DealersContextProvider>
                  </CodesProvider>
                </TrackQRDataProvider>
              </RedemptionsContextProvider>
            </CatalogProvider>
          </SettingsProvider>
        </DashboardProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
