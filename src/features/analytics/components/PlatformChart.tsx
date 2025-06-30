import React from 'react';

interface PlatformData {
  googleWorkspace: number;
  github: number;
  slack: number;
  zoom: number;
  aws: number;
}

interface PlatformChartProps {
  data: PlatformData;
  title: string;
  type?: 'bar' | 'donut';
  showLabels?: boolean;
  loading?: boolean;
}

const PlatformChart: React.FC<PlatformChartProps> = ({
  data,
  title,
  type = 'bar',
  showLabels = true,
  loading = false
}) => {
  const platforms = [
    { key: 'googleWorkspace', name: 'Google Workspace', icon: '📧', color: 'bg-blue-500' },
    { key: 'github', name: 'GitHub', icon: '🐙', color: 'bg-gray-800' },
    { key: 'slack', name: 'Slack', icon: '💬', color: 'bg-purple-500' },
    { key: 'zoom', name: 'Zoom', icon: '📹', color: 'bg-blue-600' },
    { key: 'aws', name: 'AWS', icon: '☁️', color: 'bg-orange-500' }
  ];

  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  const maxValue = Math.max(...Object.values(data));

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="flex-1 h-4 bg-gray-200 rounded"></div>
              <div className="w-12 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'donut') {
    // Simple donut chart using CSS
    const segments = platforms.map((platform) => {
      const value = data[platform.key as keyof PlatformData];
      const percentage = total > 0 ? (value / total) * 100 : 0;
      return { ...platform, value, percentage };
    });

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            {/* Simple pie chart representation */}
            <div className="w-full h-full rounded-full border-8 border-gray-200 relative overflow-hidden">
              {segments.map((segment, index) => (
                <div
                  key={segment.key}
                  className={`absolute inset-0 ${segment.color.replace('bg-', 'border-')} border-8`}
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + segment.percentage * 0.5}% 0%)`
                  }}
                />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{total}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          </div>
        </div>
        {showLabels && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            {segments.map((segment) => (
              <div key={segment.key} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${segment.color}`}></div>
                <span className="text-sm text-gray-600">{segment.name}</span>
                <span className="text-sm font-medium text-gray-900">{segment.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Bar chart
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="space-y-4">
        {platforms.map((platform) => {
          const value = data[platform.key as keyof PlatformData];
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          
          return (
            <div key={platform.key} className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 w-32">
                <span className="text-lg">{platform.icon}</span>
                <span className="text-sm font-medium text-gray-700 truncate">
                  {platform.name}
                </span>
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                <div
                  className={`h-full rounded-full ${platform.color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-12 text-right">
                <span className="text-sm font-semibold text-gray-900">{value}</span>
              </div>
            </div>
          );
        })}
      </div>
      {total > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Total</span>
            <span className="text-lg font-bold text-gray-900">{total}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformChart;
