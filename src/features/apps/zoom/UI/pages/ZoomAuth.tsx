import React, { useState } from 'react';
import { Monitor, Key, Shield, CheckCircle, AlertCircle, ExternalLink, ArrowRight, Zap } from 'lucide-react';
import { Layout } from '../../../../../shared/components';

const ZoomAuth: React.FC = () => {
  const [authMethod, setAuthMethod] = useState<'oauth' | 'jwt' | 'server-to-server'>('oauth');
  const [credentials, setCredentials] = useState({
    oauthClientId: '',
    oauthClientSecret: '',
    oauthRedirectUri: '',
    jwtApiKey: '',
    jwtApiSecret: '',
    serverToServerAccountId: '',
    serverToServerClientId: '',
    serverToServerClientSecret: ''
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionStatus('idle');
    setErrorMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation based on auth method
      if (authMethod === 'oauth' && (!credentials.oauthClientId || !credentials.oauthClientSecret)) {
        throw new Error('OAuth Client ID and Secret are required');
      }
      if (authMethod === 'jwt' && (!credentials.jwtApiKey || !credentials.jwtApiSecret)) {
        throw new Error('JWT API Key and Secret are required');
      }
      if (authMethod === 'server-to-server' && (!credentials.serverToServerAccountId || !credentials.serverToServerClientId || !credentials.serverToServerClientSecret)) {
        throw new Error('Account ID, Client ID, and Client Secret are required for Server-to-Server OAuth');
      }

      setConnectionStatus('success');
    } catch (error: any) {
      setConnectionStatus('error');
      setErrorMessage(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const renderAuthMethodContent = () => {
    switch (authMethod) {
      case 'oauth':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                OAuth 2.0 App Setup
              </h4>
              <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2 list-decimal list-inside">
                <li>Go to <a href="https://marketplace.zoom.us/develop/create" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">Zoom Marketplace → Develop → Create <ExternalLink className="h-3 w-3 ml-1" /></a></li>
                <li>Choose "OAuth" app type</li>
                <li>Configure OAuth redirect URL: <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">https://your-domain.com/auth/zoom/callback</code></li>
                <li>Add required scopes: <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">user:read</code>, <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">meeting:read</code></li>
                <li>Copy Client ID and Client Secret</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  OAuth Client ID *
                </label>
                <input
                  type="text"
                  value={credentials.oauthClientId}
                  onChange={(e) => setCredentials(prev => ({ ...prev, oauthClientId: e.target.value }))}
                  placeholder="your_client_id"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  OAuth Client Secret *
                </label>
                <input
                  type="password"
                  value={credentials.oauthClientSecret}
                  onChange={(e) => setCredentials(prev => ({ ...prev, oauthClientSecret: e.target.value }))}
                  placeholder="your_client_secret"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                OAuth Redirect URI *
              </label>
              <input
                type="url"
                value={credentials.oauthRedirectUri}
                onChange={(e) => setCredentials(prev => ({ ...prev, oauthRedirectUri: e.target.value }))}
                placeholder="https://your-domain.com/auth/zoom/callback"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        );

      case 'jwt':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3 flex items-center">
                <Key className="h-5 w-5 mr-2" />
                JWT App Setup (Legacy)
              </h4>
              <div className="bg-yellow-100 dark:bg-yellow-800/50 border border-yellow-300 dark:border-yellow-600 rounded-lg p-3 mb-3">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> JWT apps are deprecated. Consider using Server-to-Server OAuth for new integrations.
                </p>
              </div>
              <ol className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2 list-decimal list-inside">
                <li>Go to <a href="https://marketplace.zoom.us/develop/create" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:underline inline-flex items-center">Zoom Marketplace → Develop → Create <ExternalLink className="h-3 w-3 ml-1" /></a></li>
                <li>Choose "JWT" app type (if still available)</li>
                <li>Copy API Key and API Secret</li>
                <li>JWT tokens are generated automatically</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  JWT API Key *
                </label>
                <input
                  type="text"
                  value={credentials.jwtApiKey}
                  onChange={(e) => setCredentials(prev => ({ ...prev, jwtApiKey: e.target.value }))}
                  placeholder="your_api_key"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  JWT API Secret *
                </label>
                <input
                  type="password"
                  value={credentials.jwtApiSecret}
                  onChange={(e) => setCredentials(prev => ({ ...prev, jwtApiSecret: e.target.value }))}
                  placeholder="your_api_secret"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        );

      case 'server-to-server':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-6">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Server-to-Server OAuth Setup (Recommended)
              </h4>
              <ol className="text-sm text-green-800 dark:text-green-200 space-y-2 list-decimal list-inside">
                <li>Go to <a href="https://marketplace.zoom.us/develop/create" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline inline-flex items-center">Zoom Marketplace → Develop → Create <ExternalLink className="h-3 w-3 ml-1" /></a></li>
                <li>Choose "Server-to-Server OAuth" app type</li>
                <li>Add required scopes: <code className="bg-green-100 dark:bg-green-800 px-2 py-1 rounded text-xs">user:read:admin</code>, <code className="bg-green-100 dark:bg-green-800 px-2 py-1 rounded text-xs">meeting:read:admin</code></li>
                <li>Copy Account ID, Client ID, and Client Secret</li>
                <li>No user authorization required - direct API access</li>
              </ol>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account ID *
              </label>
              <input
                type="text"
                value={credentials.serverToServerAccountId}
                onChange={(e) => setCredentials(prev => ({ ...prev, serverToServerAccountId: e.target.value }))}
                placeholder="your_account_id"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client ID *
                </label>
                <input
                  type="text"
                  value={credentials.serverToServerClientId}
                  onChange={(e) => setCredentials(prev => ({ ...prev, serverToServerClientId: e.target.value }))}
                  placeholder="your_client_id"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client Secret *
                </label>
                <input
                  type="password"
                  value={credentials.serverToServerClientSecret}
                  onChange={(e) => setCredentials(prev => ({ ...prev, serverToServerClientSecret: e.target.value }))}
                  placeholder="your_client_secret"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Monitor className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Connect Zoom</h1>
              <p className="text-gray-600 dark:text-gray-400">Set up your Zoom integration to manage meetings and users</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Authentication Method Selection */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Choose Authentication Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setAuthMethod('oauth')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  authMethod === 'oauth'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Shield className="h-6 w-6 text-blue-500 mb-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">OAuth 2.0</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">User authorization flow</p>
              </button>

              <button
                onClick={() => setAuthMethod('jwt')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  authMethod === 'jwt'
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Key className="h-6 w-6 text-yellow-500 mb-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">JWT (Legacy)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">API key authentication</p>
              </button>

              <button
                onClick={() => setAuthMethod('server-to-server')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  authMethod === 'server-to-server'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Zap className="h-6 w-6 text-green-500 mb-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Server-to-Server</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Direct API access</p>
              </button>
            </div>
          </div>

          {/* Authentication Form */}
          <div className="p-6">
            {renderAuthMethodContent()}

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
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>Connect Zoom</span>
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
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Authentication Methods</h4>
              <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                <li>• <strong>OAuth 2.0:</strong> User authorization with scopes</li>
                <li>• <strong>JWT (Legacy):</strong> API key authentication</li>
                <li>• <strong>Server-to-Server:</strong> Direct API access (recommended)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Required Scopes</h4>
              <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                <li>• User management and profiles</li>
                <li>• Meeting creation and management</li>
                <li>• Account settings and analytics</li>
                <li>• Recording access and management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ZoomAuth;
