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
  Key,
  UserPlus,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  Lock,
  Settings
} from 'lucide-react';
import { Layout } from '../../../shared/components';
import CreateUserModal from './components/CreateUserModal';
import EditUserModal from './components/EditUserModal';
import CreateGroupModal from './components/CreateGroupModal';

interface AWSUser {
  id: string;
  userName: string;
  email?: string;
  arn: string;
  createDate: string;
  lastActivity?: string;
  status: 'active' | 'inactive' | 'locked';
  groups: string[];
  policies: string[];
  accessKeys: number;
  mfaEnabled: boolean;
  accountId: string;
  accountName: string;
}

interface AWSGroup {
  id: string;
  groupName: string;
  arn: string;
  userCount: number;
  policies: string[];
}

const AWSUsers: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AWSUser[]>([]);
  const [groups, setGroups] = useState<AWSGroup[]>([]);
  const [availableAccounts, setAvailableAccounts] = useState<Array<{ accountId: string; accountName: string }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AWSUser | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'groups'>('users');
  const [showUserMenu, setShowUserMenu] = useState<string | null>(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [selectedAccountForGroup, setSelectedAccountForGroup] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAWSUsers();
    fetchAWSGroups();
    fetchAvailableAccounts();
  }, []);

  const fetchAvailableAccounts = async () => {
    try {
      const response = await fetch('/api/integrations/aws/accounts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAvailableAccounts(data.data.map((account: any) => ({
            accountId: account.accountId,
            accountName: account.accountName
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching AWS accounts:', error);
    }
  };

  const fetchAWSUsers = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching AWS users from API...');
      
      const response = await fetch('/api/integrations/aws/iam/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      console.log('📡 AWS Users API Response:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 AWS Users Data:', data);
        
        if (data.success) {
          setUsers(data.data || []);
          console.log(`✅ Loaded ${data.data?.length || 0} AWS users`);
        } else {
          console.log('❌ API returned success: false');
          setUsers([]);
        }
      } else {
        console.log('❌ API request failed:', response.status);
        const errorData = await response.text();
        console.log('Error details:', errorData);
        setUsers([]);
      }
    } catch (error) {
      console.error('❌ Error fetching AWS users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAWSGroups = async () => {
    try {
      console.log('🔍 Fetching AWS groups from API...');
      
      const response = await fetch('/api/integrations/aws/iam/groups', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      console.log('📡 AWS Groups API Response:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 AWS Groups Data:', data);
        
        if (data.success) {
          setGroups(data.data || []);
          console.log(`✅ Loaded ${data.data?.length || 0} AWS groups`);
        } else {
          console.log('❌ Groups API returned success: false');
          setGroups([]);
        }
      } else {
        console.log('❌ Groups API request failed:', response.status);
        const errorData = await response.text();
        console.log('Groups error details:', errorData);
        setGroups([]);
      }
    } catch (error) {
      console.error('❌ Error fetching AWS groups:', error);
      setGroups([]);
    }
  };

  const handleSyncUsers = async () => {
    try {
      setSyncing(true);
      console.log('🔄 Starting AWS user sync...');
      
      const response = await fetch('/api/integrations/aws/iam/users/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      console.log('📡 Sync API Response:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Sync Result:', data);
        
        // Refresh users after sync
        await fetchAWSUsers();
        await fetchAWSGroups();
        
        console.log('✅ Sync completed successfully');
      } else {
        console.log('❌ Sync failed:', response.status);
        const errorData = await response.text();
        console.log('Sync error details:', errorData);
      }
    } catch (error) {
      console.error('❌ Error syncing AWS users:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateUser = async (userData: any) => {
    try {
      console.log('🔄 Creating AWS user:', userData);
      
      const response = await fetch('/api/integrations/aws/iam/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(userData)
      });
      
      console.log('📡 Create User API Response:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Create User Result:', data);
        
        await fetchAWSUsers();
        setShowCreateModal(false);
        console.log('✅ User created successfully');
      } else {
        console.log('❌ Create user failed:', response.status);
        const errorData = await response.text();
        console.log('Create user error details:', errorData);
      }
    } catch (error) {
      console.error('❌ Error creating AWS user:', error);
    }
  };

  const handleUpdateUser = async (userId: string, userData: any) => {
    try {
      console.log('🔄 Updating AWS user:', userId, userData);
      
      const response = await fetch(`/api/integrations/aws/iam/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(userData)
      });
      
      console.log('📡 Update User API Response:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Update User Result:', data);
        
        await fetchAWSUsers();
        setShowEditModal(false);
        setSelectedUser(null);
        console.log('✅ User updated successfully');
      } else {
        console.log('❌ Update user failed:', response.status);
        const errorData = await response.text();
        console.log('Update user error details:', errorData);
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('❌ Error updating AWS user:', error);
      throw error;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('🗑️ Deleting AWS user:', userId);
      
      const response = await fetch(`/api/integrations/aws/iam/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      console.log('📡 Delete User API Response:', response.status, response.statusText);
      
      if (response.ok) {
        await fetchAWSUsers();
        console.log('✅ User deleted successfully');
      } else {
        console.log('❌ Delete user failed:', response.status);
        const errorData = await response.text();
        console.log('Delete user error details:', errorData);
      }
    } catch (error) {
      console.error('❌ Error deleting AWS user:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAccount = selectedAccount === 'all' || user.accountId === selectedAccount;
    return matchesSearch && matchesAccount;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'locked':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
      case 'inactive':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Inactive</span>;
      case 'locked':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Locked</span>;
      default:
        return null;
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
                  onClick={() => navigate('/apps/aws')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">AWS IAM Users & Groups</h1>
                    <p className="mt-1 text-gray-600">Manage IAM users, groups, roles, and permissions across AWS accounts</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSyncUsers}
                  disabled={syncing}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync from AWS'}
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
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
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  >
                    <option value="all">All Accounts</option>
                    {availableAccounts.map((account) => (
                      <option key={account.accountId} value={account.accountId}>
                        {account.accountName} ({account.accountId})
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

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-2 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('groups')}
                  className={`py-2 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'groups'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Groups</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

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
                  <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'active').length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">MFA Enabled</p>
                  <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.mfaEnabled).length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Groups</p>
                  <p className="text-2xl font-bold text-gray-900">{groups.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'users' ? (
            /* Users Table */
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">IAM Users</h3>
              </div>
              <div className="overflow-x-auto">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No AWS users found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {users.length === 0 
                      ? 'Click "Sync from AWS" to fetch users from your connected AWS accounts.'
                      : 'Try adjusting your search or filter criteria.'
                    }
                  </p>
                  {users.length === 0 && (
                    <div className="mt-6 space-x-3">
                      <button
                        onClick={handleSyncUsers}
                        disabled={syncing}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                        {syncing ? 'Syncing...' : 'Sync from AWS'}
                      </button>
                      <button
                        onClick={() => navigate('/apps/aws/connections')}
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Groups</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Keys</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MFA</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                      <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                              {user.email && <div className="text-sm text-gray-500">{user.email}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(user.status)}
                            <span className="ml-2">{getStatusBadge(user.status)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.groups.length > 0 ? user.groups.join(', ') : 'No groups'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Key className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900">{user.accessKeys}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.mfaEnabled ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Shield className="h-3 w-3 mr-1" />
                              Enabled
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Disabled
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastActivity || 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.accountName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowEditModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
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
            </div>
          ) : (
            /* Groups Table */
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">IAM Groups</h3>
                <button
                  onClick={() => {
                    if (availableAccounts.length > 0) {
                      setSelectedAccountForGroup(availableAccounts[0].accountId);
                      setShowCreateGroupModal(true);
                    } else {
                      alert('Please connect an AWS account first');
                    }
                  }}
                  className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </button>
              </div>
              <div className="overflow-x-auto">
                {groups.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No AWS groups found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Click "Sync from AWS" to fetch groups from your connected AWS accounts.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={handleSyncUsers}
                        disabled={syncing}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                        {syncing ? 'Syncing...' : 'Sync from AWS'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ARN</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policies</th>
                        <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {groups.map((group) => (
                        <tr key={group.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                  <Users className="h-5 w-5 text-orange-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{group.groupName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{group.arn}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {group.userCount} users
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {group.policies.length > 0 ? `${group.policies.length} policies` : 'No policies'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
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
            </div>
          )}
        </div>

        {/* Create User Modal */}
        <CreateUserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateUser={handleCreateUser}
          availableGroups={groups}
          availableAccounts={availableAccounts}
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
          availableGroups={groups}
        />

        {/* Create Group Modal */}
        <CreateGroupModal
          isOpen={showCreateGroupModal}
          onClose={() => setShowCreateGroupModal(false)}
          onGroupCreated={() => {
            fetchAWSGroups();
            setShowCreateGroupModal(false);
          }}
          accountId={selectedAccountForGroup}
        />
      </div>
    </Layout>
  );
};

export default AWSUsers;
