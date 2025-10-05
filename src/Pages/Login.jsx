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
      console.log("Logged in user:", userData);

      if (userData) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (!error && setError) {
        setError(err.message || "Login failed. Please try again.");
      }
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error && setError) {
      setError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error && setError) {
      setError("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="flex items-center justify-center gap-4 px-6 py-4">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-10 h-10" />
          </div>
          <h1 className="text-lg font-bold text-white">
            INDOWUD NFC PRIVATE LIMITED
          </h1>
        </div>
      </header>



      {/* Body */}
      <div className="flex-1 flex items-center justify-center relative">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-4"
        >
          {/* Tagline */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">Welcome</h2>
            <p className="text-gray-500 text-sm">Please sign in to continue</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#fe9f45]"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#fe9f45] pr-10"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                disabled={loading}
              >
                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox text-[#fe9f45]"
                disabled={loading}
              />
              Remember me
            </label>
            <a href="#" className="text-[#fe9f45] hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#fe9f45] text-white py-3 rounded font-semibold hover:bg-orange-400 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
