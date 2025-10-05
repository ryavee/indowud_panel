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

function App() {
  return (
    <AuthProvider>
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
                          <BrowserRouter>
                            <AppRoutes />
                          </BrowserRouter>
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
    </AuthProvider>
  );
}

export default App;
