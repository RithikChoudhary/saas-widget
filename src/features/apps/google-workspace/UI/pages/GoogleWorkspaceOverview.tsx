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
  AlertTriangle
} from 'lucide-react';
import { Layout } from '../../../../../shared/components';
import api from '../../../../../shared/utils/api';

interface Connection {
  id: string;
  domain: string;
  customerID: string;
  organizationName: string;
  connectionType: 'oauth' | 'service_account';
  scope: string[];
  isActive: boolean;
  lastSync?: string;
  createdAt: string;
  serviceAccountEmail?: string;
  adminEmail?: string;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  archivedUsers: number;
  adminUsers: number;
  superAdminUsers: number;
  users2svEnrolled: number;
  users2svEnforced: number;
  totalGroups: number;
  totalOrgUnits: number;
  totalSharedDrives: number;
  totalStorageUsed: number;
  totalStorageQuota: number;
}

interface GoogleWorkspaceService {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  status: 'active' | 'setup-required' | 'available';
  count?: number;
  features: string[];
}

const GoogleWorkspaceOverview: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const getServiceStatus = (serviceId: string): 'active' | 'setup-required' | 'available' => {
    if (connections.length === 0) {
      return 'setup-required';
    }
    
    switch (serviceId) {
      case 'connections':
        return 'active';
      case 'users':
        return stats && stats.totalUsers > 0 ? 'active' : 'available';
      case 'groups':
        return stats && stats.totalGroups > 0 ? 'active' : 'available';
      case 'security':
        return stats && stats.users2svEnrolled > 0 ? 'active' : 'available';
      case 'storage':
        return stats && stats.totalStorageUsed > 0 ? 'active' : 'available';
      case 'admin':
        return stats && stats.adminUsers > 0 ? 'active' : 'available';
      default:
        return 'available';
    }
  };

  const googleWorkspaceServices: GoogleWorkspaceService[] = [
    {
      id: 'connections',
      name: 'Domain Connections',
      description: 'Manage Google Workspace domain connections and authentication',
      icon: Cloud,
      route: '/apps/google-workspace/connections',
      status: getServiceStatus('connections'),
      count: connections.length,
      features: ['OAuth Integration', 'Service Accounts', 'Multi-Domain']
    },
    {
      id: 'users',
      name: 'User Management',
      description: 'Manage workspace users, roles, and permissions',
      icon: Users,
      route: '/apps/google-workspace/users',
      status: getServiceStatus('users'),
      count: stats?.totalUsers || 0,
      features: ['User Directory', 'Role Assignment', 'License Management']
    },
    {
      id: 'groups',
      name: 'Groups & Organization',
      description: 'Manage groups, organizational units, and structure',
      icon: FolderTree,
      route: '/apps/google-workspace/groups',
      status: getServiceStatus('groups'),
      count: stats?.totalGroups || 0,
      features: ['Group Management', 'Org Units', 'Permissions']
    },
    {
      id: 'security',
      name: 'Security & Compliance',
      description: 'Monitor security settings, 2FA, and compliance',
      icon: Shield,
      route: '/apps/google-workspace/security',
      status: getServiceStatus('security'),
      features: ['2FA Monitoring', 'Admin Oversight', 'Security Policies']
    },
    {
      id: 'storage',
      name: 'Storage & Drive',
      description: 'Monitor Drive usage, shared drives, and storage quotas',
      icon: Database,
      route: '/apps/google-workspace/storage',
      status: getServiceStatus('storage'),
      features: ['Drive Analytics', 'Shared Drives', 'Storage Quotas']
    },
    {
      id: 'admin',
      name: 'Admin Console',
      description: 'Advanced administration and configuration settings',
      icon: Settings,
      route: '/apps/google-workspace/admin',
      status: getServiceStatus('admin'),
      features: ['Admin Settings', 'Policies', 'Audit Logs']
    }
  ];

  useEffect(() => {
    fetchData();
    
    // Check for OAuth callback success/error
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const domain = urlParams.get('domain');
    
    if (success === 'true' && domain) {
      alert(`Google Workspace connected successfully for domain: ${domain}`);
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchData();
    } else if (error) {
      alert(`Google Workspace connection failed: ${error}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch connections
      const connectionsResponse = await api.get('/integrations/google-workspace/connections');
      setConnections(connectionsResponse.data.connections || []);

      // Fetch analytics if we have connections
      if (connectionsResponse.data.connections?.length > 0) {
        try {
          const analyticsResponse = await api.get('/integrations/google-workspace/analytics');
          const analytics = analyticsResponse.data.analytics;
          
          setStats({
            totalUsers: analytics.users.total || 0,
            activeUsers: analytics.users.active || 0,
            suspendedUsers: analytics.users.suspended || 0,
            archivedUsers: 0,
            adminUsers: analytics.users.admins || 0,
            superAdminUsers: 0,
            users2svEnrolled: 0,
            users2svEnforced: 0,
            totalGroups: analytics.groups.total || 0,
            totalOrgUnits: analytics.orgUnits.total || 0,
            totalSharedDrives: 0,
            totalStorageUsed: 0,
            totalStorageQuota: 0
          });
        } catch (analyticsError) {
          console.error('Error fetching analytics:', analyticsError);
          setStats({
            totalUsers: 0,
            activeUsers: 0,
            suspendedUsers: 0,
            archivedUsers: 0,
            adminUsers: 0,
            superAdminUsers: 0,
            users2svEnrolled: 0,
            users2svEnforced: 0,
            totalGroups: 0,
            totalOrgUnits: 0,
            totalSharedDrives: 0,
            totalStorageUsed: 0,
            totalStorageQuota: 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching Google Workspace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setConnecting(true);
      const companyId = localStorage.getItem('companyId') || '1';
      const response = await api.post('/integrations/google-workspace/oauth/initiate', { companyId });
      
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error('Error initiating Google Workspace connection:', error);
      alert('Failed to initiate Google Workspace connection');
    } finally {
      setConnecting(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleSync = async (connectionId: string) => {
    try {
      setSyncing(true);
      const companyId = localStorage.getItem('companyId') || '1';
      await api.post('/integrations/google-workspace/sync/all', { 
        connectionId: connectionId,
        companyId 
      });
      fetchData();
      alert('Sync completed successfully!');
    } catch (error) {
      console.error('Error syncing:', error);
      alert('Sync failed');
    } finally {
      setSyncing(false);
    }
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
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 dark:from-blue-800 dark:via-indigo-800 dark:to-blue-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 dark:from-blue-800/30 dark:to-indigo-800/30"></div>
          
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
                      <span className="text-2xl">📊</span>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold">Google Workspace</h1>
                      <p className="text-blue-100 dark:text-blue-200 text-lg">Comprehensive productivity suite management</p>
                    </div>
                  </div>
                </div>
                <p className="text-xl text-blue-100 dark:text-blue-200 max-w-3xl">
                  Manage your organization's Google Workspace users, groups, and security settings
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
                {connections.length === 0 ? (
                  <button
                    onClick={() => navigate('/credentials')}
                    className="flex items-center px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Connect Domain
                  </button>
                ) : (
                  <button
                    onClick={() => connections[0] && handleSync(connections[0].id)}
                    disabled={syncing}
                    className="flex items-center px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg disabled:opacity-50"
                  >
                    <RefreshCw className={`h-5 w-5 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Syncing...' : 'Sync Data'}
                  </button>
                )}
                <button 
                  onClick={() => window.open('https://admin.google.com', '_blank')}
                  className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Admin Console
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 dark:text-blue-200 text-sm">Domains</p>
                    <p className="text-2xl font-bold">{connections.length}</p>
                  </div>
                  <Building className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 dark:text-blue-200 text-sm">Users</p>
                    <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 dark:text-blue-200 text-sm">Groups</p>
                    <p className="text-2xl font-bold">{stats?.totalGroups || 0}</p>
                  </div>
                  <FolderTree className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 dark:text-blue-200 text-sm">Admins</p>
                    <p className="text-2xl font-bold">{stats?.adminUsers || 0}</p>
                  </div>
                  <Shield className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 dark:text-blue-200 text-sm">2FA Users</p>
                    <p className="text-2xl font-bold">{stats?.users2svEnrolled || 0}</p>
                  </div>
                  <ShieldCheck className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 dark:text-blue-200 text-sm">Active</p>
                    <p className="text-2xl font-bold">{stats?.activeUsers || 0}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-200" />
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
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm">
                  <ChevronUp className="h-4 w-4" />
                  <span>Connected</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Connected Domains</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{connections.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {connections.length > 0 ? 'Workspace integrated' : 'No domains connected'}
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{(stats?.totalUsers || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats?.activeUsers || 0} active users
                </p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm">
                  <BarChart3 className="h-4 w-4" />
                  <span>Secured</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Admin Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.adminUsers || 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats?.totalUsers ? Math.round(((stats?.adminUsers || 0) / stats.totalUsers) * 100) : 0}% of total users
                </p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Protected</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">2FA Coverage</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalUsers ? Math.round(((stats?.users2svEnrolled || 0) / stats.totalUsers) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats?.users2svEnrolled || 0} users with 2FA
                </p>
              </div>
            </div>
          </div>

          {/* Connection Status Banner - Only show when no domains connected */}
          {connections.length === 0 && (
            <div className="bg-yellow-50/50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Google Workspace Integration Setup Required</h3>
                <p className="text-yellow-700 dark:text-yellow-300 mb-6 max-w-md mx-auto">
                  Connect your Google Workspace domain to start managing users and discovering insights.
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

          {/* Google Workspace Services */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Workspace Management Areas</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Access different Google Workspace management capabilities</p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {googleWorkspaceServices.length} service{googleWorkspaceServices.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {googleWorkspaceServices.map((service) => {
                  const ServiceIcon = service.icon;
                  return (
                    <div
                      key={service.id}
                      className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-600 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 group cursor-pointer"
                      onClick={() => navigate(service.route)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <ServiceIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
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
                              className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
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
                            className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
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

          {/* Getting Started Guide - Only show when no domains connected */}
          {connections.length === 0 && (
            <div className="mt-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Getting Started with Google Workspace</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Follow these steps to connect your workspace</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Cloud className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Connect Domain</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Link your Google Workspace domain using OAuth or service account</p>
                  </div>
                  
                  <div className="text-center p-6 bg-green-50/50 dark:bg-green-900/20 rounded-xl">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. Sync Users</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Import and manage your workspace users and groups</p>
                  </div>
                  
                  <div className="text-center p-6 bg-purple-50/50 dark:bg-purple-900/20 rounded-xl">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. Monitor Security</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Track security settings and compliance</p>
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

export default GoogleWorkspaceOverview;
