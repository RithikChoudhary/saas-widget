import api from '../../../../shared/utils/api';

// GitHub API service functions
export const githubApi = {
  // Connections
  getConnections: () => api.get('/integrations/github/connections'),
  
  // Users
  getUsers: (params?: URLSearchParams) => 
    api.get(`/integrations/github/users${params ? `?${params.toString()}` : ''}`),
  getUserStats: (params?: URLSearchParams) => 
    api.get(`/integrations/github/users/stats${params ? `?${params.toString()}` : ''}`),
  syncUsers: (data: { connectionId: string }) => 
    api.post('/integrations/github/users/sync', data),
  inviteUser: (data: { connectionId: string; username: string }) => 
    api.post('/integrations/github/users/invite', data),
  removeUser: (username: string, data: { connectionId: string }) => 
    api.delete(`/integrations/github/users/${username}`, { data }),
  
  // Teams
  getTeams: (params?: URLSearchParams) => 
    api.get(`/integrations/github/teams${params ? `?${params.toString()}` : ''}`),
  
  // Repositories
  getRepositories: (params?: URLSearchParams) => 
    api.get(`/integrations/github/repositories${params ? `?${params.toString()}` : ''}`),
  
  // Packages
  getPackages: (params?: URLSearchParams) => 
    api.get(`/integrations/github/packages${params ? `?${params.toString()}` : ''}`),
  
  // Dashboard data
  getDashboardData: () => api.get('/apps/dashboard')
};

export default githubApi;
