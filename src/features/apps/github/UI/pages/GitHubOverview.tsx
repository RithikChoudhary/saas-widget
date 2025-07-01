import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight,
  Users, 
  Shield, 
  Building, 
  RefreshCw, 
  Plus, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Lock,
  Unlock,
  Mail,
  FolderTree,
  UserCheck,
  UserX,
  ShieldCheck,
  ShieldOff,
  Activity,
  Database,
  Cloud,
  Key,
  Link,
  Unlink,
  Info,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  Wifi,
  WifiOff,
  ExternalLink,
  ArrowRight,
  ChevronUp,
  Eye,
  Zap,
  AlertTriangle,
  GitBranch,
  Package,
  Star,
  Code,
  GitCommit
} from 'lucide-react';
import { Layout } from '../../../../../shared/components';
import api from '../../../../../shared/utils/api';

interface GitHubStats {
  totalOrganizations: number;
  totalUsers: number;
  totalRepositories: number;
  totalTeams: number;
  totalPackages: number;
  privateRepos: number;
  publicRepos: number;
  lastSync: string;
  securityScore: number;
}

interface GitHubService {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  status: 'active' | 'setup-required' | 'available';
  count?: number;
  features: string[];
}

const GitHubOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<GitHubStats>({
    totalOrganizations: 0,
    totalUsers: 0,
    totalRepositories: 0,
    totalTeams: 0,
    totalPackages: 0,
    privateRepos: 0,
    publicRepos: 0,
    lastSync: 'Not connected',
    securityScore: 0
  });
  const navigate = useNavigate();

  const getServiceStatus = (serviceId: string): 'active' | 'setup-required' | 'available' => {
    if (stats.totalOrganizations === 0) {
      return 'setup-required';
    }
    
    switch (serviceId) {
      case 'connections':
        return 'active';
      case 'users':
        return stats.totalUsers > 0 ? 'active' : 'available';
      case 'repositories':
        return stats.totalRepositories > 0 ? 'active' : 'available';
      case 'teams':
        return stats.totalTeams > 0 ? 'active' : 'available';
      case 'packages':
        return stats.totalPackages > 0 ? 'active' : 'available';
      case 'security':
        return stats.securityScore > 0 ? 'active' : 'available';
      default:
        return 'available';
    }
  };

  const githubServices: GitHubService[] = [
    {
      id: 'connections',
      name: 'Organization Connections',
      description: 'Manage GitHub organization connections and authentication',
      icon: Building,
      route: '/apps/github/connections',
      status: getServiceStatus('connections'),
      count: stats.totalOrganizations,
      features: ['OAuth Apps', 'GitHub Apps', 'Personal Tokens']
    },
    {
      id: 'users',
      name: 'Users & Members',
      description: 'Manage organization members, roles, and permissions',
      icon: Users,
      route: '/apps/github/users',
      status: getServiceStatus('users'),
      count: stats.totalUsers,
      features: ['Member Management', 'Role Assignment', 'Access Control']
    },
    {
      id: 'repositories',
      name: 'Repositories',
      description: 'Manage repositories, branches, and code organization',
      icon: Database,
      route: '/apps/github/repositories',
      status: getServiceStatus('repositories'),
      count: stats.totalRepositories,
      features: ['Repo Management', 'Branch Protection', 'Code Analysis']
    },
    {
      id: 'teams',
      name: 'Teams & Collaboration',
      description: 'Manage teams, permissions, and collaborative workflows',
      icon: FolderTree,
      route: '/apps/github/teams',
      status: getServiceStatus('teams'),
      count: stats.totalTeams,
      features: ['Team Management', 'Permissions', 'Code Reviews']
    },
    {
      id: 'packages',
      name: 'Packages & Artifacts',
      description: 'Manage GitHub Packages and container registries',
      icon: Package,
      route: '/apps/github/packages',
      status: getServiceStatus('packages'),
      count: stats.totalPackages,
      features: ['Package Registry', 'Container Images', 'Artifacts']
    },
    {
      id: 'security',
      name: 'Security & Compliance',
      description: 'Monitor security alerts, vulnerabilities, and compliance',
      icon: Shield,
      route: '/apps/github/security',
      status: getServiceStatus('security'),
      features: ['Security Alerts', 'Dependency Scanning', 'Code Scanning']
    }
  ];

  useEffect(() => {
    fetchGitHubData();
  }, []);

  const fetchGitHubData = async () => {
    try {
      // Use the same endpoint as the main apps dashboard to get GitHub data
      const response = await api.get('/apps/dashboard');
      const dashboardData = response.data.data;
      
      // Find GitHub service data from the dashboard response
      const githubService = dashboardData.services.find((service: any) => service.id === 'github');
      
      if (githubService && githubService.status === 'connected') {
        // GitHub is connected, use real data
        setStats({
          totalOrganizations: githubService.accounts || 0,
          totalUsers: githubService.users || 0,
          totalRepositories: 0, // Will be populated when we have repo data
          totalTeams: 0, // Will be populated when we have team data
          totalPackages: 0, // Will be populated when we have package data
          privateRepos: 0,
          publicRepos: 0,
          lastSync: githubService.lastSync || 'Recently synced',
          securityScore: 0 // Will be calculated based on security metrics
        });
      } else {
        // GitHub is not connected
        setStats({
          totalOrganizations: 0,
          totalUsers: 0,
          totalRepositories: 0,
          totalTeams: 0,
          totalPackages: 0,
          privateRepos: 0,
          publicRepos: 0,
          lastSync: 'Not connected',
          securityScore: 0
        });
      }
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      // Show empty state on error
      setStats({
        totalOrganizations: 0,
        totalUsers: 0,
        totalRepositories: 0,
        totalTeams: 0,
        totalPackages: 0,
        privateRepos: 0,
        publicRepos: 0,
        lastSync: 'Not connected',
        securityScore: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchGitHubData();
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
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black dark:from-gray-900 dark:via-black dark:to-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/20 to-black/20 dark:from-gray-900/30 dark:to-black/30"></div>
          
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
                      <span className="text-2xl">🐙</span>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold">GitHub</h1>
                      <p className="text-gray-100 dark:text-gray-200 text-lg">World's leading software development platform</p>
                    </div>
                  </div>
                </div>
                <p className="text-xl text-gray-100 dark:text-gray-200 max-w-3xl">
                  Manage your GitHub organizations, repositories, teams, and development workflows
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
                  className="flex items-center px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Connect Organization
                </button>
                <button 
                  onClick={() => window.open('https://github.com', '_blank')}
                  className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  GitHub.com
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 dark:text-gray-200 text-sm">Organizations</p>
                    <p className="text-2xl font-bold">{stats.totalOrganizations}</p>
                  </div>
                  <Building className="h-8 w-8 text-gray-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 dark:text-gray-200 text-sm">Members</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-gray-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 dark:text-gray-200 text-sm">Repositories</p>
                    <p className="text-2xl font-bold">{stats.totalRepositories}</p>
                  </div>
                  <Database className="h-8 w-8 text-gray-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 dark:text-gray-200 text-sm">Teams</p>
                    <p className="text-2xl font-bold">{stats.totalTeams}</p>
                  </div>
                  <FolderTree className="h-8 w-8 text-gray-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 dark:text-gray-200 text-sm">Packages</p>
                    <p className="text-2xl font-bold">{stats.totalPackages}</p>
                  </div>
                  <Package className="h-8 w-8 text-gray-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 dark:text-gray-200 text-sm">Security</p>
                    <p className="text-2xl font-bold">{stats.securityScore}%</p>
                  </div>
                  <Shield className="h-8 w-8 text-gray-200" />
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
                <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <ChevronUp className="h-4 w-4" />
                  <span>Connected</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Organizations</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalOrganizations}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats.totalOrganizations > 0 ? 'GitHub integrated' : 'No organizations connected'}
                </p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>Repositories</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Repositories</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalRepositories.toLocaleString()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats.privateRepos} private, {stats.publicRepos} public
                </p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm">
                  <BarChart3 className="h-4 w-4" />
                  <span>Members</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Organization Members</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Across {stats.totalTeams} teams
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

          {/* Connection Status Banner - Only show when no organizations connected */}
          {stats.totalOrganizations === 0 && (
            <div className="bg-yellow-50/50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-2">GitHub Integration Setup Required</h3>
                <p className="text-yellow-700 dark:text-yellow-300 mb-6 max-w-md mx-auto">
                  Connect your GitHub organizations to start managing repositories, teams, and development workflows.
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

          {/* GitHub Services */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">GitHub Management Areas</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Access different GitHub management capabilities</p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {githubServices.length} service{githubServices.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {githubServices.map((service) => {
                  const ServiceIcon = service.icon;
                  return (
                    <div
                      key={service.id}
                      className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-600 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 group cursor-pointer"
                      onClick={() => navigate(service.route)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center">
                            <ServiceIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                                {service.name}
                              </h3>
                              {getServiceStatusIcon(service.status)}
                              {getHealthIcon(service.status)}
                            </div>
                            {service.count !== undefined && service.count > 0 && (
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
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
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
                              className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-black transition-colors"
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
                            className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-gray-800 to-black hover:from-black hover:to-gray-900 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
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
                            className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
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

          {/* Getting Started Guide - Only show when no organizations connected */}
          {stats.totalOrganizations === 0 && (
            <div className="mt-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Getting Started with GitHub</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Follow these steps to connect your development workflow</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Building className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Connect Organization</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Link your GitHub organization using OAuth or GitHub App</p>
                  </div>
                  
                  <div className="text-center p-6 bg-green-50/50 dark:bg-green-900/20 rounded-xl">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. Manage Teams</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Import and organize your development teams and members</p>
                  </div>
                  
                  <div className="text-center p-6 bg-purple-50/50 dark:bg-purple-900/20 rounded-xl">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. Monitor Security</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Track security alerts and code vulnerabilities</p>
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

export default GitHubOverview;
