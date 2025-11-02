import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessStateProps {
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
}

const SuccessState: React.FC<SuccessStateProps> = ({
  title,
  message,
  actionLabel,
  onAction
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <p className="font-semibold text-green-800">{title}</p>
            <p className="text-green-700">{message}</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onAction}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors"
        >
          {actionLabel}
          <CheckCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SuccessState;