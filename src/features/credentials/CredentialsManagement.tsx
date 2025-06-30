import React, { useState, useEffect } from 'react';
import { Layout } from '../../shared/components';
import api from '../../shared/utils/api';
import { Plus, Edit, Trash2, Eye, EyeOff, Key, CheckCircle, AlertCircle, Settings, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface Credential {
  id: string;
  appType: string;
  appName: string;
  isActive: boolean;
  createdAt: string;
  hasCredentials: boolean;
  connectionStatus?: {
    isConnected: boolean;
    lastSync?: string;
    requiresOAuth?: boolean;
    connectionDetails?: any;
  };
}

interface CredentialRequirement {
  fields: Array<{
    name: string;
    label: string;
    type: string;
    required: boolean;
    default?: string;
  }>;
  instructions: string;
}

const CredentialsManagement: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAppType, setSelectedAppType] = useState('');
  const [requirements, setRequirements] = useState<CredentialRequirement | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [saving, setSaving] = useState(false);
  const [customAppName, setCustomAppName] = useState('');
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  const appTypes = [
    { id: 'slack', name: 'Slack', icon: '💬', description: 'Team communication platform', color: 'bg-purple-100 text-purple-800' },
    { id: 'zoom', name: 'Zoom', icon: '📹', description: 'Video conferencing platform', color: 'bg-blue-100 text-blue-800' },
    { id: 'google-workspace', name: 'Google Workspace', icon: '📧', description: 'Google productivity suite', color: 'bg-green-100 text-green-800' },
    { id: 'github', name: 'GitHub', icon: '🐙', description: 'Code repository platform', color: 'bg-gray-100 text-gray-800' },
    { id: 'aws', name: 'Amazon Web Services', icon: '☁️', description: 'Cloud computing platform', color: 'bg-orange-100 text-orange-800' },
    { id: 'azure', name: 'Microsoft Azure', icon: '🔷', description: 'Microsoft cloud platform', color: 'bg-blue-100 text-blue-800' },
    { id: 'office365', name: 'Microsoft 365', icon: '📊', description: 'Microsoft productivity suite', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      console.log('🔍 Credentials: Fetching credentials...');
      
      const response = await api.get('/credentials');
      console.log('📡 Credentials: Response:', response.data);
      setCredentials(response.data.data || []);
    } catch (error) {
      console.error('❌ Credentials: Error fetching credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCredentials = async (appType: string) => {
    try {
      setSelectedAppType(appType);
      
      // Fetch requirements for this app type
      const response = await api.get(`/credentials/requirements/${appType}`);
      setRequirements(response.data.data);
      
      // Initialize form data with defaults
      const initialData: { [key: string]: string } = {};
      response.data.data.fields.forEach((field: any) => {
        initialData[field.name] = field.default || '';
      });
      setFormData(initialData);
      setCustomAppName('');
      setShowAddModal(true);
    } catch (error) {
      console.error('Error fetching requirements:', error);
      alert('Failed to load credential requirements');
    }
  };

  const handleSaveCredentials = async () => {
    if (!requirements || !selectedAppType) return;

    // Validate required fields
    const missingFields = requirements.fields
      .filter(field => field.required && !formData[field.name])
      .map(field => field.label);

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (!customAppName.trim()) {
      alert('Please provide a name for this credential set');
      return;
    }

    try {
      setSaving(true);
      
      await api.post('/credentials', {
        appType: selectedAppType,
        appName: customAppName.trim(),
        credentials: formData
      });

      alert('Credentials saved successfully!');
      setShowAddModal(false);
      setFormData({});
      setSelectedAppType('');
      setRequirements(null);
      setCustomAppName('');
      fetchCredentials();
    } catch (error: any) {
      console.error('Error saving credentials:', error);
      alert('Failed to save credentials: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCredentials = async (appType: string, appName: string) => {
    if (!confirm(`Are you sure you want to delete "${appName}"? This will disconnect the service and may affect connected integrations.`)) {
      return;
    }

    try {
      await api.delete(`/credentials/${appType}/${encodeURIComponent(appName)}`);
      alert('Credentials deleted successfully!');
      fetchCredentials();
    } catch (error) {
      console.error('Error deleting credentials:', error);
      alert('Failed to delete credentials');
    }
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const getAppIcon = (appType: string) => {
    return appTypes.find(app => app.id === appType)?.icon || '🔧';
  };

  const getAppName = (appType: string) => {
    return appTypes.find(app => app.id === appType)?.name || appType;
  };

  const getAppColor = (appType: string) => {
    return appTypes.find(app => app.id === appType)?.color || 'bg-gray-100 text-gray-800';
  };

  // Group credentials by app type
  const groupedCredentials = credentials.reduce((acc, cred) => {
    if (!acc[cred.appType]) {
      acc[cred.appType] = [];
    }
    acc[cred.appType].push(cred);
    return acc;
  }, {} as { [key: string]: Credential[] });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Credentials Management</h1>
            <p className="text-gray-600 mt-1">Manage your company's app credentials and API keys for all integrations</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Total Apps:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
              {Object.keys(groupedCredentials).length}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🔑</div>
              <div>
                <p className="text-sm text-gray-600">Total Credentials</p>
                <p className="text-2xl font-bold">{credentials.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="text-2xl mr-3">✅</div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">{credentials.filter(c => c.isActive).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🏢</div>
              <div>
                <p className="text-sm text-gray-600">App Types</p>
                <p className="text-2xl font-bold">{Object.keys(groupedCredentials).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🔄</div>
              <div>
                <p className="text-sm text-gray-600">Available Apps</p>
                <p className="text-2xl font-bold">{appTypes.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Configured Credentials by App Type */}
        {Object.keys(groupedCredentials).length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Configured Credentials</h2>
              <p className="text-sm text-gray-600">Manage existing credential sets for each app type</p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {Object.entries(groupedCredentials).map(([appType, creds]) => (
                  <div key={appType} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{getAppIcon(appType)}</span>
                        <div>
                          <h3 className="text-lg font-semibold">{getAppName(appType)}</h3>
                          <p className="text-sm text-gray-600">{creds.length} credential set(s)</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAppColor(appType)}`}>
                          {getAppName(appType)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddCredentials(appType)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center space-x-1"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Account</span>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {creds.map((credential) => (
                        <div key={credential.id} className="border rounded-lg p-3 bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div>
                                <h4 className="font-medium text-sm">{credential.appName}</h4>
                                <p className="text-xs text-gray-500">
                                  Added: {new Date(credential.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {credential.connectionStatus?.isConnected ? (
                                <div className="flex items-center space-x-1">
                                  <Wifi className="h-4 w-4 text-green-500" />
                                  <span className="text-xs text-green-600">Connected</span>
                                </div>
                              ) : credential.connectionStatus?.requiresOAuth ? (
                                <div className="flex items-center space-x-1">
                                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                                  <span className="text-xs text-yellow-600">OAuth Required</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-1">
                                  <WifiOff className="h-4 w-4 text-red-500" />
                                  <span className="text-xs text-red-600">Not Connected</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {credential.connectionStatus?.lastSync && (
                            <p className="text-xs text-gray-500 mb-2">
                              Last sync: {new Date(credential.connectionStatus.lastSync).toLocaleString()}
                            </p>
                          )}
                          
                          {credential.connectionStatus?.connectionDetails && (
                            <div className="text-xs text-gray-600 mb-2">
                              {credential.connectionStatus.connectionDetails.username && (
                                <p>User: @{credential.connectionStatus.connectionDetails.username}</p>
                              )}
                              {credential.connectionStatus.connectionDetails.organization && (
                                <p>Org: {credential.connectionStatus.connectionDetails.organization}</p>
                              )}
                            </div>
                          )}
                          
                          {credential.connectionStatus?.requiresOAuth && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-2">
                              <p className="text-xs text-yellow-800">
                                {credential.appType === 'slack' ? (
                                  <>
                                    Slack requires OAuth. Go to{' '}
                                    <a href="/apps/slack" className="text-blue-600 underline">
                                      Slack page
                                    </a>{' '}
                                    to connect.
                                  </>
                                ) : (
                                  'OAuth authentication required - Use the app page to connect'
                                )}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center">
                            <button
                              onClick={async () => {
                                setTestingConnection(credential.id);
                                try {
                                  const response = await api.post(`/credentials/${credential.appType}/test`, {
                                    appName: credential.appName
                                  });
                                  
                                  if (response.data.success) {
                                    alert('Connection successful!');
                                  } else {
                                    alert(`Connection failed: ${response.data.message}`);
                                  }
                                  
                                  // Refresh credentials to get updated status
                                  fetchCredentials();
                                } catch (error: any) {
                                  alert(`Test failed: ${error.response?.data?.message || error.message}`);
                                } finally {
                                  setTestingConnection(null);
                                }
                              }}
                              disabled={testingConnection === credential.id}
                              className="text-blue-600 hover:text-blue-800 text-xs flex items-center space-x-1"
                            >
                              <RefreshCw className={`h-3 w-3 ${testingConnection === credential.id ? 'animate-spin' : ''}`} />
                              <span>{testingConnection === credential.id ? 'Testing...' : 'Test Connection'}</span>
                            </button>
                            
                            <button
                              onClick={() => handleDeleteCredentials(credential.appType, credential.appName)}
                              className="text-red-600 hover:text-red-800 text-xs"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Available Apps to Configure */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Available Applications</h2>
            <p className="text-sm text-gray-600">Add credentials for new applications or additional accounts</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {appTypes.map((app) => {
                const credentialCount = groupedCredentials[app.id]?.length || 0;
                return (
                  <div key={app.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-3xl">{app.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-medium">{app.name}</h3>
                        <p className="text-sm text-gray-500">{app.description}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {credentialCount > 0 ? (
                          <span className="text-sm text-green-600 font-medium">
                            ✓ {credentialCount} account{credentialCount > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">Not configured</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddCredentials(app.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        {credentialCount > 0 ? 'Add Account' : 'Configure'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {credentials.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Key className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No credentials configured</h3>
            <p className="text-gray-600 mb-6">
              Start by adding credentials for your first application to enable integrations
            </p>
            <button
              onClick={() => handleAddCredentials('slack')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Your First Credentials
            </button>
          </div>
        )}

        {/* Add Credentials Modal */}
        {showAddModal && requirements && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">
                  Add {getAppName(selectedAppType)} Credentials
                </h3>
                <p className="text-sm text-gray-600">
                  Configure a new credential set for {getAppName(selectedAppType)}
                </p>
              </div>
              
              <div className="p-6">
                {/* Instructions */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Setup Instructions</h4>
                  <p className="text-blue-800 text-sm">{requirements.instructions}</p>
                </div>

                {/* Credential Set Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credential Set Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customAppName}
                    onChange={(e) => setCustomAppName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`e.g., "Production ${getAppName(selectedAppType)}", "Development Account", "Team Workspace"`}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Give this credential set a descriptive name to distinguish it from other accounts
                  </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {requirements.fields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <div className="relative">
                        {field.type === 'textarea' ? (
                          <textarea
                            value={formData[field.name] || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              [field.name]: e.target.value
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={field.default || `Enter ${field.label.toLowerCase()}`}
                            required={field.required}
                            rows={6}
                          />
                        ) : (
                          <input
                            type={field.type === 'password' && !showPasswords[field.name] ? 'password' : field.type}
                            value={formData[field.name] || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              [field.name]: e.target.value
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={field.default || `Enter ${field.label.toLowerCase()}`}
                            required={field.required}
                          />
                        )}
                        {field.type === 'password' && (
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(field.name)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords[field.name] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({});
                    setSelectedAppType('');
                    setRequirements(null);
                    setCustomAppName('');
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCredentials}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Credentials'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CredentialsManagement;
