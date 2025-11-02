import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StepHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
}

const StepHeader: React.FC<StepHeaderProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  iconColor = "text-blue-500" 
}) => {
  return (
    <div className="text-center">
      <Icon className={`w-16 h-16 ${iconColor} mx-auto mb-4`} />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default StepHeader;