import React, { useState, useEffect } from 'react';
import { Layout, AppIcon } from '../../shared/components';
import api from '../../shared/utils/api';
import { 
  Plus, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Wifi,
  WifiOff,
  ExternalLink,
  Shield,
  Database,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Key,
  Zap,
  Activity,
  Users,
  Hash,
  MessageCircle,
  Book,
  HelpCircle
} from 'lucide-react';

interface ServiceStatus {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  status: string;
  actionText: string;
  oauthAvailable: boolean;
  hasCredentials: boolean;
  hasActiveConnection: boolean;
  isImplemented: boolean;
}

interface Connection {
  id: string;
  appType: string;
  name: string;
  isConnected: boolean;
  connectionType: 'oauth' | 'credentials';
  lastSync?: string;
  connectionDetails?: any;
}

const CredentialsManagement: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showConnectionOptions, setShowConnectionOptions] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceStatus | null>(null);
  const [requirements, setRequirements] = useState<any>(null);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [saving, setSaving] = useState(false);
  const [appName, setAppName] = useState('');
  const [testing, setTesting] = useState<string | null>(null);

  useEffect(() => {
    fetchServicesAndConnections();
    
    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const service = urlParams.get('service');
    
    if (success === 'true' && service) {
      alert(`${service} connected successfully!`);
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchServicesAndConnections();
    } else if (error) {
      alert(`Connection failed: ${error}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchServicesAndConnections = async () => {
    try {
      setLoading(true);
      console.log('🔍 Connection Hub: Fetching services and connections...');
      
      const [servicesResponse, connectionsResponse] = await Promise.allSettled([
        api.get('/credentials/services/status'),
        fetchAllConnections()
      ]);

      if (servicesResponse.status === 'fulfilled') {
        setServices(servicesResponse.value.data.data || []);
        console.log('📊 Services status:', servicesResponse.value.data.data?.length || 0);
      }

      if (connectionsResponse.status === 'fulfilled') {
        setConnections(connectionsResponse.value || []);
        console.log('📊 Active connections:', connectionsResponse.value?.length || 0);
      }
    } catch (error) {
      console.error('❌ Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllConnections = async (): Promise<Connection[]> => {
    try {
      const [
        slackResponse,
        googleWorkspaceResponse,
        githubResponse,
        zoomResponse
      ] = await Promise.allSettled([
        api.get('/integrations/slack/connections'),
        api.get('/integrations/google-workspace/connections'),
        api.get('/integrations/github/connections'),
        api.get('/integrations/zoom/connections')
      ]);

      let allConnections: Connection[] = [];

      // Process Slack connections
      if (slackResponse.status === 'fulfilled' && slackResponse.value.data.success) {
        const slackConns = slackResponse.value.data.data || [];
        allConnections = [...allConnections, ...slackConns.map((conn: any) => ({
          id: conn.id,
          appType: 'slack',
          name: conn.workspaceName || 'Slack Workspace',
          isConnected: conn.isActive,
          connectionType: 'oauth' as const,
          lastSync: conn.lastSync,
          connectionDetails: conn
        }))];
      }

      // Process Google Workspace connections
      if (googleWorkspaceResponse.status === 'fulfilled' && googleWorkspaceResponse.value.data.success) {
        const gwConns = googleWorkspaceResponse.value.data.connections || [];
        allConnections = [...allConnections, ...gwConns.map((conn: any) => ({
          id: conn._id,
          appType: 'google-workspace',
          name: `${conn.domain} (${conn.connectionType})`,
          isConnected: conn.isActive,
          connectionType: conn.connectionType === 'oauth' ? 'oauth' : 'credentials',
          lastSync: conn.lastSync,
          connectionDetails: conn
        }))];
      }

      // Process GitHub connections
      if (githubResponse.status === 'fulfilled' && githubResponse.value.data.success) {
        const githubConns = githubResponse.value.data.data || [];
        allConnections = [...allConnections, ...githubConns.map((conn: any) => ({
          id: conn.id,
          appType: 'github',
          name: conn.organizationName || conn.username || 'GitHub Connection',
          isConnected: conn.isActive,
          connectionType: 'oauth' as const,
          lastSync: conn.lastSync,
          connectionDetails: conn
        }))];
      }

      // Process Zoom connections
      if (zoomResponse.status === 'fulfilled' && zoomResponse.value.data.success) {
        const zoomConns = zoomResponse.value.data.data || [];
        allConnections = [...allConnections, ...zoomConns.map((conn: any) => ({
          id: conn.id,
          appType: 'zoom',
          name: conn.accountName || 'Zoom Account',
          isConnected: conn.isActive,
          connectionType: 'oauth' as const,
          lastSync: conn.lastSync,
          connectionDetails: conn
        }))];
      }

      return allConnections;
    } catch (error) {
      console.error('❌ Error fetching connections:', error);
      return [];
    }
  };

  const handleConnect = async (service: ServiceStatus) => {
    if (service.status === 'coming-soon' || !service.isImplemented) {
      alert(`${service.name} integration is coming soon!`);
      return;
    }

    if (service.status === 'setup-required') {
      // Show connection options if service supports multiple methods
      if (['slack', 'google-workspace', 'github', 'zoom'].includes(service.id)) {
        setSelectedService(service);
        setShowConnectionOptions(true);
        return;
      } else {
        // For services with only one connection method (like AWS), go directly to setup
        handleSetupCredentials(service);
        return;
      }
    }

    try {
      setConnecting(service.id);
      console.log(`🔄 ${service.name}: Initiating smart connect...`);
      
      const response = await api.post(`/credentials/services/${service.id}/connect`);
      
      if (response.data.success) {
        if (response.data.action === 'oauth-redirect' && response.data.authUrl) {
          console.log(`✅ ${service.name}: Redirecting to OAuth...`);
          window.location.href = response.data.authUrl;
        } else if (response.data.action === 'connected') {
          console.log(`✅ ${service.name}: Connected successfully`);
          alert(`${service.name} connected successfully!`);
          fetchServicesAndConnections();
        } else {
          throw new Error(response.data.message || 'Unexpected response');
        }
      } else {
        if (response.data.action === 'setup-required') {
          console.log(`⚠️ ${service.name}: Setup required`);
          handleSetupCredentials(service);
        } else if (response.data.action === 'credentials-invalid') {
          console.log(`⚠️ ${service.name}: Credentials invalid`);
          alert(`${service.name} credentials are invalid. Please re-enter your credentials.`);
          handleSetupCredentials(service);
        } else {
          throw new Error(response.data.message || 'Connection failed');
        }
      }
    } catch (error: any) {
      console.error(`❌ ${service.name} Connect Error:`, error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      
      if (errorMessage.includes('not configured') || errorMessage.includes('credentials') || errorMessage.includes('setup')) {
        alert(`${service.name} requires setup. Please configure credentials first.`);
        handleSetupCredentials(service);
      } else {
        alert(`Failed to connect to ${service.name}: ${errorMessage}`);
      }
    } finally {
      setConnecting(null);
    }
  };

  const handleSetupCredentials = async (service: ServiceStatus) => {
    try {
      setSelectedService(service);
      
      const response = await api.get(`/credentials/requirements/${service.id}`);
      setRequirements(response.data.data);
      
      const initialData: { [key: string]: string } = {};
      response.data.data.fields.forEach((field: any) => {
        initialData[field.name] = field.default || '';
      });
      setFormData(initialData);
      setAppName(`${service.name} Production`);
      setShowSetupModal(true);
    } catch (error) {
      console.error('Error fetching requirements:', error);
      alert('Failed to load setup requirements');
    }
  };

  const handleSaveCredentials = async () => {
    if (!requirements || !selectedService) return;

    const missingFields = requirements.fields
      .filter((field: any) => field.required && !formData[field.name])
      .map((field: any) => field.label);

    if (missingFields.length > 0) {
      alert(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    if (!appName.trim()) {
      alert('Please provide a name for this credential set');
      return;
    }

    try {
      setSaving(true);
      
      await api.post('/credentials', {
        appType: selectedService.id,
        appName: appName.trim(),
        credentials: formData
      });

      alert('Credentials saved successfully! You can now connect.');
      setShowSetupModal(false);
      setFormData({});
      setSelectedService(null);
      setRequirements(null);
      setAppName('');
      fetchServicesAndConnections();
    } catch (error: any) {
      console.error('Error saving credentials:', error);
      alert('Failed to save credentials: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async (connection: Connection) => {
    try {
      setTesting(connection.id);
      console.log(`🔄 Testing ${connection.appType} connection...`);
      
      const response = await api.post(`/credentials/${connection.appType}/test`, {
        appName: connection.name
      });
      
      if (response.data.success) {
        alert(`✅ ${connection.name} connection test successful!`);
      } else {
        alert(`❌ ${connection.name} connection test failed: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error('Test error:', error);
      alert(`❌ Test failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setTesting(null);
    }
  };

  const handleDisconnect = async (connection: Connection) => {
    if (!confirm(`Disconnect "${connection.name}"? This will remove access to the service.`)) {
      return;
    }

    try {
      let endpoint = '';
      if (connection.connectionType === 'oauth') {
        switch (connection.appType) {
          case 'slack':
            endpoint = `/integrations/slack/connections/${connection.id}`;
            break;
          case 'google-workspace':
            endpoint = `/integrations/google-workspace/connections/${connection.id}`;
            break;
          case 'github':
            endpoint = `/integrations/github/connections/${connection.id}`;
            break;
          case 'zoom':
            endpoint = `/integrations/zoom/connections/${connection.id}`;
            break;
        }
      } else {
        endpoint = `/credentials/${connection.appType}/${encodeURIComponent(connection.name)}`;
      }

      await api.delete(endpoint);
      alert('Connection disconnected successfully!');
      fetchServicesAndConnections();
    } catch (error: any) {
      console.error('Error disconnecting:', error);
      alert(`Failed to disconnect: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleServiceDisconnect = async (service: ServiceStatus) => {
    if (!confirm(`Disconnect "${service.name}"? This will remove all credentials and connection data for this service.`)) {
      return;
    }

    try {
      console.log(`🔄 Disconnecting ${service.name}...`);
      
      // Call the comprehensive disconnect endpoint that will:
      // 1. Delete app credentials
      // 2. Remove connection data
      // 3. Clean up related service data
      const response = await api.delete(`/credentials/services/${service.id}/disconnect`);
      
      if (response.data.success) {
        console.log(`✅ ${service.name} disconnected successfully`);
        alert(`${service.name} has been disconnected and all related data has been removed.`);
        fetchServicesAndConnections();
      } else {
        throw new Error(response.data.message || 'Failed to disconnect service');
      }
    } catch (error: any) {
      console.error(`❌ Error disconnecting ${service.name}:`, error);
      
      // If the comprehensive endpoint doesn't exist, fall back to manual cleanup
      if (error.response?.status === 404) {
        console.log(`⚠️ Comprehensive disconnect endpoint not found, attempting manual cleanup for ${service.name}...`);
        await handleManualServiceDisconnect(service);
      } else {
        alert(`Failed to disconnect ${service.name}: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleManualServiceDisconnect = async (service: ServiceStatus) => {
    try {
      console.log(`🔧 Manual cleanup for ${service.name}...`);
      
      // Step 1: Delete app credentials
      try {
        await api.delete(`/credentials/services/${service.id}`);
        console.log(`✅ Deleted credentials for ${service.name}`);
      } catch (error) {
        console.warn(`⚠️ Could not delete credentials for ${service.name}:`, error);
      }

      // Step 2: Delete connection data based on service type
      try {
        switch (service.id) {
          case 'slack':
            const slackConnections = await api.get('/integrations/slack/connections');
            if (slackConnections.data.success && slackConnections.data.data?.length > 0) {
              for (const conn of slackConnections.data.data) {
                await api.delete(`/integrations/slack/connections/${conn.id}`);
              }
            }
            break;
            
          case 'google-workspace':
            const gwConnections = await api.get('/integrations/google-workspace/connections');
            if (gwConnections.data.success && gwConnections.data.connections?.length > 0) {
              for (const conn of gwConnections.data.connections) {
                await api.delete(`/integrations/google-workspace/connections/${conn._id}`);
              }
            }
            break;
            
          case 'github':
            const githubConnections = await api.get('/integrations/github/connections');
            if (githubConnections.data.success && githubConnections.data.data?.length > 0) {
              for (const conn of githubConnections.data.data) {
                await api.delete(`/integrations/github/connections/${conn.id}`);
              }
            }
            break;
            
          case 'zoom':
            const zoomConnections = await api.get('/integrations/zoom/connections');
            if (zoomConnections.data.success && zoomConnections.data.data?.length > 0) {
              for (const conn of zoomConnections.data.data) {
                await api.delete(`/integrations/zoom/connections/${conn.id}`);
              }
            }
            break;
            
          case 'aws':
            // AWS uses credentials-based connection, no separate connection records to delete
            console.log(`ℹ️ AWS uses credential-based connection, no additional cleanup needed`);
            break;
        }
        
        console.log(`✅ Cleaned up connection data for ${service.name}`);
      } catch (error) {
        console.warn(`⚠️ Could not clean up all connection data for ${service.name}:`, error);
      }

      alert(`${service.name} has been disconnected successfully.`);
      fetchServicesAndConnections();
    } catch (error: any) {
      console.error(`❌ Manual cleanup failed for ${service.name}:`, error);
      alert(`Failed to completely disconnect ${service.name}. Some data may remain. Please try again or contact support.`);
    }
  };

  const getServiceIcon = (serviceId: string) => {
    return <AppIcon appType={serviceId} size="lg" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600';
      case 'setup-required': return 'text-yellow-600';
      case 'coming-soon': return 'text-gray-500';
      case 'credentials-invalid': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'setup-required': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'coming-soon': return <Clock className="h-4 w-4 text-gray-500" />;
      case 'credentials-invalid': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };

  const availableServices = services.filter(s => s.status !== 'coming-soon' || s.isImplemented);
  const comingSoonServices = services.filter(s => s.status === 'coming-soon' && !s.isImplemented);
  // Use services with hasActiveConnection flag instead of connections array
  const connectedServices = services.filter(s => s.hasActiveConnection);

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">Connection Hub</h1>
                  <p className="mt-1 text-blue-100 text-lg">
                    Centralized management for all your SaaS integrations
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{connectedServices.length}</div>
                <div className="text-blue-100">Active Connections</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Services</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{availableServices.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Connected</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{connectedServices.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">OAuth Connections</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {connections.filter(c => c.connectionType === 'oauth').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-yellow-500">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Coming Soon</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{comingSoonServices.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200 dark:border-teal-700 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-teal-100 dark:bg-teal-900 rounded-lg">
                <Book className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-100 mb-2">Need Help Setting Up Integrations?</h3>
                <p className="text-teal-800 dark:text-teal-200 mb-4">
                  Check out our comprehensive integration guides with step-by-step instructions, code examples, and troubleshooting tips.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => window.location.href = '/docs'}
                    className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Book className="h-4 w-4 mr-2" />
                    Documentation Hub
                  </button>
                  <button
                    onClick={() => window.location.href = '/docs/integration-guide'}
                    className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 border border-teal-300 dark:border-teal-600 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Integration Guide
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Available Services */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Available Services</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Connect to your favorite SaaS platforms</p>
              </div>
              <button
                onClick={() => window.location.href = '/docs'}
                className="inline-flex items-center px-3 py-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
              >
                <Book className="h-4 w-4 mr-1" />
                View Guides
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {availableServices.map((service) => (
                  <div
                    key={`available-${service.id}`}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-500"
                    onClick={() => handleConnect(service)}
                  >
                    <div className="flex justify-center mb-3">
                      <div className={`p-3 rounded-lg ${service.color.replace('text-', 'text-').replace('border-', 'bg-').replace('bg-', 'bg-opacity-20 ')}`}>
                        {getServiceIcon(service.id)}
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">{service.name}</h3>
                    <div className="flex items-center justify-center mb-2">
                      {getStatusIcon(service.status)}
                    </div>
                    <button
                      disabled={connecting === service.id}
                      className={`w-full px-3 py-1 text-xs rounded transition-colors ${
                        service.status === 'available'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : service.status === 'setup-required'
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-gray-400 text-white cursor-not-allowed'
                      }`}
                    >
                      {connecting === service.id ? 'Connecting...' : service.actionText}
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Coming Soon Services */}
              {comingSoonServices.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Coming Soon</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {comingSoonServices.map((service) => (
                      <div
                        key={`coming-soon-${service.id}`}
                        className="bg-gray-100 dark:bg-gray-600 rounded-lg p-4 text-center opacity-60"
                      >
                        <div className="flex justify-center mb-3">
                          <div className="p-3 bg-gray-200 dark:bg-gray-500 rounded-lg">
                            {getServiceIcon(service.id)}
                          </div>
                        </div>
                        <h3 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-1">{service.name}</h3>
                        <div className="flex items-center justify-center mb-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                        </div>
                        <button
                          disabled
                          className="w-full px-3 py-1 text-xs rounded bg-gray-400 text-white cursor-not-allowed"
                        >
                          Coming Soon
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Connected Services */}
          {connectedServices.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Connected Services</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage your active connections</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {connectedServices.map((service) => (
                    <div key={service.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${service.color.replace('text-', 'bg-').replace('border-', 'bg-').replace('bg-', 'bg-opacity-20 ')}`}>
                            {getServiceIcon(service.id)}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{service.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {service.id === 'google-workspace' ? 'Service Account (OAuth)' :
                               service.id === 'aws' ? 'Access Keys' :
                               service.id === 'github' ? 'Personal Access Token' :
                               service.id === 'slack' ? 'OAuth Connection' :
                               service.id === 'zoom' ? 'OAuth Connection' :
                               'API Credentials'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Status: {service.actionText}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Wifi className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">Connected</span>
                          </div>
                          <button
                            onClick={() => window.location.href = `/apps/${service.id}`}
                            className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            Manage
                          </button>
                          <button
                            onClick={() => handleServiceDisconnect(service)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Disconnect
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {connectedServices.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <Database className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No connections yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start by connecting your first service to enable integrations and data management
              </p>
              <button
                onClick={() => {
                  const slackService = services.find(s => s.id === 'slack');
                  if (slackService) handleConnect(slackService);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Connect Your First Service
              </button>
            </div>
          )}
        </div>

        {/* Connection Options Modal */}
        {showConnectionOptions && selectedService && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Connect to {selectedService.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose your preferred connection method
                </p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {/* Service-specific connection options */}
                  {selectedService.id === 'google-workspace' && (
                    <>
                      {/* Service Account Option */}
                      <div 
                        className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
                        onClick={() => {
                          setShowConnectionOptions(false);
                          handleSetupCredentials(selectedService);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">Service Account</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Use Google Cloud service account with domain-wide delegation
                            </p>
                            <div className="flex items-center mt-1">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                              <span className="text-xs text-green-600">Recommended</span>
                            </div>
                          </div>
                          <Key className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      {/* OAuth Login Option */}
                      <div 
                        className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                        onClick={async () => {
                          setShowConnectionOptions(false);
                          try {
                            setConnecting(selectedService.id);
                            console.log('🔄 Initiating Google Workspace OAuth...');
                            
                            // Use the specific Google Workspace OAuth endpoint
                            const response = await api.post('/integrations/google-workspace/oauth/initiate', {
                              companyId: 'current-company' // This will be handled by the backend auth middleware
                            });
                            
                            if (response.data.success && response.data.authUrl) {
                              console.log('✅ Google Workspace OAuth URL generated, redirecting...');
                              window.location.href = response.data.authUrl;
                            } else {
                              throw new Error(response.data.message || 'Failed to get OAuth URL');
                            }
                          } catch (error: any) {
                            console.error('OAuth connection error:', error);
                            if (error.response?.data?.action === 'setup-required') {
                              handleSetupCredentials(selectedService);
                            } else {
                              alert(`Failed to connect: ${error.response?.data?.message || error.message}`);
                            }
                          } finally {
                            setConnecting(null);
                          }
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <ExternalLink className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">OAuth Login</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Connect using Google OAuth flow with workspace permissions
                            </p>
                            <div className="flex items-center mt-1">
                              <CheckCircle className="h-4 w-4 text-blue-600 mr-1" />
                              <span className="text-xs text-blue-600">Available</span>
                            </div>
                          </div>
                          <ExternalLink className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </>
                  )}

                  {selectedService.id === 'slack' && (
                    <>
                      {/* OAuth Option */}
                      <div 
                        className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
                        onClick={async () => {
                          setShowConnectionOptions(false);
                          try {
                            setConnecting(selectedService.id);
                            const response = await api.post(`/credentials/services/${selectedService.id}/connect`);
                            
                            if (response.data.success && response.data.action === 'oauth-redirect' && response.data.authUrl) {
                              window.location.href = response.data.authUrl;
                            } else if (response.data.action === 'setup-required') {
                              handleSetupCredentials(selectedService);
                            } else {
                              alert(response.data.message || 'Connection failed');
                            }
                          } catch (error: any) {
                            console.error('OAuth connection error:', error);
                            if (error.response?.data?.action === 'setup-required') {
                              handleSetupCredentials(selectedService);
                            } else {
                              alert(`Failed to connect: ${error.response?.data?.message || error.message}`);
                            }
                          } finally {
                            setConnecting(null);
                          }
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">OAuth Connection</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Secure OAuth flow with workspace permissions
                            </p>
                            <div className="flex items-center mt-1">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                              <span className="text-xs text-green-600">Recommended</span>
                            </div>
                          </div>
                          <ExternalLink className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      {/* Bot Token Option */}
                      <div 
                        className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                        onClick={() => {
                          setShowConnectionOptions(false);
                          handleSetupCredentials(selectedService);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Key className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">Bot Token</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Use Slack bot token for custom configurations
                            </p>
                            <div className="flex items-center mt-1">
                              <Settings className="h-4 w-4 text-blue-600 mr-1" />
                              <span className="text-xs text-blue-600">Advanced</span>
                            </div>
                          </div>
                          <Key className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </>
                  )}

                  {selectedService.id === 'github' && (
                    <>
                      {/* Personal Access Token */}
                      <div 
                        className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
                        onClick={() => {
                          setShowConnectionOptions(false);
                          handleSetupCredentials(selectedService);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <Key className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">Personal Access Token</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Use GitHub personal access token for repository access
                            </p>
                            <div className="flex items-center mt-1">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                              <span className="text-xs text-green-600">Recommended</span>
                            </div>
                          </div>
                          <Key className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      {/* GitHub App */}
                      <div 
                        className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                        onClick={() => {
                          alert('GitHub App integration is not yet implemented. Please use Personal Access Token.');
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">GitHub App</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Install GitHub App for organization-wide access (Coming Soon)
                            </p>
                            <div className="flex items-center mt-1">
                              <Clock className="h-4 w-4 text-gray-500 mr-1" />
                              <span className="text-xs text-gray-500">Coming Soon</span>
                            </div>
                          </div>
                          <Shield className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </>
                  )}

                  {selectedService.id === 'zoom' && (
                    <>
                      {/* OAuth Connection */}
                      <div 
                        className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
                        onClick={async () => {
                          setShowConnectionOptions(false);
                          try {
                            setConnecting(selectedService.id);
                            const response = await api.post(`/credentials/services/${selectedService.id}/connect`);
                            
                            if (response.data.success && response.data.action === 'oauth-redirect' && response.data.authUrl) {
                              window.location.href = response.data.authUrl;
                            } else if (response.data.action === 'setup-required') {
                              handleSetupCredentials(selectedService);
                            } else {
                              alert(response.data.message || 'Connection failed');
                            }
                          } catch (error: any) {
                            console.error('OAuth connection error:', error);
                            if (error.response?.data?.action === 'setup-required') {
                              handleSetupCredentials(selectedService);
                            } else {
                              alert(`Failed to connect: ${error.response?.data?.message || error.message}`);
                            }
                          } finally {
                            setConnecting(null);
                          }
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">OAuth Connection</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              OAuth flow with meeting and user management permissions
                            </p>
                            <div className="flex items-center mt-1">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                              <span className="text-xs text-green-600">Recommended</span>
                            </div>
                          </div>
                          <ExternalLink className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      {/* JWT/API Keys */}
                      <div 
                        className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                        onClick={() => {
                          setShowConnectionOptions(false);
                          handleSetupCredentials(selectedService);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Key className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">JWT/API Keys</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Use Zoom JWT or API key/secret for custom integrations
                            </p>
                            <div className="flex items-center mt-1">
                              <Settings className="h-4 w-4 text-blue-600 mr-1" />
                              <span className="text-xs text-blue-600">Advanced</span>
                            </div>
                          </div>
                          <Key className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Connection Methods</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {selectedService.id === 'slack' && 'OAuth provides workspace-level access, while Bot Token allows custom bot configurations.'}
                        {selectedService.id === 'google-workspace' && 'Service Account provides domain-wide access for administrative operations. OAuth login provides workspace-level permissions.'}
                        {selectedService.id === 'github' && 'Personal Access Tokens provide repository and organization access. GitHub App integration is coming soon.'}
                        {selectedService.id === 'zoom' && 'OAuth provides meeting and user management access. JWT/API keys allow custom integrations.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => {
                    setShowConnectionOptions(false);
                    setSelectedService(null);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Setup Modal */}
        {showSetupModal && selectedService && requirements && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Setup {selectedService.name} Credentials
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Configure credentials to enable connections for {selectedService.name}
                </p>
              </div>
              
              <div className="p-6">
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Setup Instructions</h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">{requirements.instructions}</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Credential Set Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder={`e.g., "${selectedService.name} Production"`}
                    required
                  />
                </div>

                <div className="space-y-4">
                  {requirements.fields.map((field: any) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <div className="relative">
                        {field.type === 'textarea' ? (
                          <textarea
                            value={formData[field.name] || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              [field.name]: e.target.value
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder={field.default || `Enter ${field.label.toLowerCase()}`}
                            required={field.required}
                            rows={6}
                          />
                        ) : (
                          <input
                            type={field.type === 'password' && !showPasswords[field.name] ? 'password' : field.type}
                            value={formData[field.name] || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              [field.name]: e.target.value
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder={field.default || `Enter ${field.label.toLowerCase()}`}
                            required={field.required}
                          />
                        )}
                        {field.type === 'password' && (
                          <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({
                              ...prev,
                              [field.name]: !prev[field.name]
                            }))}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                          >
                            {showPasswords[field.name] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowSetupModal(false);
                    setFormData({});
                    setSelectedService(null);
                    setRequirements(null);
                    setAppName('');
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCredentials}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save & Connect'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CredentialsManagement;
