import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft,
  Users,
  Shield,
  RefreshCw,
  Search,
  Filter,
  Download,
  UserCheck,
  UserX,
  Crown,
  Clock,
  Mail,
  Phone,
  Building,
  Globe,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { Layout } from '../../../../../shared/components';
import api from '../../../../../shared/utils/api';

interface SlackUser {
  id: string;
  slackId: string;
  name: string;
  realName: string;
  displayName: string;
  email?: string;
  phone?: string;
  title?: string;
  department?: string;
  avatar?: string;
  timezone?: string;
  timezoneLabel?: string;
  isAdmin: boolean;
  isOwner: boolean;
  isPrimaryOwner: boolean;
  isRestricted: boolean;
  isUltraRestricted: boolean;
  isBot: boolean;
  isAppUser?: boolean;
  has2FA?: boolean;
  lastActiveAt?: string;
  lastSync: string;
  workspace?: {
    name: string;
    domain: string;
  };
}

interface UserStats {
  totalUsers: number;
  adminUsers: number;
  botUsers: number;
  restrictedUsers: number;
  users2FA: number;
  activeUsers: number;
  inactiveUsers: number;
  twoFactorPercentage: number;
}

const SlackUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<SlackUser[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'admin' | 'restricted' | 'inactive'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Slack Users: Fetching users...');
      
      // Fetch users and stats from real API
      const [usersResponse, statsResponse] = await Promise.all([
        api.get('/integrations/slack/users').catch((error) => {
          console.log('⚠️ Users API not available:', error.message);
          return { data: { data: [] } };
        }),
        api.get('/integrations/slack/users/stats').catch((error) => {
          console.log('⚠️ Users stats API not available:', error.message);
          return { data: { data: null } };
        })
      ]);

      console.log('✅ Slack Users: Successfully fetched user stats');
      console.log('✅ Slack Users: Successfully fetched users');
      
      const usersData = usersResponse.data.data || [];
      const statsData = statsResponse.data.data || null;
      
      console.log('📊 Users data:', usersData.length, 'users found');
      console.log('📊 Stats data:', statsData);

      setUsers(usersData);
      setStats(statsData);
    } catch (error) {
      console.error('❌ Error fetching Slack users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      await api.post('/integrations/slack/users/sync');
      await fetchData();
      alert('Users synced successfully!');
    } catch (error) {
      console.error('Error syncing users:', error);
      alert('Failed to sync users');
    } finally {
      setSyncing(false);
    }
  };

  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = !searchTerm || 
      user.realName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Type filter
    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'admin' && user.isAdmin) ||
      (filterType === 'restricted' && (user.isRestricted || user.isUltraRestricted)) ||
      (filterType === 'inactive' && (!user.lastActiveAt || 
        new Date(user.lastActiveAt) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)));

    return matchesSearch && matchesFilter;
  });

  const getUserRoleBadge = (user: SlackUser) => {
    if (user.isPrimaryOwner) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Primary Owner</span>;
    }
    if (user.isOwner) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Owner</span>;
    }
    if (user.isAdmin) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Admin</span>;
    }
    if (user.isRestricted) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Restricted</span>;
    }
    if (user.isUltraRestricted) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Ultra Restricted</span>;
    }
    return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">Member</span>;
  };

  const getLastActiveStatus = (lastActiveAt?: string) => {
    if (!lastActiveAt) return 'Never';
    
    const lastActive = new Date(lastActiveAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (24 * 60 * 60 * 1000));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getActivityStatusColor = (lastActiveAt?: string) => {
    if (!lastActiveAt) return 'text-gray-500';
    
    const lastActive = new Date(lastActiveAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (24 * 60 * 60 * 1000));
    
    if (diffDays === 0) return 'text-green-600';
    if (diffDays <= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/apps/slack')}
                  className="text-white hover:text-purple-200 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">Slack Users</h1>
                    <p className="mt-1 text-purple-100 text-lg">
                      {stats ? `Managing ${stats.totalUsers} users across workspaces` : 'Manage workspace users and permissions'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync Users'}
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                <button 
                  onClick={() => window.open('https://slack.com', '_blank')}
                  className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Slack.com
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{stats.activeUsers} active</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-yellow-500">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Crown className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Admins</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.adminUsers}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Admin users</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-green-500">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">2FA Enabled</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.twoFactorPercentage}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{stats.users2FA} users</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-red-500">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                    <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inactiveUsers}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">30+ days</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Users</option>
                    <option value="admin">Admins Only</option>
                    <option value="restricted">Restricted</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            </div>
          </div>

          {/* Users Grid */}
          {filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <div key={user.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* User Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {user.avatar ? (
                            <img className="h-12 w-12 rounded-full" src={user.avatar} alt="" />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {user.displayName || user.realName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">@{user.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getUserRoleBadge(user)}
                      </div>
                    </div>

                    {/* User Details */}
                    <div className="space-y-3">
                      {user.title && (
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{user.title}</span>
                        </div>
                      )}
                      
                      {user.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-300 truncate">{user.email}</span>
                        </div>
                      )}
                      
                      {user.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{user.phone}</span>
                        </div>
                      )}

                      {user.timezoneLabel && (
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{user.timezoneLabel}</span>
                        </div>
                      )}
                    </div>

                    {/* Security & Activity */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {user.has2FA ? (
                            <div className="flex items-center space-x-1">
                              <UserCheck className="h-4 w-4 text-green-600" />
                              <span className="text-xs text-green-600 font-medium">2FA</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <UserX className="h-4 w-4 text-red-600" />
                              <span className="text-xs text-red-600 font-medium">No 2FA</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className={`text-xs font-medium ${getActivityStatusColor(user.lastActiveAt)}`}>
                            {getLastActiveStatus(user.lastActiveAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Workspace Info */}
                    {user.workspace && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-medium">{user.workspace.name}</span>
                          <span className="mx-1">•</span>
                          <span>{user.workspace.domain}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {users.length === 0 
                  ? 'Connect a Slack workspace and sync users to get started.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {users.length === 0 && (
                <div className="flex justify-center space-x-3">
                  <button 
                    onClick={() => navigate('/apps/slack')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Back to Slack Overview
                  </button>
                  <button 
                    onClick={() => navigate('/credentials')}
                    className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors border border-purple-300"
                  >
                    Setup Connection
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SlackUsersPage;
