import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight,
  Users,
  GitBranch,
  Shield,
  Settings,
  Plus,
  Activity,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Code,
  Star,
  GitFork,
  Eye,
  Package
} from 'lucide-react';
import { Layout } from '../../../shared/components';
import api from '../../../shared/utils/api';

interface GitHubStats {
  totalConnections: number;
  totalUsers: number;
  totalRepositories: number;
  totalStars: number;
  totalForks: number;
  lastSync: string;
  publicRepositories: number;
  privateRepositories: number;
  totalTeams?: number;
  hasPackages?: boolean;
}

interface GitHubService {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  status: 'active' | 'setup-required' | 'available';
  count?: number;
}

const GitHubOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<GitHubStats>({
    totalConnections: 0,
    totalUsers: 0,
    totalRepositories: 0,
    totalStars: 0,
    totalForks: 0,
    lastSync: '',
    publicRepositories: 0,
    privateRepositories: 0
  });
  const [syncing, setSyncing] = useState<string | null>(null);
  const navigate = useNavigate();

  const getServiceStatus = (serviceId: string): 'active' | 'setup-required' | 'available' => {
    if (stats.totalConnections === 0) {
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
        return stats.totalTeams && stats.totalTeams > 0 ? 'active' : 'available';
      case 'packages':
        return stats.hasPackages ? 'active' : 'available';
      case 'security':
        return 'available'; // GitHub security features
      default:
        return 'available';
    }
  };

  const githubServices: GitHubService[] = [
    {
      id: 'connections',
      name: 'GitHub Connections',
      description: 'Manage GitHub organization and personal account connections',
      icon: GitBranch,
      route: '/apps/github/connections',
      status: getServiceStatus('connections'),
      count: stats.totalConnections
    },
    {
      id: 'users',
      name: 'Users & Members',
      description: 'Manage organization members, collaborators, and permissions',
      icon: Users,
      route: '/apps/github/users',
      status: getServiceStatus('users'),
      count: stats.totalUsers
    },
    {
      id: 'repositories',
      name: 'Repository Management',
      description: 'Manage repositories, branches, and access controls',
      icon: Code,
      route: '/apps/github/repositories',
      status: getServiceStatus('repositories'),
      count: stats.totalRepositories
    },
    {
      id: 'teams',
      name: 'Teams & Permissions',
      description: 'Organize users into teams and manage repository access',
      icon: Shield,
      route: '/apps/github/teams',
      status: getServiceStatus('teams'),
      count: stats.totalTeams
    },
    {
      id: 'packages',
      name: 'Packages & Releases',
      description: 'Manage GitHub Packages and repository releases',
      icon: Package,
      route: '/apps/github/packages',
      status: getServiceStatus('packages')
    },
    {
      id: 'security',
      name: 'Security & Compliance',
      description: 'Security alerts, dependency scanning, and code analysis',
      icon: Shield,
      route: '/apps/github/security',
      status: getServiceStatus('security')
    }
  ];

  useEffect(() => {
    fetchGitHubOverview();
  }, []);

  const fetchGitHubOverview = async () => {
    try {
      setLoading(true);
      console.log('🔍 GitHub Overview: Fetching overview data...');
      
      // Fetch real connections first
      const connectionsResponse = await api.get('/integrations/github/connections');
      console.log('🔍 GitHub Overview: Connections response:', connectionsResponse.data);
      
      const connections = connectionsResponse.data.data || [];
      console.log('🔍 GitHub Overview: Found connections:', connections.length);
      
      if (connections.length > 0) {
        // Fetch stats from all services
        console.log('📊 GitHub Overview: Fetching stats from all services...');
        const [usersStats, teamsStats, reposStats] = await Promise.all([
          api.get('/integrations/github/users/stats').catch((error) => {
            console.log('⚠️ Users stats not available:', error.message);
            return { data: { data: { totalUsers: 0 } } };
          }),
          api.get('/integrations/github/teams/stats').catch((error) => {
            console.log('⚠️ Teams stats not available:', error.message);
            return { data: { data: { totalTeams: 0 } } };
          }),
          api.get('/integrations/github/repositories/stats').catch((error) => {
            console.log('⚠️ Repositories stats not available:', error.message);
            return { 
              data: { 
                data: { 
                  totalRepositories: 0, 
                  publicRepositories: 0, 
                  privateRepositories: 0,
                  totalStars: 0,
                  totalForks: 0
                } 
              } 
            };
          })
        ]);

        console.log('📊 GitHub Overview: Users stats:', usersStats.data.data);
        console.log('📊 GitHub Overview: Teams stats:', teamsStats.data.data);
        console.log('📊 GitHub Overview: Repos stats:', reposStats.data.data);

        const lastSync = connections.reduce((latest: string, connection: any) => {
          return !latest || (connection.lastSync && connection.lastSync > latest) ? connection.lastSync || '' : latest;
        }, '');

        const statsData = {
          totalConnections: connections.length,
          totalUsers: usersStats.data.data.totalUsers || 0,
          totalRepositories: reposStats.data.data.totalRepositories || 0,
          publicRepositories: reposStats.data.data.publicRepositories || 0,
          privateRepositories: reposStats.data.data.privateRepositories || 0,
          totalStars: reposStats.data.data.totalStars || 0,
          totalForks: reposStats.data.data.totalForks || 0,
          totalTeams: teamsStats.data.data.totalTeams || 0,
          lastSync: lastSync ? new Date(lastSync).toLocaleDateString() : 'Never',
          hasPackages: false // TODO: Implement packages check
        };

        console.log('📊 GitHub Overview: Final stats:', statsData);
        setStats(statsData);
      } else {
        console.log('⚠️ GitHub Overview: No connections found');
        setStats({
          totalConnections: 0,
          totalUsers: 0,
          totalRepositories: 0,
          totalStars: 0,
          totalForks: 0,
          lastSync: 'Not connected',
          publicRepositories: 0,
          privateRepositories: 0
        });
      }
    } catch (error: any) {
      console.error('❌ GitHub Overview: Error fetching data:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      setStats({
        totalConnections: 0,
        totalUsers: 0,
        totalRepositories: 0,
        totalStars: 0,
        totalForks: 0,
        lastSync: 'Error',
        publicRepositories: 0,
        privateRepositories: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAll = async () => {
    try {
      setSyncing('all');
      console.log('🔄 GitHub Overview: Starting full sync...');
      
      // First, fetch all GitHub connections
      const connectionsResponse = await api.get('/integrations/github/connections');
      const connections = connectionsResponse.data.data || [];
      
      console.log('🔍 GitHub Overview: Found connections:', connections.length);
      
      if (connections.length === 0) {
        alert('No GitHub connections found. Please connect a GitHub account first.');
        setSyncing(null);
        return;
      }

      // Sync all data types for all connections sequentially to avoid rate limiting
      let successCount = 0;
      let errorCount = 0;
      
      for (const connection of connections) {
        console.log(`🔄 GitHub Overview: Syncing connection ${connection.id} (${connection.organizationName || connection.username})`);
        
        try {
          // Sync users
          console.log('🔄 Syncing users...');
          await api.post('/integrations/github/users/sync', { 
            connectionId: connection.id 
          });
          successCount++;
          
          // Sync repositories
          console.log('🔄 Syncing repositories...');
          await api.post('/integrations/github/repositories/sync', { 
            connectionId: connection.id 
          });
          successCount++;
          
          // Sync teams only for organization connections
          if (connection.scope === 'organization') {
            console.log('🔄 Syncing teams...');
            await api.post('/integrations/github/teams/sync', { 
              connectionId: connection.id 
            });
            successCount++;
          }
          
          // Add small delay between connections to avoid rate limiting
          if (connections.length > 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
        } catch (connectionError: any) {
          console.error(`❌ GitHub Overview: Error syncing connection ${connection.id}:`, connectionError);
          errorCount++;
          
          // Show specific error message if available
          const errorMessage = connectionError.response?.data?.message || connectionError.message;
          console.error(`❌ Connection ${connection.organizationName || connection.username} sync failed: ${errorMessage}`);
        }
      }
      
      console.log(`✅ GitHub Overview: Sync completed - ${successCount} successful, ${errorCount} failed`);
      
      if (successCount > 0) {
        alert(`GitHub data sync initiated for ${successCount} operations. This may take a few minutes.`);
        // Refresh data after a delay
        setTimeout(fetchGitHubOverview, 3000);
      } else {
        alert('Failed to sync GitHub data. Please check your connections and try again.');
      }
      
    } catch (error: any) {
      console.error('❌ GitHub Overview: Error syncing data:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to sync GitHub data: ${errorMessage}`);
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
                  <span className="text-3xl">🐙</span>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">GitHub</h1>
                    <p className="mt-1 text-gray-600">World's leading software development platform</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/apps/github/connections')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Connect GitHub
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
                  GitHub.com
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
                  <GitBranch className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Connections</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalConnections}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-green-600" />
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
                  <Code className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Repositories</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRepositories}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Stars</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStars}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <GitFork className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Forks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalForks}</p>
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

          {/* Connection Status Banner - Only show when no connections */}
          {stats.totalConnections === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800">GitHub Integration Setup Required</h3>
                  <p className="text-yellow-700 mt-1">
                    Connect your GitHub account or organization to start managing repositories and users. 
                    <button 
                      onClick={() => navigate('/apps/github/connections')}
                      className="ml-2 text-yellow-800 underline hover:text-yellow-900"
                    >
                      Get started →
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* GitHub Services */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">GitHub Management Areas</h3>
              <p className="text-sm text-gray-600">Access different GitHub management capabilities</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {githubServices.map((service) => {
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

          {/* Getting Started Guide - Only show when no connections */}
          {stats.totalConnections === 0 && (
            <div className="mt-8 bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Getting Started with GitHub</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <GitBranch className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">1. Connect Account</h4>
                    <p className="text-sm text-gray-600">Link your GitHub personal account or organization using OAuth or PAT</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">2. Manage Users</h4>
                    <p className="text-sm text-gray-600">Sync and manage organization members, teams, and permissions</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <Code className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">3. Monitor Repos</h4>
                    <p className="text-sm text-gray-600">Track repositories, security, and development activity</p>
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
