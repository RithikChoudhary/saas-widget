import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Shield, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Cloud, 
  Zap,
  CheckCircle,
  AlertTriangle,
  Plus,
  ArrowRight,
  Building2,
  Globe,
  Lock,
  UserCheck,
  RefreshCw,
  Eye,
  TrendingDown,
  AlertCircle,
  Clock,
  Calendar,
  Sparkles,
  ChevronUp,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { api } from '../../shared/utils';
import { Layout } from '../../shared/components';

interface DashboardStats {
  connectedServices: number;
  totalUsers: number;
  activeIntegrations: number;
  monthlyCost: number;
  costSavings: number;
  securityScore: number;
}

interface ConnectedService {
  id: string;
  name: string;
  type: 'aws' | 'azure' | 'office365' | 'github' | 'slack' | 'zoom' | 'google-workspace';
  status: 'connected' | 'warning' | 'error';
  users: number;
  lastSync: string;
  accounts?: number;
  monthlyCost?: number;
}

interface RecentActivity {
  id: string;
  type: 'user_added' | 'service_connected' | 'service_disconnected' | 'cost_alert' | 'security_update' | 'data_sync';
  service: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'success';
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    connectedServices: 0,
    totalUsers: 0,
    activeIntegrations: 0,
    monthlyCost: 0,
    costSavings: 0,
    securityScore: 0
  });
  const [connectedServices, setConnectedServices] = useState<ConnectedService[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      
      // Get user data from token
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          let companyData = null;
          if (payload.companyId && typeof payload.companyId === 'string') {
            try {
              companyData = JSON.parse(payload.companyId);
            } catch (e) {
              const nameMatch = payload.companyId.match(/name:\s*'([^']+)'/);
              if (nameMatch) {
                companyData = { name: nameMatch[1] };
              }
            }
          }
          
          setUser({ 
            name: `${payload.firstName || 'User'} ${payload.lastName || ''}`.trim() || payload.email,
            company: companyData?.name || 'Your Company'
          });
        } catch (e) {
          setUser({ name: 'User', company: 'Your Company' });
        }
      }

      // Fetch real dashboard overview data
      try {
        const overviewResponse = await api.get('/dashboard/overview');
        if (overviewResponse.data.success) {
          const data = overviewResponse.data.data;
          setStats({
            connectedServices: data.connectedServices || 0,
            totalUsers: data.totalUsers || 0,
            activeIntegrations: data.totalAccounts || 0,
            monthlyCost: data.monthlyCost || 0,
            costSavings: data.costSavings || 0,
            securityScore: data.securityScore || 0
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard overview:', error);
        setStats({
          connectedServices: 0,
          totalUsers: 0,
          activeIntegrations: 0,
          monthlyCost: 0,
          costSavings: 0,
          securityScore: 0
        });
      }

      // Fetch real connected services data
      try {
        const servicesResponse = await api.get('/dashboard/connected-services');
        if (servicesResponse.data.success) {
          const services = servicesResponse.data.data;
          setConnectedServices(services.map((service: any) => ({
            id: service.id,
            name: service.name,
            type: service.type,
            status: service.status,
            users: service.users || 0,
            lastSync: service.lastSync ? new Date(service.lastSync).toLocaleString() : 'Never',
            accounts: service.accounts,
            monthlyCost: service.monthlyCost || 0
          })));
        }
      } catch (error) {
        console.error('Error fetching connected services:', error);
        setConnectedServices([]);
      }

      // Fetch real recent activity data
      try {
        const activityResponse = await api.get('/dashboard/recent-activity');
        if (activityResponse.data.success) {
          const activities = activityResponse.data.data;
          setRecentActivity(activities.map((activity: any) => ({
            id: activity.id,
            type: activity.type,
            service: activity.service,
            message: activity.message,
            timestamp: new Date(activity.timestamp).toLocaleString(),
            severity: activity.severity
          })));
        }
      } catch (error) {
        console.error('Error fetching recent activity:', error);
        setRecentActivity([]);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'aws': return '☁️';
      case 'azure': return '🔷';
      case 'office365': return '📧';
      case 'github': return '🐙';
      case 'slack': return '💬';
      case 'zoom': return '📹';
      case 'google-workspace': return '📊';
      default: return '🔧';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'error': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_added': return <UserCheck className="h-4 w-4" />;
      case 'service_connected': return <CheckCircle className="h-4 w-4" />;
      case 'service_disconnected': return <AlertTriangle className="h-4 w-4" />;
      case 'cost_alert': return <DollarSign className="h-4 w-4" />;
      case 'security_update': return <Shield className="h-4 w-4" />;
      case 'data_sync': return <RefreshCw className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'info': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
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
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-800 dark:via-purple-800 dark:to-blue-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-800/30 dark:to-purple-800/30"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Sparkles className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'User'}</h1>
                    <p className="text-blue-100 dark:text-blue-200 text-lg">{user?.company} Dashboard</p>
                  </div>
                </div>
                <p className="text-xl text-blue-100 dark:text-blue-200 max-w-3xl">
                  Monitor and manage all your cloud services from one powerful dashboard
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
                  onClick={() => navigate('/apps')}
                  className="flex items-center px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Connect Service
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 dark:text-blue-200 text-sm">Services</p>
                    <p className="text-2xl font-bold">{stats.connectedServices}</p>
                  </div>
                  <Cloud className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 dark:text-blue-200 text-sm">Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 dark:text-blue-200 text-sm">Monthly Cost</p>
                    <p className="text-2xl font-bold">${stats.monthlyCost.toFixed(0)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 dark:text-blue-200 text-sm">Security</p>
                    <p className="text-2xl font-bold">{stats.securityScore}%</p>
                  </div>
                  <Shield className="h-8 w-8 text-blue-200" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Key Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Cloud className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                  <ChevronUp className="h-4 w-4" />
                  <span>+2</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Connected Services</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.connectedServices}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active integrations</p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                  <ChevronUp className="h-4 w-4" />
                  <span>+12</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Across all services</p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Active</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Active Integrations</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeIntegrations}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All systems operational</p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
                  <ChevronUp className="h-4 w-4" />
                  <span>+15%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Monthly Cost</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.monthlyCost.toFixed(0)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">From last month</p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>Saved</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Cost Savings</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.costSavings}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This quarter</p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Excellent</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Security Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.securityScore}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Security rating</p>
              </div>
            </div>
          </div>

          {/* Connected Services and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Connected Services */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Cloud className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Connected Services</h3>
                  </div>
                  <button
                    onClick={() => navigate('/apps')}
                    className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {connectedServices.length > 0 ? (
                    connectedServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-200">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{getServiceIcon(service.type)}</div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">{service.name}</h4>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(service.status)}`}>
                                {service.status}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                              <span>{service.users} users</span>
                              {service.accounts && <span>• {service.accounts} accounts</span>}
                              {service.monthlyCost && service.monthlyCost > 0 && <span>• ${service.monthlyCost}/mo</span>}
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              Last sync: {formatTimestamp(service.lastSync)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => navigate(`/apps/${service.type}`)}
                            className="flex items-center px-3 py-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                          <button 
                            onClick={() => navigate(`/apps/${service.type}`)}
                            className="flex items-center px-3 py-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 text-sm transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No services connected</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">Connect your first service to get started</p>
                      <button
                        onClick={() => navigate('/apps')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Connect Service
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                  </div>
                  <button
                    onClick={() => navigate('/activity')}
                    className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-200">
                        <div className={`flex-shrink-0 mt-1 ${getActivityColor(activity.severity)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.message}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              activity.severity === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                              activity.severity === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                            }`}>
                              {activity.severity}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTimestamp(activity.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
                            {activity.service.replace('-', ' ')} • {activity.type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No recent activity</h3>
                      <p className="text-gray-500 dark:text-gray-400">Activity will appear here as you use the platform</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quick Actions</h3>
              <p className="text-gray-600 dark:text-gray-400">Get started with these common tasks</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => navigate('/apps')}
                className="group flex flex-col items-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Add Integration</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Connect AWS, Azure, Office 365, and more</p>
              </button>

              <button
                onClick={() => navigate('/users')}
                className="group flex flex-col items-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Manage Users</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Add team members and assign roles</p>
              </button>

              <button
                onClick={() => navigate('/analytics')}
                className="group flex flex-col items-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">View Analytics</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Security, compliance, and cost reports</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
