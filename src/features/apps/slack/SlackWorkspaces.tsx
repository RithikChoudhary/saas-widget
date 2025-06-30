import React, { useState, useEffect } from 'react';
import { Layout } from '../../../shared/components';
import api from '../../../shared/utils/api';
import { Plus, Users, MessageCircle, Settings, Activity, CheckCircle, AlertCircle } from 'lucide-react';

interface SlackWorkspace {
  id: string;
  name: string;
  domain: string;
  memberCount: number;
  channelCount: number;
  isActive: boolean;
  lastActivity: string;
  plan: string;
}

const SlackWorkspaces: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<SlackWorkspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState<any[]>([]);

  useEffect(() => {
    fetchWorkspaces();
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const response = await api.get('/credentials');
      if (response.data.success) {
        const slackCredentials = response.data.data.filter((cred: any) => cred.appType === 'slack');
        setCredentials(slackCredentials);
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
    }
  };

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      console.log('🔍 Slack Workspaces: Fetching connections...');
      
      // Fetch real Slack connections from API
      const response = await api.get('/integrations/slack/connections');
      console.log('🔍 Slack Workspaces: API response:', response.data);
      
      if (response.data.success && response.data.data) {
        const connections = response.data.data;
        console.log('🔍 Slack Workspaces: Found connections:', connections.length);
        
        // Transform connections to workspace format
        const workspaceData: SlackWorkspace[] = await Promise.all(
          connections.map(async (connection: any) => {
            try {
              // Try to get user stats for member count
              const userStatsResponse = await api.get('/integrations/slack/users/stats').catch(() => ({
                data: { data: { totalUsers: 0 } }
              }));
              
              // Try to get channel stats for channel count
              const channelStatsResponse = await api.get('/integrations/slack/channels/stats').catch(() => ({
                data: { data: { totalChannels: 0 } }
              }));
              
              return {
                id: connection.id,
                name: connection.workspaceName || 'Unknown Workspace',
                domain: connection.workspaceDomain || 'unknown.slack.com',
                memberCount: userStatsResponse.data.data.totalUsers || 0,
                channelCount: channelStatsResponse.data.data.totalChannels || 0,
                isActive: connection.isActive,
                lastActivity: connection.lastSync || new Date().toISOString(),
                plan: 'Connected'
              };
            } catch (error) {
              console.error('Error fetching stats for connection:', connection.id, error);
              return {
                id: connection.id,
                name: connection.workspaceName || 'Unknown Workspace',
                domain: connection.workspaceDomain || 'unknown.slack.com',
                memberCount: 0,
                channelCount: 0,
                isActive: connection.isActive,
                lastActivity: connection.lastSync || new Date().toISOString(),
                plan: 'Connected'
              };
            }
          })
        );
        
        console.log('🔍 Slack Workspaces: Processed workspaces:', workspaceData);
        setWorkspaces(workspaceData);
      } else {
        console.log('⚠️ Slack Workspaces: No connections found');
        setWorkspaces([]);
      }
    } catch (error: any) {
      console.error('❌ Slack Workspaces: Error fetching workspaces:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWorkspace = async () => {
    try {
      console.log('🔗 Initiating Slack OAuth...');
      
      // Check if we have credentials first
      if (credentials.length === 0) {
        alert('Please configure Slack credentials first in the Credentials section.');
        return;
      }

      // Initiate OAuth flow
      const response = await api.post('/integrations/slack/connections/oauth/initiate');
      
      if (response.data.success && response.data.authUrl) {
        console.log('🔗 Redirecting to Slack OAuth...');
        // Redirect to Slack OAuth
        window.location.href = response.data.authUrl;
      } else {
        throw new Error(response.data.message || 'Failed to initiate OAuth');
      }
    } catch (error: any) {
      console.error('❌ Error initiating Slack OAuth:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to connect workspace';
      alert(`Failed to connect Slack workspace: ${errorMessage}`);
    }
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Slack Workspaces</h1>
            <p className="text-gray-600 mt-1">Manage your Slack workspaces and team collaboration</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Connected Workspaces:</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {workspaces.length}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="text-2xl mr-3">💬</div>
              <div>
                <p className="text-sm text-gray-600">Total Workspaces</p>
                <p className="text-2xl font-bold">{workspaces.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="text-2xl mr-3">👥</div>
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-2xl font-bold">{workspaces.reduce((sum, ws) => sum + ws.memberCount, 0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="text-2xl mr-3">#</div>
              <div>
                <p className="text-sm text-gray-600">Total Channels</p>
                <p className="text-2xl font-bold">{workspaces.reduce((sum, ws) => sum + ws.channelCount, 0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="text-2xl mr-3">✅</div>
              <div>
                <p className="text-sm text-gray-600">Active Workspaces</p>
                <p className="text-2xl font-bold">{workspaces.filter(ws => ws.isActive).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Workspaces List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Connected Workspaces</h2>
            <p className="text-sm text-gray-600">Manage your Slack workspaces and their settings</p>
          </div>
          <div className="p-6">
            {workspaces.length > 0 ? (
              <div className="space-y-4">
                {workspaces.map((workspace) => (
                  <div key={workspace.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">💬</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{workspace.name}</h3>
                          <p className="text-sm text-gray-600">{workspace.domain}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500 flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {workspace.memberCount} members
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              {workspace.channelCount} channels
                            </span>
                            <span className="text-xs text-gray-500">
                              Plan: {workspace.plan}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {workspace.isActive ? (
                          <span className="flex items-center text-green-600 text-sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center text-red-600 text-sm">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Inactive
                          </span>
                        )}
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                          Manage
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Last Activity</p>
                        <p className="text-sm font-medium">
                          {new Date(workspace.lastActivity).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="text-sm font-medium text-green-600">Connected</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Integration</p>
                        <p className="text-sm font-medium text-blue-600">Full Access</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No workspaces found</h3>
                <p className="text-gray-600 mb-6">
                  Connect your Slack workspace to start managing your team collaboration
                </p>
                <button 
                  onClick={handleConnectWorkspace}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                >
                  Connect Workspace
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
                  <p className="font-medium">Manage Members</p>
                  <p className="text-sm text-gray-600">Add, remove, and manage workspace members</p>
                </div>
              </button>
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <MessageCircle className="h-8 w-8 text-green-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Channel Management</p>
                  <p className="text-sm text-gray-600">Create and organize channels</p>
                </div>
              </button>
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Activity className="h-8 w-8 text-purple-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium">View Analytics</p>
                  <p className="text-sm text-gray-600">Monitor workspace activity and usage</p>
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
                <p className="text-green-800 font-medium">Slack Integration Active</p>
                <p className="text-green-700 text-sm">
                  {credentials.length} credential set(s) configured. Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SlackWorkspaces;
