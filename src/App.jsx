import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes";
import { AuthProvider } from "./Context/AuthContext";
import { UserProvider } from "./Context/userContext";
import { CustomerProvider } from "./Context/CustomerContext";
import { AnnouncementProvider } from "./Context/AnnouncementContext";
import { TicketProvider } from "./Context/TicketsContext";
import { FeedProvider } from "./Context/FeedContext";
import { PromotionalProvider } from "./Context/PromotionalContext";

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
