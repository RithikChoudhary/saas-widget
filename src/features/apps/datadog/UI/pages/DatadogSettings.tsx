import React, { useState, useEffect } from 'react';
import { Settings, Save, TestTube, Trash2, Plus, Clock, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { Layout } from '../../../../../shared/components';

interface DatadogConnection {
  id: string;
  organizationName: string;
  site: string;
  isActive: boolean;
  syncStatus: 'idle' | 'syncing' | 'completed' | 'failed';
  lastSync: string;
  errorMessage?: string;
  createdAt: string;
}

interface SyncSettings {
  enabled: boolean;
  frequency: 'hourly' | 'daily' | 'weekly';
  cronExpression: string;
  autoSync: boolean;
  syncUsers: boolean;
  syncTeams: boolean;
  collectUsageStats: boolean;
}

const DatadogSettings: React.FC = () => {
  const [connections, setConnections] = useState<DatadogConnection[]>([]);
  const [syncSettings, setSyncSettings] = useState<SyncSettings>({
    enabled: true,
    frequency: 'daily',
    cronExpression: '0 2 * * *',
    autoSync: true,
    syncUsers: true,
    syncTeams: true,
    collectUsageStats: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [newConnection, setNewConnection] = useState({
    organizationName: '',
    site: 'datadoghq.com',
    apiKey: '',
    applicationKey: ''
  });

  useEffect(() => {
    fetchConnections();
    fetchSyncSettings();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/integrations/datadog/connections', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setConnections(result.data);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSyncSettings = async () => {
    // In a real implementation, this would fetch from the backend
    // For now, we'll use default settings
    setSyncSettings({
      enabled: true,
      frequency: 'daily',
      cronExpression: '0 2 * * *',
      autoSync: true,
      syncUsers: true,
      syncTeams: true,
      collectUsageStats: true
    });
  };

  const handleAddConnection = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('/api/integrations/datadog/connect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newConnection)
      });

      if (response.ok) {
        await fetchConnections();
        setShowAddConnection(false);
        setNewConnection({
          organizationName: '',
          site: 'datadoghq.com',
          apiKey: '',
          applicationKey: ''
        });
        alert('Connection added successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to add connection: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding connection:', error);
      alert('Failed to add connection. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async (connectionId: string) => {
    try {
      setTesting(connectionId);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`/api/integrations/datadog/connections/${connectionId}/test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Connection test successful! Organization: ${result.data.organizationName}`);
      } else {
        const error = await response.json();
        alert(`Connection test failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      alert('Connection test failed. Please try again.');
    } finally {
      setTesting(null);
    }
  };

  const handleDeleteConnection = async (connectionId: string) => {
    if (!confirm('Are you sure you want to delete this connection? This will remove all associated data.')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`/api/integrations/datadog/connections/${connectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchConnections();
        alert('Connection deleted successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to delete connection: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting connection:', error);
      alert('Failed to delete connection. Please try again.');
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      // In a real implementation, this would save to the backend
      // For now, we'll just simulate a save
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (connection: DatadogConnection) => {
    switch (connection.syncStatus) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center space-x-1">
          <CheckCircle className="h-3 w-3" />
          <span>Active</span>
        </span>;
      case 'syncing':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Syncing</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full flex items-center space-x-1">
          <AlertCircle className="h-3 w-3" />
          <span>Failed</span>
        </span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Idle</span>;
    }
  };

  const getCronDescription = (frequency: string) => {
    switch (frequency) {
      case 'hourly':
        return 'Every hour at minute 0';
      case 'daily':
        return 'Daily at 2:00 AM UTC';
      case 'weekly':
        return 'Weekly on Sunday at 2:00 AM UTC';
      default:
        return 'Custom schedule';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Datadog Settings</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage connections, sync settings, and integration preferences</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Connections Management */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Datadog Connections</h2>
                <button
                  onClick={() => setShowAddConnection(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Connection</span>
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {connections.map((connection) => (
                    <div key={connection.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{connection.organizationName}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{connection.site}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(connection)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Last Sync:</span>
                          <p className="text-gray-900 dark:text-white">
                            {connection.lastSync ? new Date(connection.lastSync).toLocaleString() : 'Never'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Created:</span>
                          <p className="text-gray-900 dark:text-white">
                            {new Date(connection.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {connection.errorMessage && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <p className="text-sm text-red-800 dark:text-red-200">{connection.errorMessage}</p>
                        </div>
                      )}

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleTestConnection(connection.id)}
                          disabled={testing === connection.id}
                          className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 flex items-center space-x-1"
                        >
                          <TestTube className="h-3 w-3" />
                          <span>{testing === connection.id ? 'Testing...' : 'Test'}</span>
                        </button>
                        
                        <button
                          onClick={() => handleDeleteConnection(connection.id)}
                          className="px-3 py-1 border border-red-300 text-red-700 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {connections.length === 0 && (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No Datadog connections configured</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Add a connection to get started</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sync Settings */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Sync Settings</h2>
                <Clock className="h-5 w-5 text-gray-400" />
              </div>

              <div className="space-y-6">
                {/* Enable Sync */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Automatic Sync</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Automatically sync data on schedule</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={syncSettings.enabled}
                    onChange={(e) => setSyncSettings({...syncSettings, enabled: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                {/* Sync Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sync Frequency</label>
                  <select
                    value={syncSettings.frequency}
                    onChange={(e) => setSyncSettings({...syncSettings, frequency: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getCronDescription(syncSettings.frequency)}
                  </p>
                </div>

                {/* Sync Options */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sync Options</label>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sync Users</span>
                    <input
                      type="checkbox"
                      checked={syncSettings.syncUsers}
                      onChange={(e) => setSyncSettings({...syncSettings, syncUsers: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sync Teams</span>
                    <input
                      type="checkbox"
                      checked={syncSettings.syncTeams}
                      onChange={(e) => setSyncSettings({...syncSettings, syncTeams: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Collect Usage Stats</span>
                    <input
                      type="checkbox"
                      checked={syncSettings.collectUsageStats}
                      onChange={(e) => setSyncSettings({...syncSettings, collectUsageStats: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </div>

            {/* Integration Info */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3">Integration Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Active Connections:</span>
                  <span className="font-medium text-blue-900 dark:text-blue-100">{connections.filter(c => c.isActive).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Auto Sync:</span>
                  <span className="font-medium text-blue-900 dark:text-blue-100">{syncSettings.enabled ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Next Sync:</span>
                  <span className="font-medium text-blue-900 dark:text-blue-100">
                    {syncSettings.enabled ? getCronDescription(syncSettings.frequency) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Connection Modal */}
        {showAddConnection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Datadog Connection</h3>
                <button
                  onClick={() => setShowAddConnection(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization Name</label>
                  <input
                    type="text"
                    value={newConnection.organizationName}
                    onChange={(e) => setNewConnection({...newConnection, organizationName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="My Organization"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Datadog Site</label>
                  <select
                    value={newConnection.site}
                    onChange={(e) => setNewConnection({...newConnection, site: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="datadoghq.com">US1 (datadoghq.com)</option>
                    <option value="us3.datadoghq.com">US3 (us3.datadoghq.com)</option>
                    <option value="us5.datadoghq.com">US5 (us5.datadoghq.com)</option>
                    <option value="datadoghq.eu">EU (datadoghq.eu)</option>
                    <option value="ap1.datadoghq.com">AP1 (ap1.datadoghq.com)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API Key</label>
                  <input
                    type="password"
                    value={newConnection.apiKey}
                    onChange={(e) => setNewConnection({...newConnection, apiKey: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Your Datadog API Key"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Application Key</label>
                  <input
                    type="password"
                    value={newConnection.applicationKey}
                    onChange={(e) => setNewConnection({...newConnection, applicationKey: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Your Datadog Application Key"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddConnection(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddConnection}
                  disabled={saving || !newConnection.organizationName || !newConnection.apiKey || !newConnection.applicationKey}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Adding...' : 'Add Connection'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DatadogSettings;
