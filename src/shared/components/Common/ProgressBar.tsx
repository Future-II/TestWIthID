import React from 'react';
interface ProgressBarProps {
  percentage: number;
  stage: 'withdraw' | 'verify' | 'send';
  status?: 'processing' | 'success' | 'error';
}
const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  stage,
  status = 'processing'
}) => {
  const getStageText = () => {
    switch (stage) {
      case 'withdraw':
        return 'سحب البيانات';
      case 'verify':
        return 'التحقق من البيانات';
      case 'send':
        return 'إرسال البيانات إلى نظام الهيئة';
      default:
        return '';
    }
  };
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };
  return <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">
          {getStageText()}
        </span>
        <span className="text-sm font-medium text-gray-700">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${getStatusColor()}`} style={{
        width: `${percentage}%`
      }}></div>
      </div>
    </div>;
};
export default ProgressBar;