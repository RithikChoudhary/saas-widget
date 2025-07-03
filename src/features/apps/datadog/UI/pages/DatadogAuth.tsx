import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Layout } from '../../../../../shared/components';

const DatadogAuth: React.FC = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    site: 'datadoghq.com',
    apiKey: '',
    applicationKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear test result when form changes
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    if (!formData.apiKey || !formData.applicationKey) {
      setTestResult({
        success: false,
        message: 'Please provide both API Key and Application Key'
      });
      return;
    }

    try {
      setTesting(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('/api/integrations/datadog/test-connection', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setTestResult({
          success: true,
          message: `Connection successful! Organization: ${result.data.organizationName}`
        });
      } else {
        setTestResult({
          success: false,
          message: result.error || 'Connection test failed'
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Network error. Please try again.'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleConnect = async () => {
    if (!formData.organizationName || !formData.apiKey || !formData.applicationKey) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('/api/integrations/datadog/connect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        // Redirect to Datadog overview
        navigate('/apps/datadog');
      } else {
        alert(result.error || 'Failed to connect to Datadog');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Connect to Datadog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Integrate your Datadog organization to monitor users, teams, and infrastructure from one central dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Connection Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Connection Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    placeholder="My Company"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    A friendly name for your Datadog organization
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Datadog Site *
                  </label>
                  <select
                    name="site"
                    value={formData.site}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="datadoghq.com">US1 (datadoghq.com)</option>
                    <option value="us3.datadoghq.com">US3 (us3.datadoghq.com)</option>
                    <option value="us5.datadoghq.com">US5 (us5.datadoghq.com)</option>
                    <option value="datadoghq.eu">EU (datadoghq.eu)</option>
                    <option value="ap1.datadoghq.com">AP1 (ap1.datadoghq.com)</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Select your Datadog site region
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    API Key *
                  </label>
                  <input
                    type="password"
                    name="apiKey"
                    value={formData.apiKey}
                    onChange={handleInputChange}
                    placeholder="Your Datadog API Key"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Application Key *
                  </label>
                  <input
                    type="password"
                    name="applicationKey"
                    value={formData.applicationKey}
                    onChange={handleInputChange}
                    placeholder="Your Datadog Application Key"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Test Result */}
                {testResult && (
                  <div className={`p-4 rounded-lg border ${
                    testResult.success 
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                      : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {testResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      <p className={`text-sm ${
                        testResult.success 
                          ? 'text-green-800 dark:text-green-200' 
                          : 'text-red-800 dark:text-red-200'
                      }`}>
                        {testResult.message}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleTestConnection}
                    disabled={testing || !formData.apiKey || !formData.applicationKey}
                    className="flex-1 px-6 py-3 border border-purple-300 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {testing ? 'Testing...' : 'Test Connection'}
                  </button>
                  
                  <button
                    onClick={handleConnect}
                    disabled={loading || !testResult?.success}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <span>Connecting...</span>
                    ) : (
                      <>
                        <span>Connect to Datadog</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Information Panel */}
            <div className="space-y-8">
              {/* What You'll Get */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  What You'll Get
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">User Management</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Monitor and manage all Datadog users across your organization</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Team Analytics</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Track team performance, resource usage, and collaboration metrics</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Usage Insights</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Monitor logs, metrics, traces, and synthetic test usage</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Google Workspace Integration</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Automatic correlation with Google Workspace users and groups</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Setup Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
                  How to Get Your API Keys
                </h3>
                <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
                  <div className="flex items-start space-x-2">
                    <span className="font-semibold">1.</span>
                    <span>Log in to your Datadog account</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-semibold">2.</span>
                    <span>Go to Organization Settings → API Keys</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-semibold">3.</span>
                    <span>Create or copy an existing API Key</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-semibold">4.</span>
                    <span>Go to Organization Settings → Application Keys</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-semibold">5.</span>
                    <span>Create or copy an existing Application Key</span>
                  </div>
                </div>
                <a
                  href="https://docs.datadoghq.com/account_management/api-app-keys/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <span>View Datadog Documentation</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DatadogAuth;
