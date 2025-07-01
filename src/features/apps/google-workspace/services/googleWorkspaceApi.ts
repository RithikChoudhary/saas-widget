import api from '../../../../shared/utils/api';

// Google Workspace API service functions
export const googleWorkspaceApi = {
  // Connections
  getConnections: () => api.get('/integrations/google-workspace/connections'),
  
  // Analytics/Overview
  getAnalytics: () => api.get('/integrations/google-workspace/analytics'),
  
  // Users
  getUsers: (params?: URLSearchParams) => 
    api.get(`/integrations/google-workspace/users${params ? `?${params.toString()}` : ''}`),
  getUserStats: (params?: URLSearchParams) => 
    api.get(`/integrations/google-workspace/users/stats${params ? `?${params.toString()}` : ''}`),
  syncUsers: (data: { connectionId: string }) => 
    api.post('/integrations/google-workspace/users/sync', data),
  
  // Groups
  getGroups: (params?: URLSearchParams) => 
    api.get(`/integrations/google-workspace/groups${params ? `?${params.toString()}` : ''}`),
  getGroupStats: (params?: URLSearchParams) => 
    api.get(`/integrations/google-workspace/groups/stats${params ? `?${params.toString()}` : ''}`),
  syncGroups: (data: { connectionId: string }) => 
    api.post('/integrations/google-workspace/groups/sync', data),
  
  // OAuth
  initiateOAuth: (data: { companyId: string }) => 
    api.post('/integrations/google-workspace/oauth/initiate', data),
  
  // Sync all data
  syncAll: (data: { connectionId: string; companyId: string }) => 
    api.post('/integrations/google-workspace/sync/all', data),
  
  // Dashboard data
  getDashboardData: () => api.get('/apps/dashboard')
};

export default googleWorkspaceApi;
