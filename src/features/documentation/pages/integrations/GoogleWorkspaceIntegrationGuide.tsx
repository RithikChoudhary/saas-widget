import React, { useState } from 'react';
import { 
  Cloud, 
  Shield, 
  Database, 
  Code, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Users,
  Settings
} from 'lucide-react';
import DocumentationLayout from '../../components/DocumentationLayout';
import CodeBlock from '../../components/CodeBlock';

const GoogleWorkspaceIntegrationGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Cloud,
      description: 'Google Workspace integration capabilities'
    },
    {
      id: 'prerequisites',
      title: 'Prerequisites',
      icon: CheckCircle,
      description: 'Service account and API setup'
    },
    {
      id: 'authentication',
      title: 'Service Account Setup',
      icon: Shield,
      description: 'Service account and OAuth configuration'
    },
    {
      id: 'database',
      title: 'Database Models',
      icon: Database,
      description: 'Google Workspace data models'
    },
    {
      id: 'backend',
      title: 'Backend Implementation',
      icon: Code,
      description: 'Services and API endpoints'
    },
    {
      id: 'sync',
      title: 'Data Synchronization',
      icon: Zap,
      description: 'User and organization sync'
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: AlertTriangle,
      description: 'Common issues and solutions'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-3xl p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Cloud className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Google Workspace Integration</h3>
                  <p className="text-blue-700 dark:text-blue-300 text-lg">Complete Google Workspace management</p>
                </div>
              </div>
              
              <p className="text-blue-800 dark:text-blue-200 mb-8 text-lg leading-relaxed">
                Integrate Google Workspace to manage users, groups, organizational units, and workspace settings. 
                This integration supports both Service Account authentication for admin operations and OAuth 2.0 for user authorization.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center text-lg">
                    <Zap className="h-6 w-6 mr-3 text-yellow-500" />
                    Key Features
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-3">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>User Management</strong> - Complete user lifecycle management</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Group Synchronization</strong> - Groups and membership sync</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Organizational Units</strong> - OU structure management</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Usage Analytics</strong> - Workspace usage insights</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center text-lg">
                    <Shield className="h-6 w-6 mr-3 text-green-500" />
                    Authentication Methods
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-3">
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🔑</span>
                      <span><strong>Service Account</strong> - Admin-level access</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🔐</span>
                      <span><strong>OAuth 2.0</strong> - User authorization</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">👤</span>
                      <span><strong>Domain-wide Delegation</strong> - Impersonation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🎯</span>
                      <span><strong>Scoped Access</strong> - Granular permissions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Settings className="h-7 w-7 mr-3 text-blue-600" />
                Google Workspace APIs
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-500" />
                    Admin SDK
                  </h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• User management</li>
                    <li>• Group operations</li>
                    <li>• Organizational units</li>
                    <li>• Domain settings</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-green-500" />
                    Reports API
                  </h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• Usage statistics</li>
                    <li>• Activity reports</li>
                    <li>• Audit logs</li>
                    <li>• Security insights</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-purple-500" />
                    Directory API
                  </h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• Directory structure</li>
                    <li>• Contact management</li>
                    <li>• Resource calendars</li>
                    <li>• Chrome devices</li>
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
                Google Workspace Setup
              </h3>
              
              <div className="space-y-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-green-900 dark:text-green-100 mb-4 text-lg">1. Create Google Cloud Project</h4>
                  <ol className="text-green-800 dark:text-green-200 space-y-2 list-decimal list-inside">
                    <li>Go to <a href="https://console.cloud.google.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
                    <li>Create a new project or select existing one</li>
                    <li>Enable Google Workspace Admin SDK API</li>
                    <li>Enable Google Workspace Reports API</li>
                  </ol>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-green-900 dark:text-green-100 mb-4 text-lg">2. Create Service Account</h4>
                  <ol className="text-green-800 dark:text-green-200 space-y-2 list-decimal list-inside">
                    <li>Navigate to IAM & Admin → Service Accounts</li>
                    <li>Click "Create Service Account"</li>
                    <li>Provide name and description</li>
                    <li>Download the JSON key file</li>
                    <li>Enable domain-wide delegation</li>
                  </ol>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-green-900 dark:text-green-100 mb-4 text-lg">3. Configure Domain-wide Delegation</h4>
                  <ol className="text-green-800 dark:text-green-200 space-y-2 list-decimal list-inside">
                    <li>Go to Google Admin Console</li>
                    <li>Navigate to Security → API Controls</li>
                    <li>Click "Manage Domain Wide Delegation"</li>
                    <li>Add the service account client ID</li>
                    <li>Add required OAuth scopes</li>
                  </ol>
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
                Service Account Authentication
              </h3>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Google Workspace Connection Service</h4>
              
              <CodeBlock
                title="googleWorkspaceConnectionService.ts"
                language="typescript"
                showLineNumbers
                code={`import { GoogleWorkspaceConnection } from '../../../../database/models';
import { encrypt, decrypt } from '../../../../utils/encryption';
import { CredentialsService } from '../../../credentials/services/credentialsService';
import { google } from 'googleapis';

export class GoogleWorkspaceConnectionService {
  private credentialsService: CredentialsService;

  constructor() {
    this.credentialsService = new CredentialsService();
  }

  async createConnection(companyId: string): Promise<any> {
    // Get company-specific Google Workspace credentials
    const credentialsData = await this.credentialsService.getDecryptedCredentials(companyId, 'google-workspace');
    
    if (!credentialsData) {
      throw new Error('Google Workspace credentials not configured for this company');
    }

    const { serviceAccountKey, adminEmail, domain } = credentialsData;
    
    if (!serviceAccountKey || !adminEmail) {
      throw new Error('Service Account Key and Admin Email are required');
    }

    try {
      // Parse service account key
      const serviceAccount = JSON.parse(serviceAccountKey);
      
      // Create JWT client for domain-wide delegation
      const jwtClient = new google.auth.JWT(
        serviceAccount.client_email,
        undefined,
        serviceAccount.private_key,
        [
          'https://www.googleapis.com/auth/admin.directory.user.readonly',
          'https://www.googleapis.com/auth/admin.directory.group.readonly',
          'https://www.googleapis.com/auth/admin.directory.orgunit.readonly',
          'https://www.googleapis.com/auth/admin.reports.usage.readonly'
        ],
        adminEmail // Subject for domain-wide delegation
      );

      // Test the connection
      await jwtClient.authorize();
      
      // Get domain info
      const admin = google.admin({ version: 'directory_v1', auth: jwtClient });
      const domainResponse = await admin.domains.list({ customer: 'my_customer' });
      const domains = domainResponse.data.domains || [];
      
      // Encrypt and store credentials
      const encryptedServiceAccountKey = encrypt(serviceAccountKey);

      // Create or update connection
      const connection = await GoogleWorkspaceConnection.findOneAndUpdate(
        {
          companyId,
          domain: domain || domains[0]?.domainName
        },
        {
          adminEmail,
          domain: domain || domains[0]?.domainName,
          serviceAccountKey: encryptedServiceAccountKey,
          connectionType: 'service-account',
          isActive: true,
          lastSync: new Date()
        },
        { upsert: true, new: true }
      );

      return {
        success: true,
        connectionId: connection._id,
        domain: connection.domain,
        adminEmail: connection.adminEmail
      };
    } catch (error: any) {
      console.error('Google Workspace connection test failed:', error);
      throw new Error(\`Failed to connect to Google Workspace: \${error.message}\`);
    }
  }

  async getConnections(companyId: string): Promise<any[]> {
    const connections = await GoogleWorkspaceConnection.find({
      companyId,
      isActive: true
    }).select('-serviceAccountKey');

    return connections.map((conn: any) => ({
      id: conn._id.toString(),
      domain: conn.domain,
      adminEmail: conn.adminEmail,
      connectionType: conn.connectionType,
      isActive: conn.isActive,
      lastSync: conn.lastSync,
      createdAt: conn.createdAt
    }));
  }
}`}
              />
            </div>
          </div>
        );

      case 'database':
        return (
          <div className="space-y-8">
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-3xl p-8">
              <h3 className="text-2xl font-semibold text-purple-900 dark:text-purple-100 mb-6 flex items-center">
                <Database className="h-8 w-8 mr-4 text-purple-600" />
                Google Workspace Database Models
              </h3>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">GoogleWorkspaceConnection Model</h4>
              
              <CodeBlock
                title="GoogleWorkspaceConnection.ts"
                language="typescript"
                showLineNumbers
                code={`import mongoose, { Schema, Document } from 'mongoose';

export interface IGoogleWorkspaceConnection extends Document {
  companyId: mongoose.Types.ObjectId;
  domain: string;
  adminEmail: string;
  customerId?: string;
  
  // Service Account credentials (encrypted)
  serviceAccountKey: {
    encrypted: string;
    iv: string;
    authTag: string;
  };
  
  // Connection metadata
  connectionType: 'service-account' | 'oauth';
  status: 'connected' | 'disconnected' | 'error';
  isActive: boolean;
  
  // Sync tracking
  lastSync?: Date;
  syncStatus?: 'pending' | 'in-progress' | 'completed' | 'failed';
  
  // Statistics
  userCount?: number;
  groupCount?: number;
  orgUnitCount?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const GoogleWorkspaceConnectionSchema: Schema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  domain: {
    type: String,
    required: true
  },
  adminEmail: {
    type: String,
    required: true
  },
  customerId: String,
  serviceAccountKey: {
    encrypted: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true }
  },
  connectionType: {
    type: String,
    enum: ['service-account', 'oauth'],
    default: 'service-account'
  },
  status: {
    type: String,
    enum: ['connected', 'disconnected', 'error'],
    default: 'connected'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastSync: Date,
  syncStatus: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'failed']
  },
  userCount: Number,
  groupCount: Number,
  orgUnitCount: Number
}, {
  timestamps: true,
  collection: 'google_workspace_connections'
});

// Indexes
GoogleWorkspaceConnectionSchema.index({ companyId: 1, domain: 1 }, { unique: true });
GoogleWorkspaceConnectionSchema.index({ companyId: 1, isActive: 1 });

export const GoogleWorkspaceConnection = mongoose.model<IGoogleWorkspaceConnection>('GoogleWorkspaceConnection', GoogleWorkspaceConnectionSchema);`}
              />
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">GoogleWorkspaceUser Model</h4>
              
              <CodeBlock
                title="GoogleWorkspaceUser.ts"
                language="typescript"
                showLineNumbers
                code={`export interface IGoogleWorkspaceUser extends Document {
  companyId: mongoose.Types.ObjectId;
  connectionId: mongoose.Types.ObjectId;
  
  // Google identifiers
  googleId: string;
  primaryEmail: string;
  customerId: string;
  
  // User profile
  name: {
    givenName?: string;
    familyName?: string;
    fullName?: string;
  };
  
  // Contact information
  emails: Array<{
    address: string;
    type?: string;
    primary?: boolean;
  }>;
  phones?: Array<{
    value: string;
    type?: string;
  }>;
  
  // Organizational info
  orgUnitPath: string;
  department?: string;
  title?: string;
  manager?: string;
  
  // Account status
  suspended: boolean;
  suspensionReason?: string;
  changePasswordAtNextLogin: boolean;
  isAdmin: boolean;
  isDelegatedAdmin: boolean;
  
  // Activity
  lastLoginTime?: Date;
  creationTime: Date;
  
  // Custom fields
  customSchemas?: any;
  
  // Sync metadata
  lastSync: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const GoogleWorkspaceUserSchema: Schema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  connectionId: {
    type: Schema.Types.ObjectId,
    ref: 'GoogleWorkspaceConnection',
    required: true,
    index: true
  },
  googleId: {
    type: String,
    required: true
  },
  primaryEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  customerId: String,
  name: {
    givenName: String,
    familyName: String,
    fullName: String
  },
  emails: [{
    address: { type: String, lowercase: true },
    type: String,
    primary: Boolean
  }],
  phones: [{
    value: String,
    type: String
  }],
  orgUnitPath: {
    type: String,
    default: '/'
  },
  department: String,
  title: String,
  manager: String,
  suspended: {
    type: Boolean,
    default: false
  },
  suspensionReason: String,
  changePasswordAtNextLogin: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isDelegatedAdmin: {
    type: Boolean,
    default: false
  },
  lastLoginTime: Date,
  creationTime: Date,
  customSchemas: Schema.Types.Mixed,
  lastSync: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'google_workspace_users'
});

// Compound indexes
GoogleWorkspaceUserSchema.index({ companyId: 1, googleId: 1 }, { unique: true });
GoogleWorkspaceUserSchema.index({ companyId: 1, primaryEmail: 1 });
GoogleWorkspaceUserSchema.index({ connectionId: 1, suspended: 1 });`}
              />
            </div>
          </div>
        );

      case 'backend':
        return (
          <div className="space-y-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-3xl p-8">
              <h3 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-6 flex items-center">
                <Code className="h-8 w-8 mr-4 text-blue-600" />
                Backend Implementation
              </h3>
              
              <p className="text-blue-800 dark:text-blue-200 text-lg">
                Complete backend services, controllers, and routes for Google Workspace integration.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Google Workspace Controller</h4>
              
              <CodeBlock
                title="googleWorkspaceController.ts"
                language="typescript"
                showLineNumbers
                code={`import { Request, Response } from 'express';
import { GoogleWorkspaceConnectionService } from '../services/googleWorkspaceConnectionService';
import { GoogleWorkspaceSyncService } from '../services/googleWorkspaceSyncService';

export class GoogleWorkspaceController {
  private connectionService: GoogleWorkspaceConnectionService;
  private syncService: GoogleWorkspaceSyncService;

  constructor() {
    this.connectionService = new GoogleWorkspaceConnectionService();
    this.syncService = new GoogleWorkspaceSyncService();
  }

  async createConnection(req: Request, res: Response) {
    try {
      const { companyId } = req.user;
      
      const result = await this.connectionService.createConnection(companyId);
      
      // Start initial sync
      this.syncService.syncWorkspaceData(result.connectionId).catch(console.error);
      
      res.json({
        success: true,
        data: result,
        message: 'Google Workspace connected successfully'
      });
    } catch (error: any) {
      console.error('Google Workspace connection error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getConnections(req: Request, res: Response) {
    try {
      const { companyId } = req.user;
      
      const connections = await this.connectionService.getConnections(companyId);
      
      res.json({
        success: true,
        data: connections
      });
    } catch (error: any) {
      console.error('Get Google Workspace connections error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async syncWorkspace(req: Request, res: Response) {
    try {
      const { connectionId } = req.params;
      const { companyId } = req.user;
      
      const result = await this.syncService.syncWorkspaceData(connectionId, companyId);
      
      res.json({
        success: true,
        data: result,
        message: 'Workspace sync completed successfully'
      });
    } catch (error: any) {
      console.error('Google Workspace sync error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const { connectionId } = req.params;
      const { companyId } = req.user;
      const { page = 1, limit = 50, search, orgUnit, suspended } = req.query;
      
      const result = await this.syncService.getUsers(connectionId, companyId, {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        search: search as string,
        orgUnit: orgUnit as string,
        suspended: suspended === 'true'
      });
      
      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('Get Google Workspace users error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}`}
              />
            </div>
          </div>
        );

      case 'sync':
        return (
          <div className="space-y-8">
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-3xl p-8">
              <h3 className="text-2xl font-semibold text-orange-900 dark:text-orange-100 mb-6 flex items-center">
                <Zap className="h-8 w-8 mr-4 text-orange-600" />
                Data Synchronization
              </h3>
              
              <p className="text-orange-800 dark:text-orange-200 text-lg">
                Strategies for syncing Google Workspace data including users, groups, and organizational units.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Google Workspace Sync Service</h4>
              
              <CodeBlock
                title="googleWorkspaceSyncService.ts"
                language="typescript"
                showLineNumbers
                code={`import { GoogleWorkspaceConnection, GoogleWorkspaceUser } from '../../../../database/models';
import { decrypt } from '../../../../utils/encryption';
import { google } from 'googleapis';

export class GoogleWorkspaceSyncService {
  async syncWorkspaceData(connectionId: string, companyId?: string): Promise<any> {
    const connection = await GoogleWorkspaceConnection.findOne({
      _id: connectionId,
      ...(companyId && { companyId }),
      isActive: true
    });

    if (!connection) {
      throw new Error('Google Workspace connection not found');
    }

    try {
      // Update connection sync status
      await GoogleWorkspaceConnection.findByIdAndUpdate(connectionId, {
        lastSync: new Date(),
        syncStatus: 'in-progress',
        status: 'connected'
      });

      // Create authenticated client
      const auth = await this.createAuthClient(connection);
      
      // Sync users, groups, and org units in parallel
      const [usersResult, groupsResult, orgUnitsResult] = await Promise.allSettled([
        this.syncUsers(connection, auth),
        this.syncGroups(connection, auth),
        this.syncOrgUnits(connection, auth)
      ]);

      // Update connection with results
      await GoogleWorkspaceConnection.findByIdAndUpdate(connectionId, {
        syncStatus: 'completed',
        userCount: usersResult.status === 'fulfilled' ? usersResult.value.totalUsers : 0,
        groupCount: groupsResult.status === 'fulfilled' ? groupsResult.value.totalGroups : 0,
        orgUnitCount: orgUnitsResult.status === 'fulfilled' ? orgUnitsResult.value.totalOrgUnits : 0
      });

      const result = {
        connectionId,
        domain: connection.domain,
        users: usersResult.status === 'fulfilled' ? usersResult.value : { error: usersResult.reason?.message },
        groups: groupsResult.status === 'fulfilled' ? groupsResult.value : { error: groupsResult.reason?.message },
        orgUnits: orgUnitsResult.status === 'fulfilled' ? orgUnitsResult.value : { error: orgUnitsResult.reason?.message },
        syncedAt: new Date()
      };

      console.log(\`✅ Google Workspace sync completed for \${connection.domain}:\`, result);
      return result;
    } catch (error: any) {
      console.error(\`❌ Google Workspace sync failed for \${connection.domain}:\`, error);
      
      await GoogleWorkspaceConnection.findByIdAndUpdate(connectionId, {
        status: 'error',
        syncStatus: 'failed',
        lastSync: new Date()
      });
      
      throw error;
    }
  }

  private async createAuthClient(connection: any) {
    const serviceAccountKey = JSON.parse(decrypt(connection.serviceAccountKey));
    
    const jwtClient = new google.auth.JWT(
      serviceAccountKey.client_email,
      undefined,
      serviceAccountKey.private_key,
      [
        'https://www.googleapis.com/auth/admin.directory.user.readonly',
        'https://www.googleapis.com/auth/admin.directory.group.readonly',
        'https://www.googleapis.com/auth/admin.directory.orgunit.readonly'
      ],
      connection.adminEmail
    );

    await jwtClient.authorize();
    return jwtClient;
  }

  private async syncUsers(connection: any, auth: any): Promise<any> {
    const admin = google.admin({ version: 'directory_v1', auth });
    let pageToken = '';
    let totalUsers = 0;
    let newUsers = 0;
    let updatedUsers = 0;

    do {
      const response = await admin.users.list({
        customer: 'my_customer',
        maxResults: 500,
        pageToken: pageToken || undefined,
        projection: 'full'
      });

      const users = response.data.users || [];
      
      for (const user of users) {
        const userData = {
          companyId: connection.companyId,
          connectionId: connection._id,
          googleId: user.id!,
          primaryEmail: user.primaryEmail!,
          customerId: user.customerId,
          name: {
            givenName: user.name?.givenName,
            familyName: user.name?.familyName,
            fullName: user.name?.fullName
          },
          emails: user.emails || [],
          phones: user.phones || [],
          orgUnitPath: user.orgUnitPath || '/',
          department: user.organizations?.[0]?.department,
          title: user.organizations?.[0]?.title,
          suspended: user.suspended || false,
          suspensionReason: user.suspensionReason,
          changePasswordAtNextLogin: user.changePasswordAtNextLogin || false,
          isAdmin: user.isAdmin || false,
          isDelegatedAdmin: user.isDelegatedAdmin || false,
          lastLoginTime: user.lastLoginTime ? new Date(user.lastLoginTime) : undefined,
          creationTime: new Date(user.creationTime!),
          customSchemas: user.customSchemas,
          lastSync: new Date()
        };

        const existingUser = await GoogleWorkspaceUser.findOne({
          companyId: connection.companyId,
          googleId: user.id
        });

        if (existingUser) {
          await GoogleWorkspaceUser.findByIdAndUpdate(existingUser._id, userData);
          updatedUsers++;
        } else {
          await GoogleWorkspaceUser.create(userData);
          newUsers++;
        }
        
        totalUsers++;
      }

      pageToken = response.data.nextPageToken || '';
    } while (pageToken);

    return { totalUsers, newUsers, updatedUsers };
  }

  private async syncGroups(connection: any, auth: any): Promise<any> {
    // Implementation for syncing groups
    return { totalGroups: 0, newGroups: 0, updatedGroups: 0 };
  }

  private async syncOrgUnits(connection: any, auth: any): Promise<any> {
    // Implementation for syncing organizational units
    return { totalOrgUnits: 0, newOrgUnits: 0, updatedOrgUnits: 0 };
  }
}`}
              />
            </div>
          </div>
        );

      case 'troubleshooting':
        return (
          <div className="space-y-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-3xl p-8">
              <h3 className="text-2xl font-semibold text-red-900 dark:text-red-100 mb-6 flex items-center">
                <AlertTriangle className="h-8 w-8 mr-4 text-red-600" />
                Troubleshooting Guide
              </h3>
              
              <p className="text-red-800 dark:text-red-200 text-lg">
                Common issues and solutions for Google Workspace integration.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Common Issues</h4>
              
              <div className="space-y-6">
                <div className="border-l-4 border-red-500 pl-4">
                  <h5 className="font-semibold text-red-900 dark:text-red-100 mb-2">Domain-wide Delegation Failed</h5>
                  <p className="text-red-800 dark:text-red-200 mb-2">Error: "unauthorized_client" or "access_denied"</p>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>• Verify service account has domain-wide delegation enabled</li>
                    <li>• Check client ID is correctly added in Admin Console</li>
                    <li>• Ensure OAuth scopes match exactly</li>
                    <li>• Verify admin email has super admin privileges</li>
                  </ul>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h5 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">API Not Enabled</h5>
                  <p className="text-yellow-800 dark:text-yellow-200 mb-2">Error: "API has not been used" or 403 status</p>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• Enable Admin SDK API in Google Cloud Console</li>
                    <li>• Enable Reports API for usage statistics</li>
                    <li>• Wait a few minutes for API activation</li>
                    <li>• Check billing is enabled for the project</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Invalid Service Account Key</h5>
                  <p className="text-blue-800 dark:text-blue-200 mb-2">Error: "invalid_grant" or JSON parsing errors</p>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Verify JSON key file is complete and valid</li>
                    <li>• Check private key format and line breaks</li>
                    <li>• Ensure service account email is correct</li>
                    <li>• Regenerate key if corrupted</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h5 className="font-semibold text-green-900 dark:text-green-100 mb-2">Quota Exceeded</h5>
                  <p className="text-green-800 dark:text-green-200 mb-2">Error: "quotaExceeded" or 429 status</p>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• Implement exponential backoff retry logic</li>
                    <li>• Use pagination for large data sets</li>
                    <li>• Monitor API usage in Google Cloud Console</li>
                    <li>• Request quota increase if needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-8 text-center">
            <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-3">Section Coming Soon</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">This section is being developed. Check back soon!</p>
          </div>
        );
    }
  };

  return (
    <DocumentationLayout
      title="Google Workspace Integration Guide"
      description="Complete guide for integrating Google Workspace"
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

export default GoogleWorkspaceIntegrationGuide;
