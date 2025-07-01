import React, { useState, useEffect } from 'react';
import api from '../../../../../shared/utils/api';
import { Layout } from '../../../../../shared/components';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  RefreshCw, 
  ChevronLeft,
  ChevronRight,
  Mail,
  Hash,
  Shield,
  Calendar,
  Download,
  Eye,
  XCircle,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Settings
} from 'lucide-react';

interface Group {
  _id: string;
  companyId: string;
  connectionId: string;
  googleGroupId: string;
  email: string;
  name: string;
  description?: string;
  adminCreated: boolean;
  directMembersCount: number;
  aliases?: string[];
  nonEditableAliases?: string[];
  isActive: boolean;
  lastSync: string;
  createdAt?: string;
  updatedAt?: string;
}

const GoogleWorkspaceGroups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'admin' | 'user'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGroups, setTotalGroups] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, [currentPage, searchQuery]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '50',
        ...(searchQuery && { search: searchQuery })
      });

      const response = await api.get(`/integrations/google-workspace/groups?${params}`);
      
      if (response.data.success) {
        let filteredGroups = response.data.groups || [];
        
        // Apply client-side filters
        if (filterType !== 'all') {
          filteredGroups = filteredGroups.filter((group: Group) => 
            filterType === 'admin' ? group.adminCreated : !group.adminCreated
          );
        }
        
        setGroups(filteredGroups);
        setTotalPages(response.data.pagination?.pages || 1);
        setTotalGroups(response.data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const companyId = localStorage.getItem('companyId');
      
      // Get the first connection
      const connectionsResponse = await api.get('/integrations/google-workspace/connections');
      if (connectionsResponse.data.connections?.length > 0) {
        const connectionId = connectionsResponse.data.connections[0].id;
        
        await api.post('/integrations/google-workspace/sync/groups', {
          connectionId,
          companyId
        });
        
        // Refresh the groups list
        await fetchGroups();
        alert('Groups synced successfully!');
      } else {
        alert('No Google Workspace connection found');
      }
    } catch (error) {
      console.error('Error syncing groups:', error);
      alert('Failed to sync groups');
    } finally {
      setSyncing(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getGroupTypeBadge = (group: Group) => {
    if (group.adminCreated) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          <Shield className="h-3 w-3 mr-1" />
          Admin Created
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
        <Users className="h-3 w-3 mr-1" />
        User Created
      </span>
    );
  };

  const getStatusBadge = (group: Group) => {
    if (group.isActive) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
        <XCircle className="h-3 w-3 mr-1" />
        Inactive
      </span>
    );
  };

  const exportGroups = () => {
    const csvContent = [
      ['Email', 'Name', 'Description', 'Type', 'Members', 'Status', 'Created'].join(','),
      ...groups.map(group => [
        group.email,
        group.name,
        group.description || '',
        group.adminCreated ? 'Admin Created' : 'User Created',
        group.directMembersCount.toString(),
        group.isActive ? 'Active' : 'Inactive',
        formatDate(group.createdAt)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `google-workspace-groups-${new Date().toISOString().split('T')[0]}.csv`;
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Google Workspace Groups</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Total: {totalGroups} groups • Page {currentPage} of {totalPages}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportGroups}
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
              {syncing ? 'Syncing...' : 'Sync Groups'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search groups by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Groups</option>
              <option value="admin">Admin Created</option>
              <option value="user">User Created</option>
            </select>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <div
              key={group._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer"
              onClick={() => {
                setSelectedGroup(group);
                setShowGroupDetails(true);
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-shrink-0 h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex flex-col items-end space-y-1">
                  {getGroupTypeBadge(group)}
                  {getStatusBadge(group)}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {group.name}
              </h3>
              
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <Mail className="h-4 w-4 mr-1" />
                {group.email}
              </div>
              
              {group.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {group.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <UserPlus className="h-4 w-4 mr-1" />
                  {group.directMembersCount} members
                </div>
                {group.aliases && group.aliases.length > 0 && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Hash className="h-4 w-4 mr-1" />
                    {group.aliases.length} aliases
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {groups.length === 0 && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No groups found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Try adjusting your search criteria' : 'Sync your Google Workspace groups to get started'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Group Details Modal */}
        {showGroupDetails && selectedGroup && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Group Details</h3>
                  <button
                    onClick={() => setShowGroupDetails(false)}
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
                        <dd className="text-sm text-gray-900 dark:text-white">{selectedGroup.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{selectedGroup.email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Members</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{selectedGroup.directMembersCount}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">
                          {selectedGroup.adminCreated ? 'Admin Created' : 'User Created'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  
                  {selectedGroup.description && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</h4>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedGroup.description}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {getStatusBadge(selectedGroup)}
                      {getGroupTypeBadge(selectedGroup)}
                    </div>
                  </div>
                  
                  {selectedGroup.aliases && selectedGroup.aliases.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Aliases</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedGroup.aliases.map((alias, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            {alias}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Timestamps</h4>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{formatDate(selectedGroup.createdAt)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Synced</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{formatDate(selectedGroup.lastSync)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GoogleWorkspaceGroups;
