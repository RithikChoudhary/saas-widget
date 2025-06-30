import api from '../../../shared/utils/api';

export interface DashboardData {
  overview: {
    totalUsers: number;
    totalGhostUsers: number;
    totalSecurityRisks: number;
    totalWastedCost: number;
    totalLicenseCost: number;
    wastePercentage: string;
  };
  platformBreakdown: {
    googleWorkspace: number;
    github: number;
    slack: number;
    zoom: number;
    aws: number;
  };
  ghostUsersByPlatform: {
    googleWorkspace: number;
    github: number;
    slack: number;
    zoom: number;
    aws: number;
  };
  securityRiskBreakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
    impact: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  lastUpdated: string;
}

export interface CrossPlatformUser {
  _id: string;
  email: string;
  companyId: string;
  platforms: {
    googleWorkspace?: {
      id: string;
      name: string;
      isAdmin: boolean;
      lastLogin?: string;
      status: string;
    };
    github?: {
      id: string;
      login: string;
      isAdmin: boolean;
      lastActivity?: string;
      status: string;
    };
    slack?: {
      id: string;
      name: string;
      isAdmin: boolean;
      lastActivity?: string;
      status: string;
    };
    zoom?: {
      id: string;
      email: string;
      type: string;
      lastLogin?: string;
      status: string;
    };
    aws?: {
      id: string;
      userName: string;
      isAdmin: boolean;
      lastActivity?: string;
      status: string;
    };
  };
  isGhostUser: boolean;
  securityRisks: Array<{
    type: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
  }>;
  estimatedMonthlyCost: number;
  lastUpdated: string;
}

export interface GhostUser {
  _id: string;
  email: string;
  platforms: string[];
  neverLoggedInPlatforms: string[];
  estimatedMonthlyCost: number;
  potentialSavings: number;
  lastUpdated: string;
}

export interface SecurityRisk {
  _id: string;
  userId: string;
  email: string;
  riskType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  platform: string;
  riskScore: number;
  recommendations: string[];
  status: 'open' | 'acknowledged' | 'resolved';
  createdAt: string;
  lastUpdated: string;
}

export interface LicenseOptimization {
  _id: string;
  platform: string;
  optimizationType: string;
  currentCost: number;
  optimizedCost: number;
  potentialSavings: number;
  description: string;
  recommendations: string[];
  priority: 'high' | 'medium' | 'low';
  estimatedImplementationTime: string;
  createdAt: string;
}

export interface CorrelationResult {
  totalUsers: number;
  ghostUsers: number;
  securityRisks: number;
  licenseWaste: number;
}

class AnalyticsApi {
  // Dashboard endpoint
  async getDashboard(): Promise<DashboardData> {
    const response = await api.get('/analytics/dashboard');
    return response.data.data;
  }

  // User correlation
  async correlateUsers(): Promise<CorrelationResult> {
    const response = await api.post('/analytics/correlate');
    return response.data.data;
  }

  // Cross-platform users
  async getCrossPlatformUsers(): Promise<CrossPlatformUser[]> {
    const response = await api.get('/analytics/cross-platform-users');
    return response.data.data;
  }

  // Ghost users
  async getGhostUsers(): Promise<GhostUser[]> {
    const response = await api.get('/analytics/ghost-users');
    return response.data.data;
  }

  // Security risks
  async getSecurityRisks(): Promise<SecurityRisk[]> {
    const response = await api.get('/analytics/security-risks');
    return response.data.data;
  }

  // License optimization
  async getLicenseOptimization(): Promise<LicenseOptimization[]> {
    const response = await api.get('/analytics/license-optimization');
    return response.data.data;
  }

  // Update security risk status
  async updateSecurityRiskStatus(riskId: string, status: 'acknowledged' | 'resolved'): Promise<void> {
    await api.patch(`/analytics/security-risks/${riskId}`, { status });
  }

  // Export data
  async exportDashboardData(format: 'csv' | 'pdf' = 'csv'): Promise<Blob> {
    const response = await api.get(`/analytics/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export const analyticsApi = new AnalyticsApi();
