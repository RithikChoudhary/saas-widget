import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface CostData {
  currentCost: number;
  optimizedCost: number;
  potentialSavings: number;
  wastePercentage: number;
}

interface CostSavingsChartProps {
  data: CostData;
  title?: string;
  loading?: boolean;
}

const CostSavingsChart: React.FC<CostSavingsChartProps> = ({
  data,
  title = "Cost Optimization",
  loading = false
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const savingsPercentage = data.currentCost > 0 
    ? ((data.potentialSavings / data.currentCost) * 100).toFixed(1)
    : '0';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      
      {/* Cost Comparison */}
      <div className="space-y-6">
        {/* Current vs Optimized Cost */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              ${data.currentCost.toLocaleString()}
            </div>
            <div className="text-sm text-red-600 font-medium">Current Cost</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              ${data.optimizedCost.toLocaleString()}
            </div>
            <div className="text-sm text-green-600 font-medium">Optimized Cost</div>
          </div>
        </div>

        {/* Savings Visualization */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Cost Breakdown</span>
            <span className="text-sm text-gray-500">
              {data.wastePercentage.toFixed(1)}% waste
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
            {/* Optimized cost (green) */}
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ 
                width: `${data.currentCost > 0 ? (data.optimizedCost / data.currentCost) * 100 : 0}%` 
              }}
            />
            {/* Waste (red) */}
            <div
              className="h-full bg-red-500 transition-all duration-500"
              style={{ 
                width: `${data.wastePercentage}%`,
                marginLeft: `${data.currentCost > 0 ? (data.optimizedCost / data.currentCost) * 100 : 0}%`
              }}
            />
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Optimized</span>
            <span>Waste</span>
          </div>
        </div>

        {/* Potential Savings */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <TrendingDown className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  ${data.potentialSavings.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Potential Monthly Savings</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">
                {savingsPercentage}%
              </div>
              <div className="text-xs text-gray-500">reduction</div>
            </div>
          </div>
        </div>

        {/* Annual Projection */}
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">
                ${(data.potentialSavings * 12).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Annual Savings</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                ${(data.currentCost * 12).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Current Annual</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                ${(data.optimizedCost * 12).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Optimized Annual</div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        {data.potentialSavings > 0 && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-blue-900">
                  Optimization Opportunities
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  Review ghost users, unused licenses, and platform redundancies to achieve these savings.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CostSavingsChart;
