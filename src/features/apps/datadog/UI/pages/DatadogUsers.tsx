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
  UserX,
  Eye
} from 'lucide-react';
import { Layout } from '../../../../../shared/components';
import { datadogApi, DatadogUser, DatadogConnection, DatadogUserStats } from '../../services/datadogApi';
import CreateUserModal from '../components/CreateUserModal';
import EditUserModal from '../components/EditUserModal';

const DatadogUsers: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<DatadogUser[]>([]);
  const [stats, setStats] = useState<DatadogUserStats | null>(null);
  const [connections, setConnections] = useState<DatadogConnection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConnection, setSelectedConnection] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [correlationFilter, setCorrelationFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DatadogUser | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConnections();
    fetchUsers();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [selectedConnection, statusFilter, correlationFilter, currentPage]);

  const fetchConnections = async () => {
    try {
      const connectionsData = await datadogApi.getConnections();
      setConnections(connectionsData);
      console.log(`✅ Loaded ${connectionsData.length} Datadog connections`);
    } catch (error) {
      console.error('❌ Error fetching connections:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching Datadog users from API...');
      
      const params: any = {
        page: currentPage,
        limit: 20
      };
      
      if (selectedConnection !== 'all') params.connectionId = selectedConnection;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (correlationFilter !== 'all') params.correlationStatus = correlationFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await datadogApi.getUsers(params);
      
      setUsers(response.users || []);
      setTotalPages(response.pagination?.totalPages || 1);
      console.log(`✅ Loaded ${response.users?.length || 0} Datadog users`);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const connectionId = selectedConnection !== 'all' ? selectedConnection : undefined;
      const statsData = await datadogApi.getUserStats(connectionId);
      setStats(statsData);
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
    }
  };

  const handleSyncUsers = async () => {
    if (selectedConnection === 'all') {
      alert('Please select a specific connection to sync');
      return;
    }

    try {
      setSyncing(true);
      console.log('🔄 Starting Datadog user sync...');
      
      await datadogApi.syncUsers(selectedConnection);
      
      // Refresh data after sync
      await fetchUsers();
      await fetchStats();
      
      console.log('✅ Sync completed successfully');
    } catch (error) {
      console.error('❌ Error syncing users:', error);
      alert('Failed to sync users. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateUser = async (userData: any) => {
    try {
      console.log('🔄 Creating Datadog user:', userData);
      await datadogApi.createUser(userData);
      await fetchUsers();
      await fetchStats();
      console.log('✅ User created successfully');
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  };

  const handleUpdateUser = async (userId: string, userData: any) => {
    try {
      console.log('🔄 Updating Datadog user:', userId, userData);
      await datadogApi.updateUser(userId, userData);
      await fetchUsers();
      await fetchStats();
      console.log('✅ User updated successfully');
    } catch (error) {
      console.error('❌ Error updating user:', error);
      throw error;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('🗑️ Deleting Datadog user:', userId);
      await datadogApi.deleteUser(userId);
      await fetchUsers();
      await fetchStats();
      console.log('✅ User deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    await fetchUsers();
  };

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const connectionId = selectedConnection !== 'all' ? selectedConnection : undefined;
      const blob = await datadogApi.exportUsers({ format, connectionId });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `datadog-users.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('❌ Error exporting users:', error);
      alert('Export failed. Please try again.');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.handle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusIcon = (status: string, disabled: boolean) => {
    if (disabled) {
      return <UserX className="h-4 w-4 text-red-600" />;
    }
    switch (status) {
      case 'Active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string, disabled: boolean) => {
    if (disabled) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Disabled</span>;
    }
    switch (status) {
      case 'Active':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
      case 'Pending':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getCorrelationBadge = (correlationStatus: string) => {
    switch (correlationStatus) {
      case 'matched':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Matched</span>;
      case 'unmatched':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unmatched</span>;
      case 'conflict':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Conflict</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/apps/datadog')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Datadog Users</h1>
                    <p className="mt-1 text-gray-600">Manage Datadog users, roles, and permissions across organizations</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSyncUsers}
                  disabled={syncing || selectedConnection === 'all'}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync from Datadog'}
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users by name, email, or handle..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedConnection}
                    onChange={(e) => setSelectedConnection(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 rounded-md"
                  >
                    <option value="all">All Connections</option>
                    {connections.map((conn) => (
                      <option key={conn.id} value={conn.id}>
                        {conn.organizationName}
                      </option>
                    ))}
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 rounded-md"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                  <select
                    value={correlationFilter}
                    onChange={(e) => setCorrelationFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 rounded-md"
                  >
                    <option value="all">All Correlation</option>
                    <option value="matched">Matched</option>
                    <option value="unmatched">Unmatched</option>
                    <option value="conflict">Conflict</option>
                  </select>
                  <button
                    onClick={handleSearch}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserCheck className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Verified Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.verifiedUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Shield className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Correlation Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.correlationRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Datadog Users</h3>
            </div>
            <div className="overflow-x-auto">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Datadog users found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {users.length === 0 
                      ? 'Click "Sync from Datadog" to fetch users from your connected Datadog organizations.'
                      : 'Try adjusting your search or filter criteria.'
                    }
                  </p>
                  {users.length === 0 && (
                    <div className="mt-6 space-x-3">
                      <button
                        onClick={handleSyncUsers}
                        disabled={syncing || selectedConnection === 'all'}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                        {syncing ? 'Syncing...' : 'Sync from Datadog'}
                      </button>
                      <button
                        onClick={() => navigate('/apps/datadog/settings')}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Manage Connections
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teams</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correlation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                      <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-purple-600">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              <div className="text-xs text-gray-400">@{user.handle}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(user.status, user.disabled)}
                            <span className="ml-2">{getStatusBadge(user.status, user.disabled)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.roles.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {user.roles.slice(0, 2).map((role, index) => (
                                  <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                                    {role}
                                  </span>
                                ))}
                                {user.roles.length > 2 && (
                                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                                    +{user.roles.length - 2}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">No roles</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.teams.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {user.teams.slice(0, 2).map((team, index) => (
                                  <span key={index} className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                                    {team}
                                  </span>
                                ))}
                                {user.teams.length > 2 && (
                                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                                    +{user.teams.length - 2}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">No teams</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getCorrelationBadge(user.correlationStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.verified ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Unverified
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowEditModal(true);
                              }}
                              className="text-purple-600 hover:text-purple-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create User Modal */}
        <CreateUserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateUser={handleCreateUser}
          availableConnections={connections}
        />

        {/* Edit User Modal */}
        <EditUserModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onUpdateUser={handleUpdateUser}
          user={selectedUser}
        />
      </div>
    </Layout>
  );
};

export default DatadogUsers;
