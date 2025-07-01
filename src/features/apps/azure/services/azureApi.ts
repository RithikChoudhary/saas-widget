import api from '../../../../shared/utils/api';

// Azure API service functions
export const azureApi = {
  // Connections
  getConnections: () => api.get('/integrations/azure/connections'),
  
  // Overview
  getOverview: () => api.get('/integrations/azure/overview'),
  
  // Subscriptions
  getSubscriptions: (params?: URLSearchParams) => 
    api.get(`/integrations/azure/subscriptions${params ? `?${params.toString()}` : ''}`),
  
  // Users
  getUsers: (params?: URLSearchParams) => 
    api.get(`/integrations/azure/users${params ? `?${params.toString()}` : ''}`),
  
  // Resources
  getResources: (params?: URLSearchParams) => 
    api.get(`/integrations/azure/resources${params ? `?${params.toString()}` : ''}`),
  
  // Cost Management
  getCosts: (params?: URLSearchParams) => 
    api.get(`/integrations/azure/costs${params ? `?${params.toString()}` : ''}`),
  
  // Dashboard data
  getDashboardData: () => api.get('/apps/dashboard')
};

export default azureApi;
