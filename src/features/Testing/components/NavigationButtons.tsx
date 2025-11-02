import React from 'react';
import { ChevronRight } from 'lucide-react';

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  backLabel?: string;
  nextDisabled?: boolean;
  nextIcon?: React.ComponentType<any>;
  showBack?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onBack,
  onNext,
  nextLabel,
  backLabel = "Back",
  nextDisabled = false,
  nextIcon: NextIcon = ChevronRight,
  showBack = true
}) => {
  return (
    <div className={`flex ${showBack ? 'justify-between' : 'justify-end'} pt-4`}>
      {showBack && onBack && (
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          {backLabel}
        </button>
      )}
      
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
          !nextDisabled
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {nextLabel}
        <NextIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default NavigationButtons;