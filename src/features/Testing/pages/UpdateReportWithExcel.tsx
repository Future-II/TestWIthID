import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CheckCircle,
    ArrowLeft,
    Upload,
    FileCheck,
    AlertTriangle,
    RefreshCw
} from "lucide-react";

import { uploadAssetsToDB } from "../api";
import { useTaqeemAuth } from "../../../shared/context/TaqeemAuthContext";

const UpdateReportWithExcel: React.FC = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useTaqeemAuth();

    // Form state
    const [reportId, setReportId] = useState("");
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [updateResult, setUpdateResult] = useState<any>(null);

    // Handle Excel file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0]) {
            const file = files[0];

            // Validate file type
            const validTypes = ['.xlsx', '.xls'];
            const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

            if (!validTypes.includes(fileExtension)) {
                setError("Please upload a valid Excel file (.xlsx or .xls)");
                return;
            }

            setExcelFile(file);
            setError("");
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!reportId.trim() || !excelFile) {
            setError("Report ID and Excel file are required");
            return;
        }

        setError("");
        setIsUpdating(true);

        try {
            console.log(`Updating report: ${reportId} with file: ${excelFile.name}`);

            const result = await uploadAssetsToDB(reportId, excelFile);
            console.log("Report update result:", result);

            setUpdateResult(result);

            if (result.status === "SUCCESS") {
                setSuccess(true);
            } else {
                setError(result.error || 'Failed to update report');
            }
        } catch (err: any) {
            console.error("Error updating report:", err);
            setError(err.message || 'An unexpected error occurred during report update');
        } finally {
            setIsUpdating(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setReportId("");
        setExcelFile(null);
        setError("");
        setSuccess(false);
        setUpdateResult(null);
    };

    // Remove selected file
    const removeFile = () => {
        setExcelFile(null);
        setError("");
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
                <div className="max-w-2xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-green-600 hover:text-green-800 mb-4 mx-auto transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">✅ Update Complete</h1>
                        <p className="text-gray-600">Report has been successfully updated</p>
                    </div>

                    {/* Success Content */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>

                        <h2 className="text-2xl font-semibold text-green-800 mb-4">Report Updated Successfully!</h2>

                        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                            <h3 className="font-medium text-gray-800 mb-4">Update Details:</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Report ID:</span>
                                    <span className="font-medium">{reportId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Excel File:</span>
                                    <span className="font-medium">{excelFile?.name}</span>
                                </div>
                                {updateResult?.data?.status && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <span className="font-medium text-green-600">{updateResult.data.status}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-600 mb-8">
                            The report has been successfully updated with the new asset data from the Excel file.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate("/equipment/viewReports")}
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                            >
                                View Reports
                            </button>
                            <button
                                onClick={resetForm}
                                className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-semibold transition-colors"
                            >
                                Update Another Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 mx-auto transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Update Report with Excel</h1>
                    <p className="text-gray-600">Update existing report data using Excel file with asset information</p>
                </div>

                {/* Main Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Report ID Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Report ID *
                            </label>
                            <input
                                type="text"
                                value={reportId}
                                onChange={(e) => {
                                    setReportId(e.target.value);
                                    setError("");
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter existing report ID to update"
                                disabled={isUpdating}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Enter the report ID of the existing report you want to update
                            </p>
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Excel File *
                            </label>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                <input
                                    type="file"
                                    id="excel-file"
                                    accept=".xlsx,.xls"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    disabled={isUpdating}
                                />

                                {!excelFile ? (
                                    <label htmlFor="excel-file" className="cursor-pointer">
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-lg font-medium text-gray-700 mb-1">Upload Excel File</p>
                                        <p className="text-sm text-gray-500 mb-3">
                                            Drag and drop your Excel file here, or click to browse
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Supported formats: .xlsx, .xls (2 sheets required)
                                        </p>
                                    </label>
                                ) : (
                                    <div className="space-y-3">
                                        <FileCheck className="w-12 h-12 text-green-500 mx-auto" />
                                        <p className="text-lg font-medium text-green-700">File Selected</p>
                                        <p className="text-sm text-gray-600">{excelFile.name}</p>
                                        <p className="text-xs text-gray-500">
                                            Size: {(excelFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            disabled={isUpdating}
                                            className="px-4 py-2 text-red-600 hover:text-red-800 text-sm font-medium transition-colors disabled:opacity-50"
                                        >
                                            Remove File
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Requirements Box */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                                <div>
                                    <p className="font-medium text-yellow-800 mb-2">Excel File Requirements</p>
                                    <ul className="text-sm text-yellow-700 space-y-1">
                                        <li>• Must contain exactly 2 sheets: marketAssets and costAssets</li>
                                        <li>• Asset count must match existing report</li>
                                        <li>• File size should not exceed 50MB</li>
                                        <li>• Supported formats: .xlsx, .xls</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Information Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <FileCheck className="w-5 h-5 text-blue-500" />
                                <div>
                                    <p className="font-medium text-blue-800">About This Process</p>
                                    <p className="text-sm text-blue-600">
                                        This will update an existing report with new asset data from an Excel file.
                                        The report must already exist in the system.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                    <span className="text-red-700">{error}</span>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                disabled={isUpdating}
                                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 text-gray-700 rounded-lg font-semibold transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!reportId.trim() || !excelFile || !isLoggedIn || isUpdating}
                                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                            >
                                {isUpdating ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        Updating Report...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Update Report
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateReportWithExcel;