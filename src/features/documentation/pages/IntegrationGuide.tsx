import React, { useState } from 'react';
import { 
  Book, 
  Shield, 
  Database, 
  Code, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  FileText,
  GitBranch,
  Server,
  Lock
} from 'lucide-react';
import DocumentationLayout from '../components/DocumentationLayout';
import CodeBlock from '../components/CodeBlock';

const IntegrationGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Book,
      description: 'Introduction to SaaS integration patterns'
    },
    {
      id: 'prerequisites',
      title: 'Prerequisites',
      icon: CheckCircle,
      description: 'Requirements and setup checklist'
    },
    {
      id: 'authentication',
      title: 'Authentication',
      icon: Shield,
      description: 'OAuth, API Keys, and security patterns'
    },
    {
      id: 'database',
      title: 'Database Schema',
      icon: Database,
      description: 'Models and relationships'
    },
    {
      id: 'backend',
      title: 'Backend Implementation',
      icon: Server,
      description: 'Services, controllers, and routes'
    },
    {
      id: 'frontend',
      title: 'Frontend Implementation',
      icon: Code,
      description: 'Components, pages, and hooks'
    },
    {
      id: 'configuration',
      title: 'Configuration',
      icon: Settings,
      description: 'Environment variables and settings'
    },
    {
      id: 'testing',
      title: 'Testing',
      icon: Zap,
      description: 'Testing strategies and examples'
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
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Book className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Generic Integration Guide</h3>
                  <p className="text-blue-700 dark:text-blue-300 text-lg">Master template for all SaaS integrations</p>
                </div>
              </div>
              
              <p className="text-blue-800 dark:text-blue-200 mb-8 text-lg leading-relaxed">
                This comprehensive guide provides a standardized approach to integrating any SaaS application into your platform. 
                Follow these patterns to ensure consistency, security, and maintainability across all integrations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center text-lg">
                    <Zap className="h-6 w-6 mr-3 text-yellow-500" />
                    Integration Patterns
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-3">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>OAuth 2.0 Flow</strong> - Secure user authorization</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>API Key Management</strong> - Encrypted credential storage</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Data Synchronization</strong> - Real-time and batch sync</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Error Handling</strong> - Robust error recovery</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center text-lg">
                    <FileText className="h-6 w-6 mr-3 text-blue-500" />
                    File Structure
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-3">
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">📁</span>
                      <span><strong>Backend</strong> - Services, controllers, models</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">⚛️</span>
                      <span><strong>Frontend</strong> - Components, pages, hooks</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🗄️</span>
                      <span><strong>Database</strong> - Models and migrations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🔧</span>
                      <span><strong>Configuration</strong> - Environment variables</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <GitBranch className="h-7 w-7 mr-3 text-purple-600" />
                Integration Workflow
              </h4>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white">API Analysis</h5>
                    <p className="text-gray-600 dark:text-gray-400">Study the service's API documentation, authentication methods, and data structures.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white">Database Design</h5>
                    <p className="text-gray-600 dark:text-gray-400">Create models for connections, users, and service-specific entities.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white">Backend Implementation</h5>
                    <p className="text-gray-600 dark:text-gray-400">Build services, controllers, and routes following our established patterns.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white">Frontend Development</h5>
                    <p className="text-gray-600 dark:text-gray-400">Create UI components, pages, and hooks with consistent styling.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">5</div>
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white">Testing & Deployment</h5>
                    <p className="text-gray-600 dark:text-gray-400">Test the integration thoroughly and deploy with proper monitoring.</p>
                  </div>
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
                Prerequisites Checklist
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-green-900 dark:text-green-100 mb-4 text-lg">Development Environment</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800 dark:text-green-200">Node.js 18+ and npm/yarn</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800 dark:text-green-200">MongoDB database connection</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800 dark:text-green-200">TypeScript knowledge</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800 dark:text-green-200">React and Tailwind CSS familiarity</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-green-900 dark:text-green-100 mb-4 text-lg">Service Requirements</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800 dark:text-green-200">Service API documentation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800 dark:text-green-200">Developer account and API access</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800 dark:text-green-200">Understanding of authentication flow</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800 dark:text-green-200">Rate limits and API constraints</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Required Tools & Libraries</h4>
              
              <CodeBlock
                title="Package Dependencies"
                language="json"
                code={`{
  "dependencies": {
    "axios": "^1.6.0",
    "mongoose": "^8.0.0",
    "crypto": "built-in",
    "jsonwebtoken": "^9.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}`}
              />
            </div>
          </div>
        );

      case 'authentication':
        return (
          <div className="space-y-8">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-3xl p-8">
              <h3 className="text-2xl font-semibold text-yellow-900 dark:text-yellow-100 mb-6 flex items-center">
                <Shield className="h-8 w-8 mr-4 text-yellow-600" />
                Authentication Patterns
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-yellow-900 dark:text-yellow-100 mb-4 text-lg flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-green-500" />
                    OAuth 2.0
                  </h4>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
                    <li>• Authorization Code Flow</li>
                    <li>• Refresh Token Management</li>
                    <li>• Scope-based Permissions</li>
                    <li>• PKCE for Security</li>
                  </ul>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-yellow-900 dark:text-yellow-100 mb-4 text-lg flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-blue-500" />
                    API Keys
                  </h4>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
                    <li>• AES-256 Encryption</li>
                    <li>• Secure Key Storage</li>
                    <li>• Key Rotation Support</li>
                    <li>• Environment Isolation</li>
                  </ul>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-yellow-900 dark:text-yellow-100 mb-4 text-lg flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-purple-500" />
                    Service Accounts
                  </h4>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
                    <li>• JWT Token Generation</li>
                    <li>• Certificate Management</li>
                    <li>• Impersonation Support</li>
                    <li>• Admin-level Access</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">OAuth 2.0 Implementation Example</h4>
              
              <CodeBlock
                title="OAuth Service Implementation"
                language="typescript"
                showLineNumbers
                code={`export class ServiceConnectionService {
  async initiateOAuth(companyId: string): Promise<string> {
    // Get company-specific credentials
    const credentials = await this.credentialsService.getDecryptedCredentials(companyId, 'service-name');
    
    if (!credentials) {
      throw new Error('Service credentials not configured');
    }

    const { clientId, clientSecret, redirectUri } = credentials;
    
    // Generate state for CSRF protection
    const state = Buffer.from(JSON.stringify({
      companyId,
      timestamp: Date.now()
    })).toString('base64');

    // Define required scopes
    const scopes = [
      'read:user',
      'read:organization',
      'write:data'
    ].join(' ');

    // Build authorization URL
    const authUrl = \`https://api.service.com/oauth/authorize?\` +
      \`client_id=\${encodeURIComponent(clientId)}&\` +
      \`scope=\${encodeURIComponent(scopes)}&\` +
      \`redirect_uri=\${encodeURIComponent(redirectUri)}&\` +
      \`state=\${state}&\` +
      \`response_type=code\`;

    return authUrl;
  }

  async handleOAuthCallback(code: string, state: string): Promise<any> {
    // Decode and validate state
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    
    // Get credentials
    const credentials = await this.credentialsService.getDecryptedCredentials(
      stateData.companyId, 
      'service-name'
    );
    
    // Exchange code for access token
    const tokenResponse = await axios.post('https://api.service.com/oauth/token', {
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      code,
      redirect_uri: credentials.redirectUri,
      grant_type: 'authorization_code'
    });

    const { access_token, refresh_token } = tokenResponse.data;
    
    // Encrypt and store tokens
    const encryptedAccessToken = encrypt(access_token);
    const encryptedRefreshToken = refresh_token ? encrypt(refresh_token) : undefined;
    
    // Save connection
    const connection = await ServiceConnection.create({
      companyId: stateData.companyId,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      isActive: true
    });

    return connection;
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
                Common Issues & Solutions
              </h3>
              
              <p className="text-red-800 dark:text-red-200 text-lg">
                Troubleshooting guide for common integration issues across all SaaS platforms.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Authentication Issues</h4>
              
              <div className="space-y-6">
                <div className="border-l-4 border-red-500 pl-4">
                  <h5 className="font-semibold text-red-900 dark:text-red-100 mb-2">Invalid Credentials</h5>
                  <p className="text-red-800 dark:text-red-200 mb-2">Error: "invalid_client", "unauthorized", or 401 status</p>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>• Verify API keys/secrets are correct and not expired</li>
                    <li>• Check if credentials are properly encrypted/decrypted</li>
                    <li>• Ensure service account has necessary permissions</li>
                    <li>• Validate redirect URIs match exactly</li>
                  </ul>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h5 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Token Expiration</h5>
                  <p className="text-yellow-800 dark:text-yellow-200 mb-2">Error: "token_expired" or "access_denied"</p>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• Implement automatic token refresh logic</li>
                    <li>• Store and use refresh tokens when available</li>
                    <li>• Handle token expiration gracefully in API calls</li>
                    <li>• Set up monitoring for token expiration</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Rate Limiting</h5>
                  <p className="text-blue-800 dark:text-blue-200 mb-2">Error: "rate_limited", "too_many_requests", or 429 status</p>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Implement exponential backoff with jitter</li>
                    <li>• Respect Retry-After headers in responses</li>
                    <li>• Use request queuing for high-volume operations</li>
                    <li>• Monitor API usage and implement circuit breakers</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Data Synchronization Issues</h4>
              
              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h5 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Sync Failures</h5>
                  <p className="text-purple-800 dark:text-purple-200 mb-2">Partial or complete sync failures</p>
                  <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                    <li>• Implement retry logic with exponential backoff</li>
                    <li>• Use pagination for large datasets</li>
                    <li>• Store sync checkpoints for resumable operations</li>
                    <li>• Log detailed error information for debugging</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h5 className="font-semibold text-green-900 dark:text-green-100 mb-2">Data Consistency</h5>
                  <p className="text-green-800 dark:text-green-200 mb-2">Inconsistent or duplicate data</p>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• Implement idempotent operations</li>
                    <li>• Use unique constraints and upsert operations</li>
                    <li>• Validate data before saving to database</li>
                    <li>• Implement data reconciliation processes</li>
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
      title="Generic Integration Guide"
      description="Master template for integrating any SaaS application"
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

export default IntegrationGuide;
