import { useState } from "react";
import { Shield, CheckCircle, FileText } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import CompanyCreationPage from "./CompanyCreationPage";

import LanguageToggle from "../../Common/LanguageToggle";
import { useTranslation } from "react-i18next";

interface AuthSystemProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AuthSystem = ({ onClose, onSuccess }: AuthSystemProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "register" | "company-creation">("login");
  const [userData, setUserData] = useState<any>(null);
  const { t } = useTranslation();

  const handleAuthSuccess = () => {
    onSuccess();
    onClose();
  };

  const handleSwitchToLogin = () => {
    setActiveTab("login");
  };

  const handleRegisterSuccess = (data: any) => {
    // Store the token for authenticated requests during company setup
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    setUserData(data);
    // For company type users, company is created during registration, no separate setup needed
    if (data.needsCompanySetup && data.user?.type !== 'company') {
      if (data.isManager) {
        setActiveTab("company-creation");
      } else {
        // Non-managers cannot join companies via secret key anymore
        handleAuthSuccess();
      }
    } else {
      handleAuthSuccess();
    }
  };

  const handleCompanySetupSuccess = () => {
    handleAuthSuccess();
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex items-center justify-center p-4">
      {/* Make the entire modal scrollable */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative overflow-y-auto">
        
        {/* Language Toggle */}
        <div className="absolute top-3 left-3">
          <LanguageToggle />
        </div>

        {/* Left Side - Marketing Info (hidden on mobile) */}
        <div className="hidden md:flex flex-1 bg-gray-50 p-12 flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t("logintranslator.realstate.title")}
            </h1>
            <p className="text-gray-600 max-w-md">
              {t("logintranslator.realstate.description")}
            </p>
          </div>

          <div className="space-y-6 max-w-md">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {t("logintranslator.realstate.title1")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("logintranslator.realstate.description1")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {t("logintranslator.realstate.title2")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("logintranslator.realstate.description2")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {t("logintranslator.realstate.title3")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("logintranslator.realstate.description3")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full md:w-[38rem] bg-white flex flex-col border-t md:border-t-0 md:border-l border-green-200">
          {/* Tabs */}
          {(activeTab === "login" || activeTab === "register") && (
            <div className="flex border-b border-gray-200 px-4 sm:px-6 pt-2 sm:pt-4 sticky top-0 bg-white z-10">
              <button
                className={`flex-1 py-2 sm:py-3 text-sm font-medium transition-all duration-200 ${
                  activeTab === "login"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("login")}
              >
                {t("logintranslator.login.title")}
              </button>
              <button
                className={`flex-1 py-2 sm:py-3 text-sm font-medium transition-all duration-200 ${
                  activeTab === "register"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("register")}
              >
                {t("logintranslator.register.title")}
              </button>
            </div>
          )}

          {/* Form Content - Remove individual scrolling */}
          <div className="p-4 sm:p-6">
            {activeTab === "login" ? (
              <LoginForm onSuccess={handleAuthSuccess} />
            ) : activeTab === "register" ? (
              <RegisterForm
                onSuccess={handleRegisterSuccess}
                onSwitchToLogin={handleSwitchToLogin}
              />
            ) : activeTab === "company-creation" ? (
              <CompanyCreationPage onSuccess={handleCompanySetupSuccess} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSystem;