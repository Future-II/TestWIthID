import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CheckCircle,
    ArrowLeft,
    FileText,
    RefreshCw,
    Trash2,
    Search,
    PlayCircle,
    AlertTriangle
} from "lucide-react";

import { deleteReport, validateExcelData, changeReportStatus } from "../api";
import { useTaqeemAuth } from "../../../shared/context/TaqeemAuthContext";

const DeleteReport: React.FC = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useTaqeemAuth();

    // Report ID state
    const [reportId, setReportId] = useState("");

    // Error state
    const [error, setError] = useState("");

    // Operation states
    const [isCheckingReport, setIsCheckingReport] = useState(false);
    const [reportExists, setReportExists] = useState<boolean | null>(null);
    const [deleteRequested, setDeleteRequested] = useState(false);

    // New states for status change
    const [isChangingStatus, setIsChangingStatus] = useState(false);
    const [statusChangeResult, setStatusChangeResult] = useState<any>(null);
    const [statusChangeRequested, setStatusChangeRequested] = useState(false);

    // Handle report validation in Taqeem
    const handleCheckReportInTaqeem = async () => {
        if (!reportId.trim()) {
            setError("Please enter a report ID");
            return;
        }

        setIsCheckingReport(true);
        setError("");
        setReportExists(null);
        setStatusChangeResult(null);
        setStatusChangeRequested(false);

        try {
            const result = await validateExcelData(reportId, {});
            console.log("Full API response:", result);

            // The Python response is wrapped in result.data by Express
            const pythonResponse = result.data;
            console.log("Python response:", pythonResponse);

            // Check the status from the Python backend response
            if (pythonResponse?.status === 'NOT_FOUND') {
                setReportExists(false);
                setError("Report with this ID does not exist. Please check the ID and try again.");
            } else if (pythonResponse?.status === 'SUCCESS') {
                setReportExists(true);
                setError("");
            } else if (pythonResponse?.status === 'MACROS_EXIST') {
                setReportExists(false);
                setError(`Report exists with ${pythonResponse?.assetsExact || pythonResponse?.microsCount || 'unknown'} macros. Please use a different report ID.`);
            } else if (pythonResponse?.status === 'FAILED') {
                setReportExists(false);
                setError(pythonResponse?.error || "Failed to check report ID");
            } else {
                // Handle unexpected status values
                setReportExists(false);
                setError("Unexpected response from server. Please try again.");
            }
        } catch (err: any) {
            console.error("Error checking report:", err);

            // Handle different error scenarios
            if (err?.response?.status === 400) {
                setReportExists(false);
                setError("Invalid request. Please check the report ID and try again.");
            } else if (err?.response?.status === 401) {
                setReportExists(false);
                setError("Please log in to check report ID.");
            } else if (err?.response?.status === 500) {
                setReportExists(false);
                setError("Server error. Please try again later.");
            } else if (err?.response?.status === 504) {
                setReportExists(false);
                setError("Request timeout. Please try again.");
            } else {
                setReportExists(false);
                setError(err.message || "Error checking report ID. Please try again.");
            }
        } finally {
            setIsCheckingReport(false);
        }
    };

    // Handle report deletion - fire and forget
    const handleDeleteReport = async () => {
        if (!reportId.trim()) {
            setError("Report ID is required");
            return;
        }

        setError("");
        setDeleteRequested(true);
        setStatusChangeResult(null);
        setStatusChangeRequested(false);

        try {
            console.log(`Sending delete request for report: ${reportId}`);

            // Fire the delete request but don't wait for response
            deleteReport(reportId).then(result => {
                console.log("Report deletion completed:", result);
            }).catch(err => {
                console.error("Report deletion encountered error:", err);
                // Don't show errors to user since we're doing fire-and-forget
            });

        } catch (err: any) {
            console.error("Error initiating report deletion:", err);
            // Don't set error state since we're doing fire-and-forget
        }
    };

    // Handle changing report status
    // Handle changing report status
    const handleChangeReportStatus = async () => {
        if (!reportId.trim()) {
            setError("Report ID is required");
            return;
        }

        setIsChangingStatus(true);
        setError("");
        setStatusChangeResult(null);
        setStatusChangeRequested(false);

        try {
            console.log(`Changing status for report: ${reportId}`);

            const result = await changeReportStatus(reportId);
            console.log("Status change result:", result);

            // Extract the Python response from result.data
            const pythonResponse = result.data;
            console.log("Python response:", pythonResponse);

            setStatusChangeResult(pythonResponse); // Store the actual Python response
            setStatusChangeRequested(true);

        } catch (err: any) {
            console.error("Error changing report status:", err);

            // Handle different error scenarios
            if (err?.response?.status === 400) {
                setError("Invalid request. Please check the report ID and try again.");
            } else if (err?.response?.status === 401) {
                setError("Please log in to change report status.");
            } else if (err?.response?.status === 500) {
                setError("Server error. Please try again later.");
            } else if (err?.response?.status === 504) {
                setError("Request timeout. Please try again.");
            } else {
                setError(err.message || "Error changing report status. Please try again.");
            }
        } finally {
            setIsChangingStatus(false);
        }
    };

    // Render status change result
    const renderStatusChangeResult = () => {
        if (!statusChangeResult) return null;

        const { status, message, error, wasCancelled, previousStatus, currentStatus } = statusChangeResult;

        if (status === 'CHANGED') {
            return (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                            <p className="font-medium text-green-800">Status Changed Successfully</p>
                            <p className="text-sm text-green-600">{message}</p>
                            <p className="text-xs text-green-500 mt-1">
                                Previous status: <strong>{previousStatus}</strong> → Current status: <strong>CANCELLED</strong>
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        if (status === 'NOT_CANCELLED') {
            return (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-blue-500" />
                        <div>
                            <p className="font-medium text-blue-800">Status Not Changed</p>
                            <p className="text-sm text-blue-600">{message}</p>
                            <p className="text-xs text-blue-500 mt-1">
                                Current status: <strong>{currentStatus}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        if (status === 'FAILED') {
            return (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <div>
                            <p className="font-medium text-red-800">Status Change Failed</p>
                            <p className="text-sm text-red-600">{error || "Failed to change report status"}</p>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-8">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-800 mb-4 mx-auto transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">🗑️ Delete Report</h1>
                    <p className="text-gray-600">Permanently delete a report and all its associated data</p>
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    {/* Main Form */}
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Report</h2>
                            <p className="text-gray-600">Enter the report ID to delete it permanently</p>
                        </div>

                        <div className="space-y-6">
                            {/* Report ID Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Report ID *
                                </label>
                                <div className="flex gap-3 mb-3">
                                    <input
                                        type="text"
                                        value={reportId}
                                        onChange={(e) => {
                                            setReportId(e.target.value);
                                            setError("");
                                            setReportExists(null);
                                            setDeleteRequested(false);
                                            setStatusChangeResult(null);
                                            setStatusChangeRequested(false);
                                        }}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                        placeholder="Enter report ID to delete"
                                    />
                                    <button
                                        onClick={handleCheckReportInTaqeem}
                                        disabled={!reportId.trim() || isCheckingReport || !isLoggedIn}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors whitespace-nowrap"
                                    >
                                        {isCheckingReport ? (
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Search className="w-4 h-4" />
                                        )}
                                        {isCheckingReport ? "Checking..." : "Check Report"}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Enter the report ID you want to permanently delete
                                </p>

                                {/* Report Validation Status */}
                                {reportExists === true && (
                                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span className="text-green-700 text-sm font-medium">
                                                Report verified successfully
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {reportExists === false && (
                                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-red-500" />
                                            <span className="text-red-700 text-sm">
                                                Report not found or invalid
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Status Change Section - ALWAYS VISIBLE */}
                            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <PlayCircle className="w-5 h-5 text-blue-500" />
                                    Change Report Status
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    Change the report status before deletion if needed.
                                </p>

                                <button
                                    onClick={handleChangeReportStatus}
                                    disabled={!reportId.trim() || isChangingStatus || !isLoggedIn}
                                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                                >
                                    {isChangingStatus ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <PlayCircle className="w-4 h-4" />
                                    )}
                                    {isChangingStatus ? "Changing Status..." : "Change Report Status"}
                                </button>

                                {/* Status Change Result */}
                                {renderStatusChangeResult()}
                            </div>

                            {/* Delete Request Sent Confirmation */}
                            {deleteRequested && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-blue-500" />
                                        <div>
                                            <p className="font-medium text-blue-800">Delete Request Sent</p>
                                            <p className="text-sm text-blue-600">
                                                Delete request sent for Report ID: <strong>{reportId}</strong>
                                            </p>
                                            <p className="text-xs text-blue-500 mt-1">
                                                You can send multiple delete requests if needed.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error Display */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-red-500" />
                                        <span className="text-red-700">{error}</span>
                                    </div>
                                </div>
                            )}

                            {/* Warning Box */}
                            {!deleteRequested && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-yellow-500" />
                                        <div>
                                            <p className="font-medium text-yellow-800">Warning: Irreversible Action</p>
                                            <p className="text-sm text-yellow-600">
                                                This action will permanently delete the report and all associated data. This cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </button>
                                <button
                                    onClick={handleDeleteReport}
                                    disabled={!reportId.trim() || !isLoggedIn}
                                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteReport;