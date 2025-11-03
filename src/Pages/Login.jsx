import { useState, useEffect } from "react";
import { useAuthContext } from "../Context/AuthContext";
import {
  EyeIcon,
  EyeOffIcon,
  KeyRound,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo_Indowud.png";

const Login = () => {
  const { login, handleForgotPassword, loading, error, setError } =
    useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // Clear errors when switching between screens
  useEffect(() => {
    if (setError) setError("");
    setResetError("");
    setResetMessage("");
  }, [showForgotPassword, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (setError) setError("");

    // Handle remember me functionality
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    try {
      const userData = await login(email, password);
      if (userData) {
        navigate("/dashboard");
      }
    } catch (err) {
      // Error is already handled in context, but we can add additional handling here if needed
      console.error("Login error:", err);
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

  const handleResetEmailChange = (e) => {
    setResetEmail(e.target.value);
    setResetError("");
    setResetMessage("");
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetMessage("");
    setResetSuccess(false);

    if (!resetEmail.trim()) {
      setResetError("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setResetError("Please enter a valid email address");
      return;
    }

    try {
      const response = await handleForgotPassword(resetEmail);

      if (response) {
        setResetSuccess(true);
        setResetMessage("Password reset link has been sent to your email!");

        // Auto redirect to login after 3 seconds
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetEmail("");
          setResetMessage("");
          setResetSuccess(false);
          setResetError("");
        }, 3000);
      }
    } catch (err) {
      setResetError(
        err.message || "Failed to send reset link. Please try again."
      );
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setResetEmail("");
    setResetMessage("");
    setResetError("");
    setResetSuccess(false);
    if (setError) setError("");
  };

  // Forgot Password Screen
  if (showForgotPassword) {
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

        {/* Forgot Password Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
          <form
            onSubmit={handleForgotPasswordSubmit}
            className="bg-white/90 backdrop-blur-sm border border-gray-200 p-8 sm:p-10 rounded-2xl shadow-lg w-full max-w-md space-y-5 transition-all hover:shadow-xl"
          >
            {/* Icon and Title */}
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[#169698] to-[#128083] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                {resetSuccess ? (
                  <CheckCircle2 className="w-8 h-8 text-white" />
                ) : (
                  <KeyRound className="w-8 h-8 text-white" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-[#169698]">
                Reset Password
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Enter your email address and we'll send you a link to reset your
                password
              </p>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={handleResetEmailChange}
                  required
                  disabled={loading || resetSuccess}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#169698] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Success Message */}
            {resetSuccess && resetMessage && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm shadow-sm flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{resetMessage}</span>
              </div>
            )}

            {/* Error Message */}
            {resetError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm shadow-sm">
                {resetError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || resetSuccess}
              className="w-full py-3 bg-gradient-to-r from-[#169698] to-[#128083] text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-[#128083] hover:to-[#0E6F72] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Sending..."
                : resetSuccess
                ? "Email Sent!"
                : "Send Reset Link"}
            </button>

            {/* Back to Login */}
            <button
              type="button"
              onClick={handleBackToLogin}
              disabled={loading}
              className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Back to Login
            </button>

            {/* Footer Note */}
            <p className="text-center text-xs text-gray-500 mt-3">
              © {new Date().getFullYear()} Indowud NFC Pvt. Ltd. All rights
              reserved.
            </p>
          </form>
        </div>
      </div>
    );
  }

  // Login Screen
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#169698] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#169698] focus:border-transparent pr-10 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#169698] transition disabled:text-gray-400"
                aria-label={showPassword ? "Hide password" : "Show password"}
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
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-[#169698] transition-colors group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[#169698] w-4 h-4 cursor-pointer"
                disabled={loading}
              />
              <span className="select-none">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              disabled={loading}
              className="text-[#169698] hover:text-[#128083] hover:underline transition font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Forgot password?
            </button>
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
            © {new Date().getFullYear()} Indowud NFC Pvt. Ltd. All rights
            reserved.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
