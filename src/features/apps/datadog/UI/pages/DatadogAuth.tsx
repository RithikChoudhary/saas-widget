import React, { useState } from 'react';
import { BarChart3, Key, CheckCircle, AlertCircle, ExternalLink, ArrowRight, Globe } from 'lucide-react';
import { Layout } from '../../../../../shared/components';

const DatadogAuth: React.FC = () => {
  const [credentials, setCredentials] = useState({
    apiKey: '',
    applicationKey: '',
    site: 'datadoghq.com'
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const datadogSites = [
    { value: 'datadoghq.com', label: 'US1 (datadoghq.com)', region: 'US' },
    { value: 'us3.datadoghq.com', label: 'US3 (us3.datadoghq.com)', region: 'US' },
    { value: 'us5.datadoghq.com', label: 'US5 (us5.datadoghq.com)', region: 'US' },
    { value: 'datadoghq.eu', label: 'EU1 (datadoghq.eu)', region: 'EU' },
    { value: 'ap1.datadoghq.com', label: 'AP1 (ap1.datadoghq.com)', region: 'Asia Pacific' },
    { value: 'ddog-gov.com', label: 'US1-FED (ddog-gov.com)', region: 'US Government' }
  ];

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionStatus('idle');
    setErrorMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation
      if (!credentials.apiKey || !credentials.applicationKey) {
        throw new Error('Both API Key and Application Key are required');
      }

      setConnectionStatus('success');
    } catch (error: any) {
      setConnectionStatus('error');
      setErrorMessage(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Connect Datadog</h1>
              <p className="text-gray-600 dark:text-gray-400">Set up your Datadog integration to monitor users, teams, and organization</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Authentication Method Info */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">API Key + Application Key Authentication</h3>
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-6">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Datadog API Setup
              </h4>
              <ol className="text-sm text-purple-800 dark:text-purple-200 space-y-2 list-decimal list-inside">
                <li>Go to <a href="https://app.datadoghq.com/organization-settings/api-keys" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline inline-flex items-center">Datadog → Organization Settings → API Keys <ExternalLink className="h-3 w-3 ml-1" /></a></li>
                <li>Click "New Key" and provide a descriptive name</li>
                <li>Copy the generated API key (organization-level access)</li>
                <li>Go to <a href="https://app.datadoghq.com/organization-settings/application-keys" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline inline-flex items-center">Application Keys <ExternalLink className="h-3 w-3 ml-1" /></a></li>
                <li>Click "New Key" and copy the application key (user-specific permissions)</li>
              </ol>
            </div>
          </div>

          {/* Authentication Form */}
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Datadog Site *
                </label>
                <select
                  value={credentials.site}
                  onChange={(e) => setCredentials(prev => ({ ...prev, site: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {datadogSites.map(site => (
                    <option key={site.value} value={site.value}>
                      {site.label} - {site.region}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Select your Datadog site based on your account region
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Key *
                </label>
                <input
                  type="password"
                  value={credentials.apiKey}
                  onChange={(e) => setCredentials(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Organization-level API key for accessing Datadog resources
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Application Key *
                </label>
                <input
                  type="password"
                  value={credentials.applicationKey}
                  onChange={(e) => setCredentials(prev => ({ ...prev, applicationKey: e.target.value }))}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  User-specific application key that inherits your permissions
                </p>
              </div>
            </div>

            {/* Connection Status */}
            {connectionStatus !== 'idle' && (
              <div className={`mt-6 p-4 rounded-xl flex items-center space-x-3 ${
                connectionStatus === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
              }`}>
                {connectionStatus === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className={`font-medium ${
                    connectionStatus === 'success' ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'
                  }`}>
                    {connectionStatus === 'success' ? 'Connection Successful!' : 'Connection Failed'}
                  </p>
                  {errorMessage && (
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">{errorMessage}</p>
                  )}
                </div>
              </div>
            )}

            {/* Connect Button */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>Connect Datadog</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Authentication Method</h4>
              <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                <li>• <strong>API Key:</strong> Organization-level access to resources</li>
                <li>• <strong>Application Key:</strong> User-specific permissions and scopes</li>
                <li>• <strong>Site Selection:</strong> Choose correct data center region</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Required Permissions</h4>
              <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                <li>• User management and organization access</li>
                <li>• Team and role management</li>
                <li>• Monitor and dashboard access</li>
                <li>• Usage analytics and metrics</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Site Selection Guide
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Choose the correct Datadog site based on where your account was created:
            </p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
              <li>• <strong>US1:</strong> Default US site (datadoghq.com)</li>
              <li>• <strong>EU1:</strong> European site (datadoghq.eu)</li>
              <li>• <strong>US3/US5:</strong> Additional US regions</li>
              <li>• <strong>AP1:</strong> Asia Pacific region</li>
              <li>• <strong>US1-FED:</strong> US Government (FedRAMP)</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DatadogAuth;
