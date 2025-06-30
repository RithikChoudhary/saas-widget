import React from 'react';
import { AlertTriangle, Shield, AlertCircle, Info } from 'lucide-react';

interface RiskIndicatorProps {
  severity: 'critical' | 'high' | 'medium' | 'low';
  score?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  severity,
  score,
  showLabel = true,
  size = 'md'
}) => {
  const config = {
    critical: {
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-100',
      label: 'Critical Risk',
      textColor: 'text-red-600'
    },
    high: {
      icon: AlertCircle,
      color: 'text-orange-600 bg-orange-100',
      label: 'High Risk',
      textColor: 'text-orange-600'
    },
    medium: {
      icon: AlertCircle,
      color: 'text-yellow-600 bg-yellow-100',
      label: 'Medium Risk',
      textColor: 'text-yellow-600'
    },
    low: {
      icon: Info,
      color: 'text-blue-600 bg-blue-100',
      label: 'Low Risk',
      textColor: 'text-blue-600'
    }
  };

  const sizeConfig = {
    sm: { icon: 'h-4 w-4', padding: 'p-1', text: 'text-xs' },
    md: { icon: 'h-5 w-5', padding: 'p-2', text: 'text-sm' },
    lg: { icon: 'h-6 w-6', padding: 'p-3', text: 'text-base' }
  };

  const { icon: Icon, color, label, textColor } = config[severity];
  const { icon: iconSize, padding, text: textSize } = sizeConfig[size];

  return (
    <div className="flex items-center space-x-2">
      <div className={`rounded-full ${color} ${padding}`}>
        <Icon className={iconSize} />
      </div>
      {showLabel && (
        <div className="flex items-center space-x-2">
          <span className={`font-medium ${textColor} ${textSize}`}>
            {label}
          </span>
          {score !== undefined && (
            <span className={`${textColor} ${textSize}`}>
              ({score}/100)
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default RiskIndicator;
