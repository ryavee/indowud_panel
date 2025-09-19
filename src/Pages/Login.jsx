import { useState } from "react";
import { useAuth } from "../Hooks/useAuth";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo_Indowud.png";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = login(email, password);
    setLoading(false);

    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <header
        className="flex items-center justify-center gap-3 shadow-md py-4"
        style={{ backgroundColor: "#fe9f45" }}
      >
        <img src={logo} alt="Logo" className="h-10 w-10" />
        <h1 className="text-xl font-bold text-white">Indowud Private Limited</h1>
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
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#fe9f45]"
              required
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
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#fe9f45] pr-10"
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
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="form-checkbox text-[#fe9f45]" />
              Remember me
            </label>
            <a href="#" className="text-[#fe9f45] hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#fe9f45] text-white py-3 rounded font-semibold hover:bg-orange-400 transition disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
