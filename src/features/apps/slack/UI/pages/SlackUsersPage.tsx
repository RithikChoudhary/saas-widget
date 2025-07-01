import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight,
  Users,
  Shield,
  RefreshCw,
  Search,
  Filter,
  Download,
  UserCheck,
  UserX,
  Crown,
  Clock
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
      return <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Primary Owner</span>;
    }
    if (user.isOwner) {
      return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Owner</span>;
    }
    if (user.isAdmin) {
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Admin</span>;
    }
    if (user.isRestricted) {
      return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Restricted</span>;
    }
    if (user.isUltraRestricted) {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Ultra Restricted</span>;
    }
    return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Member</span>;
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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/apps/slack')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">👥</span>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Slack Users</h1>
                    <p className="mt-1 text-gray-600">Manage workspace users and permissions</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync Users'}
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    <p className="text-xs text-gray-500">{stats.activeUsers} active</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Crown className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Admins</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.adminUsers}</p>
                    <p className="text-xs text-gray-500">Admin users</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">2FA Enabled</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.twoFactorPercentage}%</p>
                    <p className="text-xs text-gray-500">{stats.users2FA} users</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserX className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Inactive</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.inactiveUsers}</p>
                    <p className="text-xs text-gray-500">30+ days</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Users</option>
                    <option value="admin">Admins Only</option>
                    <option value="restricted">Restricted</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Security
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Workspace
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.avatar ? (
                              <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <Users className="h-5 w-5 text-gray-600" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.displayName || user.realName}
                            </div>
                            <div className="text-sm text-gray-500">@{user.name}</div>
                            {user.title && (
                              <div className="text-xs text-gray-400">{user.title}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getUserRoleBadge(user)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email || 'No email'}</div>
                        {user.phone && (
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        )}
                        {user.department && (
                          <div className="text-xs text-gray-400">{user.department}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {user.has2FA ? (
                            <UserCheck className="h-4 w-4 text-green-600" />
                          ) : (
                            <UserX className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-xs text-gray-500">
                            {user.has2FA ? '2FA' : 'No 2FA'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {getLastActiveStatus(user.lastActiveAt)}
                          </span>
                        </div>
                        {user.timezone && (
                          <div className="text-xs text-gray-500">{user.timezoneLabel}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.workspace && (
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.workspace.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.workspace.domain}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">
                {users.length === 0 
                  ? 'Connect a Slack workspace and sync users to get started.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SlackUsersPage;
