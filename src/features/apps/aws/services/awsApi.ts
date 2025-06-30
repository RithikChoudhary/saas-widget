import api from '../../../../shared/utils/api';

export interface AWSOverviewData {
  totalAccounts: number;
  totalUsers: number;
  totalResources: number;
  monthlyCost: number;
  lastSync: string;
  securityScore: number;
}

export interface AWSAccount {
  id: string;
  accountId: string;
  accountName: string;
  alias?: string;
  region: string;
  status: 'connected' | 'error' | 'syncing';
  lastSync: string;
  users: number;
  resources: {
    ec2: number;
    s3: number;
    iam: number;
    lambda: number;
  };
  monthlyCost: number;
  accessType: 'cross-account-role' | 'access-keys' | 'sso';
  organizationUnit?: string;
}

export interface AWSUser {
  id: string;
  username: string;
  email?: string;
  accountId: string;
  groups: string[];
  policies: string[];
  lastActivity: string;
  status: 'active' | 'inactive';
  mfaEnabled: boolean;
}

export interface AWSBillingData {
  totalCost: number;
  previousMonthCost: number;
  costByService: Array<{
    service: string;
    cost: number;
    percentage: number;
  }>;
  costByAccount: Array<{
    accountId: string;
    accountName: string;
    cost: number;
  }>;
  recommendations: Array<{
    id: string;
    type: 'cost-optimization' | 'rightsizing' | 'reserved-instances';
    description: string;
    potentialSavings: number;
  }>;
}

export interface AWSSecurityData {
  securityScore: number;
  alerts: Array<{
    id: string;
    severity: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    accountId: string;
    timestamp: string;
  }>;
  complianceStatus: {
    cis: number;
    pci: number;
    soc2: number;
  };
}

class AWSApiService {
  private baseUrl = '/integrations/aws';

  async getOverview(): Promise<AWSOverviewData> {
    try {
      const response = await api.get(`${this.baseUrl}/overview`);
      return response.data.data;
    } catch (error) {
      console.error('AWS API: Error fetching overview:', error);
      // Return real empty state - no mock data
      return {
        totalAccounts: 0,
        totalUsers: 0,
        totalResources: 0,
        monthlyCost: 0,
        lastSync: 'Not connected',
        securityScore: 0
      };
    }
  }

  async getAccounts(): Promise<AWSAccount[]> {
    try {
      const response = await api.get(`${this.baseUrl}/accounts`);
      return response.data.data;
    } catch (error) {
      console.error('AWS API: Error fetching accounts:', error);
      // Return real empty state - no mock data
      return [];
    }
  }

  async createAccount(accountData: {
    accountId: string;
    accountName: string;
    accessType: string;
    region: string;
    credentials?: any;
  }): Promise<AWSAccount> {
    try {
      const response = await api.post(`${this.baseUrl}/accounts`, accountData);
      return response.data.data;
    } catch (error) {
      console.error('AWS API: Error creating account:', error);
      throw error;
    }
  }

  async updateAccount(accountId: string, accountData: Partial<AWSAccount>): Promise<AWSAccount> {
    try {
      const response = await api.put(`${this.baseUrl}/accounts/${accountId}`, accountData);
      return response.data.data;
    } catch (error) {
      console.error('AWS API: Error updating account:', error);
      throw error;
    }
  }

  async deleteAccount(accountId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/accounts/${accountId}`);
    } catch (error) {
      console.error('AWS API: Error deleting account:', error);
      throw error;
    }
  }

  async syncAccount(accountId: string): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/accounts/${accountId}/sync`);
    } catch (error) {
      console.error('AWS API: Error syncing account:', error);
      throw error;
    }
  }

  async getUsers(accountId?: string): Promise<AWSUser[]> {
    try {
      const url = accountId ? `${this.baseUrl}/users?accountId=${accountId}` : `${this.baseUrl}/users`;
      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      console.error('AWS API: Error fetching users:', error);
      // Return real empty state - no mock data
      return [];
    }
  }

  async getBillingData(accountId?: string): Promise<AWSBillingData> {
    try {
      const url = accountId ? `${this.baseUrl}/billing?accountId=${accountId}` : `${this.baseUrl}/billing`;
      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      console.error('AWS API: Error fetching billing data:', error);
      // Return real empty state - no mock data
      return {
        totalCost: 0,
        previousMonthCost: 0,
        costByService: [],
        costByAccount: [],
        recommendations: []
      };
    }
  }

  async getSecurityData(accountId?: string): Promise<AWSSecurityData> {
    try {
      const url = accountId ? `${this.baseUrl}/security?accountId=${accountId}` : `${this.baseUrl}/security`;
      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      console.error('AWS API: Error fetching security data:', error);
      // Return real empty state - no mock data
      return {
        securityScore: 0,
        alerts: [],
        complianceStatus: {
          cis: 0,
          pci: 0,
          soc2: 0
        }
      };
    }
  }

  async getOrganizations(): Promise<any[]> {
    try {
      const response = await api.get(`${this.baseUrl}/organizations`);
      return response.data.data;
    } catch (error) {
      console.error('AWS API: Error fetching organizations:', error);
      // Return real empty state - no mock data
      return [];
    }
  }
}

export const awsApi = new AWSApiService();
