import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Settings, 
  Users, 
  Shield, 
  DollarSign, 
  Activity,
  ChevronRight,
  Cloud,
  CheckCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  Edit,
  Trash2,
  RefreshCw,
  Key,
  Globe,
  Server,
  Database,
  X,
  Eye,
  EyeOff,
  Info
} from 'lucide-react';
import { Layout } from '../../../shared/components';
import { awsApi } from './services/awsApi';

interface AWSAccount {
  id: string;
  accountId: string;
  accountName: string;
  alias?: string;
  region: string;
  status: 'connected' | 'error' | 'syncing';
  lastSync: string;
  users: number;
  resources: {
    ec2: number;
    s3: number;
    iam: number;
    lambda: number;
  };
  monthlyCost: number;
  accessType: 'cross-account-role' | 'access-keys' | 'sso';
  organizationUnit?: string;
}

// Complete AWS Regions List
const AWS_REGIONS = [
  // US Regions
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-east-2', label: 'US East (Ohio)' },
  { value: 'us-west-1', label: 'US West (N. California)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  
  // Europe Regions
  { value: 'eu-west-1', label: 'Europe (Ireland)' },
  { value: 'eu-west-2', label: 'Europe (London)' },
  { value: 'eu-west-3', label: 'Europe (Paris)' },
  { value: 'eu-central-1', label: 'Europe (Frankfurt)' },
  { value: 'eu-north-1', label: 'Europe (Stockholm)' },
  { value: 'eu-south-1', label: 'Europe (Milan)' },
  
  // Asia Pacific Regions
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
  { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)' },
  { value: 'ap-southeast-3', label: 'Asia Pacific (Jakarta)' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
  { value: 'ap-northeast-2', label: 'Asia Pacific (Seoul)' },
  { value: 'ap-northeast-3', label: 'Asia Pacific (Osaka)' },
  { value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' },
  { value: 'ap-east-1', label: 'Asia Pacific (Hong Kong)' },
  
  // Other Regions
  { value: 'ca-central-1', label: 'Canada (Central)' },
  { value: 'sa-east-1', label: 'South America (São Paulo)' },
  { value: 'me-south-1', label: 'Middle East (Bahrain)' },
  { value: 'af-south-1', label: 'Africa (Cape Town)' },
];

const AWSConnections: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<AWSAccount[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Form state
  const [accountId, setAccountId] = useState('');
  const [accountName, setAccountName] = useState('');
  const [selectedAccessType, setSelectedAccessType] = useState('cross-account-role');
  const [selectedRegion, setSelectedRegion] = useState('us-east-1');
  
  // Credential fields based on access type
  const [roleArn, setRoleArn] = useState('');
  const [externalId, setExternalId] = useState('');
  const [accessKeyId, setAccessKeyId] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [ssoStartUrl, setSsoStartUrl] = useState('');
  const [roleName, setRoleName] = useState('');
  
  // UI state
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showSessionToken, setShowSessionToken] = useState(false);

  // Validation functions
  const validateAccountId = (id: string): boolean => {
    return /^\d{12}$/.test(id);
  };

  const validateRoleArn = (arn: string): boolean => {
    return /^arn:aws:iam::\d{12}:role\/[\w+=,.@-]+$/.test(arn);
  };

  const validateAccessKeyId = (keyId: string): boolean => {
    return /^AKIA[0-9A-Z]{16}$/.test(keyId);
  };

  const validateSecretAccessKey = (secret: string): boolean => {
    return secret.length === 40 && /^[A-Za-z0-9/+=]+$/.test(secret);
  };

  const validateSsoUrl = (url: string): boolean => {
    return /^https:\/\/[\w.-]+\.awsapps\.com\/start$/.test(url);
  };

  // Fetch AWS accounts data
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await awsApi.getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching AWS accounts:', error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const resetForm = () => {
    setAccountId('');
    setAccountName('');
    setSelectedAccessType('cross-account-role');
    setSelectedRegion('us-east-1');
    setRoleArn('');
    setExternalId('');
    setAccessKeyId('');
    setSecretAccessKey('');
    setSessionToken('');
    setSsoStartUrl('');
    setRoleName('');
    setError('');
  };

  const validateForm = (): boolean => {
    if (!accountId || !accountName) {
      setError('Account ID and Account Name are required');
      return false;
    }

    if (!validateAccountId(accountId)) {
      setError('Account ID must be exactly 12 digits');
      return false;
    }

    switch (selectedAccessType) {
      case 'cross-account-role':
        if (!roleArn) {
          setError('Role ARN is required for Cross-Account Role access');
          return false;
        }
        if (!validateRoleArn(roleArn)) {
          setError('Invalid Role ARN format. Must be: arn:aws:iam::123456789012:role/RoleName');
          return false;
        }
        break;

      case 'access-keys':
        if (!accessKeyId || !secretAccessKey) {
          setError('Access Key ID and Secret Access Key are required');
          return false;
        }
        if (!validateAccessKeyId(accessKeyId)) {
          setError('Invalid Access Key ID format. Must start with AKIA and be 20 characters');
          return false;
        }
        if (!validateSecretAccessKey(secretAccessKey)) {
          setError('Invalid Secret Access Key format. Must be 40 characters');
          return false;
        }
        break;

      case 'sso':
        if (!ssoStartUrl || !roleName) {
          setError('SSO Start URL and Role Name are required for AWS SSO');
          return false;
        }
        if (!validateSsoUrl(ssoStartUrl)) {
          setError('Invalid SSO URL format. Must be: https://your-domain.awsapps.com/start');
          return false;
        }
        break;
    }

    return true;
  };

  const handleConnectAccount = async () => {
    if (!validateForm()) {
      return;
    }

    setConnectLoading(true);
    setError('');

    try {
      // Prepare credentials based on access type
      let credentials = {};
      switch (selectedAccessType) {
        case 'cross-account-role':
          credentials = { roleArn, externalId };
          break;
        case 'access-keys':
          credentials = { accessKeyId, secretAccessKey, sessionToken };
          break;
        case 'sso':
          credentials = { ssoStartUrl, roleName };
          break;
      }

      // Call the real API to create AWS account
      await awsApi.createAccount({
        accountId,
        accountName,
        accessType: selectedAccessType,
        region: selectedRegion,
        credentials
      });
      
      // Close modal and reset form
      setShowModal(false);
      resetForm();
      
      // Refresh the accounts list
      await fetchAccounts();
    } catch (error: any) {
      console.error('Error connecting AWS account:', error);
      if (error.response?.status === 401) {
        setError('Authentication failed. Please check your credentials.');
      } else if (error.response?.status === 403) {
        setError('Access denied. Please check your AWS permissions.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to connect AWS account. Please check your credentials and try again.');
      }
    } finally {
      setConnectLoading(false);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!confirm('Are you sure you want to disconnect this AWS account?')) {
      return;
    }

    try {
      await awsApi.deleteAccount(id);
      await fetchAccounts();
    } catch (error) {
      console.error('Error deleting AWS account:', error);
      alert('Failed to disconnect AWS account. Please try again.');
    }
  };

  const handleSyncAccount = async (id: string) => {
    try {
      await awsApi.syncAccount(id);
      await fetchAccounts();
    } catch (error) {
      console.error('Error syncing AWS account:', error);
      alert('Failed to sync AWS account. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'syncing':
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Connected</span>;
      case 'error':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Connection Error</span>;
      case 'syncing':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Syncing</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Pending</span>;
    }
  };

  const getAccessTypeIcon = (type: string) => {
    switch (type) {
      case 'cross-account-role':
        return <Shield className="h-4 w-4 text-green-600" />;
      case 'access-keys':
        return <Key className="h-4 w-4 text-yellow-600" />;
      case 'sso':
        return <Users className="h-4 w-4 text-blue-600" />;
      default:
        return <Key className="h-4 w-4 text-gray-600" />;
    }
  };

  const renderCredentialFields = () => {
    switch (selectedAccessType) {
      case 'cross-account-role':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role ARN *
              </label>
              <input
                type="text"
                value={roleArn}
                onChange={(e) => setRoleArn(e.target.value)}
                placeholder="arn:aws:iam::123456789012:role/YourRoleName"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                The ARN of the IAM role to assume in your AWS account
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                External ID (Optional)
              </label>
              <input
                type="text"
                value={externalId}
                onChange={(e) => setExternalId(e.target.value)}
                placeholder="unique-external-id"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional external ID for additional security
              </p>
            </div>
          </>
        );

      case 'access-keys':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Key ID *
              </label>
              <input
                type="text"
                value={accessKeyId}
                onChange={(e) => setAccessKeyId(e.target.value)}
                placeholder="AKIAIOSFODNN7EXAMPLE"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your AWS Access Key ID (starts with AKIA)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secret Access Key *
              </label>
              <div className="relative">
                <input
                  type={showSecretKey ? "text" : "password"}
                  value={secretAccessKey}
                  onChange={(e) => setSecretAccessKey(e.target.value)}
                  placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showSecretKey ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your AWS Secret Access Key (40 characters)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Token (Optional)
              </label>
              <div className="relative">
                <input
                  type={showSessionToken ? "text" : "password"}
                  value={sessionToken}
                  onChange={(e) => setSessionToken(e.target.value)}
                  placeholder="Temporary session token if using STS"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowSessionToken(!showSessionToken)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showSessionToken ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Required only for temporary credentials
              </p>
            </div>
          </>
        );

      case 'sso':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SSO Start URL *
              </label>
              <input
                type="url"
                value={ssoStartUrl}
                onChange={(e) => setSsoStartUrl(e.target.value)}
                placeholder="https://your-domain.awsapps.com/start"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your AWS SSO start URL from the AWS SSO console
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Name *
              </label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="AdministratorAccess"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                The name of the permission set/role to use
              </p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const totalMonthlyCost = accounts.reduce((total, account) => total + account.monthlyCost, 0);
  const totalUsers = accounts.reduce((total, account) => total + account.users, 0);
  const connectedAccounts = accounts.filter(account => account.status === 'connected').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/apps')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">☁️</span>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">AWS Account Connections</h1>
                    <p className="mt-1 text-gray-600">Manage your AWS account integrations and access</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Connect Account
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Cloud className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Connected Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">{connectedAccounts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total IAM Users</p>
                  <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
                  <p className="text-2xl font-bold text-gray-900">${totalMonthlyCost.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Server className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Resources</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {accounts.reduce((total, account) => 
                      total + account.resources.ec2 + account.resources.s3 + account.resources.lambda, 0
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AWS Accounts List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">AWS Accounts</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {accounts.map((account) => (
                <div key={account.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(account.status)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-lg font-semibold text-gray-900">{account.accountName}</h4>
                          {getStatusBadge(account.status)}
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-gray-600">Account ID: {account.accountId}</p>
                          {account.alias && (
                            <p className="text-sm text-gray-600">Alias: {account.alias}</p>
                          )}
                          <p className="text-sm text-gray-600">Region: {account.region}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleSyncAccount(account.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
                        title="Sync Account"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteAccount(account.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
                        title="Disconnect Account"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{account.users}</p>
                      <p className="text-xs text-gray-600">IAM Users</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{account.resources.ec2}</p>
                      <p className="text-xs text-gray-600">EC2 Instances</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{account.resources.s3}</p>
                      <p className="text-xs text-gray-600">S3 Buckets</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{account.resources.lambda}</p>
                      <p className="text-xs text-gray-600">Lambda Functions</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">${account.monthlyCost}</p>
                      <p className="text-xs text-gray-600">Monthly Cost</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{account.lastSync}</p>
                      <p className="text-xs text-gray-600">Last Sync</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getAccessTypeIcon(account.accessType)}
                        <span className="text-sm text-gray-600 capitalize">
                          {account.accessType.replace('-', ' ')}
                        </span>
                      </div>
                      {account.organizationUnit && (
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{account.organizationUnit}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/apps/aws`)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Manage
                      </button>
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        AWS Console
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {accounts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Cloud className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No AWS accounts connected</h3>
              <p className="text-gray-600 mb-4">Connect your first AWS account to get started with cloud management</p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Connect AWS Account
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Connect Account Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Connect AWS Account</h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Connection Method Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Connection Method
                    </label>
                    <select 
                      value={selectedAccessType}
                      onChange={(e) => {
                        setSelectedAccessType(e.target.value);
                        setError('');
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="cross-account-role">Cross-Account Role (Recommended)</option>
                      <option value="access-keys">Access Keys</option>
                      <option value="sso">AWS SSO</option>
                    </select>
                    <div className="mt-2 p-3 bg-blue-50 rounded-md">
                      <div className="flex">
                        <Info className="h-4 w-4 text-blue-400 mt-0.5 mr-2" />
                        <div className="text-xs text-blue-700">
                          {selectedAccessType === 'cross-account-role' && 
                            'Most secure method. Create an IAM role in your AWS account and provide the ARN.'
                          }
                          {selectedAccessType === 'access-keys' && 
                            'Use programmatic access keys. Ensure keys have appropriate permissions.'
                          }
                          {selectedAccessType === 'sso' && 
                            'Use AWS Single Sign-On for centralized access management.'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Basic Account Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account ID *
                      </label>
                      <input
                        type="text"
                        value={accountId}
                        onChange={(e) => {
                          setAccountId(e.target.value);
                          setError('');
                        }}
                        placeholder="123456789012"
                        maxLength={12}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Your 12-digit AWS Account ID
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Name *
                      </label>
                      <input
                        type="text"
                        value={accountName}
                        onChange={(e) => {
                          setAccountName(e.target.value);
                          setError('');
                        }}
                        placeholder="Production Account"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        A friendly name for this account
                      </p>
                    </div>
                  </div>

                  {/* Default Region */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Region
                    </label>
                    <select 
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {AWS_REGIONS.map((region) => (
                        <option key={region.value} value={region.value}>
                          {region.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dynamic Credential Fields */}
                  {renderCredentialFields()}
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      disabled={connectLoading}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConnectAccount}
                      disabled={connectLoading}
                      className="flex-1 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {connectLoading ? 'Connecting...' : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AWSConnections;
