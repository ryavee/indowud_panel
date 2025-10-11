import { useState } from "react";
import { useAuthContext } from "../Context/AuthContext";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo_Indowud.png";

const Login = () => {
  const { login, loading, error, setError } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userData = await login(email, password);
      if (userData) navigate("/dashboard");
    } catch (err) {
      if (setError) setError(err.message || "Login failed. Please try again.");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error && setError) setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error && setError) setError("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-[#E6F8F6]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#169698] to-[#128083] shadow-md">
        <div className="flex items-center justify-center gap-4 px-6 py-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <img src={logo} alt="Logo" className="w-10 h-10" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            INDOWUD NFC PRIVATE LIMITED
          </h1>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-sm border border-gray-200 p-8 sm:p-10 rounded-2xl shadow-lg w-full max-w-md space-y-5 transition-all hover:shadow-xl"
        >
          {/* Welcome Text */}
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-[#169698]">Welcome Back</h2>
            <p className="text-gray-500 text-sm mt-1">
              Please sign in to continue
            </p>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              required
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#169698] focus:border-transparent transition disabled:bg-gray-100"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                required
                disabled={loading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#169698] focus:border-transparent pr-10 transition disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#169698] transition"
              >
                {showPassword ? (
                  <EyeOffIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between text-sm mt-2">
            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input
                type="checkbox"
                className="accent-[#169698] w-4 h-4"
                disabled={loading}
              />
              Remember me
            </label>
            <a
              href="#"
              className="text-[#169698] hover:text-[#128083] hover:underline transition"
            >
              Forgot password?
            </a>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm shadow-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#169698] to-[#128083] text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-[#128083] hover:to-[#0E6F72] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500 mt-3">
            © {new Date().getFullYear()} Indowud NFC Pvt. Ltd. All rights reserved.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
