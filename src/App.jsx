import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes";
import { AuthProvider } from "./Context/AuthContext";
import { UserProvider } from "./Context/userContext";
import { CustomerProvider } from "./Context/CustomerContext";
import { AnnouncementProvider } from "./Context/AnnouncementContext";

function App() {
  return (
    <AuthProvider>
      <AnnouncementProvider>
        <CustomerProvider>
          <UserProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </UserProvider>
        </CustomerProvider>
      </AnnouncementProvider>
    </AuthProvider>
  );
}

export default App;
