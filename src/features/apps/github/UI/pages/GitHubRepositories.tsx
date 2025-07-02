import React, { useState, useEffect } from 'react';
import { Layout } from '../../../../../shared/components';
import api from '../../../../../shared/utils/api';
import { useNavigate } from 'react-router-dom';
import { 
  GitBranch, 
  Star, 
  Eye, 
  Users, 
  Code, 
  CheckCircle, 
  AlertCircle, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Plus, 
  Search,
  Filter,
  ExternalLink,
  ChevronLeft,
  Calendar,
  Activity,
  Settings
} from 'lucide-react';

interface GitHubRepository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  isPrivate: boolean;
  language: string;
  starCount: number;
  forkCount: number;
  watcherCount: number;
  lastUpdated: string;
  defaultBranch: string;
  url: string;
}

const GitHubRepositories: React.FC = () => {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');

  useEffect(() => {
    fetchRepositories();
    fetchCredentials();
    fetchConnections();
  }, []);

  const fetchCredentials = async () => {
    try {
      const response = await api.get('/credentials');
      if (response.data.success) {
        const githubCredentials = response.data.data.filter((cred: any) => cred.appType === 'github');
        setCredentials(githubCredentials);
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
    }
  };

  const fetchConnections = async () => {
    try {
      const response = await api.get('/integrations/github/connections');
      if (response.data.success) {
        setConnections(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching GitHub connections:', error);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      
      if (connections.length === 0) {
        alert('No GitHub connections found. Please connect your GitHub account first.');
        return;
      }

      // Use the first connection for sync
      const connectionId = connections[0].id || connections[0]._id;
      
      console.log('🔄 Syncing repositories for connection:', connectionId);
      
      const response = await api.post('/integrations/github/repositories/sync', {
        connectionId
      });
      
      if (response.data.success) {
        alert('Repository sync completed successfully!');
        await fetchRepositories(); // Refresh the repositories list
      } else {
        alert('Repository sync failed: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('❌ Error syncing repositories:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      alert('Repository sync failed: ' + errorMessage);
    } finally {
      setSyncing(false);
    }
  };

  // Filter repositories based on search and filter type
  const filteredRepositories = repositories.filter(repo => {
    const matchesSearch = searchQuery === '' || 
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.language.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
      (filterType === 'private' && repo.isPrivate) ||
      (filterType === 'public' && !repo.isPrivate);
    
    return matchesSearch && matchesFilter;
  });

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      console.log('🔍 GitHub Repositories: Fetching repositories...');
      
      // Fetch real repositories from API
      const response = await api.get('/integrations/github/repositories');
      console.log('🔍 GitHub Repositories: API response:', response.data);
      
      if (response.data.success && response.data.data) {
        const repos = response.data.data;
        console.log('🔍 GitHub Repositories: Found repositories:', repos.length);
        
        // Transform API data to match our interface
        const transformedRepos: GitHubRepository[] = repos.map((repo: any) => ({
          id: repo.id || repo._id,
          name: repo.name,
          fullName: repo.fullName || `${repo.owner}/${repo.name}`,
          description: repo.description || 'No description available',
          isPrivate: repo.isPrivate || false,
          language: repo.language || 'Unknown',
          starCount: repo.starCount || 0,
          forkCount: repo.forkCount || 0,
          watcherCount: repo.watcherCount || 0,
          lastUpdated: repo.lastUpdated || repo.updatedAt || new Date().toISOString(),
          defaultBranch: repo.defaultBranch || 'main',
          url: repo.url || repo.htmlUrl || `https://github.com/${repo.fullName}`
        }));
        
        console.log('🔍 GitHub Repositories: Processed repositories:', transformedRepos);
        setRepositories(transformedRepos);
      } else {
        console.log('⚠️ GitHub Repositories: No repositories found');
        setRepositories([]);
      }
    } catch (error: any) {
      console.error('❌ GitHub Repositories: Error fetching repositories:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      setRepositories([]);
    } finally {
      setLoading(false);
    }
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      'TypeScript': 'bg-blue-100 text-blue-800',
      'JavaScript': 'bg-yellow-100 text-yellow-800',
      'Python': 'bg-green-100 text-green-800',
      'Java': 'bg-red-100 text-red-800',
      'Go': 'bg-cyan-100 text-cyan-800',
      'Rust': 'bg-orange-100 text-orange-800',
      'Markdown': 'bg-gray-100 text-gray-800'
    };
    return colors[language] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/apps/github')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">GitHub Repositories</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {repositories.length > 0 
                  ? `Managing ${repositories.length} repositories across your GitHub organization`
                  : 'Manage your GitHub repositories and code collaboration'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {connections.length > 0 && (
              <button
                onClick={handleSync}
                disabled={syncing}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Repositories'}
              </button>
            )}
            <button
              onClick={() => navigate('/apps/github/connections')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Connect Repository
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search repositories by name, description, or language..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Repositories</option>
                <option value="public">Public Only</option>
                <option value="private">Private Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="text-2xl mr-3">📁</div>
              <div>
                <p className="text-sm text-gray-600">Total Repositories</p>
                <p className="text-2xl font-bold">{repositories.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="text-2xl mr-3">⭐</div>
              <div>
                <p className="text-sm text-gray-600">Total Stars</p>
                <p className="text-2xl font-bold">{repositories.reduce((sum, repo) => sum + repo.starCount, 0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🔀</div>
              <div>
                <p className="text-sm text-gray-600">Total Forks</p>
                <p className="text-2xl font-bold">{repositories.reduce((sum, repo) => sum + repo.forkCount, 0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🔒</div>
              <div>
                <p className="text-sm text-gray-600">Private Repos</p>
                <p className="text-2xl font-bold">{repositories.filter(repo => repo.isPrivate).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Repositories List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Repository Overview</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredRepositories.length > 0 
                    ? `Showing ${filteredRepositories.length} of ${repositories.length} repositories`
                    : 'No repositories match your current filters'
                  }
                </p>
              </div>
              {repositories.length > 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total: {repositories.length} repositories
                </div>
              )}
            </div>
          </div>
          <div className="p-6">
            {filteredRepositories.length > 0 ? (
              <div className="space-y-4">
                {filteredRepositories.map((repo) => (
                  <div key={repo.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            {repo.isPrivate ? (
                              <Lock className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Unlock className="h-4 w-4 text-green-500" />
                            )}
                            <h3 className="text-lg font-semibold text-gray-900">{repo.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(repo.language)}`}>
                              {repo.language}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{repo.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Star className="h-4 w-4 mr-1" />
                            {repo.starCount} stars
                          </span>
                          <span className="flex items-center">
                            <GitBranch className="h-4 w-4 mr-1" />
                            {repo.forkCount} forks
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {repo.watcherCount} watchers
                          </span>
                          <span>
                            Updated {new Date(repo.lastUpdated).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          repo.isPrivate ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {repo.isPrivate ? 'Private' : 'Public'}
                        </span>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Code className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No repositories found</h3>
                <p className="text-gray-600 mb-6">
                  Connect your GitHub account to start managing your repositories
                </p>
                <button className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900">
                  Connect GitHub
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Manage Teams</p>
                  <p className="text-sm text-gray-600">Add and manage repository collaborators</p>
                </div>
              </button>
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <GitBranch className="h-8 w-8 text-green-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Branch Protection</p>
                  <p className="text-sm text-gray-600">Configure branch protection rules</p>
                </div>
              </button>
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Code className="h-8 w-8 text-purple-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Code Analytics</p>
                  <p className="text-sm text-gray-600">View repository insights and metrics</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Credentials Status */}
        {credentials.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-green-800 font-medium">GitHub Integration Active</p>
                <p className="text-green-700 text-sm">
                  {credentials.length} credential set(s) configured. Organization: Trans-Fi
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GitHubRepositories;
