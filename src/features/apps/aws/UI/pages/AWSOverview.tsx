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
  ExternalLink,
  RefreshCw,
  ArrowRight,
  Sparkles,
  ChevronUp,
  BarChart3,
  Wifi,
  WifiOff,
  Eye,
  Zap
} from 'lucide-react';
import { Layout } from '../../../../../shared/components';
import { awsApi } from '../../services/awsApi';

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
  features: string[];
}

const AWSOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
      count: stats.totalAccounts,
      features: ['Cross-Account Roles', 'Access Keys', 'Multi-Region']
    },
    {
      id: 'users',
      name: 'IAM Users & Groups',
      description: 'Manage IAM users, groups, roles, and permissions',
      icon: Users,
      route: '/apps/aws/users',
      status: getServiceStatus('users'),
      count: stats.totalUsers + (stats.totalGroups || 0),
      features: ['User Management', 'Group Policies', 'Role Assignment']
    },
    {
      id: 'organizations',
      name: 'Organizations & OUs',
      description: 'Manage AWS Organizations and Organizational Units',
      icon: Server,
      route: '/apps/aws/organizations',
      status: getServiceStatus('organizations'),
      features: ['Organization Units', 'Service Control Policies', 'Account Management']
    },
    {
      id: 'billing',
      name: 'Billing & Cost Management',
      description: 'Monitor costs, budgets, and optimize spending',
      icon: DollarSign,
      route: '/apps/aws/billing',
      status: getServiceStatus('billing'),
      features: ['Cost Explorer', 'Budget Alerts', 'Usage Reports']
    },
    {
      id: 'security',
      name: 'Security & Compliance',
      description: 'Security posture, compliance monitoring, and policies',
      icon: Shield,
      route: '/apps/aws/security',
      status: getServiceStatus('security'),
      features: ['Security Hub', 'Config Rules', 'CloudTrail']
    },
    {
      id: 'resources',
      name: 'Resource Management',
      description: 'EC2, S3, Lambda, and other AWS resources',
      icon: Database,
      route: '/apps/aws/resources',
      status: getServiceStatus('resources'),
      count: stats.totalResources > 0 ? stats.totalResources : undefined,
      features: ['EC2 Instances', 'S3 Buckets', 'Lambda Functions']
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAWSOverview();
    setRefreshing(false);
  };

  const getServiceStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'setup-required':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'available':
        return <Settings className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getServiceStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Active</span>;
      case 'setup-required':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Setup Required</span>;
      case 'available':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">Available</span>;
      default:
        return null;
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'setup-required':
        return <WifiOff className="h-4 w-4 text-yellow-500" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                ))}
              </div>
              <div className="space-y-8">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-800 dark:from-orange-800 dark:via-red-800 dark:to-orange-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 dark:from-orange-800/30 dark:to-red-800/30"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={() => navigate('/apps')}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200"
                  >
                    <ChevronRight className="h-5 w-5 rotate-180" />
                  </button>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <span className="text-2xl">☁️</span>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold">Amazon Web Services</h1>
                      <p className="text-orange-100 dark:text-orange-200 text-lg">Comprehensive cloud computing platform management</p>
                    </div>
                  </div>
                </div>
                <p className="text-xl text-orange-100 dark:text-orange-200 max-w-3xl">
                  Manage your AWS infrastructure, users, and costs from one centralized dashboard
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  onClick={() => navigate('/credentials')}
                  className="flex items-center px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-200 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Account
                </button>
                <button 
                  onClick={() => window.open('https://console.aws.amazon.com', '_blank')}
                  className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  AWS Console
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 dark:text-orange-200 text-sm">Accounts</p>
                    <p className="text-2xl font-bold">{stats.totalAccounts}</p>
                  </div>
                  <Cloud className="h-8 w-8 text-orange-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 dark:text-orange-200 text-sm">IAM Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 dark:text-orange-200 text-sm">Resources</p>
                    <p className="text-2xl font-bold">{stats.totalResources}</p>
                  </div>
                  <Server className="h-8 w-8 text-orange-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 dark:text-orange-200 text-sm">Monthly Cost</p>
                    <p className="text-2xl font-bold">${stats.monthlyCost}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 dark:text-orange-200 text-sm">Security</p>
                    <p className="text-2xl font-bold">{stats.securityScore}%</p>
                  </div>
                  <Shield className="h-8 w-8 text-orange-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 dark:text-orange-200 text-sm">Last Sync</p>
                    <p className="text-sm font-bold">{stats.lastSync}</p>
                  </div>
                  <Activity className="h-8 w-8 text-orange-200" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Enhanced Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Cloud className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm">
                  <ChevronUp className="h-4 w-4" />
                  <span>Connected</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">AWS Accounts</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalAccounts}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats.totalAccounts > 0 ? 'Multi-account setup' : 'No accounts connected'}
                </p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>Managed</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">IAM Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Across all accounts</p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-yellow-600 dark:text-yellow-400 text-sm">
                  <BarChart3 className="h-4 w-4" />
                  <span>Tracked</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Monthly Cost</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.monthlyCost.toLocaleString()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats.monthlyCost > 0 ? 'Cost optimization available' : 'No billing data'}
                </p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Secure</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Security Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.securityScore}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats.securityScore >= 90 ? 'Excellent security' : stats.securityScore >= 70 ? 'Good security' : 'Needs improvement'}
                </p>
              </div>
            </div>
          </div>

          {/* Connection Status Banner - Only show when no accounts connected */}
          {stats.totalAccounts === 0 && (
            <div className="bg-yellow-50/50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-2">AWS Integration Setup Required</h3>
                <p className="text-yellow-700 dark:text-yellow-300 mb-6 max-w-md mx-auto">
                  Connect your AWS accounts to start managing your cloud infrastructure and get powerful insights.
                </p>
                <button
                  onClick={() => navigate('/credentials')}
                  className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition-colors shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* AWS Services */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AWS Management Areas</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Access different AWS management capabilities</p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {awsServices.length} service{awsServices.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {awsServices.map((service) => {
                  const ServiceIcon = service.icon;
                  return (
                    <div
                      key={service.id}
                      className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:shadow-2xl hover:border-orange-300 dark:hover:border-orange-600 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 group cursor-pointer"
                      onClick={() => navigate(service.route)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                            <ServiceIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                {service.name}
                              </h3>
                              {getServiceStatusIcon(service.status)}
                              {getHealthIcon(service.status)}
                            </div>
                            {service.count !== undefined && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">{service.count} items</p>
                            )}
                          </div>
                        </div>
                        {getServiceStatusBadge(service.status)}
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>

                      {/* Features */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Key Features</h4>
                        <div className="flex flex-wrap gap-1">
                          {service.features.slice(0, 3).map((feature, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        {service.status === 'active' ? (
                          <div className="flex space-x-2 w-full">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(service.route);
                              }}
                              className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
                            >
                              <Settings className="h-4 w-4 mr-1" />
                              Manage
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(service.route);
                              }}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        ) : service.status === 'setup-required' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/credentials');
                            }}
                            className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Setup Now
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(service.route);
                            }}
                            className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Configure
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Getting Started Guide - Only show when no accounts connected */}
          {stats.totalAccounts === 0 && (
            <div className="mt-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Getting Started with AWS</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Follow these steps to connect your AWS infrastructure</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Cloud className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Connect Accounts</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Link your AWS accounts using cross-account roles or access keys</p>
                  </div>
                  
                  <div className="text-center p-6 bg-green-50/50 dark:bg-green-900/20 rounded-xl">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. Manage Users</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Set up IAM user and group management across your accounts</p>
                  </div>
                  
                  <div className="text-center p-6 bg-purple-50/50 dark:bg-purple-900/20 rounded-xl">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. Monitor & Secure</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Enable security monitoring and cost management</p>
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
