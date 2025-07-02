import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight,
  Users,
  MessageCircle,
  Shield,
  Settings,
  Plus,
  Activity,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Hash,
  UserCheck,
  Clock,
  RefreshCw,
  ChevronLeft,
  Zap,
  TrendingUp,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';
import api from '../../../../../shared/utils/api';
import { Layout } from '../../../../../shared/components';

interface SlackStats {
  totalConnections: number;
  totalUsers: number;
  totalChannels: number;
  publicChannels: number;
  privateChannels: number;
  totalMessages: number;
  activeUsers: number;
  adminUsers: number;
  lastSync: string;
  twoFactorPercentage: number;
}

interface SlackConnection {
  id: string;
  workspaceName: string;
  workspaceDomain: string;
  isActive: boolean;
  lastSync: string;
  connectionType: string;
  scope: string[];
}

interface SlackService {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  status: 'active' | 'setup-required' | 'available';
  count?: number;
  features: string[];
}

const SlackOverview: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState<SlackConnection[]>([]);
  const [stats, setStats] = useState<SlackStats>({
    totalConnections: 0,
    totalUsers: 0,
    totalChannels: 0,
    publicChannels: 0,
    privateChannels: 0,
    totalMessages: 0,
    activeUsers: 0,
    adminUsers: 0,
    lastSync: '',
    twoFactorPercentage: 0
  });
  const [syncing, setSyncing] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const getServiceStatus = (serviceId: string): 'active' | 'setup-required' | 'available' => {
    if (stats.totalConnections === 0) {
      return 'setup-required';
    }
    
    switch (serviceId) {
      case 'workspaces':
        return 'active';
      case 'users':
        return stats.totalUsers > 0 ? 'active' : 'available';
      case 'channels':
        return stats.totalChannels > 0 ? 'active' : 'available';
      case 'analytics':
        return stats.totalMessages > 0 ? 'active' : 'available';
      default:
        return 'available';
    }
  };

  const slackServices: SlackService[] = [
    {
      id: 'workspaces',
      name: 'Workspace Management',
      description: 'Manage Slack workspaces, settings, and configurations',
      icon: MessageCircle,
      route: '/apps/slack/workspaces',
      status: getServiceStatus('workspaces'),
      count: stats.totalConnections,
      features: ['Workspace Settings', 'Member Management', 'Integration Control']
    },
    {
      id: 'users',
      name: 'Users & Members',
      description: 'Manage workspace members, roles, and permissions',
      icon: Users,
      route: '/apps/slack/users',
      status: getServiceStatus('users'),
      count: stats.totalUsers,
      features: ['User Profiles', 'Role Management', 'Activity Tracking']
    },
    {
      id: 'channels',
      name: 'Channel Management',
      description: 'Manage channels, conversations, and access controls',
      icon: Hash,
      route: '/apps/slack/channels',
      status: getServiceStatus('channels'),
      count: stats.totalChannels,
      features: ['Channel Analytics', 'Access Control', 'Message History']
    },
    {
      id: 'analytics',
      name: 'Usage Analytics',
      description: 'Monitor workspace activity, engagement, and usage patterns',
      icon: Activity,
      route: '/apps/slack/analytics',
      status: getServiceStatus('analytics'),
      features: ['Usage Reports', 'Engagement Metrics', 'Trend Analysis']
    }
  ];

  useEffect(() => {
    fetchSlackOverview();
    
    // Check for OAuth callback success/error
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const workspace = urlParams.get('workspace');
    
    if (success === 'true' && workspace) {
      alert(`Slack workspace connected successfully: ${workspace}`);
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchSlackOverview();
    } else if (error) {
      alert(`Slack connection failed: ${error}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      console.log('🔄 Slack: Initiating OAuth connection...');
      
      const response = await api.post('/integrations/slack/connections/oauth/initiate');
      
      if (response.data.success && response.data.data?.authUrl) {
        console.log('✅ Slack: Redirecting to OAuth URL');
        window.location.href = response.data.data.authUrl;
      } else {
        throw new Error('Failed to get OAuth URL');
      }
    } catch (error: any) {
      console.error('❌ Slack OAuth Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      
      if (errorMessage.includes('not configured') || errorMessage.includes('credentials')) {
        alert('Slack OAuth is not configured. Please add Slack credentials first in the Connection Hub.');
        navigate('/credentials');
      } else {
        alert(`Failed to initiate Slack connection: ${errorMessage}`);
      }
    } finally {
      setConnecting(false);
    }
  };

  const fetchSlackOverview = async () => {
    try {
      setLoading(true);
      console.log('🔍 Slack Overview: Fetching overview data...');
      
      // Fetch real connections and stats from database
      const [connectionsResponse, usersStats, channelsStats] = await Promise.allSettled([
        api.get('/integrations/slack/connections'),
        api.get('/integrations/slack/users/stats').catch(() => ({ data: { data: { totalUsers: 0, activeUsers: 0, adminUsers: 0, twoFactorPercentage: 0 } } })),
        api.get('/integrations/slack/channels/stats').catch(() => ({ data: { data: { totalChannels: 0, publicChannels: 0, privateChannels: 0, totalMessages: 0 } } }))
      ]);

      let slackConnections: SlackConnection[] = [];
      
      if (connectionsResponse.status === 'fulfilled' && connectionsResponse.value.data.success) {
        slackConnections = connectionsResponse.value.data.data || [];
        setConnections(slackConnections);
        console.log('🔍 Found Slack connections:', slackConnections.length);
      }

      // Calculate stats from real data
      const lastSync = slackConnections.reduce((latest: string, connection: SlackConnection) => {
        return !latest || (connection.lastSync && connection.lastSync > latest) ? connection.lastSync || '' : latest;
      }, '');

      const statsData: SlackStats = {
        totalConnections: slackConnections.length,
        totalUsers: usersStats.status === 'fulfilled' ? usersStats.value.data.data.totalUsers || 0 : 0,
        totalChannels: channelsStats.status === 'fulfilled' ? channelsStats.value.data.data.totalChannels || 0 : 0,
        publicChannels: channelsStats.status === 'fulfilled' ? channelsStats.value.data.data.publicChannels || 0 : 0,
        privateChannels: channelsStats.status === 'fulfilled' ? channelsStats.value.data.data.privateChannels || 0 : 0,
        totalMessages: channelsStats.status === 'fulfilled' ? channelsStats.value.data.data.totalMessages || 0 : 0,
        activeUsers: usersStats.status === 'fulfilled' ? usersStats.value.data.data.activeUsers || 0 : 0,
        adminUsers: usersStats.status === 'fulfilled' ? usersStats.value.data.data.adminUsers || 0 : 0,
        lastSync: lastSync ? new Date(lastSync).toLocaleDateString() : 'Never',
        twoFactorPercentage: usersStats.status === 'fulfilled' ? usersStats.value.data.data.twoFactorPercentage || 0 : 0
      };

      console.log('📊 Slack stats:', statsData);
      setStats(statsData);

    } catch (error) {
      console.error('❌ Error fetching Slack data:', error);
      setStats({
        totalConnections: 0,
        totalUsers: 0,
        totalChannels: 0,
        publicChannels: 0,
        privateChannels: 0,
        totalMessages: 0,
        activeUsers: 0,
        adminUsers: 0,
        lastSync: 'Error',
        twoFactorPercentage: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAll = async () => {
    try {
      setSyncing('all');
      console.log('🔄 Slack Overview: Starting full sync...');
      
      if (connections.length === 0) {
        alert('No Slack connections found. Please connect a Slack workspace first.');
        setSyncing(null);
        return;
      }

      // Sync all data types for all connections
      let successCount = 0;
      let errorCount = 0;
      
      for (const connection of connections) {
        console.log(`🔄 Slack Overview: Syncing connection ${connection.id} (${connection.workspaceName})`);
        
        try {
          // Sync users
          await api.post('/integrations/slack/users/sync', { 
            connectionId: connection.id 
          });
          successCount++;
          
          // Sync channels
          await api.post('/integrations/slack/channels/sync', { 
            connectionId: connection.id 
          });
          successCount++;
          
          // Add small delay between connections to avoid rate limiting
          if (connections.length > 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
        } catch (connectionError: any) {
          console.error(`❌ Slack Overview: Error syncing connection ${connection.id}:`, connectionError);
          errorCount++;
        }
      }
      
      console.log(`✅ Slack Overview: Sync completed - ${successCount} successful, ${errorCount} failed`);
      
      if (successCount > 0) {
        alert(`Slack data sync initiated for ${successCount} operations. This may take a few minutes.`);
        // Refresh data after a delay
        setTimeout(fetchSlackOverview, 3000);
      } else {
        alert('Failed to sync Slack data. Please check your connections and try again.');
      }
      
    } catch (error: any) {
      console.error('❌ Slack Overview: Error syncing data:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to sync Slack data: ${errorMessage}`);
    } finally {
      setSyncing(null);
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
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/apps')}
                  className="text-white hover:text-purple-200 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                    <span className="text-4xl">💬</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">Slack</h1>
                    <p className="mt-1 text-purple-100 text-lg">
                      {stats.totalConnections > 0 
                        ? `Managing ${stats.totalConnections} workspace${stats.totalConnections > 1 ? 's' : ''} with ${stats.totalUsers} users`
                        : 'Team communication and collaboration platform'
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/credentials')}
                  className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Connection Hub
                </button>
                {stats.totalConnections === 0 ? (
                  <button
                    onClick={handleConnect}
                    disabled={connecting}
                    className="inline-flex items-center px-6 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 disabled:opacity-50 transition-colors font-medium"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {connecting ? 'Connecting...' : 'Connect Workspace'}
                  </button>
                ) : (
                  <button
                    onClick={handleSyncAll}
                    disabled={syncing === 'all'}
                    className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${syncing === 'all' ? 'animate-spin' : ''}`} />
                    {syncing === 'all' ? 'Syncing...' : 'Sync All'}
                  </button>
                )}
                <button 
                  onClick={() => window.open('https://slack.com', '_blank')}
                  className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Slack.com
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Workspaces</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalConnections}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Hash className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Channels</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalChannels}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-yellow-500">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <UserCheck className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-red-500">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                  <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">2FA Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.twoFactorPercentage}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-indigo-500">
              <div className="flex items-center">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                  <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Sync</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{stats.lastSync}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Status Banner */}
          {stats.totalConnections === 0 ? (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 mb-8">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mr-4" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200">Slack Integration Setup Required</h3>
                  <p className="text-yellow-700 dark:text-yellow-300 mt-2">
                    Connect your Slack workspace to start managing users, channels, and analytics. 
                    Set up credentials in the Connection Hub first, then connect your workspace.
                  </p>
                  <div className="flex space-x-3 mt-4">
                    <button 
                      onClick={() => navigate('/credentials')}
                      className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Setup Credentials
                    </button>
                    <button 
                      onClick={handleConnect}
                      disabled={connecting}
                      className="bg-white text-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-50 transition-colors border border-yellow-300"
                    >
                      {connecting ? 'Connecting...' : 'Try Connect'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 border border-green-200 dark:border-green-700 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mr-4" />
                  <div>
                    <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">Slack Integration Active</h3>
                    <p className="text-green-700 dark:text-green-300 mt-1">
                      {connections.length} workspace{connections.length > 1 ? 's' : ''} connected • {stats.totalUsers} users managed • Last sync: {stats.lastSync}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {connections.map((connection) => (
                    <div key={connection.id} className="flex items-center space-x-2 bg-white bg-opacity-50 px-3 py-1 rounded-lg">
                      {connection.isActive ? (
                        <Wifi className="h-4 w-4 text-green-600" />
                      ) : (
                        <WifiOff className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm font-medium text-green-800">{connection.workspaceName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Slack Services */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Slack Management Areas</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Access different Slack management capabilities</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {slackServices.map((service) => {
                  const ServiceIcon = service.icon;
                  return (
                    <div
                      key={service.id}
                      className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-500 transition-all cursor-pointer group"
                      onClick={() => navigate(service.route)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                            <ServiceIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{service.name}</h4>
                            {service.count !== undefined && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">{service.count} items</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getServiceStatusIcon(service.status)}
                          {getServiceStatusBadge(service.status)}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
                      
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {service.features.map((feature, index) => (
                            <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                          {service.status === 'active' ? 'Manage' : 
                           service.status === 'setup-required' ? 'Setup Required' : 'Configure'}
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Common Slack management tasks</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button 
                  onClick={() => navigate('/credentials')}
                  className="flex items-center p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900 transition-all"
                >
                  <Database className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Connection Hub</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage all service connections</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => stats.totalConnections > 0 ? navigate('/apps/slack/users') : handleConnect()}
                  className="flex items-center p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-all"
                >
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Manage Users</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View and manage workspace members</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => stats.totalConnections > 0 ? navigate('/apps/slack/channels') : handleConnect()}
                  className="flex items-center p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-green-300 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900 transition-all"
                >
                  <Hash className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Manage Channels</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monitor channel activity and settings</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Getting Started Guide - Only show when no connections */}
          {stats.totalConnections === 0 && (
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Getting Started with Slack</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                      <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Setup Credentials</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Configure Slack app credentials in the Connection Hub</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                      <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. Connect Workspace</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Link your Slack workspace using OAuth authentication</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                      <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. Monitor & Manage</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Track users, channels, and workspace analytics</p>
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

export default SlackOverview;
