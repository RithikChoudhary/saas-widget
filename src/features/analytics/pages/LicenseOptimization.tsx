import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, AlertTriangle } from 'lucide-react';
import { Layout } from '../../../shared/components';

const LicenseOptimization: React.FC = () => {
  const navigate = useNavigate();

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
                <h1 className="text-3xl font-bold text-gray-900">License Optimization</h1>
                <p className="text-gray-600 mt-1">Cost optimization and license management</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">License Optimization</h3>
            <p className="text-gray-600">Detailed license optimization view coming soon.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LicenseOptimization;
