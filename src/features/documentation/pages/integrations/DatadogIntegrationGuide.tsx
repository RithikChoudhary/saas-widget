import React, { useState } from 'react';
import { BarChart3, Shield, Database, Code, CheckCircle, AlertTriangle, Zap, Users, Monitor } from 'lucide-react';
import DocumentationLayout from '../../components/DocumentationLayout';
import CodeBlock from '../../components/CodeBlock';

const DatadogIntegrationGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: BarChart3, description: 'Datadog integration capabilities' },
    { id: 'prerequisites', title: 'Prerequisites', icon: CheckCircle, description: 'API keys and application setup' },
    { id: 'authentication', title: 'Authentication', icon: Shield, description: 'API Key + Application Key' },
    { id: 'database', title: 'Database Models', icon: Database, description: 'Datadog data models' },
    { id: 'backend', title: 'Backend Implementation', icon: Code, description: 'Services and API endpoints' },
    { id: 'sync', title: 'Data Synchronization', icon: Zap, description: 'Users, teams, and organization sync' },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: AlertTriangle, description: 'Common issues and solutions' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-900/20 dark:via-violet-900/20 dark:to-indigo-900/20 border border-purple-200/50 dark:border-purple-700/50 rounded-3xl p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Datadog Integration</h3>
                  <p className="text-purple-700 dark:text-purple-300 text-lg">Monitoring and observability platform</p>
                </div>
              </div>
              
              <p className="text-purple-800 dark:text-purple-200 mb-8 text-lg leading-relaxed">
                Integrate Datadog to manage users, teams, monitors, dashboards, and organization settings. 
                This integration uses API Key + Application Key authentication for comprehensive monitoring platform management.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center text-lg">
                    <Zap className="h-6 w-6 mr-3 text-yellow-500" />
                    Key Features
                  </h4>
                  <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-3">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>User Management</strong> - Organization users and permissions</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Team Synchronization</strong> - Teams and memberships</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Monitor Configuration</strong> - Alerts and monitoring</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Dashboard Access</strong> - Custom dashboards</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center text-lg">
                    <Shield className="h-6 w-6 mr-3 text-green-500" />
                    Authentication Method
                  </h4>
                  <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-3">
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🔑</span>
                      <span><strong>API Key</strong> - Organization-level access</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">📱</span>
                      <span><strong>Application Key</strong> - User-specific permissions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🌐</span>
                      <span><strong>Site Selection</strong> - US/EU data centers</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🎯</span>
                      <span><strong>Scoped Access</strong> - Resource-specific permissions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Monitor className="h-7 w-7 mr-3 text-purple-600" />
                Datadog API Capabilities
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-500" />
                    User & Team Management
                  </h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• User profiles and roles</li>
                    <li>• Team creation and management</li>
                    <li>• Permission assignments</li>
                    <li>• Organization settings</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Monitor className="h-5 w-5 mr-2 text-green-500" />
                    Monitoring & Alerts
                  </h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• Monitor configurations</li>
                    <li>• Alert policies</li>
                    <li>• Downtime scheduling</li>
                    <li>• SLO management</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
                    Data & Analytics
                  </h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• Custom dashboards</li>
                    <li>• Metrics and logs</li>
                    <li>• Usage analytics</li>
                    <li>• API usage tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'prerequisites':
        return (
          <div className="space-y-8">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-3xl p-8">
              <h3 className="text-2xl font-semibold text-green-900 dark:text-green-100 mb-6 flex items-center">
                <CheckCircle className="h-8 w-8 mr-4 text-green-600" />
                Datadog API Setup
              </h3>
              
              <div className="space-y-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-green-900 dark:text-green-100 mb-4 text-lg">1. Generate API Key</h4>
                  <ol className="text-green-800 dark:text-green-200 space-y-2 list-decimal list-inside">
                    <li>Go to <a href="https://app.datadoghq.com/organization-settings/api-keys" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Datadog API Keys</a></li>
                    <li>Click "New Key" and provide a name</li>
                    <li>Copy the generated API key</li>
                    <li>Store securely - this provides organization-level access</li>
                  </ol>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-green-900 dark:text-green-100 mb-4 text-lg">2. Create Application Key</h4>
                  <ol className="text-green-800 dark:text-green-200 space-y-2 list-decimal list-inside">
                    <li>Go to <a href="https://app.datadoghq.com/organization-settings/application-keys" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Datadog Application Keys</a></li>
                    <li>Click "New Key" and provide a name</li>
                    <li>Copy the generated application key</li>
                    <li>This key inherits the user's permissions</li>
                  </ol>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-green-900 dark:text-green-100 mb-4 text-lg">3. Required Permissions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold mb-2">User Management:</h5>
                      <ul className="text-sm space-y-1">
                        <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">users_read</code></li>
                        <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">users_write</code></li>
                        <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">org_management</code></li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">Monitoring:</h5>
                      <ul className="text-sm space-y-1">
                        <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">monitors_read</code></li>
                        <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">dashboards_read</code></li>
                        <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">metrics_read</code></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'authentication':
        return (
          <div className="space-y-8">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-3xl p-8">
              <h3 className="text-2xl font-semibold text-yellow-900 dark:text-yellow-100 mb-6 flex items-center">
                <Shield className="h-8 w-8 mr-4 text-yellow-600" />
                API Key Authentication
              </h3>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Datadog Connection Service</h4>
              
              <CodeBlock
                title="datadogConnectionService.ts"
                language="typescript"
                showLineNumbers
                code={`import { DatadogConnection, DatadogUser, DatadogTeam } from '../../../../database/models';
import { encrypt, decrypt } from '../../../../utils/encryption';
import { CredentialsService } from '../../../credentials/services/credentialsService';
import axios from 'axios';

export class DatadogConnectionService {
  private credentialsService: CredentialsService;

  constructor() {
    this.credentialsService = new CredentialsService();
  }

  async createConnection(companyId: string): Promise<any> {
    // Get company-specific Datadog credentials
    const credentialsData = await this.credentialsService.getDecryptedCredentials(companyId, 'datadog');
    
    if (!credentialsData) {
      throw new Error('Datadog credentials not configured for this company');
    }

    const { apiKey, applicationKey, site = 'datadoghq.com' } = credentialsData;
    
    if (!apiKey || !applicationKey) {
      throw new Error('Both API Key and Application Key are required for Datadog integration');
    }

    // Test the connection by fetching organization info
    const baseUrl = \`https://api.\${site}\`;
    
    try {
      const response = await axios.get(\`\${baseUrl}/api/v1/org\`, {
        headers: {
          'DD-API-KEY': apiKey,
          'DD-APPLICATION-KEY': applicationKey,
          'Content-Type': 'application/json'
        }
      });

      const orgData = response.data.org;

      // Encrypt and store credentials
      const encryptedApiKey = encrypt(apiKey);
      const encryptedApplicationKey = encrypt(applicationKey);

      // Create or update connection
      const connection = await DatadogConnection.findOneAndUpdate(
        {
          companyId,
          organizationId: orgData.public_id
        },
        {
          organizationName: orgData.name,
          site,
          apiKey: encryptedApiKey,
          applicationKey: encryptedApplicationKey,
          connectionType: 'api-key',
          isActive: true,
          lastSync: new Date()
        },
        { upsert: true, new: true }
      );

      return {
        success: true,
        connectionId: connection._id,
        organizationName: orgData.name,
        organizationId: orgData.public_id
      };
    } catch (error: any) {
      console.error('Datadog connection test failed:', error);
      throw new Error(\`Failed to connect to Datadog: \${error.response?.data?.errors?.[0] || error.message}\`);
    }
  }

  async getConnections(companyId: string): Promise<any[]> {
    const connections = await DatadogConnection.find({
      companyId,
      isActive: true
    }).select('-apiKey -applicationKey');

    return connections.map((conn: any) => ({
      id: conn._id.toString(),
      organizationId: conn.organizationId,
      organizationName: conn.organizationName,
      site: conn.site,
      connectionType: conn.connectionType,
      isActive: conn.isActive,
      lastSync: conn.lastSync,
      createdAt: conn.createdAt
    }));
  }

  async testConnection(connectionId: string, companyId: string): Promise<any> {
    const connection = await DatadogConnection.findOne({
      _id: connectionId,
      companyId,
      isActive: true
    });

    if (!connection) {
      throw new Error('Connection not found');
    }

    const apiKey = decrypt(connection.apiKey);
    const applicationKey = decrypt(connection.applicationKey);
    const baseUrl = \`https://api.\${connection.site}\`;

    const response = await axios.get(\`\${baseUrl}/api/v1/validate\`, {
      headers: {
        'DD-API-KEY': apiKey,
        'DD-APPLICATION-KEY': applicationKey,
        'Content-Type': 'application/json'
      }
    });

    return {
      success: response.data.valid,
      message: response.data.valid ? 'Connection successful' : 'Invalid credentials'
    };
  }
}`}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="p-8 text-center">
            <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-3">Section In Progress</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">This section is being developed as part of the Datadog integration.</p>
          </div>
        );
    }
  };

  return (
    <DocumentationLayout
      title="Datadog Integration Guide"
      description="Complete guide for integrating Datadog monitoring platform"
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      showBackButton
      backTo="/docs"
    >
      {renderContent()}
    </DocumentationLayout>
  );
};

export default DatadogIntegrationGuide;
