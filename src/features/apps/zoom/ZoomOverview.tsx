import React, { useState, useEffect } from 'react';
import api from '../../../shared/utils/api';
import { Layout } from '../../../shared/components';

interface Connection {
  id: string;
  accountId: string;
  accountName: string;
  accountType: 'basic' | 'pro' | 'business' | 'enterprise' | 'developer';
  connectionType: 'oauth';
  scope: string[];
  isActive: boolean;
  lastSync?: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  licensedUsers: number;
  basicUsers: number;
  totalMeetings: number;
  totalMinutes: number;
  averageDuration: number;
  recordedMeetings: number;
  cloudStorageUsed: number;
}

const ZoomOverview: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch connections
      const connectionsResponse = await api.get('/integrations/zoom/connections');
      setConnections(connectionsResponse.data.data || []);

      // Fetch stats if we have connections
      if (connectionsResponse.data.data?.length > 0) {
        // For now, set mock stats - will be replaced with real API calls
        setStats({
          totalUsers: 0,
          licensedUsers: 0,
          basicUsers: 0,
          totalMeetings: 0,
          totalMinutes: 0,
          averageDuration: 0,
          recordedMeetings: 0,
          cloudStorageUsed: 0
        });
      }
    } catch (error) {
      console.error('Error fetching Zoom data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setConnecting(true);
      const response = await api.post('/integrations/zoom/connections/oauth/initiate');
      
      // Redirect to Zoom OAuth
      window.location.href = response.data.data.authUrl;
    } catch (error) {
      console.error('Error initiating Zoom connection:', error);
      alert('Failed to initiate Zoom connection');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    if (!confirm('Are you sure you want to disconnect this Zoom account?')) {
      return;
    }

    try {
      await api.delete(`/integrations/zoom/connections/${connectionId}`);
      fetchData();
      alert('Zoom account disconnected successfully!');
    } catch (error) {
      console.error('Error disconnecting:', error);
      alert('Failed to disconnect Zoom account');
    }
  };

  const handleTest = async (connectionId: string) => {
    try {
      await api.post(`/integrations/zoom/connections/${connectionId}/test`);
      alert('Connection test successful!');
    } catch (error) {
      console.error('Error testing connection:', error);
      alert('Connection test failed');
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'basic': return 'bg-gray-100 text-gray-800';
      case 'pro': return 'bg-blue-100 text-blue-800';
      case 'business': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-green-100 text-green-800';
      case 'developer': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Zoom Integration</h1>
            <p className="text-gray-600">Manage your Zoom accounts and meeting analytics</p>
          </div>
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {connecting ? 'Connecting...' : 'Connect Zoom'}
          </button>
        </div>

        {/* Connections */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Zoom Accounts</h2>
          {connections.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📹</div>
              <p className="text-gray-600">No Zoom accounts connected</p>
              <p className="text-sm text-gray-500">Connect your Zoom account to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {connections.map((connection) => (
                <div key={connection.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{connection.accountName}</span>
                        <span className="text-gray-500">({connection.accountId})</span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          connection.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {connection.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${getAccountTypeColor(connection.accountType)}`}>
                          {connection.accountType.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Connected: {new Date(connection.createdAt).toLocaleDateString()}
                        {connection.lastSync && (
                          <span className="ml-4">
                            Last sync: {new Date(connection.lastSync).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {connection.scope.map((scope, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {scope}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleTest(connection.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Test
                      </button>
                      <button
                        onClick={() => handleDisconnect(connection.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl">👥</div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  <p className="text-xs text-gray-500">{stats.licensedUsers} licensed</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl">📹</div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Meetings</p>
                  <p className="text-2xl font-bold">{stats.totalMeetings}</p>
                  <p className="text-xs text-gray-500">{stats.recordedMeetings} recorded</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl">⏱️</div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Meeting Time</p>
                  <p className="text-2xl font-bold">{Math.round(stats.totalMinutes / 60)}h</p>
                  <p className="text-xs text-gray-500">{stats.averageDuration}min avg</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl">☁️</div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Storage</p>
                  <p className="text-2xl font-bold">{stats.cloudStorageUsed}GB</p>
                  <p className="text-xs text-gray-500">Cloud recordings</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {connections.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <div className="text-lg mb-2">👥</div>
                <h3 className="font-medium">Manage Users</h3>
                <p className="text-sm text-gray-600">View and manage Zoom users and licenses</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <div className="text-lg mb-2">📊</div>
                <h3 className="font-medium">Meeting Analytics</h3>
                <p className="text-sm text-gray-600">Analyze meeting patterns and usage</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <div className="text-lg mb-2">💰</div>
                <h3 className="font-medium">License Management</h3>
                <p className="text-sm text-gray-600">Optimize license usage and costs</p>
              </button>
            </div>
          </div>
        )}

        {/* License Overview */}
        {connections.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">License Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats?.licensedUsers || 0}</div>
                <div className="text-sm text-gray-600">Licensed Users</div>
                <div className="text-xs text-gray-500 mt-1">Pro, Business, Enterprise</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">{stats?.basicUsers || 0}</div>
                <div className="text-sm text-gray-600">Basic Users</div>
                <div className="text-xs text-gray-500 mt-1">Free accounts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {stats ? Math.round((stats.licensedUsers / Math.max(stats.totalUsers, 1)) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">License Utilization</div>
                <div className="text-xs text-gray-500 mt-1">Licensed vs Total</div>
              </div>
            </div>
          </div>
        )}

        {/* Setup Instructions */}
        {connections.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Getting Started with Zoom</h3>
            <div className="text-blue-800 space-y-2">
              <p>1. Click "Connect Zoom" to start the OAuth flow</p>
              <p>2. Authorize the application in your Zoom account</p>
              <p>3. Start managing your Zoom users and meetings from this dashboard</p>
            </div>
            <div className="mt-4 p-4 bg-blue-100 rounded">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> You'll need admin permissions in your Zoom account to connect it.
              </p>
            </div>
            <div className="mt-4">
              <h4 className="font-medium text-blue-900 mb-2">What you'll get:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Complete user list with license types</li>
                <li>• Meeting analytics and usage statistics</li>
                <li>• License optimization recommendations</li>
                <li>• Cloud storage and recording management</li>
                <li>• Cost analysis and reporting</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ZoomOverview;
