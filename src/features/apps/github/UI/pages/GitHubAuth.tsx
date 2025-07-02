import React, { useState } from 'react';
import { Github, Key, Shield, CheckCircle, AlertCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { Layout } from '../../../../../shared/components';

const GitHubAuth: React.FC = () => {
  const [authMethod, setAuthMethod] = useState<'pat' | 'github-app' | 'oauth'>('pat');
  const [credentials, setCredentials] = useState({
    personalAccessToken: '',
    githubAppId: '',
    githubAppPrivateKey: '',
    githubAppInstallationId: '',
    oauthClientId: '',
    oauthClientSecret: ''
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
      if (authMethod === 'pat' && !credentials.personalAccessToken) {
        throw new Error('Personal Access Token is required');
      }
      if (authMethod === 'github-app' && (!credentials.githubAppId || !credentials.githubAppPrivateKey)) {
        throw new Error('GitHub App ID and Private Key are required');
      }
      if (authMethod === 'oauth' && (!credentials.oauthClientId || !credentials.oauthClientSecret)) {
        throw new Error('OAuth Client ID and Secret are required');
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
      case 'pat':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Personal Access Token Setup
              </h4>
              <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2 list-decimal list-inside">
                <li>Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">GitHub Settings → Developer settings → Personal access tokens <ExternalLink className="h-3 w-3 ml-1" /></a></li>
                <li>Click "Generate new token (classic)"</li>
                <li>Select required scopes: <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">repo</code>, <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">admin:org</code>, <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">user</code></li>
                <li>Copy the generated token</li>
              </ol>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Personal Access Token *
              </label>
              <input
                type="password"
                value={credentials.personalAccessToken}
                onChange={(e) => setCredentials(prev => ({ ...prev, personalAccessToken: e.target.value }))}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        );

      case 'github-app':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-6">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                GitHub App Setup
              </h4>
              <ol className="text-sm text-green-800 dark:text-green-200 space-y-2 list-decimal list-inside">
                <li>Go to <a href="https://github.com/settings/apps" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline inline-flex items-center">GitHub Settings → Developer settings → GitHub Apps <ExternalLink className="h-3 w-3 ml-1" /></a></li>
                <li>Click "New GitHub App"</li>
                <li>Configure permissions: Repository (Read), Organization members (Read), Metadata (Read)</li>
                <li>Install the app to your organization</li>
                <li>Generate and download private key</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GitHub App ID *
                </label>
                <input
                  type="text"
                  value={credentials.githubAppId}
                  onChange={(e) => setCredentials(prev => ({ ...prev, githubAppId: e.target.value }))}
                  placeholder="123456"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Installation ID
                </label>
                <input
                  type="text"
                  value={credentials.githubAppInstallationId}
                  onChange={(e) => setCredentials(prev => ({ ...prev, githubAppInstallationId: e.target.value }))}
                  placeholder="12345678"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Private Key (PEM format) *
              </label>
              <textarea
                value={credentials.githubAppPrivateKey}
                onChange={(e) => setCredentials(prev => ({ ...prev, githubAppPrivateKey: e.target.value }))}
                placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
              />
            </div>
          </div>
        );

      case 'oauth':
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-6">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                OAuth App Setup
              </h4>
              <ol className="text-sm text-purple-800 dark:text-purple-200 space-y-2 list-decimal list-inside">
                <li>Go to <a href="https://github.com/settings/applications/new" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline inline-flex items-center">GitHub Settings → Developer settings → OAuth Apps <ExternalLink className="h-3 w-3 ml-1" /></a></li>
                <li>Click "New OAuth App"</li>
                <li>Set Authorization callback URL to: <code className="bg-purple-100 dark:bg-purple-800 px-2 py-1 rounded text-xs">https://your-domain.com/auth/github/callback</code></li>
                <li>Copy Client ID and generate Client Secret</li>
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
                  placeholder="Iv1.xxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
            <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center">
              <Github className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Connect GitHub</h1>
              <p className="text-gray-600 dark:text-gray-400">Set up your GitHub integration to manage repositories and teams</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Authentication Method Selection */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Choose Authentication Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setAuthMethod('pat')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  authMethod === 'pat'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Key className="h-6 w-6 text-blue-500 mb-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Personal Access Token</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Simple token-based authentication</p>
              </button>

              <button
                onClick={() => setAuthMethod('github-app')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  authMethod === 'github-app'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Shield className="h-6 w-6 text-green-500 mb-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">GitHub App</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Organization-wide access</p>
              </button>

              <button
                onClick={() => setAuthMethod('oauth')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  authMethod === 'oauth'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Shield className="h-6 w-6 text-purple-500 mb-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">OAuth App</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">User authorization flow</p>
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
                className="px-6 py-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl hover:from-gray-700 hover:to-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>Connect GitHub</span>
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
                <li>• <strong>Personal Access Token:</strong> Simple, user-based access</li>
                <li>• <strong>GitHub App:</strong> Organization-wide, more secure</li>
                <li>• <strong>OAuth App:</strong> User authorization with scopes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Required Permissions</h4>
              <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Repository access (read/write)</li>
                <li>• Organization member access</li>
                <li>• Team management</li>
                <li>• User profile information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GitHubAuth;
