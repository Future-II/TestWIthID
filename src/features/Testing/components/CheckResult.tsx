import React from 'react';
import { AlertCircle, CheckCircle, Download, Upload } from 'lucide-react';
import { ValidationResults as ValidationResultsType } from '../utils/validations';

interface ValidationResultsProps {
  results: ValidationResultsType;
  errorCount: number;
  onDownloadCorrected: () => void;
  onUploadNew: () => void;
}

const CheckResult: React.FC<ValidationResultsProps> = ({
  results,
  errorCount,
  onDownloadCorrected,
  onUploadNew
}) => {
  const validationItems = [
    { key: 'hasEmptyFields', label: 'Empty Fields', description: 'All required fields are filled' },
    { key: 'hasFractionInFinalValue', label: 'Fractions', description: 'Final values are integers' },
    { key: 'hasInvalidPurposeId', label: 'Purpose IDs', description: 'Valid purpose IDs' },
    { key: 'hasInvalidValuePremiseId', label: 'Value Premise', description: 'Valid value premises' },
    { key: 'hasMissingRequiredHeaders', label: 'Required Headers', description: 'All headers present' },
    { key: 'isReportValueValid', label: 'Value Match', description: 'Report value matches assets sum', invert: true }
  ];

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <h3 className="font-semibold text-red-800">Validation Failed</h3>
      </div>
      <p className="text-red-700 mb-3">Found {errorCount} errors in your Excel file.</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {validationItems.slice(0, 4).map(({ key, label, description }) => {
          const hasError = results[key as keyof ValidationResultsType] as boolean;
          const isInverted = key === 'isReportValueValid';
          const showError = isInverted ? !hasError : hasError;
          
          return (
            <div key={key} className={`p-3 rounded-lg border-2 text-center ${
              showError ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
            }`}>
              <div className="font-medium text-sm mb-1">{label}</div>
              <div className="text-xs text-gray-600 mb-2">{description}</div>
              {showError ? (
                <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {validationItems.slice(4).map(({ key, label, description, invert }) => {
          const hasError = results[key as keyof ValidationResultsType] as boolean;
          const showError = invert ? !hasError : hasError;
          
          return (
            <div key={key} className={`p-3 rounded-lg border-2 text-center ${
              showError ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
            }`}>
              <div className="font-medium text-sm mb-1">{label}</div>
              <div className="text-xs text-gray-600 mb-2">{description}</div>
              {showError ? (
                <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onDownloadCorrected}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Corrected File
        </button>
        
        <button
          onClick={onUploadNew}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload New Excel File
        </button>
      </div>
    </div>
  );
};

export default CheckResult;