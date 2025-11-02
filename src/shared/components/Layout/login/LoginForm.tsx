import React, { useState } from "react";
import { Mail, Eye, EyeOff } from "lucide-react";
import { api } from "../../../utils/api";
import { useTranslation } from "react-i18next";

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await api.post("/users/auth/login", { email, password });

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (remember) {
          localStorage.setItem("rememberLogin", "true");
        }

        onSuccess();
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error: any) {
      setError(error?.response?.data?.message || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full px-4 sm:px-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        {t("logintranslator.login.subtitle")}
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-4">
        {t("logintranslator.login.description")}
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Email Field */}
      <div className="mb-4">
        <label
          htmlFor="loginEmail"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {t("logintranslator.login.email")}
        </label>
        <div className="relative">
          <input
            id="loginEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("logintranslator.login.placeholder")}
            required
            className="w-full pl-4 pr-12 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Password Field */}
      <div className="mb-4">
        <label
          htmlFor="loginPassword"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {t("logintranslator.login.pass")}
        </label>
        <div className="relative">
          <input
            id="loginPassword"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("logintranslator.login.placeholder1")}
            required
            className="w-full pl-4 pr-12 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Remember me & Forgot password */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
            {t("logintranslator.login.remember")}
          </label>
        </div>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
          {t("logintranslator.login.forget")}
        </a>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 sm:py-3 px-4 rounded-lg font-medium text-sm sm:text-base hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* Test credentials */}
      <div className="mt-6 text-center text-xs sm:text-sm text-gray-500 bg-gray-50 p-2 sm:p-3 rounded-lg">
        For testing: admin@reports.com / 123456
      </div>
    </form>
  );
};

export default LoginForm;
