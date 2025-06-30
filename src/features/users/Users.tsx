import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users as UsersIcon, Search, Filter, Download, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { api } from '../../shared/utils';
import { Layout } from '../../shared/components';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  awsUserId?: string;
  awsArn?: string;
  awsUserName?: string;
  apps: {
    appName: string;
    lastSyncedAt: string;
    accessLevel: string;
  }[];
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/company');
      if (response.data.success) {
        // Fetch user app access for each user
        const usersWithApps = await Promise.all(
          response.data.data.map(async (user: User) => {
            try {
              const appsResponse = await api.get(`/users/${user._id}/apps`);
              return {
                ...user,
                apps: appsResponse.data.success ? appsResponse.data.data : []
              };
            } catch (error) {
              return { ...user, apps: [] };
            }
          })
        );
        setUsers(usersWithApps);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !filterDepartment || user.department === filterDepartment;
    const matchesStatus = !filterStatus || 
      (filterStatus === 'active' && user.isActive) ||
      (filterStatus === 'inactive' && !user.isActive);

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = [...new Set(users.map(user => user.department).filter(Boolean))];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Department', 'Role', 'Status', 'Joined Date', 'Last Login', 'Apps Count', 'AWS ARN'].join(','),
      ...filteredUsers.map(user => [
        `"${user.firstName} ${user.lastName}"`,
        user.email,
        user.department || '',
        user.role,
        user.isActive ? 'Active' : 'Inactive',
        formatDate(user.createdAt),
        user.lastLogin ? formatDateTime(user.lastLogin) : 'Never',
        user.apps.length,
        user.awsArn || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <UsersIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportUsers}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex items-center text-sm text-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              {filteredUsers.length} of {users.length} users
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
                    Department & Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apps Access
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AWS Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.department || 'No Department'}</div>
                      <div className="text-sm text-gray-500 capitalize">{user.role.replace('_', ' ')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.apps.length} app{user.apps.length !== 1 ? 's' : ''}
                      </div>
                      {user.apps.length > 0 && (
                        <div className="text-xs text-gray-500">
                          {user.apps.map(app => app.appName).join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.awsUserId ? (
                        <div className="text-sm">
                          <div className="text-gray-900 font-mono text-xs">
                            {user.awsUserName || user.awsUserId}
                          </div>
                          {user.awsArn && (
                            <div className="text-gray-500 text-xs truncate max-w-32" title={user.awsArn}>
                              {user.awsArn}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No AWS data</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                User Details - {selectedUser.firstName} {selectedUser.lastName}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <p className="text-sm text-gray-900 capitalize">{selectedUser.role.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <p className="text-sm text-gray-900">{selectedUser.department || 'No Department'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="text-sm text-gray-900">{selectedUser.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Joined Date</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Login</label>
                  <p className="text-sm text-gray-900">
                    {selectedUser.lastLogin ? formatDateTime(selectedUser.lastLogin) : 'Never'}
                  </p>
                </div>
              </div>

              {selectedUser.awsUserId && (
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-2">AWS Details</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">AWS User ID</label>
                        <p className="text-sm text-gray-900 font-mono">{selectedUser.awsUserId}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">AWS Username</label>
                        <p className="text-sm text-gray-900 font-mono">{selectedUser.awsUserName}</p>
                      </div>
                      {selectedUser.awsArn && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">AWS ARN</label>
                          <p className="text-sm text-gray-900 font-mono break-all">{selectedUser.awsArn}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-2">App Access ({selectedUser.apps.length})</h4>
                {selectedUser.apps.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.apps.map((app, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{app.appName}</div>
                          <div className="text-xs text-gray-500">Access Level: {app.accessLevel}</div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Last Sync: {formatDateTime(app.lastSyncedAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No app access assigned</p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md text-sm font-medium"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium">
                  Edit User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
};

export default Users;
