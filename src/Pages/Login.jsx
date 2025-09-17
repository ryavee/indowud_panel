import { useState } from "react";
import { useAuth } from "../Hooks/useAuth";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useNavigate } from "react-router-dom"; // <-- import navigate
import logo from "../assets/logo_Indowud.png";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // <-- create navigate instance

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(email, password); // login should return true/false
    if (success) {
      navigate("/dashboard"); // redirect on success
    } else {
      alert("Invalid credentials. Use admin@example.com / password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-100 p-4 shadow flex items-center gap-4">
        <img src={logo} alt="Logo" className="h-10 w-10" />
        <h1 className="text-xl font-bold">Indowud Private Limited</h1>
      </header>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col gap-4"
        >
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeOffIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
