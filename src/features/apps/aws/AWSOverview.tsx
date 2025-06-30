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
import { Layout } from '../../../shared/components';
import { awsApi } from './services/awsApi';

interface AWSStats {
  totalAccounts: number;
  totalUsers: number;
  totalResources: number;
  monthlyCost: number;
  lastSync: string;
  securityScore: number;
  totalGroups?: number;
  hasOrganizations?: boolean;
  hasBillingData?: boolean;
}

interface AWSService {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  status: 'active' | 'setup-required' | 'available';
  count?: number;
}

const AWSOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AWSStats>({
    totalAccounts: 0,
    totalUsers: 0,
    totalResources: 0,
    monthlyCost: 0,
    lastSync: '',
    securityScore: 0
  });
  const navigate = useNavigate();

  const getServiceStatus = (serviceId: string): 'active' | 'setup-required' | 'available' => {
    if (stats.totalAccounts === 0) {
      return 'setup-required';
    }
    
    switch (serviceId) {
      case 'connections':
        return 'active';
      case 'users':
        return stats.totalUsers > 0 || (stats.totalGroups && stats.totalGroups > 0) ? 'active' : 'available';
      case 'organizations':
        return stats.hasOrganizations ? 'active' : 'available';
      case 'billing':
        return stats.hasBillingData || stats.monthlyCost > 0 ? 'active' : 'available';
      case 'resources':
        return stats.totalResources > 0 ? 'active' : 'available';
      case 'security':
        return stats.securityScore > 0 ? 'active' : 'available';
      default:
        return 'available';
    }
  };

  const awsServices: AWSService[] = [
    {
      id: 'connections',
      name: 'Account Connections',
      description: 'Manage multiple AWS account connections and access methods',
      icon: Cloud,
      route: '/apps/aws/connections',
      status: getServiceStatus('connections'),
      count: stats.totalAccounts
    },
    {
      id: 'users',
      name: 'IAM Users & Groups',
      description: 'Manage IAM users, groups, roles, and permissions',
      icon: Users,
      route: '/apps/aws/users',
      status: getServiceStatus('users'),
      count: stats.totalUsers + (stats.totalGroups || 0)
    },
    {
      id: 'organizations',
      name: 'Organizations & OUs',
      description: 'Manage AWS Organizations and Organizational Units',
      icon: Server,
      route: '/apps/aws/organizations',
      status: getServiceStatus('organizations')
    },
    {
      id: 'billing',
      name: 'Billing & Cost Management',
      description: 'Monitor costs, budgets, and optimize spending',
      icon: DollarSign,
      route: '/apps/aws/billing',
      status: getServiceStatus('billing')
    },
    {
      id: 'security',
      name: 'Security & Compliance',
      description: 'Security posture, compliance monitoring, and policies',
      icon: Shield,
      route: '/apps/aws/security',
      status: getServiceStatus('security')
    },
    {
      id: 'resources',
      name: 'Resource Management',
      description: 'EC2, S3, Lambda, and other AWS resources',
      icon: Database,
      route: '/apps/aws/resources',
      status: getServiceStatus('resources'),
      count: stats.totalResources > 0 ? stats.totalResources : undefined
    }
  ];

  useEffect(() => {
    fetchAWSOverview();
  }, []);

  const fetchAWSOverview = async () => {
    try {
      const data = await awsApi.getOverview();
      setStats(data);
    } catch (error) {
      console.error('Error fetching AWS overview:', error);
      // No mock data - show real empty state
      setStats({
        totalAccounts: 0,
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
                  <span className="text-3xl">☁️</span>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Amazon Web Services</h1>
                    <p className="mt-1 text-gray-600">Comprehensive cloud computing platform management</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/apps/aws/connections')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Account
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  AWS Console
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
                  <p className="text-sm font-medium text-gray-600">Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAccounts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">IAM Users</p>
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

          {/* Connection Status Banner - Only show when no accounts connected */}
          {stats.totalAccounts === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800">AWS Integration Setup Required</h3>
                  <p className="text-yellow-700 mt-1">
                    Connect your AWS accounts to start managing your cloud infrastructure. 
                    <button 
                      onClick={() => navigate('/apps/aws/connections')}
                      className="ml-2 text-yellow-800 underline hover:text-yellow-900"
                    >
                      Get started →
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AWS Services */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">AWS Management Areas</h3>
              <p className="text-sm text-gray-600">Access different AWS management capabilities</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {awsServices.map((service) => {
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

          {/* Getting Started Guide - Only show when no accounts connected */}
          {stats.totalAccounts === 0 && (
            <div className="mt-8 bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Getting Started with AWS</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Cloud className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">1. Connect Accounts</h4>
                    <p className="text-sm text-gray-600">Link your AWS accounts using cross-account roles or access keys</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">2. Manage Users</h4>
                    <p className="text-sm text-gray-600">Set up IAM user and group management across your accounts</p>
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
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AWSOverview;
