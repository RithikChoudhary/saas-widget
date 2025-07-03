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
  Activity,
  Database,
  BarChart3,
  TrendingUp,
  ChevronUp,
  Eye,
  Zap,
  AlertTriangle,
  ExternalLink,
  ArrowRight,
  Wifi,
  WifiOff,
  Monitor,
  PieChart,
  Clock,
  Target,
  Layers,
  GitBranch
} from 'lucide-react';
import { Layout } from '../../../../../shared/components';
import api from '../../../../../shared/utils/api';

interface DatadogStats {
  connections: number;
  activeConnections: number;
  users: {
    totalUsers: number;
    activeUsers: number;
    disabledUsers: number;
    verifiedUsers: number;
    matchedUsers: number;
    unmatchedUsers: number;
    correlationRate: string;
  };
  teams: {
    totalTeams: number;
    matchedTeams: number;
    unmatchedTeams: number;
    totalMembers: number;
    totalDashboards: number;
    totalMonitors: number;
    correlationRate: string;
  };
  lastSync: number | null;
}

interface DatadogService {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  status: 'active' | 'setup-required' | 'available';
  count?: number;
  features: string[];
}

const DatadogOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DatadogStats>({
    connections: 0,
    activeConnections: 0,
    users: {
      totalUsers: 0,
      activeUsers: 0,
      disabledUsers: 0,
      verifiedUsers: 0,
      matchedUsers: 0,
      unmatchedUsers: 0,
      correlationRate: '0'
    },
    teams: {
      totalTeams: 0,
      matchedTeams: 0,
      unmatchedTeams: 0,
      totalMembers: 0,
      totalDashboards: 0,
      totalMonitors: 0,
      correlationRate: '0'
    },
    lastSync: null
  });
  const navigate = useNavigate();

  const getServiceStatus = (serviceId: string): 'active' | 'setup-required' | 'available' => {
    if (stats.connections === 0) {
      return 'setup-required';
    }
    
    switch (serviceId) {
      case 'connections':
        return 'active';
      case 'users':
        return stats.users.totalUsers > 0 ? 'active' : 'available';
      case 'teams':
        return stats.teams.totalTeams > 0 ? 'active' : 'available';
      case 'analytics':
        return stats.teams.totalDashboards > 0 || stats.teams.totalMonitors > 0 ? 'active' : 'available';
      default:
        return 'available';
    }
  };

  const datadogServices: DatadogService[] = [
    {
      id: 'connections',
      name: 'Organization Connections',
      description: 'Manage Datadog organization connections and API authentication',
      icon: Building,
      route: '/apps/datadog/settings',
      status: getServiceStatus('connections'),
      count: stats.connections,
      features: ['API Keys', 'Organization Setup', 'Site Configuration']
    },
    {
      id: 'users',
      name: 'Users & Members',
      description: 'Manage organization members, roles, and access permissions',
      icon: Users,
      route: '/apps/datadog/users',
      status: getServiceStatus('users'),
      count: stats.users.totalUsers,
      features: ['User Management', 'Role Assignment', 'Access Control']
    },
    {
      id: 'teams',
      name: 'Teams & Collaboration',
      description: 'Manage teams, permissions, and collaborative workflows',
      icon: Shield,
      route: '/apps/datadog/teams',
      status: getServiceStatus('teams'),
      count: stats.teams.totalTeams,
      features: ['Team Management', 'Permissions', 'Collaboration']
    },
    {
      id: 'analytics',
      name: 'Analytics & Insights',
      description: 'Monitor usage analytics, dashboards, and performance metrics',
      icon: BarChart3,
      route: '/apps/datadog/analytics',
      status: getServiceStatus('analytics'),
      count: stats.teams.totalDashboards + stats.teams.totalMonitors,
      features: ['Usage Analytics', 'Cost Optimization', 'Performance Insights']
    }
  ];

  useEffect(() => {
    fetchDatadogData();
  }, []);

  const fetchDatadogData = async () => {
    try {
      const response = await api.get('/integrations/datadog/overview');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching Datadog data:', error);
      // Show empty state on error
      setStats({
        connections: 0,
        activeConnections: 0,
        users: {
          totalUsers: 0,
          activeUsers: 0,
          disabledUsers: 0,
          verifiedUsers: 0,
          matchedUsers: 0,
          unmatchedUsers: 0,
          correlationRate: '0'
        },
        teams: {
          totalTeams: 0,
          matchedTeams: 0,
          unmatchedTeams: 0,
          totalMembers: 0,
          totalDashboards: 0,
          totalMonitors: 0,
          correlationRate: '0'
        },
        lastSync: null
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDatadogData();
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

  const formatLastSync = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
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
        <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 dark:from-purple-900 dark:via-indigo-900 dark:to-purple-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 dark:from-purple-900/30 dark:to-indigo-900/30"></div>
          
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
                      <span className="text-2xl">🐕</span>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold">Datadog</h1>
                      <p className="text-gray-100 dark:text-gray-200 text-lg">Modern monitoring and analytics platform</p>
                    </div>
                  </div>
                </div>
                <p className="text-xl text-gray-100 dark:text-gray-200 max-w-3xl">
                  Manage your Datadog organizations, users, teams, and monitoring infrastructure
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
                  onClick={() => window.open('https://app.datadoghq.com', '_blank')}
                  className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Datadog App
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 dark:text-gray-200 text-sm">Organizations</p>
                    <p className="text-2xl font-bold">{stats.connections}</p>
                  </div>
                  <Building className="h-8 w-8 text-gray-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 dark:text-gray-200 text-sm">Users</p>
                    <p className="text-2xl font-bold">{stats.users.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-gray-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 dark:text-gray-200 text-sm">Teams</p>
                    <p className="text-2xl font-bold">{stats.teams.totalTeams}</p>
                  </div>
                  <Shield className="h-8 w-8 text-gray-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 dark:text-gray-200 text-sm">Dashboards</p>
                    <p className="text-2xl font-bold">{stats.teams.totalDashboards}</p>
                  </div>
                  <Monitor className="h-8 w-8 text-gray-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 dark:text-gray-200 text-sm">Monitors</p>
                    <p className="text-2xl font-bold">{stats.teams.totalMonitors}</p>
                  </div>
                  <Target className="h-8 w-8 text-gray-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 dark:text-gray-200 text-sm">Correlation</p>
                    <p className="text-2xl font-bold">{stats.users.correlationRate}%</p>
                  </div>
                  <GitBranch className="h-8 w-8 text-gray-200" />
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
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <ChevronUp className="h-4 w-4" />
                  <span>Connected</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Organizations</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.connections}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats.activeConnections} active connections
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
                  <span>Users</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.users.totalUsers}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats.users.activeUsers} active, {stats.users.verifiedUsers} verified
                </p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>Teams</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Teams</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.teams.totalTeams}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats.teams.totalMembers} total members
                </p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-orange-600 dark:text-orange-400 text-sm">
                  <Activity className="h-4 w-4" />
                  <span>Monitoring</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Dashboards & Monitors</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.teams.totalDashboards + stats.teams.totalMonitors}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats.teams.totalDashboards} dashboards, {stats.teams.totalMonitors} monitors
                </p>
              </div>
            </div>
          </div>

          {/* Connection Status Banner - Only show when no organizations connected */}
          {stats.connections === 0 && (
            <div className="bg-purple-50/50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-2">Datadog Integration Setup Required</h3>
                <p className="text-purple-700 dark:text-purple-300 mb-6 max-w-md mx-auto">
                  Connect your Datadog organizations to start monitoring infrastructure, applications, and logs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/credentials')}
                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Setup Datadog Connection
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                  <button 
                    onClick={() => window.open('https://docs.datadoghq.com/account_management/api-app-keys/', '_blank')}
                    className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors shadow-lg"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Get API Keys
                  </button>
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-4">
                  All connections are managed through the centralized credentials page
                </p>
              </div>
            </div>
          )}

          {/* Datadog Services */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Datadog Management Areas</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Access different Datadog management capabilities</p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {datadogServices.length} service{datadogServices.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {datadogServices.map((service) => {
                  const ServiceIcon = service.icon;
                  return (
                    <div
                      key={service.id}
                      className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-600 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 group cursor-pointer"
                      onClick={() => navigate(service.route)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
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
                              className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
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
                            className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Setup Connection
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
          {stats.connections === 0 && (
            <div className="mt-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Getting Started with Datadog</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Follow these steps to connect your monitoring infrastructure</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-purple-50/50 dark:bg-purple-900/20 rounded-xl">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Building className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Connect Organization</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Link your Datadog organization using API keys</p>
                  </div>
                  
                  <div className="text-center p-6 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. Sync Users & Teams</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Import and organize your monitoring teams and members</p>
                  </div>
                  
                  <div className="text-center p-6 bg-green-50/50 dark:bg-green-900/20 rounded-xl">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. Monitor Analytics</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Track usage analytics and optimize monitoring costs</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Last Sync Information */}
          {stats.lastSync && (
            <div className="mt-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Last synchronized: {formatLastSync(stats.lastSync)}
                  </span>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  {refreshing ? 'Syncing...' : 'Sync Now'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DatadogOverview;
