import React, { useState, useEffect } from 'react';
import { Layout } from '../../../shared/components';
import api from '../../../shared/utils/api';
import { 
  Users, 
  Shield, 
  Plus, 
  RefreshCw, 
  Search, 
  Edit2, 
  Trash2, 
  UserPlus,
  UserMinus,
  Lock,
  Unlock,
  Building,
  FolderOpen,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface Team {
  id: string;
  githubId: number;
  nodeId: string;
  slug: string;
  name: string;
  description?: string;
  privacy: 'closed' | 'secret';
  permission: string;
  membersCount: number;
  reposCount: number;
  organization: string;
  parentTeamId?: number;
  lastSync: string;
  connection: {
    id: string;
    organization: string;
  };
}

interface TeamMember {
  id: string;
  role: 'member' | 'maintainer';
  addedAt: string;
  user: {
    id: string;
    githubId: number;
    login: string;
    name?: string;
    email?: string;
    avatarUrl?: string;
    type: 'User' | 'Bot';
  };
}

interface Connection {
  id: string;
  scope: 'user' | 'organization';
  organizationName?: string;
  isActive: boolean;
}

const GitHubTeams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConnection, setSelectedConnection] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Form states
  const [teamForm, setTeamForm] = useState({
    name: '',
    description: '',
    privacy: 'closed' as 'closed' | 'secret',
    connectionId: ''
  });
  const [memberForm, setMemberForm] = useState({
    username: '',
    role: 'member' as 'member' | 'maintainer'
  });

  useEffect(() => {
    fetchConnections();
  }, []);

  useEffect(() => {
    if (connections.length > 0) {
      fetchTeams();
    }
  }, [selectedConnection, searchTerm, connections]);

  const fetchConnections = async () => {
    try {
      const response = await api.get('/integrations/github/connections');
      const orgConnections = response.data.data?.filter((conn: Connection) => 
        conn.isActive && conn.scope === 'organization'
      ) || [];
      setConnections(orgConnections);
      
      if (orgConnections.length > 0 && !selectedConnection) {
        setSelectedConnection(orgConnections[0].id);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedConnection) {
        params.append('connectionId', selectedConnection);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await api.get(`/integrations/github/teams?${params.toString()}`);
      setTeams(response.data.data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async (teamId: string) => {
    try {
      setMembersLoading(true);
      const response = await api.get(`/integrations/github/teams/${teamId}/members`);
      setTeamMembers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembers([]);
    } finally {
      setMembersLoading(false);
    }
  };

  const handleSync = async () => {
    if (!selectedConnection) return;

    try {
      setSyncing(true);
      await api.post('/integrations/github/teams/sync', {
        connectionId: selectedConnection
      });
      alert('Teams sync initiated. This may take a few minutes.');
      
      setTimeout(fetchTeams, 2000);
    } catch (error) {
      console.error('Error syncing teams:', error);
      alert('Failed to sync teams');
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!teamForm.name || !teamForm.connectionId) return;

    try {
      await api.post('/integrations/github/teams', teamForm);
      
      setShowCreateModal(false);
      setTeamForm({ name: '', description: '', privacy: 'closed', connectionId: '' });
      alert('Team created successfully!');
      fetchTeams();
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Failed to create team');
    }
  };

  const handleEditTeam = async () => {
    if (!selectedTeam || !teamForm.name) return;

    try {
      await api.patch(`/integrations/github/teams/${selectedTeam.slug}`, {
        connectionId: selectedTeam.connection.id,
        name: teamForm.name,
        description: teamForm.description,
        privacy: teamForm.privacy
      });
      
      setShowEditModal(false);
      setSelectedTeam(null);
      alert('Team updated successfully!');
      fetchTeams();
    } catch (error) {
      console.error('Error updating team:', error);
      alert('Failed to update team');
    }
  };

  const handleDeleteTeam = async (team: Team) => {
    if (!confirm(`Are you sure you want to delete the team "${team.name}"?`)) {
      return;
    }

    try {
      await api.delete(`/integrations/github/teams/${team.slug}`, {
        data: { connectionId: team.connection.id }
      });
      
      alert('Team deleted successfully!');
      fetchTeams();
      if (selectedTeam?.id === team.id) {
        setSelectedTeam(null);
        setTeamMembers([]);
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Failed to delete team');
    }
  };

  const handleAddMember = async () => {
    if (!selectedTeam || !memberForm.username) return;

    try {
      await api.post(`/integrations/github/teams/${selectedTeam.slug}/members`, {
        connectionId: selectedTeam.connection.id,
        username: memberForm.username,
        role: memberForm.role
      });
      
      setShowAddMemberModal(false);
      setMemberForm({ username: '', role: 'member' });
      alert('Member added successfully!');
      fetchTeamMembers(selectedTeam.id);
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member');
    }
  };

  const handleRemoveMember = async (username: string) => {
    if (!selectedTeam) return;
    
    if (!confirm(`Are you sure you want to remove ${username} from the team?`)) {
      return;
    }

    try {
      await api.delete(`/integrations/github/teams/${selectedTeam.slug}/members/${username}`, {
        data: { connectionId: selectedTeam.connection.id }
      });
      
      alert('Member removed successfully!');
      fetchTeamMembers(selectedTeam.id);
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member');
    }
  };

  const openEditModal = (team: Team) => {
    setSelectedTeam(team);
    setTeamForm({
      name: team.name,
      description: team.description || '',
      privacy: team.privacy,
      connectionId: team.connection.id
    });
    setShowEditModal(true);
  };

  const selectTeam = (team: Team) => {
    setSelectedTeam(team);
    fetchTeamMembers(team.id);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">GitHub Teams</h1>
            <p className="text-gray-600 mt-1">Organize users into teams and manage repository access</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={connections.length === 0}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </button>
            <button
              onClick={handleSync}
              disabled={syncing || !selectedConnection}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Teams'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {connections.length > 0 && teams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Teams</p>
                  <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teams.reduce((sum, team) => sum + team.membersCount, 0)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FolderOpen className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Repos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teams.reduce((sum, team) => sum + team.reposCount, 0)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Building className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Organizations</p>
                  <p className="text-2xl font-bold text-gray-900">{connections.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {connections.length === 0 ? (
          <div className="bg-white rounded-lg shadow">
            <div className="p-12 text-center">
              <Building className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Organization Connections</h3>
              <p className="text-gray-600 mb-6">Teams are only available for GitHub organization connections</p>
              <button
                onClick={() => window.location.href = '/apps/github/connections'}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Connect Organization
              </button>
            </div>
          </div>
        ) : (
        <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        value={selectedConnection}
                        onChange={(e) => setSelectedConnection(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {connections.map((connection) => (
                          <option key={connection.id} value={connection.id}>
                            {connection.organizationName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Teams</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by team name or description..."
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Teams List */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Teams</h2>
                  <p className="text-sm text-gray-600">Select a team to view and manage members</p>
                </div>
              
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                ) : teams.length === 0 ? (
                  <div className="text-center py-12">
                    <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium">No teams found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedConnection ? 'Try syncing teams or creating a new one' : 'Select an organization to view teams'}
                    </p>
                  </div>
              ) : (
                <div className="divide-y">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${
                        selectedTeam?.id === team.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => selectTeam(team)}
                    >
                      <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900">{team.name}</h3>
                              <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                                team.privacy === 'closed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {team.privacy === 'closed' ? (
                                  <Unlock className="h-3 w-3 mr-1" />
                                ) : (
                                  <Lock className="h-3 w-3 mr-1" />
                                )}
                                {team.privacy}
                              </span>
                            </div>
                            {team.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{team.description}</p>
                            )}
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="inline-flex items-center text-xs text-gray-500">
                                <Users className="h-3 w-3 mr-1" />
                                {team.membersCount} members
                              </span>
                              <span className="inline-flex items-center text-xs text-gray-500">
                                <FolderOpen className="h-3 w-3 mr-1" />
                                {team.reposCount} repos
                              </span>
                              <span className="inline-flex items-center text-xs text-gray-500">
                                <Building className="h-3 w-3 mr-1" />
                                {team.organization}
                              </span>
                            </div>
                          </div>
                        <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(team);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Edit team"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTeam(team);
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete team"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

              {/* Team Members */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {selectedTeam ? `${selectedTeam.name} Members` : 'Team Members'}
                      </h2>
                      {selectedTeam && (
                        <p className="text-sm text-gray-600">Manage team membership and roles</p>
                      )}
                    </div>
                    {selectedTeam && (
                      <button
                        onClick={() => setShowAddMemberModal(true)}
                        className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Add Member
                      </button>
                    )}
                  </div>
                </div>
              
                {!selectedTeam ? (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium">Select a team to view members</p>
                  </div>
              ) : membersLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                ) : teamMembers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium">No members found</p>
                    <p className="text-sm text-gray-500 mt-1">Add members to this team</p>
                  </div>
              ) : (
                <div className="divide-y">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={member.user.avatarUrl || `https://github.com/${member.user.login}.png`}
                            alt={member.user.login}
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {member.user.name || member.user.login}
                            </div>
                            <div className="text-sm text-gray-500">@{member.user.login}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                              member.role === 'maintainer' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {member.role === 'maintainer' && <Shield className="h-3 w-3 mr-1" />}
                              {member.role}
                            </span>
                            <button
                              onClick={() => handleRemoveMember(member.user.login)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Remove member"
                            >
                              <UserMinus className="h-4 w-4" />
                            </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Team</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Organization</label>
                <select
                  value={teamForm.connectionId}
                  onChange={(e) => setTeamForm({ ...teamForm, connectionId: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select organization...</option>
                  {connections.map((connection) => (
                    <option key={connection.id} value={connection.id}>
                      {connection.organizationName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Team Name</label>
                <input
                  type="text"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  placeholder="Enter team name"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={teamForm.description}
                  onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                  placeholder="Enter team description (optional)"
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Privacy</label>
                <select
                  value={teamForm.privacy}
                  onChange={(e) => setTeamForm({ ...teamForm, privacy: e.target.value as 'closed' | 'secret' })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="closed">Closed (visible to organization members)</option>
                  <option value="secret">Secret (only visible to team members)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTeam}
                disabled={!teamForm.name || !teamForm.connectionId}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {showEditModal && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Team</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Team Name</label>
                <input
                  type="text"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={teamForm.description}
                  onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Privacy</label>
                <select
                  value={teamForm.privacy}
                  onChange={(e) => setTeamForm({ ...teamForm, privacy: e.target.value as 'closed' | 'secret' })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="closed">Closed</option>
                  <option value="secret">Secret</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTeam}
                disabled={!teamForm.name}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Update Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Team Member</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">GitHub Username</label>
                <input
                  type="text"
                  value={memberForm.username}
                  onChange={(e) => setMemberForm({ ...memberForm, username: e.target.value })}
                  placeholder="Enter GitHub username"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  value={memberForm.role}
                  onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value as 'member' | 'maintainer' })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="member">Member</option>
                  <option value="maintainer">Maintainer</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                disabled={!memberForm.username}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </Layout>
  );
};

export default GitHubTeams;
