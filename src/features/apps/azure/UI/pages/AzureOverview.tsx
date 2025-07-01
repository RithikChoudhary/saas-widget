import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight,
  Cloud,
  Users,
  Shield,
  DollarSign,
  Server,
  Database,
  Settings,
  Plus,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { Layout } from '../../../../../shared/components';
import { azureApi } from '../../services/azureApi';

interface AzureStats {
  totalSubscriptions: number;
  totalUsers: number;
  totalResources: number;
  monthlyCost: number;
  lastSync: string;
  securityScore: number;
}

interface AzureService {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  status: 'active' | 'setup-required' | 'available';
  count?: number;
}

const AzureOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AzureStats>({
    totalSubscriptions: 0,
    totalUsers: 0,
    totalResources: 0,
    monthlyCost: 0,
    lastSync: '',
    securityScore: 0
  });
  const navigate = useNavigate();

  const azureServices: AzureService[] = [
    {
      id: 'subscriptions',
      name: 'Subscription Management',
      description: 'Manage Azure subscriptions and billing accounts',
      icon: Cloud,
      route: '/apps/azure/subscriptions',
      status: 'setup-required'
    },
    {
      id: 'ad',
      name: 'Azure Active Directory',
      description: 'Manage Azure AD users, groups, and applications',
      icon: Users,
      route: '/apps/azure/ad',
      status: 'available'
    },
    {
      id: 'management',
      name: 'Management Groups',
      description: 'Organize resources with management groups and policies',
      icon: Server,
      route: '/apps/azure/management',
      status: 'available'
    },
    {
      id: 'cost',
      name: 'Cost Management',
      description: 'Monitor costs, budgets, and optimize Azure spending',
      icon: DollarSign,
      route: '/apps/azure/cost',
      status: 'available'
    },
    {
      id: 'security',
      name: 'Security Center',
      description: 'Security posture management and threat protection',
      icon: Shield,
      route: '/apps/azure/security',
      status: 'available'
    },
    {
      id: 'resources',
      name: 'Resource Management',
      description: 'Virtual machines, storage, and other Azure resources',
      icon: Database,
      route: '/apps/azure/resources',
      status: 'available'
    }
  ];

  useEffect(() => {
    fetchAzureOverview();
  }, []);

  const fetchAzureOverview = async () => {
    try {
      const response = await azureApi.getOverview();
      if (response.data && response.data.success) {
        setStats(response.data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching Azure overview:', error);
      // No mock data - real implementation needed
      setStats({
        totalSubscriptions: 0,
        totalUsers: 0,
        totalResources: 0,
        monthlyCost: 0,
        lastSync: 'Not connected',
        securityScore: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getServiceStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'setup-required':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'available':
        return <Settings className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getServiceStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
      case 'setup-required':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Setup Required</span>;
      case 'available':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Available</span>;
      default:
        return null;
    }
  };

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
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/apps')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🔷</span>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Microsoft Azure</h1>
                    <p className="mt-1 text-gray-600">Cloud computing services for building, testing, and deploying applications</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/apps/azure/subscriptions')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Subscription
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Azure Portal
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Cloud className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Subscriptions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSubscriptions}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">AD Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Server className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Resources</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalResources}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.monthlyCost.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Security Score</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.securityScore}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Activity className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Last Sync</p>
                  <p className="text-sm font-bold text-gray-900">{stats.lastSync}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Azure Integration Setup Required</h3>
                <p className="text-yellow-700 mt-1">
                  Connect your Azure subscriptions to start managing your cloud resources. 
                  <button 
                    onClick={() => navigate('/apps/azure/subscriptions')}
                    className="ml-2 text-yellow-800 underline hover:text-yellow-900"
                  >
                    Get started →
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Azure Services */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Azure Management Areas</h3>
              <p className="text-sm text-gray-600">Access different Azure management capabilities</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {azureServices.map((service) => {
                  const ServiceIcon = service.icon;
                  return (
                    <div
                      key={service.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(service.route)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <ServiceIcon className="h-8 w-8 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{service.name}</h4>
                            {service.count && (
                              <p className="text-sm text-gray-500">{service.count} items</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getServiceStatusIcon(service.status)}
                          {getServiceStatusBadge(service.status)}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600 font-medium">
                          {service.status === 'active' ? 'Manage' : 
                           service.status === 'setup-required' ? 'Setup Required' : 'Configure'}
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Getting Started */}
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Getting Started with Azure</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Cloud className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">1. Connect Subscriptions</h4>
                  <p className="text-sm text-gray-600">Link your Azure subscriptions to start managing resources</p>
                </div>
                
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">2. Configure Azure AD</h4>
                  <p className="text-sm text-gray-600">Set up user and group management through Azure Active Directory</p>
                </div>
                
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">3. Monitor & Secure</h4>
                  <p className="text-sm text-gray-600">Enable security monitoring and cost management</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AzureOverview;
