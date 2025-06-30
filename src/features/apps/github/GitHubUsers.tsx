import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight,
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  UserPlus,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  ExternalLink,
  GitBranch,
  Star
} from 'lucide-react';
import { Layout } from '../../../shared/components';
import api from '../../../shared/utils/api';

interface User {
  id: string;
  githubId: number;
  login: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  type: 'User' | 'Bot';
  siteAdmin: boolean;
  company?: string;
  location?: string;
  bio?: string;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  lastSync: string;
  connection: {
    id: string;
    organization?: string;
    username?: string;
  };
}

interface Connection {
  id: string;
  scope: 'user' | 'organization';
  organizationName?: string;
  username?: string;
  isActive: boolean;
}

const GitHubUsers: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConnection, setSelectedConnection] = useState<string>('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteUsername, setInviteUsername] = useState('');
  const [inviteConnectionId, setInviteConnectionId] = useState('');
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchConnections();
  }, []);

  useEffect(() => {
    if (connections.length > 0) {
      fetchUsers();
    }
  }, [selectedConnection, searchTerm, connections]);

  const fetchConnections = async () => {
    try {
      const response = await api.get('/integrations/github/connections');
      const activeConnections = response.data.data?.filter((conn: Connection) => conn.isActive) || [];
      setConnections(activeConnections);
      
      if (activeConnections.length > 0 && !selectedConnection) {
        setSelectedConnection(activeConnections[0].id);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedConnection) {
        params.append('connectionId', selectedConnection);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await api.get(`/integrations/github/users?${params.toString()}`);
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!selectedConnection) return;

    try {
      setSyncing(true);
      await api.post('/integrations/github/users/sync', {
        connectionId: selectedConnection
      });
      alert('Users sync initiated. This may take a few minutes.');
      
      // Refresh users after a delay
      setTimeout(fetchUsers, 2000);
    } catch (error) {
      console.error('Error syncing users:', error);
      alert('Failed to sync users');
    } finally {
      setSyncing(false);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteUsername || !inviteConnectionId) return;

    try {
      await api.post('/integrations/github/users/invite', {
        connectionId: inviteConnectionId,
        username: inviteUsername
      });
      
      setShowInviteModal(false);
      setInviteUsername('');
      setInviteConnectionId('');
      alert('User invitation sent successfully!');
      fetchUsers();
    } catch (error) {
      console.error('Error inviting user:', error);
      alert('Failed to invite user');
    }
  };

  const handleRemoveUser = async (username: string) => {
    if (!selectedConnection) return;
    
    if (!confirm(`Are you sure you want to remove ${username}?`)) {
      return;
    }

    try {
      await api.delete(`/integrations/github/users/${username}`, {
        data: { connectionId: selectedConnection }
      });
      
      alert('User removed successfully!');
      fetchUsers();
    } catch (error) {
      console.error('Error removing user:', error);
      alert('Failed to remove user');
    }
  };

  const organizationConnections = connections.filter(conn => conn.scope === 'organization');

  if (loading && connections.length === 0) {
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
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">GitHub Users & Members</h1>
                    <p className="mt-1 text-gray-600">Manage GitHub users, organization members, and permissions</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSync}
                  disabled={syncing || !selectedConnection}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync from GitHub'}
                </button>
                {organizationConnections.length > 0 && (
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.type === 'User').length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.siteAdmin).length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <GitBranch className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Connections</p>
                  <p className="text-2xl font-bold text-gray-900">{connections.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users by username, name, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedConnection}
                    onChange={(e) => setSelectedConnection(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  >
                    <option value="">All Connections</option>
                    {connections.map((connection) => (
                      <option key={connection.id} value={connection.id}>
                        {connection.scope === 'organization' 
                          ? connection.organizationName 
                          : connection.username} ({connection.scope})
                      </option>
                    ))}
                  </select>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </button>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">GitHub Users</h3>
            </div>
            <div className="overflow-x-auto">
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No GitHub users found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {connections.length === 0 
                      ? 'Connect a GitHub account to start managing users.'
                      : selectedConnection 
                        ? 'Try syncing users or adjusting your search criteria.'
                        : 'Select a connection to view users.'
                    }
                  </p>
                  {connections.length === 0 ? (
                    <div className="mt-6">
                      <button
                        onClick={() => navigate('/apps/github/connections')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Connect GitHub
                      </button>
                    </div>
                  ) : selectedConnection && (
                    <div className="mt-6">
                      <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                        {syncing ? 'Syncing...' : 'Sync Users'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Connection</th>
                      <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user.avatarUrl || `https://github.com/${user.login}.png`}
                                alt={user.login}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name || user.login}</div>
                              <div className="text-sm text-gray-500">@{user.login}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {user.email && <div className="mb-1">{user.email}</div>}
                            {user.company && <div className="text-gray-500">🏢 {user.company}</div>}
                            {user.location && <div className="text-gray-500">📍 {user.location}</div>}
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 text-xs rounded ${
                                user.type === 'User' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {user.type}
                              </span>
                              {user.siteAdmin && (
                                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Admin</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>📁 {user.publicRepos} repos</div>
                          <div>👥 {user.followers} followers</div>
                          <div>👤 {user.following} following</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{user.connection.organization || user.connection.username}</div>
                          <div className="text-xs">Synced: {new Date(user.lastSync).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <a
                              href={`https://github.com/${user.login}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                            {connections.find(c => c.id === user.connection.id)?.scope === 'organization' && (
                              <button
                                onClick={() => handleRemoveUser(user.login)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Invite User Modal */}
          {showInviteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Invite User to Organization</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Organization</label>
                    <select
                      value={inviteConnectionId}
                      onChange={(e) => setInviteConnectionId(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">Select organization...</option>
                      {organizationConnections.map((connection) => (
                        <option key={connection.id} value={connection.id}>
                          {connection.organizationName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub Username</label>
                    <input
                      type="text"
                      value={inviteUsername}
                      onChange={(e) => setInviteUsername(e.target.value)}
                      placeholder="Enter GitHub username"
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInviteUser}
                    disabled={!inviteUsername || !inviteConnectionId}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Send Invitation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GitHubUsers;
