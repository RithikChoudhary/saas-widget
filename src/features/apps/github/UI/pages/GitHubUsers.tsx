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
  Star,
  Activity,
  TrendingUp,
  BarChart3,
  ChevronUp,
  Eye,
  Settings,
  Wifi,
  WifiOff,
  ArrowRight,
  X,
  Mail
} from 'lucide-react';
import { Layout } from '../../../../../shared/components';
import api from '../../../../../shared/utils/api';

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

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  botUsers: number;
  totalConnections: number;
  lastSync: string;
}

const GitHubUsers: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    botUsers: 0,
    totalConnections: 0,
    lastSync: 'Never'
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConnection, setSelectedConnection] = useState<string>('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteUsername, setInviteUsername] = useState('');
  const [inviteConnectionId, setInviteConnectionId] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchConnections();
  }, []);

  useEffect(() => {
    if (connections.length > 0) {
      fetchUsers();
      fetchStats();
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

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedConnection) {
        params.append('connectionId', selectedConnection);
      }

      const response = await api.get(`/integrations/github/users/stats?${params.toString()}`);
      setStats(response.data.data || stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSync = async () => {
    if (!selectedConnection) return;

    try {
      setSyncing(true);
      await api.post('/integrations/github/users/sync', {
        connectionId: selectedConnection
      });
      
      // Show success message
      alert('Users sync initiated successfully! This may take a few minutes to complete.');
      
      // Refresh data after a delay
      setTimeout(() => {
        fetchUsers();
        fetchStats();
      }, 2000);
    } catch (error) {
      console.error('Error syncing users:', error);
      alert('Failed to sync users. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchUsers(), fetchStats()]);
    setRefreshing(false);
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
      fetchStats();
    } catch (error) {
      console.error('Error removing user:', error);
      alert('Failed to remove user');
    }
  };

  const organizationConnections = connections.filter(conn => conn.scope === 'organization');

  if (loading && connections.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                ))}
              </div>
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black dark:from-gray-900 dark:via-black dark:to-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/20 to-black/20 dark:from-gray-900/30 dark:to-black/30"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={() => navigate('/apps/github')}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200"
                  >
                    <ChevronRight className="h-5 w-5 rotate-180" />
                  </button>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Users className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold">GitHub Users & Members</h1>
                      <p className="text-gray-100 dark:text-gray-200 text-lg">Manage organization members, roles, and permissions</p>
                    </div>
                  </div>
                </div>
                <p className="text-xl text-gray-100 dark:text-gray-200 max-w-3xl">
                  View and manage GitHub users across your connected organizations and repositories
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  onClick={handleSync}
                  disabled={syncing || !selectedConnection}
                  className="flex items-center px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg disabled:opacity-50"
                >
                  <RefreshCw className={`h-5 w-5 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync from GitHub'}
                </button>
                {organizationConnections.length > 0 && (
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite User
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 dark:text-gray-200 text-sm">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-gray-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 dark:text-gray-200 text-sm">Active</p>
                    <p className="text-2xl font-bold">{stats.activeUsers}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-gray-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 dark:text-gray-200 text-sm">Admins</p>
                    <p className="text-2xl font-bold">{stats.adminUsers}</p>
                  </div>
                  <Shield className="h-8 w-8 text-gray-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 dark:text-gray-200 text-sm">Bots</p>
                    <p className="text-2xl font-bold">{stats.botUsers}</p>
                  </div>
                  <Activity className="h-8 w-8 text-gray-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 dark:text-gray-200 text-sm">Connections</p>
                    <p className="text-2xl font-bold">{stats.totalConnections}</p>
                  </div>
                  <GitBranch className="h-8 w-8 text-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Enhanced Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm">
                  <ChevronUp className="h-4 w-4" />
                  <span>Total</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">GitHub Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Across {stats.totalConnections} connections
                </p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>Active</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Active Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeUsers}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats.totalUsers ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% of total
                </p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm">
                  <BarChart3 className="h-4 w-4" />
                  <span>Privileged</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Admin Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.adminUsers}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Site administrators
                </p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-indigo-600 dark:text-indigo-400 text-sm">
                  <Wifi className="h-4 w-4" />
                  <span>Automated</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Bot Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.botUsers}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Automated accounts
                </p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 mb-8">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users by username, name, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedConnection}
                    onChange={(e) => setSelectedConnection(e.target.value)}
                    className="block w-full pl-3 pr-10 py-3 text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl"
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
                  <button className="inline-flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </button>
                  <button className="inline-flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Showing {users.length} of {stats.totalUsers} users
                </span>
                <span>Last sync: {stats.lastSync}</span>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">GitHub Users</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage users across your GitHub organizations</p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {users.length} user{users.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {users.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No GitHub users found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    {connections.length === 0 
                      ? 'Connect a GitHub account to start managing users.'
                      : selectedConnection 
                        ? 'Try syncing users or adjusting your search criteria.'
                        : 'Select a connection to view users.'
                    }
                  </p>
                  {connections.length === 0 ? (
                    <button
                      onClick={() => navigate('/apps/github/connections')}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Connect GitHub
                    </button>
                  ) : selectedConnection && (
                    <button
                      onClick={handleSync}
                      disabled={syncing}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50"
                    >
                      <RefreshCw className={`h-5 w-5 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                      {syncing ? 'Syncing...' : 'Sync Users'}
                    </button>
                  )}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
                  <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stats</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Connection</th>
                      <th className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/60 dark:bg-gray-800/60 divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <img
                                className="h-12 w-12 rounded-xl object-cover"
                                src={user.avatarUrl || `https://github.com/${user.login}.png`}
                                alt={user.login}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">{user.name || user.login}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">@{user.login}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {user.email && <div className="mb-1 flex items-center"><Mail className="h-3 w-3 mr-1" />{user.email}</div>}
                            {user.company && <div className="text-gray-500 dark:text-gray-400 mb-1">🏢 {user.company}</div>}
                            {user.location && <div className="text-gray-500 dark:text-gray-400 mb-1">📍 {user.location}</div>}
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`px-2 py-1 text-xs rounded-lg font-medium ${
                                user.type === 'User' 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' 
                                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                              }`}>
                                {user.type}
                              </span>
                              {user.siteAdmin && (
                                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-lg font-medium">Admin</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">
                            <div className="flex items-center space-x-4 mb-2">
                              <div className="flex items-center">
                                <GitBranch className="h-4 w-4 mr-1 text-gray-400" />
                                <span>{user.publicRepos}</span>
                              </div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 mr-1 text-gray-400" />
                                <span>{user.followers}</span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {user.publicGists} gists • {user.following} following
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">
                            <div className="font-medium">
                              {user.connection.organization || user.connection.username}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Last sync: {new Date(user.lastSync).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => window.open(`https://github.com/${user.login}`, '_blank')}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveUser(user.login)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
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
        </div>

        {/* Invite User Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invite User to Organization</h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    value={inviteUsername}
                    onChange={(e) => setInviteUsername(e.target.value)}
                    placeholder="Enter GitHub username"
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Organization
                  </label>
                  <select
                    value={inviteConnectionId}
                    onChange={(e) => setInviteConnectionId(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select organization</option>
                    {organizationConnections.map((connection) => (
                      <option key={connection.id} value={connection.id}>
                        {connection.organizationName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInviteUser}
                  disabled={!inviteUsername || !inviteConnectionId}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GitHubUsers;
