import React, { useState } from 'react';
import { Cloud, Key, Shield, CheckCircle, AlertCircle, ExternalLink, ArrowRight, Users } from 'lucide-react';
import { Layout } from '../../../../../shared/components';

const AWSAuth: React.FC = () => {
  const [authMethod, setAuthMethod] = useState<'access-keys' | 'iam-role' | 'sts-assume'>('access-keys');
  const [credentials, setCredentials] = useState({
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1',
    roleArn: '',
    externalId: '',
    sessionName: '',
    mfaSerial: '',
    mfaToken: ''
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const awsRegions = [
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
    { value: 'us-west-2', label: 'US West (Oregon)' },
    { value: 'eu-west-1', label: 'Europe (Ireland)' },
    { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
    { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' }
  ];

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionStatus('idle');
    setErrorMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation based on auth method
      if (authMethod === 'access-keys' && (!credentials.accessKeyId || !credentials.secretAccessKey)) {
        throw new Error('Access Key ID and Secret Access Key are required');
      }
      if (authMethod === 'iam-role' && !credentials.roleArn) {
        throw new Error('IAM Role ARN is required');
      }
      if (authMethod === 'sts-assume' && (!credentials.roleArn || !credentials.sessionName)) {
        throw new Error('Role ARN and Session Name are required for STS Assume Role');
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
      case 'access-keys':
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-xl p-6">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center">
                <Key className="h-5 w-5 mr-2" />
                AWS Access Keys Setup
              </h4>
              <ol className="text-sm text-orange-800 dark:text-orange-200 space-y-2 list-decimal list-inside">
                <li>Go to <a href="https://console.aws.amazon.com/iam/home#/security_credentials" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline inline-flex items-center">AWS Console → IAM → Security Credentials <ExternalLink className="h-3 w-3 ml-1" /></a></li>
                <li>Click "Create access key" under Access keys section</li>
                <li>Select "Programmatic access" use case</li>
                <li>Copy Access Key ID and Secret Access Key</li>
                <li><strong>Important:</strong> Store keys securely and never commit to version control</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Access Key ID *
                </label>
                <input
                  type="text"
                  value={credentials.accessKeyId}
                  onChange={(e) => setCredentials(prev => ({ ...prev, accessKeyId: e.target.value }))}
                  placeholder="AKIAIOSFODNN7EXAMPLE"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  AWS Region *
                </label>
                <select
                  value={credentials.region}
                  onChange={(e) => setCredentials(prev => ({ ...prev, region: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {awsRegions.map(region => (
                    <option key={region.value} value={region.value}>{region.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Secret Access Key *
              </label>
              <input
                type="password"
                value={credentials.secretAccessKey}
                onChange={(e) => setCredentials(prev => ({ ...prev, secretAccessKey: e.target.value }))}
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
              />
            </div>
          </div>
        );

      case 'iam-role':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                IAM Role Setup
              </h4>
              <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2 list-decimal list-inside">
                <li>Go to <a href="https://console.aws.amazon.com/iam/home#/roles" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">AWS Console → IAM → Roles <ExternalLink className="h-3 w-3 ml-1" /></a></li>
                <li>Click "Create role" and select "AWS service" or "Another AWS account"</li>
                <li>Attach required policies: <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">ReadOnlyAccess</code>, <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">IAMReadOnlyAccess</code></li>
                <li>Configure trust relationship for cross-account access if needed</li>
                <li>Copy the Role ARN</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  IAM Role ARN *
                </label>
                <input
                  type="text"
                  value={credentials.roleArn}
                  onChange={(e) => setCredentials(prev => ({ ...prev, roleArn: e.target.value }))}
                  placeholder="arn:aws:iam::123456789012:role/MyRole"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  External ID (Optional)
                </label>
                <input
                  type="text"
                  value={credentials.externalId}
                  onChange={(e) => setCredentials(prev => ({ ...prev, externalId: e.target.value }))}
                  placeholder="unique-external-id"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                AWS Region *
              </label>
              <select
                value={credentials.region}
                onChange={(e) => setCredentials(prev => ({ ...prev, region: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {awsRegions.map(region => (
                  <option key={region.value} value={region.value}>{region.label}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'sts-assume':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-6">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                STS Assume Role Setup
              </h4>
              <ol className="text-sm text-green-800 dark:text-green-200 space-y-2 list-decimal list-inside">
                <li>Create an IAM role with appropriate trust policy</li>
                <li>Configure the role to allow assumption from your account/service</li>
                <li>Set up MFA requirement if needed for additional security</li>
                <li>Use temporary credentials with limited lifetime</li>
                <li>Ideal for cross-account access and enhanced security</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role ARN *
                </label>
                <input
                  type="text"
                  value={credentials.roleArn}
                  onChange={(e) => setCredentials(prev => ({ ...prev, roleArn: e.target.value }))}
                  placeholder="arn:aws:iam::123456789012:role/AssumeRole"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Session Name *
                </label>
                <input
                  type="text"
                  value={credentials.sessionName}
                  onChange={(e) => setCredentials(prev => ({ ...prev, sessionName: e.target.value }))}
                  placeholder="SaaSManagementSession"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  MFA Serial (Optional)
                </label>
                <input
                  type="text"
                  value={credentials.mfaSerial}
                  onChange={(e) => setCredentials(prev => ({ ...prev, mfaSerial: e.target.value }))}
                  placeholder="arn:aws:iam::123456789012:mfa/user"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  MFA Token (Optional)
                </label>
                <input
                  type="text"
                  value={credentials.mfaToken}
                  onChange={(e) => setCredentials(prev => ({ ...prev, mfaToken: e.target.value }))}
                  placeholder="123456"
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
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Cloud className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Connect AWS</h1>
              <p className="text-gray-600 dark:text-gray-400">Set up your AWS integration to manage cloud resources and costs</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Authentication Method Selection */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Choose Authentication Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setAuthMethod('access-keys')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  authMethod === 'access-keys'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Key className="h-6 w-6 text-orange-500 mb-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Access Keys</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Programmatic access with keys</p>
              </button>

              <button
                onClick={() => setAuthMethod('iam-role')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  authMethod === 'iam-role'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Shield className="h-6 w-6 text-blue-500 mb-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">IAM Role</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Role-based access</p>
              </button>

              <button
                onClick={() => setAuthMethod('sts-assume')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  authMethod === 'sts-assume'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Users className="h-6 w-6 text-green-500 mb-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">STS Assume Role</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Temporary credentials</p>
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
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-600 text-white rounded-xl hover:from-orange-600 hover:to-yellow-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>Connect AWS</span>
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
                <li>• <strong>Access Keys:</strong> Direct programmatic access</li>
                <li>• <strong>IAM Role:</strong> Role-based permissions</li>
                <li>• <strong>STS Assume Role:</strong> Temporary, secure access</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Required Permissions</h4>
              <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                <li>• EC2, S3, RDS resource access</li>
                <li>• IAM user and role management</li>
                <li>• Billing and cost information</li>
                <li>• CloudTrail and logging access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AWSAuth;
