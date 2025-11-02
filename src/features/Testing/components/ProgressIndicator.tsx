import React from 'react';
import { CheckCircle } from 'lucide-react';

interface Step {
  step: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface ProgressIndicatorProps {
  currentStep: string;
  steps: Step[];
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        {steps.map(({ step, label, icon: Icon }, index, array) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                currentStep === step 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : currentStep > step
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {currentStep > step ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="mt-2 text-center">
                <div className={`text-xs font-medium ${
                  currentStep === step || currentStep > step 
                    ? 'text-blue-600' 
                    : 'text-gray-500'
                }`}>
                  {label}
                </div>
              </div>
            </div>
            {index < array.length - 1 && (
              <div className={`flex-1 h-1 mx-2 ${
                currentStep > step ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;