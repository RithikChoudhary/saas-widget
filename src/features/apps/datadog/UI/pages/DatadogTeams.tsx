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
  UserPlus,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
  Eye,
  BarChart3,
  Monitor,
  Activity
} from 'lucide-react';
import { Layout } from '../../../../../shared/components';
import { datadogApi, DatadogTeam, DatadogConnection, DatadogTeamStats } from '../../services/datadogApi';
import CreateTeamModal from '../components/CreateTeamModal';

const DatadogTeams: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<DatadogTeam[]>([]);
  const [stats, setStats] = useState<DatadogTeamStats | null>(null);
  const [connections, setConnections] = useState<DatadogConnection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConnection, setSelectedConnection] = useState('all');
  const [correlationFilter, setCorrelationFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<DatadogTeam | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showTeamDetails, setShowTeamDetails] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConnections();
    fetchTeams();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchTeams();
    fetchStats();
  }, [selectedConnection, correlationFilter, currentPage]);

  const fetchConnections = async () => {
    try {
      const connectionsData = await datadogApi.getConnections();
      setConnections(connectionsData);
      console.log(`✅ Loaded ${connectionsData.length} Datadog connections`);
    } catch (error) {
      console.error('❌ Error fetching connections:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching Datadog teams from API...');
      
      const params: any = {
        page: currentPage,
        limit: 20
      };
      
      if (selectedConnection !== 'all') params.connectionId = selectedConnection;
      if (correlationFilter !== 'all') params.correlationStatus = correlationFilter;

      const response = await datadogApi.getTeams(params);
      
      setTeams(response.teams || []);
      setTotalPages(response.pagination?.totalPages || 1);
      console.log(`✅ Loaded ${response.teams?.length || 0} Datadog teams`);
    } catch (error) {
      console.error('❌ Error fetching teams:', error);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const connectionId = selectedConnection !== 'all' ? selectedConnection : undefined;
      const statsData = await datadogApi.getTeamStats(connectionId);
      setStats(statsData);
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
    }
  };

  const handleSyncTeams = async () => {
    if (selectedConnection === 'all') {
      alert('Please select a specific connection to sync');
      return;
    }

    try {
      setSyncing(true);
      console.log('🔄 Starting Datadog team sync...');
      
      await datadogApi.syncTeams(selectedConnection);
      
      // Refresh data after sync
      await fetchTeams();
      await fetchStats();
      
      console.log('✅ Sync completed successfully');
    } catch (error) {
      console.error('❌ Error syncing teams:', error);
      alert('Failed to sync teams. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateTeam = async (teamData: any) => {
    try {
      console.log('🔄 Creating Datadog team:', teamData);
      await datadogApi.createTeam(teamData);
      await fetchTeams();
      await fetchStats();
      console.log('✅ Team created successfully');
    } catch (error) {
      console.error('❌ Error creating team:', error);
      throw error;
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('🗑️ Deleting Datadog team:', teamId);
      await datadogApi.deleteTeam(teamId);
      await fetchTeams();
      await fetchStats();
      console.log('✅ Team deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting team:', error);
      alert('Failed to delete team. Please try again.');
    }
  };

  const handleViewTeamDetails = async (team: DatadogTeam) => {
    try {
      setSelectedTeam(team);
      
      // Find the connection for this team
      const connection = connections.find(conn => conn.id === selectedConnection);
      if (connection) {
        const members = await datadogApi.getTeamMembers(team.id, connection.id);
        setTeamMembers(members);
      }
      
      setShowTeamDetails(true);
    } catch (error) {
      console.error('❌ Error fetching team details:', error);
      alert('Failed to load team details. Please try again.');
    }
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    await fetchTeams();
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (team.description && team.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

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
                    <h1 className="text-3xl font-bold text-gray-900">Datadog Teams</h1>
                    <p className="mt-1 text-gray-600">Manage Datadog teams, members, and permissions across organizations</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSyncTeams}
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
                  Create Team
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
                      placeholder="Search teams by name, handle, or description..."
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
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
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
                    <p className="text-sm font-medium text-gray-600">Total Teams</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalTeams}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Members</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Dashboards</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalDashboards}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Monitor className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Monitors</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalMonitors}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Teams Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Datadog Teams</h3>
            </div>
            <div className="overflow-x-auto">
              {filteredTeams.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Datadog teams found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {teams.length === 0 
                      ? 'Click "Sync from Datadog" to fetch teams from your connected Datadog organizations.'
                      : 'Try adjusting your search or filter criteria.'
                    }
                  </p>
                  {teams.length === 0 && (
                    <div className="mt-6 space-x-3">
                      <button
                        onClick={handleSyncTeams}
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resources</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correlation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTeams.map((team) => (
                      <tr key={team.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {team.avatar ? (
                                <img className="h-10 w-10 rounded-full" src={team.avatar} alt={team.name} />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-purple-600">
                                    {team.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{team.name}</div>
                              <div className="text-sm text-gray-500">@{team.handle}</div>
                              {team.description && (
                                <div className="text-xs text-gray-400 max-w-xs truncate">{team.description}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900">{team.userCount}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-4 text-sm text-gray-900">
                            <div className="flex items-center">
                              <BarChart3 className="h-4 w-4 text-blue-500 mr-1" />
                              <span>{team.summary.dashboards}</span>
                            </div>
                            <div className="flex items-center">
                              <Monitor className="h-4 w-4 text-orange-500 mr-1" />
                              <span>{team.summary.monitors}</span>
                            </div>
                            <div className="flex items-center">
                              <Activity className="h-4 w-4 text-green-500 mr-1" />
                              <span>{team.summary.slos}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getCorrelationBadge(team.correlationStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(team.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewTeamDetails(team)}
                              className="text-purple-600 hover:text-purple-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTeam(team.id)}
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

        {/* Create Team Modal */}
        <CreateTeamModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateTeam={handleCreateTeam}
          availableConnections={connections}
        />

        {/* Team Details Modal */}
        {showTeamDetails && selectedTeam && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Team Details</h3>
                  <button
                    onClick={() => setShowTeamDetails(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <AlertTriangle className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    {selectedTeam.avatar ? (
                      <img className="h-16 w-16 rounded-full" src={selectedTeam.avatar} alt={selectedTeam.name} />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-xl font-medium text-purple-600">
                          {selectedTeam.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">{selectedTeam.name}</h4>
                      <p className="text-gray-500">@{selectedTeam.handle}</p>
                      {selectedTeam.description && (
                        <p className="text-sm text-gray-600 mt-1">{selectedTeam.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{selectedTeam.userCount}</div>
                      <div className="text-sm text-gray-500">Members</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedTeam.summary.dashboards}</div>
                      <div className="text-sm text-gray-500">Dashboards</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{selectedTeam.summary.monitors}</div>
                      <div className="text-sm text-gray-500">Monitors</div>
                    </div>
                  </div>

                  {teamMembers && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Team Members</h5>
                      <div className="space-y-2">
                        {teamMembers.members.map((member: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-900">{member.userId}</span>
                            <span className="text-xs text-gray-500">{member.role}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Created: {new Date(selectedTeam.createdAt).toLocaleString()}</span>
                    <span>Updated: {new Date(selectedTeam.updatedAt).toLocaleString()}</span>
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

export default DatadogTeams;
