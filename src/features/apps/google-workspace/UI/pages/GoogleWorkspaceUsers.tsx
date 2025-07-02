import React, { useState, useEffect } from 'react';
import api from '../../../../../shared/utils/api';
import { Layout } from '../../../../../shared/components';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  RefreshCw, 
  ChevronLeft,
  ChevronRight,
  Shield,
  ShieldOff,
  UserCheck,
  UserX,
  Clock,
  Mail,
  Phone,
  Building,
  Briefcase,
  MapPin,
  Key,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Download,
  Eye
} from 'lucide-react';

interface User {
  _id: string;
  companyId: string;
  connectionId: string;
  googleUserId: string;
  primaryEmail: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isDelegatedAdmin: boolean;
  suspended: boolean;
  archived: boolean;
  changePasswordAtNextLogin: boolean;
  ipWhitelisted: boolean;
  orgUnitPath: string;
  lastLoginTime?: string;
  creationTime: string;
  deletionTime?: string;
  suspensionReason?: string;
  jobTitle?: string;
  department?: string;
  location?: string;
  phoneNumber?: string;
  recoveryEmail?: string;
  recoveryPhone?: string;
  isEnforcedIn2Sv: boolean;
  isEnrolledIn2Sv: boolean;
  agreedToTerms: boolean;
  quotaUsed: number;
  quotaLimit: number;
  isActive: boolean;
  lastSync: string;
}

const GoogleWorkspaceUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all');
  const [filterAdmin, setFilterAdmin] = useState<'all' | 'admin' | 'user'>('all');
  const [filter2FA, setFilter2FA] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery, filterStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const companyId = localStorage.getItem('companyId') || '1';
      const params = new URLSearchParams({
        companyId,
        page: currentPage.toString(),
        limit: '50',
        ...(searchQuery && { search: searchQuery }),
        ...(filterStatus !== 'all' && { isActive: filterStatus === 'active' ? 'true' : 'false' })
      });

      console.log('🔍 Fetching users with params:', params.toString());
      
      const response = await api.get(`/integrations/google-workspace/users?${params}`);
      
      console.log('📊 Users API response:', response.data);
      
      if (response.data.success) {
        let filteredUsers = response.data.users || [];
        
        console.log('👥 Raw users from API:', filteredUsers.length);
        
        // Apply client-side filters
        if (filterAdmin !== 'all') {
          filteredUsers = filteredUsers.filter((user: User) => 
            filterAdmin === 'admin' ? (user.isAdmin || user.isSuperAdmin) : (!user.isAdmin && !user.isSuperAdmin)
          );
        }
        
        if (filter2FA !== 'all') {
          filteredUsers = filteredUsers.filter((user: User) => 
            filter2FA === 'enabled' ? user.isEnrolledIn2Sv : !user.isEnrolledIn2Sv
          );
        }
        
        console.log('👥 Filtered users:', filteredUsers.length);
        
        setUsers(filteredUsers);
        setTotalPages(response.data.pagination?.pages || 1);
        setTotalUsers(response.data.pagination?.total || 0);
      } else {
        console.error('❌ API returned success: false', response.data);
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const companyId = localStorage.getItem('companyId') || '1';
      
      // Get the first connection
      const connectionsResponse = await api.get('/integrations/google-workspace/connections');
      if (connectionsResponse.data.success && connectionsResponse.data.connections?.length > 0) {
        // Use _id instead of id for MongoDB ObjectId
        const connectionId = connectionsResponse.data.connections[0]._id;
        
        console.log('🔄 Syncing users with connectionId:', connectionId);
        
        await api.post('/integrations/google-workspace/sync/users', {
          connectionId,
          companyId
        });
        
        // Refresh the user list
        await fetchUsers();
        alert('Users synced successfully!');
      } else {
        alert('No Google Workspace connection found');
      }
    } catch (error) {
      console.error('Error syncing users:', error);
      alert('Failed to sync users. Please check the connection.');
    } finally {
      setSyncing(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = (user: User) => {
    if (user.suspended) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <UserX className="h-3 w-3 mr-1" />
          Suspended
        </span>
      );
    }
    if (!user.isActive) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          <XCircle className="h-3 w-3 mr-1" />
          Inactive
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </span>
    );
  };

  const getAdminBadge = (user: User) => {
    if (user.isSuperAdmin) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
          <Shield className="h-3 w-3 mr-1" />
          Super Admin
        </span>
      );
    }
    if (user.isAdmin) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          <Shield className="h-3 w-3 mr-1" />
          Admin
        </span>
      );
    }
    return null;
  };

  const get2FABadge = (user: User) => {
    if (user.isEnforcedIn2Sv) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <Lock className="h-3 w-3 mr-1" />
          2FA Enforced
        </span>
      );
    }
    if (user.isEnrolledIn2Sv) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          <Key className="h-3 w-3 mr-1" />
          2FA Enrolled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
        <Unlock className="h-3 w-3 mr-1" />
        No 2FA
      </span>
    );
  };

  const exportUsers = () => {
    const csvContent = [
      ['Email', 'Name', 'Status', 'Admin', '2FA', 'Department', 'Job Title', 'Last Login', 'Created'].join(','),
      ...users.map(user => [
        user.primaryEmail,
        user.fullName,
        user.suspended ? 'Suspended' : (user.isActive ? 'Active' : 'Inactive'),
        user.isSuperAdmin ? 'Super Admin' : (user.isAdmin ? 'Admin' : 'User'),
        user.isEnforcedIn2Sv ? '2FA Enforced' : (user.isEnrolledIn2Sv ? '2FA Enrolled' : 'No 2FA'),
        user.department || '',
        user.jobTitle || '',
        formatDate(user.lastLoginTime),
        formatDate(user.creationTime)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `google-workspace-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/apps/google-workspace')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Google Workspace Users</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Total: {totalUsers} users • Page {currentPage} of {totalPages}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportUsers}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Users'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
            
            <select
              value={filterAdmin}
              onChange={(e) => setFilterAdmin(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins Only</option>
              <option value="user">Users Only</option>
            </select>
            
            <select
              value={filter2FA}
              onChange={(e) => setFilter2FA(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All 2FA Status</option>
              <option value="enabled">2FA Enabled</option>
              <option value="disabled">No 2FA</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Security
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Storage
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.fullName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.primaryEmail}
                          </div>
                          {user.department && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                              <Building className="h-3 w-3 mr-1" />
                              {user.department}
                              {user.jobTitle && ` • ${user.jobTitle}`}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getAdminBadge(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {get2FABadge(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(user.lastLoginTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.quotaUsed > 0 ? (
                        <div>
                          <div className="text-xs">{formatBytes(user.quotaUsed)}</div>
                          <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${Math.min((user.quotaUsed / user.quotaLimit) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No data</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-600 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{(currentPage - 1) * 50 + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * 50, totalUsers)}</span> of{' '}
                  <span className="font-medium">{totalUsers}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* User Details Modal */}
        {showUserDetails && selectedUser && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">User Details</h3>
                  <button
                    onClick={() => setShowUserDetails(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Basic Information</h4>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{selectedUser.fullName}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{selectedUser.primaryEmail}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{selectedUser.department || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Job Title</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{selectedUser.jobTitle || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{selectedUser.location || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{selectedUser.phoneNumber || 'N/A'}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Account Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {getStatusBadge(selectedUser)}
                      {getAdminBadge(selectedUser)}
                      {get2FABadge(selectedUser)}
                      {selectedUser.changePasswordAtNextLogin && (
                        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Password Change Required
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Activity</h4>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Login</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{formatDate(selectedUser.lastLoginTime)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Created</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{formatDate(selectedUser.creationTime)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Storage Used</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">
                          {formatBytes(selectedUser.quotaUsed)} / {formatBytes(selectedUser.quotaLimit)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Org Unit</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{selectedUser.orgUnitPath}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  {selectedUser.suspensionReason && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Suspension Details</h4>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedUser.suspensionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GoogleWorkspaceUsers;
