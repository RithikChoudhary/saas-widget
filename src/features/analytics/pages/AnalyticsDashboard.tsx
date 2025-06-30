import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Shield, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  RefreshCw,
  Download,
  Eye,
  UserX,
  Activity
} from 'lucide-react';
import { Layout } from '../../../shared/components';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import KPICard from '../components/KPICard';
import PlatformChart from '../components/PlatformChart';
import CostSavingsChart from '../components/CostSavingsChart';

const AnalyticsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading, error, lastUpdated, refresh, correlateUsers } = useAnalyticsData(true, 300000); // Auto-refresh every 5 minutes
  const [correlating, setCorrelating] = useState(false);

  const handleCorrelateUsers = async () => {
    try {
      setCorrelating(true);
      await correlateUsers();
    } catch (err) {
      console.error('Failed to correlate users:', err);
    } finally {
      setCorrelating(false);
    }
  };

  const handleExport = async () => {
    try {
      // This would trigger a download - implementation depends on backend
      console.log('Exporting dashboard data...');
    } catch (err) {
      console.error('Failed to export data:', err);
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Analytics</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={refresh}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Cross-platform insights and optimization opportunities
                </p>
                {lastUpdated && (
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated: {lastUpdated.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCorrelateUsers}
                  disabled={correlating || loading}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <Activity className="h-4 w-4" />
                  <span>{correlating ? 'Correlating...' : 'Correlate Users'}</span>
                </button>
                <button
                  onClick={refresh}
                  disabled={loading}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleExport}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Total Users"
              value={data?.overview.totalUsers || 0}
              icon={Users}
              color="blue"
              loading={loading}
              onClick={() => navigate('/analytics/cross-platform-users')}
            />
            <KPICard
              title="Ghost Users"
              value={data?.overview.totalGhostUsers || 0}
              icon={UserX}
              color="red"
              loading={loading}
              onClick={() => navigate('/analytics/ghost-users')}
            />
            <KPICard
              title="Security Risks"
              value={data?.overview.totalSecurityRisks || 0}
              icon={Shield}
              color="yellow"
              loading={loading}
              onClick={() => navigate('/analytics/security')}
            />
            <KPICard
              title="Monthly Waste"
              value={data?.overview.totalWastedCost ? `$${data.overview.totalWastedCost.toLocaleString()}` : '$0'}
              icon={DollarSign}
              color="green"
              loading={loading}
              onClick={() => navigate('/analytics/license-optimization')}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Platform Breakdown */}
            <PlatformChart
              data={data?.platformBreakdown || {
                googleWorkspace: 0,
                github: 0,
                slack: 0,
                zoom: 0,
                aws: 0
              }}
              title="Users by Platform"
              type="bar"
              loading={loading}
            />

            {/* Ghost Users by Platform */}
            <PlatformChart
              data={data?.ghostUsersByPlatform || {
                googleWorkspace: 0,
                github: 0,
                slack: 0,
                zoom: 0,
                aws: 0
              }}
              title="Ghost Users by Platform"
              type="bar"
              loading={loading}
            />
          </div>

          {/* Cost Optimization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <CostSavingsChart
              data={{
                currentCost: data?.overview.totalLicenseCost || 0,
                optimizedCost: (data?.overview.totalLicenseCost || 0) - (data?.overview.totalWastedCost || 0),
                potentialSavings: data?.overview.totalWastedCost || 0,
                wastePercentage: parseFloat(data?.overview.wastePercentage || '0')
              }}
              loading={loading}
            />

            {/* Security Risk Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Risk Breakdown</h3>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                      <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                      <div className="w-8 h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { level: 'Critical', count: data?.securityRiskBreakdown.critical || 0, color: 'bg-red-500' },
                    { level: 'High', count: data?.securityRiskBreakdown.high || 0, color: 'bg-orange-500' },
                    { level: 'Medium', count: data?.securityRiskBreakdown.medium || 0, color: 'bg-yellow-500' },
                    { level: 'Low', count: data?.securityRiskBreakdown.low || 0, color: 'bg-blue-500' }
                  ].map((risk) => (
                    <div key={risk.level} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded ${risk.color}`}></div>
                        <span className="text-sm font-medium text-gray-700">{risk.level}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{risk.count}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6">
                <button
                  onClick={() => navigate('/analytics/security')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View All Risks</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {data?.recommendations && data.recommendations.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Recommendations</h3>
              <div className="space-y-4">
                {data.recommendations.slice(0, 5).map((recommendation, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{recommendation.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">Impact: {recommendation.impact}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            recommendation.priority === 'high' ? 'bg-red-100 text-red-800' :
                            recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {recommendation.priority} priority
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <button
              onClick={() => navigate('/analytics/cross-platform-users')}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
            >
              <Users className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900">View All Users</h3>
              <p className="text-sm text-gray-600 mt-1">Cross-platform user analysis</p>
            </button>

            <button
              onClick={() => navigate('/analytics/ghost-users')}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
            >
              <UserX className="h-8 w-8 text-red-600 mb-3" />
              <h3 className="font-semibold text-gray-900">Ghost Users</h3>
              <p className="text-sm text-gray-600 mt-1">Identify inactive users</p>
            </button>

            <button
              onClick={() => navigate('/analytics/security')}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
            >
              <Shield className="h-8 w-8 text-yellow-600 mb-3" />
              <h3 className="font-semibold text-gray-900">Security Risks</h3>
              <p className="text-sm text-gray-600 mt-1">Security assessment</p>
            </button>

            <button
              onClick={() => navigate('/analytics/license-optimization')}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
            >
              <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900">Cost Optimization</h3>
              <p className="text-sm text-gray-600 mt-1">License optimization</p>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsDashboard;
