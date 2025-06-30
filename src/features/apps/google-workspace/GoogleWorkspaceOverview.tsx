import React, { useState, useEffect } from 'react';
import api from '../../../shared/utils/api';
import { Layout } from '../../../shared/components';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Shield, 
  Building, 
  RefreshCw, 
  Plus, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Lock,
  Unlock,
  Mail,
  FolderTree,
  UserCheck,
  UserX,
  ShieldCheck,
  ShieldOff,
  Activity,
  Database,
  Cloud,
  Key,
  Link,
  Unlink,
  Info,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';

interface Connection {
  id: string;
  domain: string;
  customerID: string;
  organizationName: string;
  connectionType: 'oauth' | 'service_account';
  scope: string[];
  isActive: boolean;
  lastSync?: string;
  createdAt: string;
  serviceAccountEmail?: string;
  adminEmail?: string;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  archivedUsers: number;
  adminUsers: number;
  superAdminUsers: number;
  users2svEnrolled: number;
  users2svEnforced: number;
  totalGroups: number;
  totalOrgUnits: number;
  totalSharedDrives: number;
  totalStorageUsed: number;
  totalStorageQuota: number;
}

const GoogleWorkspaceOverview: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    
    // Check for OAuth callback success/error
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const domain = urlParams.get('domain');
    
    if (success === 'true' && domain) {
      alert(`Google Workspace connected successfully for domain: ${domain}`);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchData();
    } else if (error) {
      alert(`Google Workspace connection failed: ${error}`);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch connections
      const connectionsResponse = await api.get('/integrations/google-workspace/connections');
      setConnections(connectionsResponse.data.data || []);

      // For now, set mock stats - will be replaced with real API calls
      if (connectionsResponse.data.data?.length > 0) {
        setStats({
          totalUsers: 0,
          activeUsers: 0,
          suspendedUsers: 0,
          archivedUsers: 0,
          adminUsers: 0,
          superAdminUsers: 0,
          users2svEnrolled: 0,
          users2svEnforced: 0,
          totalGroups: 0,
          totalOrgUnits: 0,
          totalSharedDrives: 0,
          totalStorageUsed: 0,
          totalStorageQuota: 0
        });
      }
    } catch (error) {
      console.error('Error fetching Google Workspace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setConnecting(true);
      const response = await api.post('/integrations/google-workspace/connections/oauth/initiate');
      
      // Redirect to Google OAuth
      window.location.href = response.data.data.authUrl;
    } catch (error) {
      console.error('Error initiating Google Workspace connection:', error);
      alert('Failed to initiate Google Workspace connection');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    if (!confirm('Are you sure you want to disconnect this Google Workspace domain?')) {
      return;
    }

    try {
      await api.delete(`/integrations/google-workspace/connections/${connectionId}`);
      fetchData();
      alert('Google Workspace domain disconnected successfully!');
    } catch (error) {
      console.error('Error disconnecting:', error);
      alert('Failed to disconnect Google Workspace domain');
    }
  };

  const handleTest = async (connectionId: string) => {
    try {
      await api.post(`/integrations/google-workspace/connections/${connectionId}/test`);
      alert('Connection test successful!');
    } catch (error) {
      console.error('Error testing connection:', error);
      alert('Connection test failed');
    }
  };

  const handleSync = async (connectionId: string) => {
    try {
      setSyncing(true);
      await api.post(`/integrations/google-workspace/connections/${connectionId}/sync`);
      fetchData();
      alert('Sync completed successfully!');
    } catch (error) {
      console.error('Error syncing:', error);
      alert('Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getConnectionTypeColor = (type: string) => {
    switch (type) {
      case 'oauth': return 'bg-blue-100 text-blue-800';
      case 'service_account': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Google Workspace</h1>
            <p className="text-gray-600 mt-1">Manage your organization's Google Workspace users, groups, and security settings</p>
          </div>
          <div className="flex space-x-3">
            {connections.length === 0 && (
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Link className="h-4 w-4 mr-2" />
                {connecting ? 'Connecting...' : 'Connect via OAuth'}
              </button>
            )}
            {connections.length > 0 && (
              <button
                onClick={() => connections[0] && handleSync(connections[0].id)}
                disabled={syncing}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync All Data'}
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        {connections.length > 0 && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-xs text-gray-500 mt-1">{stats.activeUsers} active</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Admin Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.adminUsers}</p>
                  <p className="text-xs text-gray-500 mt-1">{stats.superAdminUsers} super admins</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <ShieldCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">2FA Enabled</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.users2svEnrolled}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.totalUsers > 0 ? `${Math.round((stats.users2svEnrolled / stats.totalUsers) * 100)}%` : '0%'} coverage
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FolderTree className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Groups</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalGroups}</p>
                  <p className="text-xs text-gray-500 mt-1">{stats.totalOrgUnits} org units</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Connections */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Connected Domains</h2>
            <p className="text-sm text-gray-600">Manage your Google Workspace domain connections</p>
          </div>
          <div className="p-6">
            {connections.length === 0 ? (
              <div className="text-center py-12">
                <Building className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Domains Connected</h3>
                <p className="text-gray-600 mb-6">Connect your Google Workspace domain to start managing users and security</p>
                <div className="space-y-4 max-w-md mx-auto">
                  <button
                    onClick={handleConnect}
                    disabled={connecting}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Connect via OAuth
                  </button>
                  <div className="text-sm text-gray-500">
                    <p>Or use Service Account credentials from the</p>
                    <a href="/credentials" className="text-blue-600 hover:underline">Credentials page</a>
                  </div>
                </div>
              </div>
          ) : (
            <div className="space-y-4">
              {connections.map((connection) => (
                  <div key={connection.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <h3 className="font-semibold text-gray-900">{connection.domain}</h3>
                          <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                            connection.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {connection.isActive ? (
                              <>
                                <Wifi className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <WifiOff className="h-3 w-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                            getConnectionTypeColor(connection.connectionType)
                          }`}>
                            {connection.connectionType === 'oauth' ? (
                              <>
                                <Link className="h-3 w-3 mr-1" />
                                OAuth
                              </>
                            ) : (
                              <>
                                <Key className="h-3 w-3 mr-1" />
                                Service Account
                              </>
                            )}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p><span className="font-medium">Organization:</span> {connection.organizationName}</p>
                            <p><span className="font-medium">Customer ID:</span> {connection.customerID}</p>
                          </div>
                          <div>
                            <p><span className="font-medium">Connected:</span> {new Date(connection.createdAt).toLocaleDateString()}</p>
                            {connection.lastSync && (
                              <p><span className="font-medium">Last sync:</span> {new Date(connection.lastSync).toLocaleString()}</p>
                            )}
                          </div>
                        </div>

                        {connection.connectionType === 'service_account' && connection.serviceAccountEmail && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                            <p><span className="font-medium">Service Account:</span> {connection.serviceAccountEmail}</p>
                            <p><span className="font-medium">Admin Email:</span> {connection.adminEmail}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1 mt-3">
                          {connection.scope.slice(0, 3).map((scope, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                              <Shield className="h-3 w-3 mr-1" />
                              {scope.split('/').pop()?.replace('.readonly', '')}
                            </span>
                          ))}
                          {connection.scope.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              +{connection.scope.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => handleSync(connection.id)}
                          disabled={syncing}
                          className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          <RefreshCw className={`h-4 w-4 mr-1 ${syncing ? 'animate-spin' : ''}`} />
                          Sync
                        </button>
                        <button
                          onClick={() => handleTest(connection.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 text-sm rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <Activity className="h-4 w-4 mr-1" />
                          Test
                        </button>
                        <button
                          onClick={() => handleDisconnect(connection.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-red-600 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Unlink className="h-4 w-4 mr-1" />
                          Disconnect
                        </button>
                      </div>
                    </div>
                  </div>
              ))}
              </div>
            )}
          </div>
        </div>

        {/* Security Overview */}
        {connections.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Security Overview</h2>
              <p className="text-sm text-gray-600">Monitor your organization's security posture</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <ShieldCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-green-600">
                    {stats ? Math.round((stats.users2svEnrolled / Math.max(stats.totalUsers, 1)) * 100) : 0}%
                  </div>
                  <div className="text-sm font-medium text-gray-900">2FA Coverage</div>
                  <div className="text-xs text-gray-600 mt-1">Users with 2FA enabled</div>
                </div>
                
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-blue-600">{stats?.adminUsers || 0}</div>
                  <div className="text-sm font-medium text-gray-900">Admin Users</div>
                  <div className="text-xs text-gray-600 mt-1">Users with elevated privileges</div>
                </div>
                
                <div className="text-center p-6 bg-orange-50 rounded-lg">
                  <UserX className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-orange-600">{stats?.suspendedUsers || 0}</div>
                  <div className="text-sm font-medium text-gray-900">Suspended Users</div>
                  <div className="text-xs text-gray-600 mt-1">Inactive or disabled accounts</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {connections.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              <p className="text-sm text-gray-600">Common tasks and management shortcuts</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => navigate('/apps/google-workspace/users')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Users className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Manage Users</h3>
                    <p className="text-sm text-gray-600">View and manage workspace users</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => navigate('/apps/google-workspace/ghost-users')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <UserX className="h-8 w-8 text-orange-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Ghost Users</h3>
                    <p className="text-sm text-gray-600">Find inactive license holders</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => navigate('/apps/google-workspace/security')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <ShieldCheck className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Security Audit</h3>
                    <p className="text-sm text-gray-600">Review security settings</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Setup Instructions */}
        {connections.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg">
            <div className="p-6">
              <div className="flex items-start">
                <Info className="h-6 w-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Connection Methods</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Link className="h-4 w-4 mr-2 text-blue-600" />
                        Option 1: OAuth Connection (Recommended)
                      </h4>
                      <ol className="text-sm text-gray-700 space-y-1 ml-6">
                        <li>1. Click "Connect via OAuth" button</li>
                        <li>2. Sign in with your Google Workspace admin account</li>
                        <li>3. Authorize the application to access your domain</li>
                        <li>4. Start managing your users and discovering insights</li>
                      </ol>
                      <p className="text-xs text-gray-500 mt-2">
                        Note: You'll need Super Admin permissions in your Google Workspace
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Key className="h-4 w-4 mr-2 text-green-600" />
                        Option 2: Service Account (Already Configured)
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        You've already added service account credentials. The system will automatically detect and use them.
                      </p>
                      <ol className="text-sm text-gray-700 space-y-1 ml-6">
                        <li>1. Service account JSON already uploaded</li>
                        <li>2. Admin email configured</li>
                        <li>3. Click "Sync All Data" to start syncing</li>
                      </ol>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium text-blue-900 mb-2">What you'll get:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Complete user directory with admin roles and 2FA status</li>
                      <li>• Ghost user detection (users who never logged in)</li>
                      <li>• Security risk assessment and admin oversight</li>
                      <li>• Groups and organizational units management</li>
                      <li>• License optimization recommendations</li>
                      <li>• Storage usage and shared drives analysis</li>
                      <li>• Login activity and usage statistics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Preview */}
        {connections.length === 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Google Workspace Features</h2>
              <p className="text-sm text-gray-600">Powerful features to manage your organization</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <UserX className="h-12 w-12 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-2">Ghost User Detection</h3>
                  <p className="text-sm text-gray-600">Identify users burning licenses who never logged in</p>
                </div>
                <div className="text-center p-4">
                  <ShieldCheck className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-2">Security Insights</h3>
                  <p className="text-sm text-gray-600">Monitor admin roles and 2FA enrollment</p>
                </div>
                <div className="text-center p-4">
                  <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-2">License Optimization</h3>
                  <p className="text-sm text-gray-600">Reduce costs by identifying unused licenses</p>
                </div>
                <div className="text-center p-4">
                  <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-2">Usage Analytics</h3>
                  <p className="text-sm text-gray-600">Track login patterns and user activity</p>
                </div>
                <div className="text-center p-4">
                  <FolderTree className="h-12 w-12 text-indigo-600 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-2">Groups Management</h3>
                  <p className="text-sm text-gray-600">Organize users and manage permissions</p>
                </div>
                <div className="text-center p-4">
                  <Cloud className="h-12 w-12 text-cyan-600 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-2">Storage Analysis</h3>
                  <p className="text-sm text-gray-600">Monitor Drive usage and shared drives</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GoogleWorkspaceOverview;
