import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight,
  Plus,
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  Trash2,
  RefreshCw,
  Key,
  GitBranch,
  Users,
  Building
} from 'lucide-react';
import { Layout } from '../../../../../shared/components';
import api from '../../../../../shared/utils/api';

interface Connection {
  id: string;
  connectionType: 'oauth' | 'personal-access-token';
  scope: 'user' | 'organization';
  username?: string;
  organizationName?: string;
  isActive: boolean;
  status: string;
  createdAt: string;
  lastSync?: string;
  permissions?: string[];
}

const GitHubConnections: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [connectType, setConnectType] = useState<'oauth' | 'pat'>('oauth');
  const [scope, setScope] = useState<'user' | 'organization'>('user');
  const [organizationName, setOrganizationName] = useState('');
  const [personalToken, setPersonalToken] = useState('');
  const [connecting, setConnecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      console.log('🔍 GitHub Connections: Fetching connections...');
      
      const response = await api.get('/integrations/github/connections');
      console.log('📡 GitHub Connections: Response:', response.data);
      setConnections(response.data.data || []);
    } catch (error) {
      console.error('❌ GitHub Connections: Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthConnect = async () => {
    try {
      setConnecting(true);
      console.log('🔗 GitHub Connections: Initiating OAuth connection...');
      
      const response = await api.post('/integrations/github/connections/oauth/initiate', {
        scope,
        organizationName: scope === 'organization' ? organizationName : undefined
      });
      
      console.log('✅ GitHub Connections: OAuth URL received:', response.data.data.authUrl);
      
      // Redirect to GitHub OAuth
      window.location.href = response.data.data.authUrl;
    } catch (error) {
      console.error('❌ GitHub Connections: Error initiating OAuth:', error);
      alert('Failed to initiate GitHub connection');
      setConnecting(false);
    }
  };

  const handlePATConnect = async () => {
    try {
      setConnecting(true);
      console.log('🔗 GitHub Connections: Creating PAT connection...');
      
      await api.post('/integrations/github/connections/pat', {
        token: personalToken,
        scope,
        organizationName: scope === 'organization' ? organizationName : undefined
      });
      
      console.log('✅ GitHub Connections: PAT connection created successfully');
      setShowAddModal(false);
      setPersonalToken('');
      setOrganizationName('');
      fetchConnections();
      alert('GitHub connection created successfully!');
    } catch (error) {
      console.error('❌ GitHub Connections: Error creating PAT connection:', error);
      alert('Failed to create GitHub connection');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async (connectionId: string, name: string) => {
    if (!confirm(`Are you sure you want to disconnect "${name}"? This will remove all synced data.`)) {
      return;
    }

    try {
      console.log(`🔌 GitHub Connections: Disconnecting connection ${connectionId}`);
      await api.delete(`/integrations/github/connections/${connectionId}`);
      fetchConnections();
      alert('GitHub connection disconnected successfully!');
    } catch (error) {
      console.error('❌ GitHub Connections: Error disconnecting:', error);
      alert('Failed to disconnect GitHub connection');
    }
  };

  const handleRefreshConnection = async (connectionId: string, name: string) => {
    try {
      console.log(`🔄 GitHub Connections: Refreshing connection ${connectionId}`);
      await api.post(`/integrations/github/connections/${connectionId}/refresh`);
      fetchConnections();
      alert(`Connection "${name}" refreshed successfully!`);
    } catch (error) {
      console.error('❌ GitHub Connections: Error refreshing connection:', error);
      alert('Failed to refresh connection');
    }
  };

  const getStatusIcon = (status: string, isActive: boolean) => {
    if (!isActive) {
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
    
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'expired':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Settings className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Inactive</span>;
    }
    
    switch (status) {
      case 'connected':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Connected</span>;
      case 'expired':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Expired</span>;
      case 'error':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Error</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
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
                  onClick={() => navigate('/apps/github')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🐙</span>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">GitHub Connections</h1>
                    <p className="mt-1 text-gray-600">Manage your GitHub account and organization connections</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Connection
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <GitBranch className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Connections</p>
                  <p className="text-2xl font-bold text-gray-900">{connections.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Connections</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {connections.filter(c => c.isActive && c.status === 'connected').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Organizations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {connections.filter(c => c.scope === 'organization').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Connections List */}
          {connections.length > 0 ? (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Connected Accounts</h2>
                <p className="text-sm text-gray-600">Manage your GitHub account and organization connections</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {connections.map((connection) => (
                    <div key={connection.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="text-2xl">🐙</div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {connection.scope === 'organization' ? connection.organizationName : connection.username}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                {getStatusIcon(connection.status, connection.isActive)}
                                {getStatusBadge(connection.status, connection.isActive)}
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                                  {connection.connectionType === 'oauth' ? 'OAuth' : 'PAT'}
                                </span>
                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                  {connection.scope === 'organization' ? 'Organization' : 'Personal'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p><strong>Connected:</strong> {new Date(connection.createdAt).toLocaleDateString()}</p>
                              {connection.lastSync && (
                                <p><strong>Last Sync:</strong> {new Date(connection.lastSync).toLocaleDateString()}</p>
                              )}
                            </div>
                            <div>
                              {connection.permissions && connection.permissions.length > 0 && (
                                <div>
                                  <p><strong>Permissions:</strong></p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {connection.permissions.slice(0, 3).map((perm, index) => (
                                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                        {perm}
                                      </span>
                                    ))}
                                    {connection.permissions.length > 3 && (
                                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                        +{connection.permissions.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2 ml-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleRefreshConnection(connection.id, connection.organizationName || connection.username || 'Connection')}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Refresh
                            </button>
                            <button
                              onClick={() => navigate(`/apps/github/users?connection=${connection.id}`)}
                              className="inline-flex items-center px-3 py-1 border border-blue-300 text-xs font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100"
                            >
                              <Users className="h-3 w-3 mr-1" />
                              View Users
                            </button>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/apps/github/repositories?connection=${connection.id}`)}
                              className="inline-flex items-center px-3 py-1 border border-green-300 text-xs font-medium rounded text-green-700 bg-green-50 hover:bg-green-100"
                            >
                              <GitBranch className="h-3 w-3 mr-1" />
                              View Repos
                            </button>
                            <button
                              onClick={() => handleDisconnect(connection.id, connection.organizationName || connection.username || 'Connection')}
                              className="inline-flex items-center px-3 py-1 border border-red-300 text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Disconnect
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-6xl mb-4">🐙</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No GitHub Connections</h3>
              <p className="text-gray-600 mb-6">
                Connect your GitHub account or organization to start managing repositories and users.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Connection
              </button>
            </div>
          )}
        </div>

        {/* Add Connection Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Connect GitHub Account</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Connection Type</label>
                  <select
                    value={connectType}
                    onChange={(e) => setConnectType(e.target.value as 'oauth' | 'pat')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="oauth">OAuth (Recommended)</option>
                    <option value="pat">Personal Access Token</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Scope</label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value as 'user' | 'organization')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">Personal Account</option>
                    <option value="organization">Organization</option>
                  </select>
                </div>

                {scope === 'organization' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Organization Name</label>
                    <input
                      type="text"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="Enter organization name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {connectType === 'pat' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Personal Access Token</label>
                    <input
                      type="password"
                      value={personalToken}
                      onChange={(e) => setPersonalToken(e.target.value)}
                      placeholder="Enter your GitHub PAT"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Create a PAT in GitHub Settings → Developer settings → Personal access tokens
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setPersonalToken('');
                    setOrganizationName('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={connecting}
                >
                  Cancel
                </button>
                <button
                  onClick={connectType === 'oauth' ? handleOAuthConnect : handlePATConnect}
                  disabled={
                    connecting ||
                    (scope === 'organization' && !organizationName) ||
                    (connectType === 'pat' && !personalToken)
                  }
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {connecting ? 'Connecting...' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GitHubConnections;
