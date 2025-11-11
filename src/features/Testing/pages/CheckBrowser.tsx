import React, { useState } from "react";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { checkBrowserStatus } from "../api";



const CheckBrowser: React.FC = () => {
    const [isChecking, setIsChecking] = useState(false);
    const [browserStatus, setBrowserStatus] = useState<boolean | null>(null);
    const [error, setError] = useState("");

    const handleCheckBrowser = async () => {
        setIsChecking(true);
        setError("");

        try {
            const result = await checkBrowserStatus();
            console.log("Browser status result:", result);
            setBrowserStatus(result.browserOpen);
        } catch (err: any) {
            setError(err.message || "Failed to check browser status");
            setBrowserStatus(null);
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-md mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">🌐 Check Browser</h1>
                    <p className="text-gray-600">Check if the browser is currently open</p>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="text-center">
                        {/* Status Icon */}
                        <div className="mb-6">
                            {browserStatus === true && (
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                            )}
                            {browserStatus === false && (
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <XCircle className="w-8 h-8 text-red-600" />
                                </div>
                            )}
                            {browserStatus === null && (
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <RefreshCw className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* Status Text */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {browserStatus === true && "Browser is Open"}
                            {browserStatus === false && "Browser is Closed"}
                            {browserStatus === null && "Check Browser Status"}
                        </h2>

                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-2 justify-center">
                                    <XCircle className="w-4 h-4 text-red-500" />
                                    <span className="text-red-700">{error}</span>
                                </div>
                            </div>
                        )}

                        {/* Check Button */}
                        <button
                            onClick={handleCheckBrowser}
                            disabled={isChecking}
                            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                        >
                            {isChecking ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4" />
                            )}
                            {isChecking ? "Checking..." : "Check Browser"}
                        </button>

                        {/* Additional Info */}
                        <p className="text-sm text-gray-500 mt-4">
                            Click the button to check the current browser status
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckBrowser;