import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Settings, 
  Users, 
  DollarSign, 
  Activity,
  Cloud,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Eye,
  ExternalLink,
  ArrowRight,
  BarChart3,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Star,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Layout, AppIcon } from '../../shared/components';
import { api } from '../../shared/utils';

interface DashboardStats {
  connectedServices: number;
  totalUsers: number;
  totalMonthlyCost: number;
  totalAccounts: number;
  costSavings: number;
  securityScore: number;
  activeIntegrations: number;
}

interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  status: 'connected' | 'available' | 'coming-soon';
  accounts: number;
  users: number;
  monthlyCost: number;
  lastSync: string | null;
  health: string;
  features: string[];
  route: string;
  details: any[];
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  services: Service[];
}

const AppsOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [stats, setStats] = useState<DashboardStats>({
    connectedServices: 0,
    totalUsers: 0,
    totalMonthlyCost: 0,
    totalAccounts: 0,
    costSavings: 0,
    securityScore: 0,
    activeIntegrations: 0
  });
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAppsData();
  }, [navigate]);

  const fetchAppsData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      
      console.log('🔄 Apps Overview: Fetching data from backend...');
      
      const response = await api.get('/apps/dashboard');
      console.log('📊 Apps dashboard response:', response.data);

      if (response.data.success) {
        setStats(response.data.data.stats);
        setServices(response.data.data.services);
        setCategories(response.data.data.categories);
        console.log('✅ Apps data updated successfully');
      } else {
        console.error('❌ Failed to fetch apps data:', response.data.message);
      }
    } catch (error) {
      console.error('❌ Error fetching apps data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchAppsData(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'available':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'coming-soon':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Connected</span>;
      case 'available':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">Available</span>;
      case 'coming-soon':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Coming Soon</span>;
      default:
        return null;
    }
  };

  const getHealthIcon = (health: string, status: string) => {
    if (status !== 'connected') return null;
    
    switch (health) {
      case 'healthy':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <Wifi className="h-4 w-4 text-green-500" />;
    }
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    services: category.services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || category.id === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || service.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
  })).filter(category => category.services.length > 0);

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
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
                {[...Array(3)].map((_, i) => (
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
                    <h1 className="text-4xl font-bold">Apps & Services</h1>
                    <p className="text-blue-100 dark:text-blue-200 text-lg">Manage your organization's SaaS ecosystem</p>
                  </div>
                </div>
                <p className="text-xl text-blue-100 dark:text-blue-200 max-w-3xl">
                  Connect, monitor, and optimize all your cloud services from one powerful dashboard
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
                  onClick={() => {
                    const firstAvailableService = services.find(s => s.status === 'available');
                    if (firstAvailableService) {
                      navigate(firstAvailableService.route);
                    }
                  }}
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
                    <p className="text-blue-100 dark:text-blue-200 text-sm">Connected</p>
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
                    <p className="text-2xl font-bold">${stats.totalMonthlyCost}</p>
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
          {/* Enhanced Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                  <ChevronUp className="h-4 w-4" />
                  <span>Active</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Connected Services</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.connectedServices}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats.connectedServices > 0 ? 'All systems operational' : 'No services connected'}
                </p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>Growing</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Across all platforms</p>
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
                <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.totalMonthlyCost.toLocaleString()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats.costSavings > 0 ? `$${stats.costSavings} potential savings` : 'Cost optimization available'}
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

          {/* Filters */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="connected">Connected</option>
                  <option value="available">Available</option>
                  <option value="coming-soon">Coming Soon</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                Showing {filteredCategories.reduce((sum, cat) => sum + cat.services.length, 0)} of {services.length} services
              </span>
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Service Categories */}
          <div className="space-y-8">
            {filteredCategories.map((category) => (
              <div key={category.id} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{category.name}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {category.services.length} service{category.services.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {category.services.map((service) => (
                      <div key={service.id} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-600 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                              <AppIcon appType={service.id} size="lg" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {service.name}
                                </h3>
                                {getStatusIcon(service.status)}
                                {getHealthIcon(service.health, service.status)}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{service.description}</p>
                            </div>
                          </div>
                          {getStatusBadge(service.status)}
                        </div>

                        {/* Service Stats - Only show if connected and has data */}
                        {service.status === 'connected' && (service.accounts || service.users || service.monthlyCost) && (
                          <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
                            <div className="text-center">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{service.accounts}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Accounts</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{service.users}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Users</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {service.monthlyCost > 0 ? `$${service.monthlyCost}` : 'Free'}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Monthly</p>
                            </div>
                          </div>
                        )}

                        {/* Last Sync Info */}
                        {service.status === 'connected' && (
                          <div className="mb-4 p-2 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                              Last sync: {formatTimestamp(service.lastSync)}
                            </p>
                          </div>
                        )}

                        {/* Features */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Key Features</h4>
                          <div className="flex flex-wrap gap-1">
                            {service.features.slice(0, 3).map((feature, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                {feature}
                              </span>
                            ))}
                            {service.features.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
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
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                              >
                                <Settings className="h-4 w-4 mr-1" />
                                Manage
                              </button>
                              <button 
                                onClick={() => navigate(service.route)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </>
                          ) : service.status === 'available' ? (
                            <button
                              onClick={() => navigate(service.route)}
                              className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Connect Now
                              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                          ) : (
                            <button
                              disabled
                              className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-400 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
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
            ))}
          </div>

          {/* No Services Found */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No services found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Empty State for No Connected Services */}
          {stats.connectedServices === 0 && filteredCategories.length > 0 && (
            <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Cloud className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">Ready to get started?</h3>
                <p className="text-blue-700 dark:text-blue-300 mb-6 max-w-md mx-auto">
                  Connect your first service to start managing your organization's SaaS applications and cloud infrastructure.
                </p>
                <button
                  onClick={() => {
                    const firstAvailableService = services.find(s => s.status === 'available');
                    if (firstAvailableService) {
                      navigate(firstAvailableService.route);
                    }
                  }}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Connect Your First Service
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AppsOverview;
