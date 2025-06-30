import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
    label: string;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  onClick?: () => void;
  loading?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  onClick,
  loading = false
}) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    red: 'text-red-600 bg-red-100',
    purple: 'text-purple-600 bg-purple-100',
    gray: 'text-gray-600 bg-gray-100'
  };

  const cardClasses = `
    bg-white rounded-lg shadow p-6 transition-all duration-200
    ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-105' : ''}
    ${loading ? 'animate-pulse' : ''}
  `;

  return (
    <div className={cardClasses} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {loading ? (
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900">
              {typeof value === 'number' && value > 999 
                ? value.toLocaleString() 
                : value
              }
            </p>
          )}
          {trend && !loading && (
            <p className={`text-xs mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↗' : '↘'} {trend.value} {trend.label}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default KPICard;
