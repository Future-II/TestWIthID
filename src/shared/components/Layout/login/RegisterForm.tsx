import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { api } from "../../../utils/api";
import { useTranslation } from "react-i18next";

interface RegisterFormProps {
  onSuccess: (data: any) => void;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    type: "",
    // Company fields
    companyName: "",
    companyType: "",
    licenseNumber: "",
    city: "",
    termsAccepted: false,
    newsletter: false,
  });

  useEffect(() => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      type: "",
      // Company fields
      companyName: "",
      companyType: "",
      licenseNumber: "",
      city: "",
      termsAccepted: false,
      newsletter: false,
    });
    setError(null);
    setSuccessMessage(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
      if (!formData.termsAccepted) {
        throw new Error("You must accept the terms and conditions");
      }

      const { data } = await api.post("/users/auth/register", {
        ...formData,
      });

      if (data.success) {
        setSuccessMessage("Account created successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          type: "",
    // Company fields
    companyName: "",
    companyType: "",
    licenseNumber: "",
    city: "",
    termsAccepted: false,
          newsletter: false,
        });

        setTimeout(() => {
          onSuccess(data);
        }, 2000);
      }
    } catch (error: any) {
      setError(
        error?.response?.data?.message || error.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full px-4 sm:px-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        {t("logintranslator.register.subtitle")}
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-6">
        {t("logintranslator.register.description")}
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {successMessage}
        </div>
      )}

      {/* Personal Information */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <User className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            {t("logintranslator.register.personal.title")}
          </h3>
        </div>

        <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("logintranslator.register.personal.ist")}
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder={t("logintranslator.register.personal.istplace")}
              required
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("logintranslator.register.personal.last")}
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder={t("logintranslator.register.personal.istplace")}
              required
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("logintranslator.register.personal.email")}
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t("logintranslator.register.personal.emailplace")}
              required
              className="w-full pl-4 pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("logintranslator.register.personal.phone")}
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={t("logintranslator.register.personal.phoneplace")}
              required
              className="w-full pl-4 pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t("logintranslator.register.type.title")}
          </label>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="radio"
                id="company"
                name="type"
                value="company"
                checked={formData.type === "company"}
                onChange={handleInputChange}
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="company" className="ml-3 block text-sm font-medium text-gray-700">
                {t("logintranslator.register.type.company")}
                <span className="block text-xs text-gray-500 mt-1">
                  {t("logintranslator.register.type.companyDesc")}
                </span>
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="individual"
                name="type"
                value="individual"
                checked={formData.type === "individual"}
                onChange={handleInputChange}
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="individual" className="ml-3 block text-sm font-medium text-gray-700">
                {t("logintranslator.register.type.individual")}
                <span className="block text-xs text-gray-500 mt-1">
                  {t("logintranslator.register.type.individualDesc")}
                </span>
              </label>
            </div>
          </div>
        </div>

        {formData.type === "company" && (
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="h-5 w-5 bg-green-100 rounded mr-2 flex items-center justify-center">
                <User className="h-3 w-3 text-green-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                {t("logintranslator.register.company.title")}
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t("logintranslator.register.company.name")}
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder={t("logintranslator.register.company.placeholder")}
                  required={formData.type === "company"}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="companyType" className="block text-sm font-medium text-gray-700 mb-2">
                  {t("logintranslator.register.company.type.title")}
                </label>
                <select
                  id="companyType"
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleInputChange}
                  required={formData.type === "company"}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">{t("logintranslator.register.company.type.a")}</option>
                  <option value="real-estate">{t("logintranslator.register.company.type.b")}</option>
                  <option value="construction">{t("logintranslator.register.company.type.c")}</option>
                  <option value="property-management">{t("logintranslator.register.company.type.d")}</option>
                </select>
              </div>
              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  {t("logintranslator.register.company.license")}
                </label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder={t("logintranslator.register.company.licplaceholder")}
                  required={formData.type === "company"}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  {t("logintranslator.register.company.city.title")}
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required={formData.type === "company"}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">{t("logintranslator.register.company.city.a")}</option>
                  <option value="riyadh">{t("logintranslator.register.company.city.b")}</option>
                  <option value="jeddah">{t("logintranslator.register.company.city.c")}</option>
                  <option value="dammam">{t("logintranslator.register.company.city.d")}</option>
                  <option value="mecca">{t("logintranslator.register.company.city.e")}</option>
                  <option value="medina">{t("logintranslator.register.company.city.f")}</option>
                </select>
              </div>
            </div>
          </div>
        )}

      {/* Account Information */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="h-5 w-5 bg-purple-100 rounded mr-2 flex items-center justify-center">
            <Lock className="h-3 w-3 text-purple-600" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            {t("logintranslator.register.account.title")}
          </h3>
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("logintranslator.register.account.pass")}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={t("logintranslator.register.account.passplace")}
              required
              minLength={6}
              className="w-full pl-4 pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("logintranslator.register.account.cpass")}
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder={t("logintranslator.register.account.cpassplace")}
              required
              className="w-full pl-4 pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Terms & Newsletter */}
      <div className="mb-4">
        <div className="flex items-start mb-3">
          <input
            type="checkbox"
            id="termsAccepted"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleInputChange}
            required
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
          />
          <label
            htmlFor="termsAccepted"
            className="ml-2 text-xs sm:text-sm text-gray-700"
          >
            I agree to{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Privacy Policy
            </a>
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="newsletter"
            name="newsletter"
            checked={formData.newsletter}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
          />
          <label
            htmlFor="newsletter"
            className="ml-2 text-xs sm:text-sm text-gray-700"
          >
            {t("logintranslator.register.account.receive")}
          </label>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || successMessage !== null}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 sm:py-3 px-4 rounded-lg font-medium text-sm sm:text-base hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
      >
        {loading
          ? "Creating account..."
          : successMessage
          ? "Account Created!"
          : "Create account"}
      </button>
    </form>
  );
};

export default RegisterForm;
