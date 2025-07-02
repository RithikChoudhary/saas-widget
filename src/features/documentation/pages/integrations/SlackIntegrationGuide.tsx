import React, { useState } from 'react';
import { 
  MessageSquare, 
  Shield, 
  Database, 
  Code, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Users,
  Hash,
  Bot
} from 'lucide-react';
import DocumentationLayout from '../../components/DocumentationLayout';
import CodeBlock from '../../components/CodeBlock';

const SlackIntegrationGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: MessageSquare,
      description: 'Slack integration capabilities'
    },
    {
      id: 'prerequisites',
      title: 'Prerequisites',
      icon: CheckCircle,
      description: 'Slack app setup and requirements'
    },
    {
      id: 'authentication',
      title: 'OAuth Setup',
      icon: Shield,
      description: 'OAuth 2.0 and Bot Token configuration'
    },
    {
      id: 'database',
      title: 'Database Models',
      icon: Database,
      description: 'Slack-specific data models'
    },
    {
      id: 'backend',
      title: 'Backend Implementation',
      icon: Code,
      description: 'Services and API endpoints'
    },
    {
      id: 'frontend',
      title: 'Frontend Components',
      icon: Users,
      description: 'UI components and pages'
    },
    {
      id: 'sync',
      title: 'Data Synchronization',
      icon: Zap,
      description: 'User and workspace sync'
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
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-red-900/20 border border-purple-200/50 dark:border-purple-700/50 rounded-3xl p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Slack Integration</h3>
                  <p className="text-purple-700 dark:text-purple-300 text-lg">Workspace management and user synchronization</p>
                </div>
              </div>
              
              <p className="text-purple-800 dark:text-purple-200 mb-8 text-lg leading-relaxed">
                Integrate Slack workspaces to manage users, channels, and workspace settings. 
                This integration supports both OAuth 2.0 for user authorization and Bot Tokens for automated operations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                  <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center text-lg">
                    <Zap className="h-6 w-6 mr-3 text-yellow-500" />
                    Key Features
                  </h4>
                  <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-3">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Workspace Connection</strong> - OAuth-based workspace linking</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>User Synchronization</strong> - Real-time user data sync</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Channel Management</strong> - Public and private channels</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Bot Integration</strong> - Automated workspace operations</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                  <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center text-lg">
                    <Shield className="h-6 w-6 mr-3 text-blue-500" />
                    Authentication Methods
                  </h4>
                  <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-3">
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🔐</span>
                      <span><strong>OAuth 2.0</strong> - User authorization flow</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🤖</span>
                      <span><strong>Bot Token</strong> - Automated operations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🔄</span>
                      <span><strong>Refresh Tokens</strong> - Long-term access</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🎯</span>
                      <span><strong>Scoped Permissions</strong> - Granular access control</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Hash className="h-7 w-7 mr-3 text-purple-600" />
                Slack API Capabilities
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-500" />
                    User Management
                  </h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• User profiles and status</li>
                    <li>• Team member listing</li>
                    <li>• User presence information</li>
                    <li>• Profile photo access</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Hash className="h-5 w-5 mr-2 text-green-500" />
                    Channel Operations
                  </h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• Public channel listing</li>
                    <li>• Private channel access</li>
                    <li>• Channel member management</li>
                    <li>• Message history access</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Bot className="h-5 w-5 mr-2 text-purple-500" />
                    Workspace Info
                  </h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• Team information</li>
                    <li>• Workspace settings</li>
                    <li>• Custom emoji access</li>
                    <li>• Integration management</li>
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
                Slack App Setup
              </h3>
              
              <div className="space-y-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-green-900 dark:text-green-100 mb-4 text-lg">1. Create Slack App</h4>
                  <ol className="text-green-800 dark:text-green-200 space-y-2 list-decimal list-inside">
                    <li>Go to <a href="https://api.slack.com/apps" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://api.slack.com/apps</a></li>
                    <li>Click "Create New App" → "From scratch"</li>
                    <li>Enter app name and select development workspace</li>
                    <li>Note down the App ID and Client ID</li>
                  </ol>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-green-900 dark:text-green-100 mb-4 text-lg">2. Configure OAuth & Permissions</h4>
                  <ul className="text-green-800 dark:text-green-200 space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Add redirect URL: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">http://localhost:5000/api/integrations/slack/callback</code></span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Copy Client ID and Client Secret</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-green-900 dark:text-green-100 mb-4 text-lg">3. Required OAuth Scopes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold mb-2">User Token Scopes:</h5>
                      <ul className="text-sm space-y-1">
                        <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">channels:read</code></li>
                        <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">groups:read</code></li>
                        <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">users:read</code></li>
                        <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">users:read.email</code></li>
                        <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">team:read</code></li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">Bot Token Scopes:</h5>
                      <ul className="text-sm space-y-1">
                        <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">channels:read</code></li>
                        <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">users:read</code></li>
                        <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">chat:write</code></li>
                        <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">files:read</code></li>
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
                OAuth 2.0 Implementation
              </h3>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Slack Connection Service</h4>
              
              <CodeBlock
                title="slackConnectionService.ts"
                language="typescript"
                showLineNumbers
                code={`import { SlackConnection, SlackWorkspace } from '../../../../database/models';
import { encrypt, decrypt } from '../../../../utils/encryption';
import { CredentialsService } from '../../../credentials/services/credentialsService';
import axios from 'axios';

export class SlackConnectionService {
  private credentialsService: CredentialsService;

  constructor() {
    this.credentialsService = new CredentialsService();
  }

  async initiateOAuth(companyId: string): Promise<string> {
    // Get company-specific Slack credentials
    const credentialsData = await this.credentialsService.getDecryptedCredentials(companyId, 'slack');
    
    if (!credentialsData) {
      throw new Error('Slack credentials not configured for this company');
    }

    const { clientId, clientSecret } = credentialsData;
    
    // Generate state for CSRF protection
    const state = Buffer.from(JSON.stringify({
      companyId,
      timestamp: Date.now()
    })).toString('base64');

    // Slack OAuth scopes
    const scopes = [
      'channels:read',
      'channels:history',
      'groups:read',
      'users:read',
      'users:read.email',
      'team:read',
      'chat:write'
    ].join(',');

    const redirectUri = credentialsData.redirectUri || 'http://localhost:5000/api/integrations/slack/callback';

    const authUrl = \`https://slack.com/oauth/v2/authorize?\` +
      \`client_id=\${encodeURIComponent(clientId)}&\` +
      \`scope=\${encodeURIComponent(scopes)}&\` +
      \`redirect_uri=\${encodeURIComponent(redirectUri)}&\` +
      \`state=\${state}\`;

    return authUrl;
  }

  async handleOAuthCallback(code: string, state: string): Promise<any> {
    // Decode and validate state
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    
    // Get credentials
    const credentialsData = await this.credentialsService.getDecryptedCredentials(stateData.companyId, 'slack');
    
    const { clientId, clientSecret } = credentialsData;
    const redirectUri = credentialsData.redirectUri || 'http://localhost:5000/api/integrations/slack/callback';
    
    // Exchange code for access token
    const tokenResponse = await axios.post('https://slack.com/api/oauth.v2.access', {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri
    });

    const tokenData = tokenResponse.data;

    if (!tokenData.ok) {
      throw new Error(tokenData.error || 'Failed to obtain access token');
    }

    // Get team info
    const teamResponse = await axios.get('https://slack.com/api/team.info', {
      headers: { 'Authorization': \`Bearer \${tokenData.access_token}\` }
    });

    const teamData = teamResponse.data.team;

    // Encrypt tokens
    const encryptedAccessToken = encrypt(tokenData.access_token);
    const encryptedBotToken = tokenData.bot_token ? encrypt(tokenData.bot_token) : undefined;

    // Create or update connection
    const connection = await SlackConnection.findOneAndUpdate(
      {
        companyId: stateData.companyId,
        teamId: teamData.id
      },
      {
        workspaceId: teamData.id,
        workspaceName: teamData.name,
        workspaceDomain: teamData.domain,
        teamId: teamData.id,
        accessToken: encryptedAccessToken,
        botToken: encryptedBotToken,
        scope: tokenData.scope.split(','),
        connectionType: 'oauth',
        isActive: true,
        lastSync: new Date()
      },
      { upsert: true, new: true }
    );

    return {
      success: true,
      connectionId: connection._id,
      workspaceName: teamData.name
    };
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
                Slack Database Models
              </h3>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">SlackConnection Model</h4>
              
              <CodeBlock
                title="SlackConnection.ts"
                language="typescript"
                showLineNumbers
                code={`import mongoose, { Schema, Document } from 'mongoose';

export interface ISlackConnection extends Document {
  companyId: mongoose.Types.ObjectId;
  workspaceId: string;
  workspaceName: string;
  workspaceDomain: string;
  teamId: string;
  teamName?: string;
  credentialSetName?: string;
  
  accessToken: {
    encrypted: string;
    iv: string;
    authTag: string;
  };
  refreshToken?: {
    encrypted: string;
    iv: string;
    authTag: string;
  };
  botToken?: {
    encrypted: string;
    iv: string;
    authTag: string;
  };
  
  scope: string[];
  connectionType: 'oauth' | 'bot';
  status?: 'connected' | 'disconnected' | 'error';
  isActive: boolean;
  lastSync?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SlackConnectionSchema: Schema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  workspaceId: { type: String, required: true },
  workspaceName: { type: String, required: true },
  workspaceDomain: { type: String, required: true },
  teamId: { type: String, required: true },
  teamName: { type: String, sparse: true },
  credentialSetName: { type: String, sparse: true },
  
  accessToken: {
    encrypted: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true }
  },
  refreshToken: {
    encrypted: String,
    iv: String,
    authTag: String
  },
  botToken: {
    encrypted: String,
    iv: String,
    authTag: String
  },
  
  scope: [{ type: String }],
  connectionType: {
    type: String,
    enum: ['oauth', 'bot'],
    required: true
  },
  status: {
    type: String,
    enum: ['connected', 'disconnected', 'error'],
    default: 'connected'
  },
  isActive: { type: Boolean, default: true },
  lastSync: Date
}, {
  timestamps: true,
  collection: 'slack_connections'
});

// Indexes
SlackConnectionSchema.index({ companyId: 1, workspaceId: 1 }, { unique: true });
SlackConnectionSchema.index({ companyId: 1, teamId: 1 });
SlackConnectionSchema.index({ companyId: 1, isActive: 1 });

export const SlackConnection = mongoose.model<ISlackConnection>('SlackConnection', SlackConnectionSchema);`}
              />
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">SlackUser Model</h4>
              
              <CodeBlock
                title="SlackUser.ts"
                language="typescript"
                showLineNumbers
                code={`export interface ISlackUser extends Document {
  companyId: mongoose.Types.ObjectId;
  connectionId: mongoose.Types.ObjectId;
  slackId: string;
  teamId: string;
  
  // User profile
  name: string;
  realName?: string;
  displayName?: string;
  email?: string;
  phone?: string;
  
  // Profile details
  title?: string;
  statusText?: string;
  statusEmoji?: string;
  avatar?: {
    image24?: string;
    image32?: string;
    image48?: string;
    image72?: string;
    image192?: string;
    image512?: string;
  };
  
  // User status
  isActive: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isPrimaryOwner: boolean;
  isRestricted: boolean;
  isUltraRestricted: boolean;
  isBot: boolean;
  isDeleted: boolean;
  
  // Activity
  timezone?: string;
  timezoneLabel?: string;
  timezoneOffset?: number;
  lastSync: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const SlackUserSchema: Schema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  connectionId: {
    type: Schema.Types.ObjectId,
    ref: 'SlackConnection',
    required: true,
    index: true
  },
  slackId: { type: String, required: true },
  teamId: { type: String, required: true },
  
  name: { type: String, required: true },
  realName: String,
  displayName: String,
  email: String,
  phone: String,
  
  title: String,
  statusText: String,
  statusEmoji: String,
  avatar: {
    image24: String,
    image32: String,
    image48: String,
    image72: String,
    image192: String,
    image512: String
  },
  
  isActive: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  isOwner: { type: Boolean, default: false },
  isPrimaryOwner: { type: Boolean, default: false },
  isRestricted: { type: Boolean, default: false },
  isUltraRestricted: { type: Boolean, default: false },
  isBot: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  
  timezone: String,
  timezoneLabel: String,
  timezoneOffset: Number,
  lastSync: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'slack_users'
});

// Compound indexes
SlackUserSchema.index({ companyId: 1, slackId: 1 }, { unique: true });
SlackUserSchema.index({ connectionId: 1, isActive: 1 });
SlackUserSchema.index({ companyId: 1, email: 1 });`}
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
                Complete backend services, controllers, and routes for Slack integration.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Slack Controller</h4>
              
              <CodeBlock
                title="slackController.ts"
                language="typescript"
                showLineNumbers
                code={`import { Request, Response } from 'express';
import { SlackConnectionService } from '../services/slackConnectionService';
import { SlackSyncService } from '../services/slackSyncService';

export class SlackController {
  private connectionService: SlackConnectionService;
  private syncService: SlackSyncService;

  constructor() {
    this.connectionService = new SlackConnectionService();
    this.syncService = new SlackSyncService();
  }

  async initiateOAuth(req: Request, res: Response) {
    try {
      const { companyId } = req.user;
      
      const authUrl = await this.connectionService.initiateOAuth(companyId);
      
      res.json({
        success: true,
        action: 'oauth-redirect',
        authUrl,
        message: 'Redirect to Slack for authorization'
      });
    } catch (error: any) {
      console.error('Slack OAuth initiation error:', error);
      res.status(400).json({
        success: false,
        action: 'setup-required',
        message: error.message
      });
    }
  }

  async handleOAuthCallback(req: Request, res: Response) {
    try {
      const { code, state } = req.query;
      
      if (!code || !state) {
        throw new Error('Missing authorization code or state');
      }
      
      const result = await this.connectionService.handleOAuthCallback(
        code as string, 
        state as string
      );
      
      // Start initial sync
      this.syncService.syncWorkspaceData(result.connectionId).catch(console.error);
      
      res.redirect(\`/credentials?success=true&service=Slack&workspace=\${encodeURIComponent(result.workspaceName)}\`);
    } catch (error: any) {
      console.error('Slack OAuth callback error:', error);
      res.redirect(\`/credentials?error=\${encodeURIComponent(error.message)}\`);
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
      console.error('Get Slack connections error:', error);
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

      case 'frontend':
        return (
          <div className="space-y-8">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-3xl p-8">
              <h3 className="text-2xl font-semibold text-green-900 dark:text-green-100 mb-6 flex items-center">
                <Users className="h-8 w-8 mr-4 text-green-600" />
                Frontend Components
              </h3>
              
              <p className="text-green-800 dark:text-green-200 text-lg">
                React components and pages for Slack workspace management.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Slack Overview Component</h4>
              
              <CodeBlock
                title="SlackOverview.tsx"
                language="typescript"
                showLineNumbers
                code={`import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Hash, Activity } from 'lucide-react';
import api from '../../../shared/utils/api';

interface SlackConnection {
  id: string;
  workspaceName: string;
  workspaceDomain: string;
  isActive: boolean;
  lastSync: string;
  userCount?: number;
  channelCount?: number;
}

const SlackOverview: React.FC = () => {
  const [connections, setConnections] = useState<SlackConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const response = await api.get('/integrations/slack/connections');
      if (response.data.success) {
        setConnections(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching Slack connections:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <MessageSquare className="h-12 w-12" />
          <div>
            <h1 className="text-3xl font-bold">Slack Workspaces</h1>
            <p className="text-purple-100">Manage your connected Slack workspaces</p>
          </div>
        </div>
      </div>

      {connections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection) => (
            <div key={connection.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold">{connection.workspaceName}</h3>
                    <p className="text-sm text-gray-500">{connection.workspaceDomain}</p>
                  </div>
                </div>
                <div className={\`w-3 h-3 rounded-full \${connection.isActive ? 'bg-green-500' : 'bg-red-500'}\`}></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <Users className="h-4 w-4 mx-auto mb-1 text-gray-600" />
                  <div className="text-2xl font-bold">{connection.userCount || 0}</div>
                  <div className="text-sm text-gray-500">Users</div>
                </div>
                <div className="text-center">
                  <Hash className="h-4 w-4 mx-auto mb-1 text-gray-600" />
                  <div className="text-2xl font-bold">{connection.channelCount || 0}</div>
                  <div className="text-sm text-gray-500">Channels</div>
                </div>
              </div>

              <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Sync</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">No Slack workspaces connected</h3>
          <p className="text-gray-600 mb-6">Connect your first Slack workspace to get started</p>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
            Connect Workspace
          </button>
        </div>
      )}
    </div>
  );
};

export default SlackOverview;`}
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
                Strategies for syncing Slack workspace data including users, channels, and messages.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Sync Strategies</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Real-time Sync</h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• Webhook-based updates</li>
                    <li>• Event subscriptions</li>
                    <li>• Immediate data consistency</li>
                    <li>• Lower API usage</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Scheduled Sync</h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• Hourly/daily batch updates</li>
                    <li>• Full data reconciliation</li>
                    <li>• Handles missed events</li>
                    <li>• Configurable intervals</li>
                  </ul>
                </div>
              </div>
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
                Common issues and solutions for Slack integration.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Common Issues</h4>
              
              <div className="space-y-6">
                <div className="border-l-4 border-red-500 pl-4">
                  <h5 className="font-semibold text-red-900 dark:text-red-100 mb-2">OAuth Authorization Failed</h5>
                  <p className="text-red-800 dark:text-red-200 mb-2">Error: "invalid_client" or "redirect_uri_mismatch"</p>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>• Verify Client ID and Client Secret are correct</li>
                    <li>• Check redirect URI matches exactly in Slack app settings</li>
                    <li>• Ensure app is installed in the workspace</li>
                  </ul>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h5 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Missing Permissions</h5>
                  <p className="text-yellow-800 dark:text-yellow-200 mb-2">Error: "missing_scope" or "not_allowed"</p>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• Add required scopes in Slack app OAuth settings</li>
                    <li>• Reinstall app to workspace after scope changes</li>
                    <li>• Check user has admin permissions for workspace</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Rate Limiting</h5>
                  <p className="text-blue-800 dark:text-blue-200 mb-2">Error: "rate_limited" or 429 status code</p>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Implement exponential backoff retry logic</li>
                    <li>• Respect Retry-After header in responses</li>
                    <li>• Use pagination for large data sets</li>
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
      title="Slack Integration Guide"
      description="Complete guide for integrating Slack workspaces"
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

export default SlackIntegrationGuide;
