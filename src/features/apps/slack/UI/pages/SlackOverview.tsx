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
  RefreshCw
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

interface SlackService {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  status: 'active' | 'setup-required' | 'available';
  count?: number;
}

const SlackOverview: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
  const [credentials, setCredentials] = useState<any[]>([]);

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
      description: 'Manage Slack workspaces and workspace settings',
      icon: MessageCircle,
      route: '/apps/slack/workspaces',
      status: getServiceStatus('workspaces'),
      count: stats.totalConnections
    },
    {
      id: 'users',
      name: 'Users & Members',
      description: 'Manage workspace members, roles, and permissions',
      icon: Users,
      route: '/apps/slack/users',
      status: getServiceStatus('users'),
      count: stats.totalUsers
    },
    {
      id: 'channels',
      name: 'Channel Management',
      description: 'Manage channels, conversations, and access controls',
      icon: Hash,
      route: '/apps/slack/channels',
      status: getServiceStatus('channels'),
      count: stats.totalChannels
    },
    {
      id: 'analytics',
      name: 'Usage Analytics',
      description: 'Monitor workspace activity, engagement, and usage patterns',
      icon: Activity,
      route: '/apps/slack/analytics',
      status: getServiceStatus('analytics')
    }
  ];

  useEffect(() => {
    fetchSlackOverview();
  }, []);

  const fetchSlackOverview = async () => {
    try {
      setLoading(true);
      console.log('🔍 Slack Overview: Fetching overview data...');
      
      // Check for credentials first to determine if we have any Slack integration
      const credentialsResponse = await api.get('/credentials');
      if (credentialsResponse.data.success) {
        const slackCredentials = credentialsResponse.data.data.filter((cred: any) => cred.appType === 'slack');
        setCredentials(slackCredentials);
        console.log('🔍 Found Slack credentials:', slackCredentials.length);
      }
      
      // Fetch real connections and stats
      try {
        const connectionsResponse = await api.get('/integrations/slack/connections');
        const connections = connectionsResponse.data.data || [];
        console.log('🔍 Found Slack connections:', connections.length);
        
        if (connections.length > 0) {
          // Fetch stats from all services
          console.log('📊 Fetching Slack stats...');
          const [usersStats, channelsStats] = await Promise.all([
            api.get('/integrations/slack/users/stats').catch((error) => {
              console.log('⚠️ Users stats not available:', error.message);
              return { data: { data: { totalUsers: 0, activeUsers: 0, adminUsers: 0, twoFactorPercentage: 0 } } };
            }),
            api.get('/integrations/slack/channels/stats').catch((error) => {
              console.log('⚠️ Channels stats not available:', error.message);
              return { 
                data: { 
                  data: { 
                    totalChannels: 0, 
                    publicChannels: 0, 
                    privateChannels: 0,
                    totalMessages: 0
                  } 
                } 
              };
            })
          ]);

          const lastSync = connections.reduce((latest: string, connection: any) => {
            return !latest || (connection.lastSync && connection.lastSync > latest) ? connection.lastSync || '' : latest;
          }, '');

          const statsData = {
            totalConnections: connections.length,
            totalUsers: usersStats.data.data.totalUsers || 0,
            totalChannels: channelsStats.data.data.totalChannels || 0,
            publicChannels: channelsStats.data.data.publicChannels || 0,
            privateChannels: channelsStats.data.data.privateChannels || 0,
            totalMessages: channelsStats.data.data.totalMessages || 0,
            activeUsers: usersStats.data.data.activeUsers || 0,
            adminUsers: usersStats.data.data.adminUsers || 0,
            lastSync: lastSync ? new Date(lastSync).toLocaleDateString() : 'Never',
            twoFactorPercentage: usersStats.data.data.twoFactorPercentage || 0
          };

          console.log('📊 Slack stats:', statsData);
          setStats(statsData);
        } else {
          console.log('⚠️ No Slack connections found');
          setStats({
            totalConnections: 0,
            totalUsers: 0,
            totalChannels: 0,
            publicChannels: 0,
            privateChannels: 0,
            totalMessages: 0,
            activeUsers: 0,
            adminUsers: 0,
            lastSync: 'Not connected',
            twoFactorPercentage: 0
          });
        }
      } catch (error: any) {
        console.error('❌ Error fetching Slack connections:', error);
        // If we have credentials but no connections, show that we need to set up connections
        if (credentials.length > 0) {
          setStats({
            totalConnections: 0,
            totalUsers: 0,
            totalChannels: 0,
            publicChannels: 0,
            privateChannels: 0,
            totalMessages: 0,
            activeUsers: 0,
            adminUsers: 0,
            lastSync: 'Setup required',
            twoFactorPercentage: 0
          });
        }
      }

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
      
      // First, fetch all Slack connections
      const connectionsResponse = await api.get('/integrations/slack/connections');
      const connections = connectionsResponse.data.data || [];
      
      console.log('🔍 Slack Overview: Found connections:', connections.length);
      
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
          console.log('🔄 Syncing users...');
          await api.post('/integrations/slack/users/sync', { 
            connectionId: connection.id 
          });
          successCount++;
          
          // Sync channels
          console.log('🔄 Syncing channels...');
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
          
          // Show specific error message if available
          const errorMessage = connectionError.response?.data?.message || connectionError.message;
          console.error(`❌ Connection ${connection.workspaceName} sync failed: ${errorMessage}`);
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
                  <span className="text-3xl">💬</span>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Slack</h1>
                    <p className="mt-1 text-gray-600">Team communication and collaboration platform</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/apps/slack/workspaces')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Workspace
                </button>
                {stats.totalConnections > 0 && (
                  <button
                    onClick={handleSyncAll}
                    disabled={syncing === 'all'}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    {syncing === 'all' ? 'Syncing...' : 'Sync All'}
                  </button>
                )}
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
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
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MessageCircle className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Workspaces</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalConnections}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Hash className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Channels</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalChannels}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserCheck className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">2FA Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.twoFactorPercentage}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Last Sync</p>
                  <p className="text-sm font-bold text-gray-900">{stats.lastSync}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Status Banner - Only show when no connections */}
          {stats.totalConnections === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800">Slack Integration Setup Required</h3>
                  <p className="text-yellow-700 mt-1">
                    Connect your Slack workspace to start managing users and channels. 
                    <button 
                      onClick={() => navigate('/apps/slack/workspaces')}
                      className="ml-2 text-yellow-800 underline hover:text-yellow-900"
                    >
                      Get started →
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Slack Services */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Slack Management Areas</h3>
              <p className="text-sm text-gray-600">Access different Slack management capabilities</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {slackServices.map((service) => {
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
                            <ServiceIcon className="h-8 w-8 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{service.name}</h4>
                            {service.count !== undefined && (
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
                        <span className="text-sm text-purple-600 font-medium">
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

          {/* Getting Started Guide - Only show when no connections */}
          {stats.totalConnections === 0 && (
            <div className="mt-8 bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Getting Started with Slack</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <MessageCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">1. Connect Workspace</h4>
                    <p className="text-sm text-gray-600">Link your Slack workspace using OAuth or Bot tokens</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">2. Manage Users</h4>
                    <p className="text-sm text-gray-600">Sync and manage workspace members, roles, and permissions</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <Hash className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">3. Monitor Activity</h4>
                    <p className="text-sm text-gray-600">Track channels, messages, and workspace engagement</p>
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
