import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes";
import { AuthProvider } from "./Context/AuthContext";
import { UserProvider } from "./Context/userContext";
import { CustomerProvider } from "./Context/CustomerContext";

function App() {
  return (
    <AuthProvider>
      <CustomerProvider>
        <UserProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </UserProvider>
      </CustomerProvider>
    </AuthProvider>
  );
}

export default App;
