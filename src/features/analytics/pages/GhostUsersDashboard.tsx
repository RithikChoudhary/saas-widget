import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserX, DollarSign, AlertTriangle, Download } from 'lucide-react';
import { Layout } from '../../../shared/components';
import { useGhostUsers } from '../hooks/useGhostUsers';
import UserTable from '../components/UserTable';
import PlatformChart from '../components/PlatformChart';
import KPICard from '../components/KPICard';

const GhostUsersDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { ghostUsers, loading, error, refresh } = useGhostUsers();

  const totalCost = ghostUsers.reduce((sum, user) => sum + (user.estimatedMonthlyCost || 0), 0);
  const totalSavings = ghostUsers.reduce((sum, user) => sum + (user.potentialSavings || 0), 0);

  // Calculate platform breakdown
  const platformBreakdown = ghostUsers.reduce((acc, user) => {
    user.platforms.forEach(platform => {
      acc[platform] = (acc[platform] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const chartData = {
    googleWorkspace: platformBreakdown['googleWorkspace'] || 0,
    github: platformBreakdown['github'] || 0,
    slack: platformBreakdown['slack'] || 0,
    zoom: platformBreakdown['zoom'] || 0,
    aws: platformBreakdown['aws'] || 0
  };

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Ghost Users</h2>
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
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/analytics')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Ghost Users</h1>
                  <p className="text-gray-600 mt-1">
                    Users who have never logged in across platforms
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={refresh}
                  disabled={loading}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Refresh
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <KPICard
              title="Total Ghost Users"
              value={ghostUsers.length}
              icon={UserX}
              color="red"
              loading={loading}
            />
            <KPICard
              title="Monthly Cost"
              value={`$${totalCost.toLocaleString()}`}
              icon={DollarSign}
              color="yellow"
              loading={loading}
            />
            <KPICard
              title="Potential Savings"
              value={`$${totalSavings.toLocaleString()}`}
              icon={DollarSign}
              color="green"
              loading={loading}
            />
          </div>

          {/* Platform Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <PlatformChart
              data={chartData}
              title="Ghost Users by Platform"
              type="bar"
              loading={loading}
            />
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost Impact</h3>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monthly Waste</span>
                    <span className="text-lg font-bold text-red-600">${totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Annual Waste</span>
                    <span className="text-lg font-bold text-red-600">${(totalCost * 12).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Potential Annual Savings</span>
                    <span className="text-lg font-bold text-green-600">${(totalSavings * 12).toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {ghostUsers.length > 0 ? ((totalSavings / totalCost) * 100).toFixed(1) : 0}%
                      </div>
                      <div className="text-sm text-gray-500">Cost Reduction Potential</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ghost Users Table */}
          <UserTable
            users={ghostUsers.map(user => ({
              _id: user._id,
              email: user.email,
              platforms: user.platforms.reduce((acc, platform) => {
                acc[platform] = { name: platform, isAdmin: false, status: 'inactive' };
                return acc;
              }, {} as any),
              isGhostUser: true,
              estimatedMonthlyCost: user.estimatedMonthlyCost
            }))}
            loading={loading}
            showRisks={false}
          />

          {/* Action Items */}
          {ghostUsers.length > 0 && (
            <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <UserX className="h-6 w-6 text-orange-600 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-orange-900 mb-2">
                    Recommended Actions
                  </h3>
                  <ul className="space-y-2 text-sm text-orange-800">
                    <li>• Review ghost users and confirm they should have access</li>
                    <li>• Remove licenses for users who no longer need access</li>
                    <li>• Set up automated deprovisioning for terminated employees</li>
                    <li>• Implement regular access reviews to prevent future ghost users</li>
                  </ul>
                  <div className="mt-4">
                    <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                      Start Cleanup Process
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GhostUsersDashboard;
