import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Settings, 
  Users, 
  DollarSign, 
  Activity,
  Cloud,
  Mail,
  Code,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Grid,
  List,
  TrendingUp,
  Shield,
  Zap,
  Database,
  Globe,
  Smartphone,
  Monitor,
  Wifi,
  Star,
  ArrowRight,
  BarChart3,
  PieChart,
  RefreshCw
} from 'lucide-react';
import { Layout } from '../../shared/components';

interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  services: Service[];
}

interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: 'connected' | 'available' | 'coming-soon';
  accounts?: number;
  connectedAccounts?: number;
  users?: number;
  lastSync?: string;
  monthlyCost?: number;
  features: string[];
  route: string;
}

const AppsOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [connectedServicesData, setConnectedServicesData] = useState<any[]>([]);
  const [credentialsData, setCredentialsData] = useState<any[]>([]);
  const navigate = useNavigate();

  // Fetch real data from all connected services
  useEffect(() => {
    const fetchConnectedServices = async () => {
      try {
        console.log('🔍 Apps Overview: Fetching connected services data...');
        
        // Fetch data from multiple endpoints to get comprehensive service status
        const [credentialsResponse, analyticsResponse] = await Promise.allSettled([
          fetch('/api/credentials', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          }),
          fetch('/api/analytics/dashboard', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          })
        ]);

        let servicesData: any[] = [];
        let allCredentials: any[] = [];

        // Process credentials data
        if (credentialsResponse.status === 'fulfilled' && credentialsResponse.value.ok) {
          const credentialsData = await credentialsResponse.value.json();
          console.log('✅ Apps Overview: Credentials data received:', credentialsData.data);
          allCredentials = credentialsData.data || [];
          setCredentialsData(allCredentials);
          
          // Group credentials by app type
          const credentialsByType = allCredentials.reduce((acc: any, cred: any) => {
            if (!acc[cred.appType]) {
              acc[cred.appType] = {
                credentials: [],
                connected: 0,
                total: 0
              };
            }
            acc[cred.appType].credentials.push(cred);
            acc[cred.appType].total++;
            if (cred.connectionStatus?.isConnected) {
              acc[cred.appType].connected++;
            }
            return acc;
          }, {});

          // Create service data from credentials
          Object.entries(credentialsByType).forEach(([appType, data]: [string, any]) => {
            servicesData.push({
              id: appType,
              name: appType,
              accounts: data.total,
              connectedAccounts: data.connected,
              users: 0, // Will be updated from analytics if available
              monthlyCost: 0, // Will be updated from analytics if available
              lastSync: data.credentials.find((c: any) => c.connectionStatus?.lastSync)?.connectionStatus.lastSync || null,
              hasCredentials: true,
              credentials: data.credentials
            });
          });
        }

        // Process analytics data if available
        if (analyticsResponse.status === 'fulfilled' && analyticsResponse.value.ok) {
          const analyticsData = await analyticsResponse.value.json();
          console.log('✅ Apps Overview: Analytics data received:', analyticsData.data);
          
          if (analyticsData.data?.platformBreakdown) {
            // Update service data with analytics information
            Object.entries(analyticsData.data.platformBreakdown).forEach(([platform, userCount]: [string, any]) => {
              const existingService = servicesData.find(s => s.id === platform);
              if (existingService) {
                existingService.users = userCount;
              } else if (userCount > 0) {
                // Add service even if no credentials but has users (from previous syncs)
                servicesData.push({
                  id: platform,
                  name: platform,
                  accounts: 0,
                  connectedAccounts: 0,
                  users: userCount,
                  monthlyCost: 0,
                  lastSync: 'Has Data',
                  hasCredentials: false
                });
              }
            });
          }

          // Add cost information if available
          if (analyticsData.data?.overview?.totalLicenseCost) {
            const totalCost = analyticsData.data.overview.totalLicenseCost;
            const platformCount = servicesData.length;
            if (platformCount > 0) {
              const avgCostPerPlatform = totalCost / platformCount;
              servicesData.forEach(service => {
                service.monthlyCost = Math.round(avgCostPerPlatform);
              });
            }
          }
        }

        console.log('📊 Apps Overview: Final services data:', servicesData);
        setConnectedServicesData(servicesData);
        
      } catch (error) {
        console.error('❌ Apps Overview: Error fetching connected services:', error);
        setConnectedServicesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConnectedServices();
  }, []);

  // Helper function to get service data from connected services
  const getServiceData = (serviceId: string) => {
    const data = connectedServicesData.find(service => service.id === serviceId);
    if (data) {
      return {
        ...data,
        isConnected: data.connectedAccounts > 0
      };
    }
    return null;
  };

  // Refresh data
  const refreshData = () => {
    setLoading(true);
    window.location.reload();
  };

  // Service categories with real data from connected services
  const serviceCategories: ServiceCategory[] = [
    {
      id: 'cloud-providers',
      name: 'Cloud Providers',
      icon: Cloud,
      description: 'Manage your cloud infrastructure and services',
      services: [
        {
          id: 'aws',
          name: 'Amazon Web Services',
          icon: '☁️',
          description: 'Comprehensive cloud computing platform with 200+ services',
          status: getServiceData('aws')?.isConnected ? 'connected' : 'available',
          accounts: getServiceData('aws')?.accounts || 0,
          connectedAccounts: getServiceData('aws')?.connectedAccounts || 0,
          users: getServiceData('aws')?.users || 0,
          monthlyCost: getServiceData('aws')?.monthlyCost || 0,
          lastSync: getServiceData('aws')?.lastSync ? new Date(getServiceData('aws').lastSync).toLocaleDateString() : undefined,
          features: ['EC2 Instances', 'S3 Storage', 'IAM Management', 'Cost Optimization', 'Security Monitoring'],
          route: '/apps/aws'
        },
        {
          id: 'azure',
          name: 'Microsoft Azure',
          icon: '🔷',
          description: 'Microsoft\'s cloud computing service for building, testing, and deploying applications',
          status: 'available',
          features: ['Virtual Machines', 'Azure AD', 'Storage Accounts', 'Cost Management', 'Security Center'],
          route: '/apps/azure'
        },
        {
          id: 'gcp',
          name: 'Google Cloud Platform',
          icon: '🌐',
          description: 'Google\'s suite of cloud computing services',
          status: 'coming-soon',
          features: ['Compute Engine', 'Cloud Storage', 'IAM', 'BigQuery', 'Kubernetes Engine'],
          route: '/apps/gcp'
        }
      ]
    },
    {
      id: 'productivity-suites',
      name: 'Productivity Suites',
      icon: Mail,
      description: 'Email, collaboration, and productivity tools',
      services: [
        {
          id: 'office365',
          name: 'Microsoft Office 365',
          icon: '📧',
          description: 'Complete productivity suite with email, documents, and collaboration tools',
          status: 'available', // No mock data - real connection status needed
          features: ['Exchange Online', 'SharePoint', 'Teams', 'OneDrive', 'Security & Compliance'],
          route: '/apps/office365'
        },
        {
          id: 'google-workspace',
          name: 'Google Workspace',
          icon: '📊',
          description: 'Google\'s suite of productivity and collaboration tools',
          status: 'available',
          features: ['Gmail', 'Google Drive', 'Google Meet', 'Google Calendar', 'Admin Console'],
          route: '/apps/google-workspace'
        }
      ]
    },
    {
      id: 'development-tools',
      name: 'Development Tools',
      icon: Code,
      description: 'Version control, CI/CD, and development platforms',
      services: [
        {
          id: 'github',
          name: 'GitHub',
          icon: '🐙',
          description: 'World\'s leading software development platform',
          status: getServiceData('github')?.isConnected ? 'connected' : 'available',
          accounts: getServiceData('github')?.accounts || 0,
          connectedAccounts: getServiceData('github')?.connectedAccounts || 0,
          users: getServiceData('github')?.users || 0,
          monthlyCost: getServiceData('github')?.monthlyCost || 0,
          lastSync: getServiceData('github')?.lastSync ? new Date(getServiceData('github').lastSync).toLocaleDateString() : undefined,
          features: ['Repositories', 'Actions', 'Security', 'Team Management', 'Analytics'],
          route: '/apps/github'
        },
        {
          id: 'gitlab',
          name: 'GitLab',
          icon: '🦊',
          description: 'Complete DevOps platform delivered as a single application',
          status: 'available',
          features: ['Git Repository', 'CI/CD', 'Issue Tracking', 'Security Scanning', 'Container Registry'],
          route: '/apps/gitlab'
        }
      ]
    },
    {
      id: 'communication-collaboration',
      name: 'Communication & Collaboration',
      icon: Users,
      description: 'Team communication, video conferencing, and collaboration tools',
      services: [
        {
          id: 'slack',
          name: 'Slack',
          icon: '💬',
          description: 'Team communication and collaboration platform',
          status: getServiceData('slack')?.isConnected ? 'connected' : 'available',
          accounts: getServiceData('slack')?.accounts || 0,
          connectedAccounts: getServiceData('slack')?.connectedAccounts || 0,
          users: getServiceData('slack')?.users || 0,
          monthlyCost: getServiceData('slack')?.monthlyCost || 0,
          lastSync: getServiceData('slack')?.lastSync ? new Date(getServiceData('slack').lastSync).toLocaleDateString() : undefined,
          features: ['Channels', 'Direct Messages', 'File Sharing', 'App Integrations', 'Workflow Automation'],
          route: '/apps/slack'
        },
        {
          id: 'zoom',
          name: 'Zoom',
          icon: '📹',
          description: 'Video conferencing and communication platform',
          status: getServiceData('zoom')?.isConnected ? 'connected' : 'available',
          accounts: getServiceData('zoom')?.accounts || 0,
          connectedAccounts: getServiceData('zoom')?.connectedAccounts || 0,
          users: getServiceData('zoom')?.users || 0,
          monthlyCost: getServiceData('zoom')?.monthlyCost || 0,
          lastSync: getServiceData('zoom')?.lastSync ? new Date(getServiceData('zoom').lastSync).toLocaleDateString() : undefined,
          features: ['Video Meetings', 'Webinars', 'Phone System', 'Chat', 'Rooms & Workspaces'],
          route: '/apps/zoom'
        },
        {
          id: 'microsoft-teams',
          name: 'Microsoft Teams',
          icon: '👥',
          description: 'Chat, meetings, calling, and collaboration in one place',
          status: 'coming-soon',
          features: ['Team Chat', 'Video Meetings', 'File Collaboration', 'App Integration', 'Phone System'],
          route: '/apps/teams'
        }
      ]
    }
  ];

  useEffect(() => {
    // Real implementation needed - fetch actual service connection status
    // This should call APIs to check which services are actually connected
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'available':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'coming-soon':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Connected</span>;
      case 'available':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Available</span>;
      case 'coming-soon':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Coming Soon</span>;
      default:
        return null;
    }
  };

  const filteredCategories = serviceCategories.map(category => ({
    ...category,
    services: category.services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || category.id === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || service.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
  })).filter(category => category.services.length > 0);

  // Calculate real statistics from connected services
  const totalConnectedServices = connectedServicesData.length;
  const totalUsers = connectedServicesData.reduce((sum, service) => sum + (service.users || 0), 0);
  const totalMonthlyCost = connectedServicesData.reduce((sum, service) => sum + (service.monthlyCost || 0), 0);
  const activeIntegrations = connectedServicesData.reduce((sum, service) => sum + (service.accounts || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Apps & Services</h1>
                <p className="mt-2 text-gray-600">Manage all your organization's SaaS applications and cloud services</p>
              </div>
              <button
                onClick={() => {
                  // Scroll to the services section
                  const servicesSection = document.querySelector('.space-y-8');
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Connect New Service
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Connected Services</p>
                  <p className="text-3xl font-bold">{totalConnectedServices}</p>
                  <p className="text-green-100 text-xs mt-1">
                    {totalConnectedServices > 0 ? '+12% from last month' : 'Connect your first service'}
                  </p>
                </div>
                <div className="bg-green-400 bg-opacity-30 rounded-full p-3">
                  <CheckCircle className="h-8 w-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold">{totalUsers.toLocaleString()}</p>
                  <p className="text-blue-100 text-xs mt-1">
                    {totalUsers > 0 ? 'Across all platforms' : 'No users synced yet'}
                  </p>
                </div>
                <div className="bg-blue-400 bg-opacity-30 rounded-full p-3">
                  <Users className="h-8 w-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Monthly Cost</p>
                  <p className="text-3xl font-bold">${totalMonthlyCost.toLocaleString()}</p>
                  <p className="text-yellow-100 text-xs mt-1">
                    {totalMonthlyCost > 0 ? 'Estimated spend' : 'No cost data available'}
                  </p>
                </div>
                <div className="bg-yellow-400 bg-opacity-30 rounded-full p-3">
                  <DollarSign className="h-8 w-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Active Integrations</p>
                  <p className="text-3xl font-bold">{activeIntegrations}</p>
                  <p className="text-purple-100 text-xs mt-1">
                    {activeIntegrations > 0 ? 'Accounts configured' : 'No integrations yet'}
                  </p>
                </div>
                <div className="bg-purple-400 bg-opacity-30 rounded-full p-3">
                  <Activity className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-600">Common tasks and shortcuts</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate('/credentials')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Shield className="h-8 w-8 text-blue-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Manage Credentials</p>
                    <p className="text-sm text-gray-600">Add API keys & tokens</p>
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/analytics')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">View Analytics</p>
                    <p className="text-sm text-gray-600">Usage insights & reports</p>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    // Trigger sync for all connected services
                    window.location.reload();
                  }}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="h-8 w-8 text-purple-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Sync All Data</p>
                    <p className="text-sm text-gray-600">Refresh all connections</p>
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/settings')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-8 w-8 text-gray-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Settings</p>
                    <p className="text-sm text-gray-600">Configure preferences</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Popular Integrations */}
          {totalConnectedServices === 0 && (
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Popular Integrations</h3>
                <p className="text-sm text-gray-600">Most commonly used services by organizations</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                       onClick={() => navigate('/apps/aws')}>
                    <div className="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">☁️</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Amazon Web Services</h4>
                    <p className="text-sm text-gray-600 mb-4">Cloud infrastructure and services</p>
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                  
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                       onClick={() => navigate('/apps/github')}>
                    <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">🐙</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">GitHub</h4>
                    <p className="text-sm text-gray-600 mb-4">Code repositories and collaboration</p>
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                      <span>Developer Favorite</span>
                    </div>
                  </div>
                  
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                       onClick={() => navigate('/apps/slack')}>
                    <div className="mx-auto h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">💬</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Slack</h4>
                    <p className="text-sm text-gray-600 mb-4">Team communication platform</p>
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <Zap className="h-4 w-4 text-blue-400 mr-1" />
                      <span>Team Essential</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Services Connected Message */}
          {totalConnectedServices === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">No Services Connected</h3>
                  <p className="text-blue-700 mt-1">
                    Connect your first service to start managing your organization's SaaS applications and cloud infrastructure.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Services</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    <option value="cloud-providers">Cloud Providers</option>
                    <option value="productivity-suites">Productivity Suites</option>
                    <option value="development-tools">Development Tools</option>
                    <option value="communication-collaboration">Communication & Collaboration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="connected">Connected</option>
                    <option value="available">Available</option>
                    <option value="coming-soon">Coming Soon</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Service Categories */}
          <div className="space-y-8">
            {filteredCategories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <div key={category.id} className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <CategoryIcon className="h-6 w-6 text-gray-600" />
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {category.services.map((service) => (
                        <div key={service.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-3xl">{service.icon}</span>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                                  {getStatusIcon(service.status)}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                              </div>
                            </div>
                            {getStatusBadge(service.status)}
                          </div>

                          {/* Service Stats - Only show if connected and has data */}
                          {service.status === 'connected' && (service.accounts || service.users || service.monthlyCost || service.lastSync) && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                              {service.accounts && (
                                <div className="text-center">
                                  <p className="text-sm font-medium text-gray-900">{service.accounts}</p>
                                  <p className="text-xs text-gray-600">Accounts</p>
                                </div>
                              )}
                              {service.users && (
                                <div className="text-center">
                                  <p className="text-sm font-medium text-gray-900">{service.users}</p>
                                  <p className="text-xs text-gray-600">Users</p>
                                </div>
                              )}
                              {service.monthlyCost && (
                                <div className="text-center">
                                  <p className="text-sm font-medium text-gray-900">${service.monthlyCost}</p>
                                  <p className="text-xs text-gray-600">Monthly</p>
                                </div>
                              )}
                              {service.lastSync && (
                                <div className="text-center">
                                  <p className="text-sm font-medium text-gray-900">{service.lastSync}</p>
                                  <p className="text-xs text-gray-600">Last Sync</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Features */}
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features</h4>
                            <div className="flex flex-wrap gap-1">
                              {service.features.slice(0, 3).map((feature, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  {feature}
                                </span>
                              ))}
                              {service.features.length > 3 && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  +{service.features.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex space-x-2">
                            {service.status === 'connected' ? (
                              <>
                                <button
                                  onClick={() => navigate(service.route)}
                                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                  <Settings className="h-4 w-4 mr-1" />
                                  Manage
                                </button>
                                <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                  <ExternalLink className="h-4 w-4" />
                                </button>
                              </>
                            ) : service.status === 'available' ? (
                              <button
                                onClick={() => navigate(service.route)}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Connect
                              </button>
                            ) : (
                              <button
                                disabled
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed"
                              >
                                <Clock className="h-4 w-4 mr-1" />
                                Coming Soon
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AppsOverview;
