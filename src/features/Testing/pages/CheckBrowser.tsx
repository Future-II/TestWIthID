import React, { useState } from "react";
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Plus } from "lucide-react";
import { checkBrowserStatus, createNewWindow } from "../api";

const CheckBrowser: React.FC = () => {
    const [isChecking, setIsChecking] = useState(false);
    const [isCreatingWindow, setIsCreatingWindow] = useState(false);
    const [browserStatus, setBrowserStatus] = useState<{
        isOpen: boolean | null;
        message: string;
        error?: string;
    }>({
        isOpen: null,
        message: "Check browser status"
    });
    const [windowCreationResult, setWindowCreationResult] = useState<{
        success: boolean | null;
        message: string;
        error?: string;
    } | null>(null);

    const handleCheckBrowser = async () => {
        setIsChecking(true);
        setWindowCreationResult(null); // Clear previous window creation result
        setBrowserStatus({
            isOpen: null,
            message: "Checking browser status..."
        });

        try {
            const result = await checkBrowserStatus();
            console.log("Browser status result:", result);

            setBrowserStatus({
                isOpen: result.browserOpen,
                message: result.message,
                error: result.error
            });
        } catch (err: any) {
            setBrowserStatus({
                isOpen: false,
                message: "Failed to check browser status",
                error: err.message || "Unknown error occurred"
            });
        } finally {
            setIsChecking(false);
        }
    };

    const handleCreateNewWindow = async () => {
        if (!browserStatus.isOpen) return;

        setIsCreatingWindow(true);
        setWindowCreationResult(null);

        try {
            const result = await createNewWindow();
            console.log("New window creation result:", result);

            setWindowCreationResult({
                success: true,
                message: result.message || "New browser window created successfully",
            });
        } catch (err: any) {
            setWindowCreationResult({
                success: false,
                message: "Failed to create new browser window",
                error: err.message || "Unknown error occurred"
            });
        } finally {
            setIsCreatingWindow(false);
        }
    };

    const getStatusIcon = () => {
        if (browserStatus.isOpen === true) {
            return <CheckCircle className="w-8 h-8 text-green-600" />;
        } else if (browserStatus.isOpen === false) {
            return browserStatus.error ? (
                <AlertCircle className="w-8 h-8 text-orange-500" />
            ) : (
                <XCircle className="w-8 h-8 text-red-600" />
            );
        }
        return <RefreshCw className="w-8 h-8 text-gray-400" />;
    };

    const getStatusColor = () => {
        if (browserStatus.isOpen === true) return "text-green-600";
        if (browserStatus.isOpen === false) {
            return browserStatus.error ? "text-orange-500" : "text-red-600";
        }
        return "text-gray-400";
    };

    const getStatusText = () => {
        if (browserStatus.isOpen === true) return "Browser is Open & Logged In";
        if (browserStatus.isOpen === false) {
            return browserStatus.error ? "Browser Issue" : "Browser is Closed";
        }
        return "Check Browser Status";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-md mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">🌐 Check Browser</h1>
                    <p className="text-gray-600">Check browser status and login state</p>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="text-center">
                        {/* Status Icon */}
                        <div className="mb-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                {getStatusIcon()}
                            </div>
                        </div>

                        {/* Status Text */}
                        <h2 className={`text-2xl font-bold mb-2 ${getStatusColor()}`}>
                            {getStatusText()}
                        </h2>

                        {/* Status Message */}
                        <p className="text-gray-600 mb-4">
                            {browserStatus.message}
                        </p>

                        {/* Error Display */}
                        {browserStatus.error && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                                <div className="flex items-center gap-2 justify-center">
                                    <AlertCircle className="w-4 h-4 text-orange-500" />
                                    <span className="text-orange-700 text-sm">{browserStatus.error}</span>
                                </div>
                            </div>
                        )}

                        {/* Window Creation Result */}
                        {windowCreationResult && (
                            <div className={`border rounded-lg p-3 mb-4 ${windowCreationResult.success
                                    ? "bg-green-50 border-green-200"
                                    : "bg-red-50 border-red-200"
                                }`}>
                                <div className="flex items-center gap-2 justify-center">
                                    {windowCreationResult.success ? (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-red-600" />
                                    )}
                                    <span className={
                                        windowCreationResult.success
                                            ? "text-green-700 text-sm"
                                            : "text-red-700 text-sm"
                                    }>
                                        {windowCreationResult.message}
                                    </span>
                                </div>
                                {windowCreationResult.error && (
                                    <p className="text-red-600 text-xs mt-1">
                                        {windowCreationResult.error}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Detailed Status Info */}
                        {browserStatus.isOpen !== null && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <div className="text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Browser:</span>
                                        <span className={browserStatus.isOpen ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                            {browserStatus.isOpen ? "Open" : "Closed"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span>Authentication:</span>
                                        <span className={browserStatus.isOpen ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                            {browserStatus.isOpen ? "Logged In" : "Not Logged In"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Check Button */}
                        <button
                            onClick={handleCheckBrowser}
                            disabled={isChecking}
                            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors mb-3"
                        >
                            {isChecking ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4" />
                            )}
                            {isChecking ? "Checking..." : "Check Browser Status"}
                        </button>

                        {/* Create New Window Button */}
                        <button
                            onClick={handleCreateNewWindow}
                            disabled={!browserStatus.isOpen || isCreatingWindow}
                            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                        >
                            {isCreatingWindow ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            {isCreatingWindow ? "Creating..." : "Create New Window"}
                        </button>

                        {/* Additional Info */}
                        <p className="text-xs text-gray-500 mt-4">
                            {browserStatus.isOpen
                                ? "Browser is ready - you can create new windows"
                                : "Check browser status first to enable window creation"
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckBrowser;