import api from '../../../../shared/utils/api';

export interface DatadogOverviewData {
  totalUsers: number;
  totalTeams: number;
  activeUsers: number;
  verifiedUsers: number;
  totalDashboards: number;
  totalMonitors: number;
  lastSync: string;
  correlationRate: string;
}

export interface DatadogConnection {
  id: string;
  organizationName: string;
  site: string;
  isActive: boolean;
  lastSync: string;
  userCount: number;
  teamCount: number;
}

export interface DatadogUser {
  id: string;
  datadogUserId: string;
  email: string;
  name: string;
  handle: string;
  title?: string;
  verified: boolean;
  disabled: boolean;
  status: 'Active' | 'Pending' | 'Disabled';
  roles: string[];
  teams: string[];
  correlationStatus: 'matched' | 'unmatched' | 'conflict';
  googleWorkspaceUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatadogTeam {
  id: string;
  datadogTeamId: string;
  name: string;
  handle: string;
  description?: string;
  avatar?: string;
  banner?: string;
  hiddenModules: string[];
  linkCount: number;
  userCount: number;
  summary: {
    dashboards: number;
    monitors: number;
    slos: number;
  };
  correlationStatus: 'matched' | 'unmatched' | 'conflict';
  googleWorkspaceGroupId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatadogUserStats {
  totalUsers: number;
  activeUsers: number;
  disabledUsers: number;
  verifiedUsers: number;
  matchedUsers: number;
  unmatchedUsers: number;
  correlationRate: string;
}

export interface DatadogTeamStats {
  totalTeams: number;
  matchedTeams: number;
  unmatchedTeams: number;
  totalMembers: number;
  totalDashboards: number;
  totalMonitors: number;
  correlationRate: string;
}

class DatadogApiService {
  private baseUrl = '/integrations/datadog';

  async getOverview(): Promise<DatadogOverviewData> {
    try {
      const response = await api.get(`${this.baseUrl}/overview`);
      return response.data.data;
    } catch (error) {
      console.error('Datadog API: Error fetching overview:', error);
      return {
        totalUsers: 0,
        totalTeams: 0,
        activeUsers: 0,
        verifiedUsers: 0,
        totalDashboards: 0,
        totalMonitors: 0,
        lastSync: 'Not connected',
        correlationRate: '0'
      };
    }
  }

  async getConnections(): Promise<DatadogConnection[]> {
    try {
      const response = await api.get(`${this.baseUrl}/connections`);
      return response.data.data;
    } catch (error) {
      console.error('Datadog API: Error fetching connections:', error);
      return [];
    }
  }

  async createConnection(connectionData: {
    organizationName: string;
    apiKey: string;
    applicationKey: string;
    site: string;
  }): Promise<DatadogConnection> {
    try {
      const response = await api.post(`${this.baseUrl}/connections`, connectionData);
      return response.data.data;
    } catch (error) {
      console.error('Datadog API: Error creating connection:', error);
      throw error;
    }
  }

  async updateConnection(connectionId: string, connectionData: Partial<DatadogConnection>): Promise<DatadogConnection> {
    try {
      const response = await api.put(`${this.baseUrl}/connections/${connectionId}`, connectionData);
      return response.data.data;
    } catch (error) {
      console.error('Datadog API: Error updating connection:', error);
      throw error;
    }
  }

  async deleteConnection(connectionId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/connections/${connectionId}`);
    } catch (error) {
      console.error('Datadog API: Error deleting connection:', error);
      throw error;
    }
  }

  async testConnection(connectionData: {
    apiKey: string;
    applicationKey: string;
    site: string;
  }): Promise<{ success: boolean; organizationName?: string; error?: string }> {
    try {
      const response = await api.post(`${this.baseUrl}/connections/test`, connectionData);
      return response.data;
    } catch (error) {
      console.error('Datadog API: Error testing connection:', error);
      throw error;
    }
  }

  // Users API
  async getUsers(params?: {
    connectionId?: string;
    page?: number;
    limit?: number;
    status?: string;
    correlationStatus?: string;
    search?: string;
  }): Promise<{ users: DatadogUser[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.connectionId) queryParams.append('connectionId', params.connectionId);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.correlationStatus) queryParams.append('correlationStatus', params.correlationStatus);
      if (params?.search) queryParams.append('q', params.search);

      const response = await api.get(`${this.baseUrl}/users?${queryParams}`);
      return response.data.data;
    } catch (error) {
      console.error('Datadog API: Error fetching users:', error);
      return { users: [], pagination: { totalPages: 1 } };
    }
  }

  async getUserStats(connectionId?: string): Promise<DatadogUserStats> {
    try {
      const params = connectionId ? `?connectionId=${connectionId}` : '';
      const response = await api.get(`${this.baseUrl}/users/stats${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Datadog API: Error fetching user stats:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        disabledUsers: 0,
        verifiedUsers: 0,
        matchedUsers: 0,
        unmatchedUsers: 0,
        correlationRate: '0'
      };
    }
  }

  async syncUsers(connectionId: string): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/users/sync`, { connectionId });
      return response.data;
    } catch (error) {
      console.error('Datadog API: Error syncing users:', error);
      throw error;
    }
  }

  async searchUsers(params: {
    q: string;
    connectionId?: string;
  }): Promise<{ users: DatadogUser[] }> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', params.q);
      if (params.connectionId) queryParams.append('connectionId', params.connectionId);

      const response = await api.get(`${this.baseUrl}/users/search?${queryParams}`);
      return response.data.data;
    } catch (error) {
      console.error('Datadog API: Error searching users:', error);
      return { users: [] };
    }
  }

  async exportUsers(params: {
    format: 'json' | 'csv';
    connectionId?: string;
  }): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('format', params.format);
      if (params.connectionId) queryParams.append('connectionId', params.connectionId);

      const response = await api.get(`${this.baseUrl}/users/export?${queryParams}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Datadog API: Error exporting users:', error);
      throw error;
    }
  }

  async createUser(userData: {
    email: string;
    name: string;
    handle: string;
    title?: string;
    roles: string[];
    connectionId: string;
  }): Promise<DatadogUser> {
    try {
      const response = await api.post(`${this.baseUrl}/users`, userData);
      return response.data.data;
    } catch (error) {
      console.error('Datadog API: Error creating user:', error);
      throw error;
    }
  }

  async updateUser(userId: string, userData: Partial<DatadogUser>): Promise<DatadogUser> {
    try {
      const response = await api.put(`${this.baseUrl}/users/${userId}`, userData);
      return response.data.data;
    } catch (error) {
      console.error('Datadog API: Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/users/${userId}`);
    } catch (error) {
      console.error('Datadog API: Error deleting user:', error);
      throw error;
    }
  }

  // Teams API
  async getTeams(params?: {
    connectionId?: string;
    page?: number;
    limit?: number;
    correlationStatus?: string;
  }): Promise<{ teams: DatadogTeam[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.connectionId) queryParams.append('connectionId', params.connectionId);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.correlationStatus) queryParams.append('correlationStatus', params.correlationStatus);

      const response = await api.get(`${this.baseUrl}/teams?${queryParams}`);
      return response.data.data;
    } catch (error) {
      console.error('Datadog API: Error fetching teams:', error);
      return { teams: [], pagination: { totalPages: 1 } };
    }
  }

  async getTeamStats(connectionId?: string): Promise<DatadogTeamStats> {
    try {
      const params = connectionId ? `?connectionId=${connectionId}` : '';
      const response = await api.get(`${this.baseUrl}/teams/stats${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Datadog API: Error fetching team stats:', error);
      return {
        totalTeams: 0,
        matchedTeams: 0,
        unmatchedTeams: 0,
        totalMembers: 0,
        totalDashboards: 0,
        totalMonitors: 0,
        correlationRate: '0'
      };
    }
  }

  async syncTeams(connectionId: string): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/teams/sync`, { connectionId });
      return response.data;
    } catch (error) {
      console.error('Datadog API: Error syncing teams:', error);
      throw error;
    }
  }

  async getTeamById(teamId: string): Promise<DatadogTeam> {
    try {
      const response = await api.get(`${this.baseUrl}/teams/${teamId}`);
      return response.data.data;
    } catch (error) {
      console.error('Datadog API: Error fetching team:', error);
      throw error;
    }
  }

  async getTeamMembers(teamId: string, connectionId: string): Promise<{
    teamId: string;
    teamName: string;
    members: Array<{
      userId: string;
      role: string;
      position?: string;
    }>;
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/teams/${teamId}/members?connectionId=${connectionId}`);
      return response.data.data;
    } catch (error) {
      console.error('Datadog API: Error fetching team members:', error);
      throw error;
    }
  }

  async createTeam(teamData: {
    name: string;
    handle: string;
    description?: string;
    connectionId: string;
  }): Promise<DatadogTeam> {
    try {
      const response = await api.post(`${this.baseUrl}/teams`, teamData);
      return response.data.data;
    } catch (error) {
      console.error('Datadog API: Error creating team:', error);
      throw error;
    }
  }

  async updateTeam(teamId: string, teamData: Partial<DatadogTeam>): Promise<DatadogTeam> {
    try {
      const response = await api.put(`${this.baseUrl}/teams/${teamId}`, teamData);
      return response.data.data;
    } catch (error) {
      console.error('Datadog API: Error updating team:', error);
      throw error;
    }
  }

  async deleteTeam(teamId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/teams/${teamId}`);
    } catch (error) {
      console.error('Datadog API: Error deleting team:', error);
      throw error;
    }
  }

  // Sync all data
  async syncAll(connectionId: string): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/sync/all`, { connectionId });
      return response.data;
    } catch (error) {
      console.error('Datadog API: Error syncing all data:', error);
      throw error;
    }
  }
}

export const datadogApi = new DatadogApiService();
