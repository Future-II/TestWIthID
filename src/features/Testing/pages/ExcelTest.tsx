import React, { useState } from "react";
import { extractReportData } from "../api";
import { 
  Upload, 
  FileCheck, 
  CheckCircle, 
  Save,
  FileText,
  RefreshCw
} from "lucide-react";

import { 
  ValidationError, 
  ValidationResults,
  validateExcelData,
} from "../utils/validations";
import { readExcelFile, downloadCorrectedExcel } from "../utils/excelUtils";

// Components
import ProgressIndicator from "../components/ProgressIndicator";
import StepHeader from "../components/StepHeader";
import FileUpload from "../components/FileUpload";
import CheckResult from "../components/CheckResult";
import NavigationButtons from "../components/NavigationButtons";
import LoadingSpinner from "../components/LoadingSpinner";
import SuccessState from "../components/SuccessState";

const ExcelTest: React.FC = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState<
    'excel-upload' | 'excel-validation' | 'pdf-upload' | 'upload-to-db' | 'success'
  >('excel-upload');

  // Files & data
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [excelDataSheets, setExcelDataSheets] = useState<any[][][]>([]);
  
  // Validation state
  const [validationResults, setValidationResults] = useState<ValidationResults>({
    hasEmptyFields: false,
    hasFractionInFinalValue: false,
    hasInvalidPurposeId: false,
    hasInvalidValuePremiseId: false,
    hasMissingRequiredHeaders: false,
    isReportValueValid: true,
    totalErrors: 0
  });
  
  const [excelErrors, setExcelErrors] = useState<ValidationError[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  // Step definitions for progress indicator
  const steps = [
    { step: 'excel-upload', label: 'Excel Upload', icon: Upload },
    { step: 'excel-validation', label: 'Excel Validation', icon: FileCheck },
    { step: 'pdf-upload', label: 'PDF Upload', icon: FileText },
    { step: 'upload-to-db', label: 'Upload to DB', icon: Save },
    { step: 'success', label: 'Success', icon: CheckCircle }
  ];

  // Step 1: Excel File Upload
  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setExcelFile(files[0]);
      setError("");
      try {
        const sheetsData = await readExcelFile(files[0]);
        setExcelDataSheets(sheetsData);
      } catch (err) {
        console.error(err);
        setError("Error reading Excel file. Please make sure the file is valid.");
      }
    }
  };

  // Step 2: Validate Excel File
  const handleValidateExcel = async () => {
    if (!excelFile || !excelDataSheets.length) return;
    
    setIsValidating(true);
    
    setTimeout(() => {
      const { errors, results } = validateExcelData(excelDataSheets);
      
      setExcelErrors(errors);
      setValidationResults(results);
      setIsValidating(false);

      if (errors.length === 0) {
        setCurrentStep('pdf-upload');
      }
    }, 1500);
  };

  // Step 3: PDF Upload
  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setPdfFile(files[0]);
      setCurrentStep('upload-to-db');
    }
  };

  // Step 4: Upload to DB
  const handleUploadToDB = async () => {
    if (!excelFile || !pdfFile) return;
    
    try {
      setIsUploading(true);
      const response: any = await extractReportData(excelFile, [pdfFile]);
      
      if (response?.status === "FAILED" && response.error) {
        setError(response.error);
        return;
      }
      
      if (response?.status === "SAVED" || response?.status === "SUCCESS") {
        setCurrentStep('success');
      }

    } catch (error) {
      console.error("Error:", error);
      setError("Error saving report. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Download corrected file
  const handleDownloadCorrectedExcel = () => {
    downloadCorrectedExcel(excelDataSheets, excelErrors, "corrected_report.xlsx");
  };

  // Reset validation state
  const resetValidationState = () => {
    setExcelErrors([]);
    setValidationResults({
      hasEmptyFields: false,
      hasFractionInFinalValue: false,
      hasInvalidPurposeId: false,
      hasInvalidValuePremiseId: false,
      hasMissingRequiredHeaders: false,
      isReportValueValid: true,
      totalErrors: 0
    });
    setCurrentStep('excel-upload');
  };

  // Reset entire process
  const resetProcess = () => {
    setCurrentStep('excel-upload');
    setExcelFile(null);
    setPdfFile(null);
    setExcelDataSheets([]);
    setExcelErrors([]);
    setError("");
  };

  const isExcelValid = excelErrors.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🧪 Excel File Test</h1>
          <p className="text-gray-600">Sequential testing process for Excel reports</p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator currentStep={currentStep} steps={steps} />

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Step 1: Excel Upload */}
          {currentStep === 'excel-upload' && (
            <div className="space-y-6">
              <StepHeader
                icon={Upload}
                title="Upload Excel File"
                description="Start by uploading your Excel file"
                iconColor="text-blue-500"
              />

              <FileUpload
                label="Excel File"
                accept=".xlsx,.xls"
                onFileChange={handleExcelUpload}
                file={excelFile}
                description="Upload Excel file with report data"
              />

              <div className="text-center pt-4">
                <button
                  onClick={() => setCurrentStep('excel-validation')}
                  disabled={!excelFile}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 mx-auto ${
                    excelFile
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Validate Excel File
                  <FileCheck className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Excel Validation */}
          {currentStep === 'excel-validation' && (
            <div className="space-y-6">
              <StepHeader
                icon={FileCheck}
                title="Validate Excel File"
                description="Check your Excel file for errors before proceeding"
                iconColor="text-yellow-500"
              />

              {excelFile && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-blue-800">Current file</p>
                      <p className="text-sm text-blue-600">{excelFile.name}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Show validation button only when not validating and no results yet */}
              {!isValidating && excelErrors.length === 0 && (
                <div className="text-center">
                  <button
                    onClick={handleValidateExcel}
                    disabled={!excelFile}
                    className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors"
                  >
                    <FileCheck className="w-4 h-4" />
                    Start Validation
                  </button>
                </div>
              )}

              {isValidating && (
                <LoadingSpinner message="Validating Excel file..." />
              )}

              {/* Validation Results */}
              {!isValidating && excelErrors.length > 0 && (
                <CheckResult
                  results={validationResults}
                  errorCount={excelErrors.length}
                  onDownloadCorrected={handleDownloadCorrectedExcel}
                  onUploadNew={resetValidationState}
                />
              )}

              {/* Success State */}
              {!isValidating && isExcelValid && excelErrors.length === 0 && validationResults.totalErrors === 0 && (
                <SuccessState
                  title="Validation Successful"
                  message="No errors found in your Excel file"
                  actionLabel="Continue to PDF Upload"
                  onAction={() => setCurrentStep('pdf-upload')}
                />
              )}
            </div>
          )}

          {/* Step 3: PDF Upload */}
          {currentStep === 'pdf-upload' && (
            <div className="space-y-6">
              <StepHeader
                icon={FileText}
                title="Upload PDF File"
                description="Upload the PDF report file to complete the process"
                iconColor="text-purple-500"
              />

              <FileUpload
                label="PDF File"
                accept=".pdf"
                onFileChange={handlePdfUpload}
                file={pdfFile}
                icon={FileText}
                description="Upload PDF report file"
                className="border-purple-400 hover:border-purple-400"
              />

              <NavigationButtons
                onBack={() => setCurrentStep('excel-validation')}
                onNext={() => setCurrentStep('upload-to-db')}
                nextLabel="Continue to Upload"
                backLabel="Back to Validation"
                nextDisabled={!pdfFile}
              />
            </div>
          )}

          {/* Step 4: Upload to DB */}
          {currentStep === 'upload-to-db' && (
            <div className="space-y-6">
              <StepHeader
                icon={Save}
                title="Upload to Database"
                description="Complete the process by uploading both files to the database"
                iconColor="text-green-500"
              />

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Excel File:</span>
                  <span className="text-green-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {excelFile?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">PDF File:</span>
                  <span className="text-green-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {pdfFile?.name}
                  </span>
                </div>
              </div>

              <NavigationButtons
                onBack={() => setCurrentStep('pdf-upload')}
                onNext={handleUploadToDB}
                nextLabel={isUploading ? "Uploading..." : "Upload To DB"}
                backLabel="Back to PDF Upload"
                nextDisabled={!excelFile || !pdfFile || isUploading}
                nextIcon={isUploading ? RefreshCw : Save}
              />

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Success */}
          {currentStep === 'success' && (
            <div className="space-y-6">
              <StepHeader
                icon={CheckCircle}
                title="Success!"
                description="Your report has been saved successfully"
                iconColor="text-green-500"
              />

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold text-green-800 mb-2">Process Completed</h3>
                <p className="text-green-600 mb-4">The report has been successfully processed and saved in the system.</p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={resetProcess}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Start New Test
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExcelTest;