import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, AlertTriangle } from 'lucide-react';
import { Layout } from '../../../shared/components';
import { useSecurityRisks } from '../hooks/useSecurityRisks';
import RiskIndicator from '../components/RiskIndicator';

const SecurityDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { securityRisks, loading, error, refresh } = useSecurityRisks();

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Security Risks</h2>
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
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/analytics')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Security Dashboard</h1>
                <p className="text-gray-600 mt-1">Security risks and compliance monitoring</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading security risks...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {securityRisks.map((risk) => (
                <div key={risk._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <RiskIndicator severity={risk.severity} showLabel={true} />
                        <span className="text-sm text-gray-500">{risk.platform}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{risk.riskType}</h3>
                      <p className="text-gray-600 mb-3">{risk.description}</p>
                      <div className="text-sm text-gray-500">
                        User: {risk.email} | Score: {risk.riskScore}/100
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        risk.status === 'open' ? 'bg-red-100 text-red-800' :
                        risk.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {risk.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {securityRisks.length === 0 && (
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Security Risks Found</h3>
                  <p className="text-gray-600">Your organization has no identified security risks.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SecurityDashboard;
