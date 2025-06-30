import { api } from '../../../../shared/utils';

export interface AzureOverviewData {
  totalSubscriptions: number;
  totalUsers: number;
  totalResources: number;
  monthlyCost: number;
  lastSync: string;
  securityScore: number;
}

export interface AzureSubscription {
  id: string;
  subscriptionId: string;
  subscriptionName: string;
  tenantId: string;
  status: 'connected' | 'error' | 'syncing';
  lastSync: string;
  users: number;
  resources: {
    virtualMachines: number;
    storageAccounts: number;
    databases: number;
    webApps: number;
  };
  monthlyCost: number;
  resourceGroups: number;
}

export interface AzureUser {
  id: string;
  userPrincipalName: string;
  displayName: string;
  mail?: string;
  tenantId: string;
  roles: string[];
  lastSignIn: string;
  status: 'active' | 'inactive';
  mfaEnabled: boolean;
}

export interface AzureCostData {
  totalCost: number;
  previousMonthCost: number;
  costByService: Array<{
    service: string;
    cost: number;
    percentage: number;
  }>;
  costBySubscription: Array<{
    subscriptionId: string;
    subscriptionName: string;
    cost: number;
  }>;
  recommendations: Array<{
    id: string;
    type: 'cost-optimization' | 'rightsizing' | 'reserved-instances';
    description: string;
    potentialSavings: number;
  }>;
}

export interface AzureSecurityData {
  securityScore: number;
  alerts: Array<{
    id: string;
    severity: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    subscriptionId: string;
    timestamp: string;
  }>;
  complianceStatus: {
    azureSecurityBenchmark: number;
    pci: number;
    iso27001: number;
  };
}

class AzureApiService {
  private baseUrl = '/api/integrations/azure';

  async getOverview(): Promise<AzureOverviewData> {
    try {
      const response = await api.get(`${this.baseUrl}/overview`);
      return response.data.data;
    } catch (error) {
      console.error('Azure API: Error fetching overview:', error);
      throw new Error('Azure integration not configured. Please connect your Azure subscriptions first.');
    }
  }

  async getSubscriptions(): Promise<AzureSubscription[]> {
    try {
      const response = await api.get(`${this.baseUrl}/subscriptions`);
      return response.data.data;
    } catch (error) {
      console.error('Azure API: Error fetching subscriptions:', error);
      throw new Error('Failed to fetch Azure subscriptions');
    }
  }

  async createSubscription(subscriptionData: {
    subscriptionId: string;
    subscriptionName: string;
    tenantId: string;
  }): Promise<AzureSubscription> {
    try {
      const response = await api.post(`${this.baseUrl}/subscriptions`, subscriptionData);
      return response.data.data;
    } catch (error) {
      console.error('Azure API: Error creating subscription:', error);
      throw error;
    }
  }

  async updateSubscription(subscriptionId: string, subscriptionData: Partial<AzureSubscription>): Promise<AzureSubscription> {
    try {
      const response = await api.put(`${this.baseUrl}/subscriptions/${subscriptionId}`, subscriptionData);
      return response.data.data;
    } catch (error) {
      console.error('Azure API: Error updating subscription:', error);
      throw error;
    }
  }

  async deleteSubscription(subscriptionId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/subscriptions/${subscriptionId}`);
    } catch (error) {
      console.error('Azure API: Error deleting subscription:', error);
      throw error;
    }
  }

  async syncSubscription(subscriptionId: string): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/subscriptions/${subscriptionId}/sync`);
    } catch (error) {
      console.error('Azure API: Error syncing subscription:', error);
      throw error;
    }
  }

  async getUsers(tenantId?: string): Promise<AzureUser[]> {
    try {
      const url = tenantId ? `${this.baseUrl}/users?tenantId=${tenantId}` : `${this.baseUrl}/users`;
      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      console.error('Azure API: Error fetching users:', error);
      throw new Error('Failed to fetch Azure AD users');
    }
  }

  async getCostData(subscriptionId?: string): Promise<AzureCostData> {
    try {
      const url = subscriptionId ? `${this.baseUrl}/cost?subscriptionId=${subscriptionId}` : `${this.baseUrl}/cost`;
      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      console.error('Azure API: Error fetching cost data:', error);
      throw new Error('Failed to fetch Azure cost data');
    }
  }

  async getSecurityData(subscriptionId?: string): Promise<AzureSecurityData> {
    try {
      const url = subscriptionId ? `${this.baseUrl}/security?subscriptionId=${subscriptionId}` : `${this.baseUrl}/security`;
      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      console.error('Azure API: Error fetching security data:', error);
      throw new Error('Failed to fetch Azure security data');
    }
  }

  async getManagementGroups(): Promise<any[]> {
    try {
      const response = await api.get(`${this.baseUrl}/management-groups`);
      return response.data.data;
    } catch (error) {
      console.error('Azure API: Error fetching management groups:', error);
      throw new Error('Failed to fetch Azure management groups');
    }
  }
}

export const azureApi = new AzureApiService();
