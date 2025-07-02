import React, { useState } from 'react';
import { 
  Book, 
  Code, 
  Shield, 
  Database, 
  Cloud, 
  Key, 
  AlertTriangle, 
  Copy,
  Zap,
  Lock,
  Server,
  Terminal,
  Layers,
  Sparkles,
  CheckCircle,
  Users,
  BarChart3
} from 'lucide-react';
import DocumentationLayout from '../components/DocumentationLayout';
import CodeBlock from '../components/CodeBlock';

const PlatformOverview: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
    toast.textContent = 'Copied to clipboard!';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2000);
  };

  const sections = [
    {
      id: 'overview',
      title: 'Platform Overview',
      icon: Book,
      description: 'Introduction to the SaaSDor Management Platform'
    },
    {
      id: 'architecture',
      title: 'System Architecture',
      icon: Layers,
      description: 'Technical architecture and components'
    },
    {
      id: 'security',
      title: 'Security & Compliance',
      icon: Shield,
      description: 'Security implementation and compliance standards'
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      icon: Code,
      description: 'Complete API documentation with examples'
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
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Welcome to SaaSDor</h3>
                  <p className="text-blue-700 dark:text-blue-300 text-lg">Next-generation SaaS management platform</p>
                </div>
              </div>
              
              <p className="text-blue-800 dark:text-blue-200 mb-8 text-lg leading-relaxed">
                A comprehensive enterprise solution for managing your organization's SaaS applications, cloud services, and user access across multiple platforms with advanced security, analytics, and automation capabilities.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center text-lg">
                    <Zap className="h-6 w-6 mr-3 text-yellow-500" />
                    Core Features
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-3">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Centralized Credential Management</strong> - Secure storage with AES-256 encryption</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Multi-Platform User Sync</strong> - Real-time synchronization across services</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Advanced Analytics</strong> - Usage insights, cost optimization, security monitoring</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>OAuth 2.0 Integration</strong> - Secure authentication without credential storage</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center text-lg">
                    <Cloud className="h-6 w-6 mr-3 text-blue-500" />
                    Supported Platforms
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-3">
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">☁️</span>
                      <span><strong>Amazon Web Services (AWS)</strong></span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">📧</span>
                      <span><strong>Google Workspace</strong></span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🐙</span>
                      <span><strong>GitHub</strong></span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">💬</span>
                      <span><strong>Slack</strong></span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">📹</span>
                      <span><strong>Zoom</strong></span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🔵</span>
                      <span><strong>Microsoft Azure</strong></span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <BarChart3 className="h-7 w-7 mr-3 text-purple-600" />
                Platform Capabilities
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-500" />
                    User Management
                  </h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• Cross-platform user synchronization</li>
                    <li>• Role-based access control</li>
                    <li>• Automated provisioning/deprovisioning</li>
                    <li>• Identity correlation across services</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-500" />
                    Security & Compliance
                  </h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• AES-256 encryption at rest</li>
                    <li>• TLS 1.3 for data in transit</li>
                    <li>• SOC 2 Type II compliance</li>
                    <li>• GDPR data protection</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
                    Analytics & Insights
                  </h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• Usage analytics and reporting</li>
                    <li>• Cost optimization insights</li>
                    <li>• Security posture monitoring</li>
                    <li>• License optimization recommendations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'architecture':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                <Layers className="h-8 w-8 mr-4 text-gray-600" />
                System Architecture
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">Frontend Architecture</h4>
                    <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                      <li>• <strong>React 18</strong> with TypeScript</li>
                      <li>• <strong>Vite</strong> for fast development</li>
                      <li>• <strong>Tailwind CSS</strong> for styling</li>
                      <li>• <strong>React Router</strong> for navigation</li>
                      <li>• <strong>Axios</strong> for API communication</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">Backend Architecture</h4>
                    <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                      <li>• <strong>Node.js</strong> with Express.js</li>
                      <li>• <strong>TypeScript</strong> for type safety</li>
                      <li>• <strong>MongoDB</strong> with Mongoose ODM</li>
                      <li>• <strong>JWT</strong> for authentication</li>
                      <li>• <strong>Crypto</strong> for encryption</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">Integration Layer</h4>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h5 className="font-semibold text-blue-900 dark:text-blue-100">OAuth 2.0 Flow</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Secure authorization for supported platforms</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h5 className="font-semibold text-green-900 dark:text-green-100">API Key Management</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Encrypted storage and rotation</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h5 className="font-semibold text-purple-900 dark:text-purple-100">Service Accounts</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Domain-wide delegation support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200/50 dark:border-yellow-700/50 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">Security Architecture</h3>
                  <p className="text-yellow-700 dark:text-yellow-300 text-lg">Enterprise-grade protection</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-yellow-900 dark:text-yellow-100 mb-4 text-lg flex items-center">
                    <Lock className="h-6 w-6 mr-3 text-green-500" />
                    Encryption Standards
                  </h4>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-3">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span><strong>AES-256-GCM</strong> for data at rest</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span><strong>TLS 1.3</strong> for data in transit</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span><strong>PBKDF2</strong> for key derivation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span><strong>JWT</strong> with RS256 signing</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-yellow-900 dark:text-yellow-100 mb-4 text-lg flex items-center">
                    <CheckCircle className="h-6 w-6 mr-3 text-blue-500" />
                    Compliance Standards
                  </h4>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-3">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span><strong>SOC 2 Type II</strong> compliant</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span><strong>GDPR</strong> data protection</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span><strong>ISO 27001</strong> security management</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span><strong>OWASP</strong> security guidelines</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Encryption Implementation</h4>
              
              <CodeBlock
                title="encryption.ts"
                language="typescript"
                showLineNumbers
                code={`import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

export interface EncryptedData {
  encrypted: string;
  iv: string;
  authTag: string;
}

export function encrypt(text: string, key?: string): EncryptedData {
  const encryptionKey = key ? Buffer.from(key, 'hex') : getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipher(ALGORITHM, encryptionKey);
  cipher.setAAD(Buffer.from('SaaSDor-Platform', 'utf8'));
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

export function decrypt(encryptedData: EncryptedData, key?: string): string {
  const encryptionKey = key ? Buffer.from(key, 'hex') : getEncryptionKey();
  const iv = Buffer.from(encryptedData.iv, 'hex');
  const authTag = Buffer.from(encryptedData.authTag, 'hex');
  
  const decipher = crypto.createDecipher(ALGORITHM, encryptionKey);
  decipher.setAAD(Buffer.from('SaaSDor-Platform', 'utf8'));
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
  }
  return Buffer.from(key, 'hex');
}`}
              />
            </div>
          </div>
        );

      case 'api-reference':
        return (
          <div className="space-y-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                <Terminal className="h-8 w-8 mr-4 text-blue-600" />
                API Overview
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-4 text-lg flex items-center">
                    <Server className="h-5 w-5 mr-2" />
                    Base URL
                  </h4>
                  <div className="bg-gray-900 dark:bg-gray-800 text-green-400 p-4 rounded-xl font-mono text-sm shadow-inner">
                    http://localhost:3001/api
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50">
                  <h4 className="font-bold text-green-900 dark:text-green-100 mb-4 text-lg flex items-center">
                    <Key className="h-5 w-5 mr-2" />
                    Authentication
                  </h4>
                  <div className="bg-gray-900 dark:bg-gray-800 text-green-400 p-4 rounded-xl font-mono text-sm shadow-inner">
                    Authorization: Bearer YOUR_ACCESS_TOKEN
                  </div>
                </div>
              </div>

              <div className="border border-gray-200/50 dark:border-gray-600/50 rounded-2xl p-8 bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-700/50 backdrop-blur-sm">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Database className="h-6 w-6 mr-3 text-purple-600" />
                  Core Endpoints
                </h4>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-r-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-bold text-gray-900 dark:text-white text-lg">GET /api/credentials</h5>
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium">GET</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">Retrieve all configured credentials</p>
                    
                    <div className="bg-gray-900 dark:bg-gray-800 text-green-400 p-6 rounded-xl font-mono text-sm shadow-inner">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-gray-400">Response:</span>
                        <button 
                          onClick={() => copyToClipboard('{"success": true, "data": [{"id": "cred_123", "appType": "aws", "appName": "Production AWS"}]}')}
                          className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <pre className="text-green-400">{`{
  "success": true,
  "data": [
    {
      "id": "cred_123",
      "appType": "aws",
      "appName": "Production AWS",
      "isActive": true
    }
  ]
}`}</pre>
                    </div>
                  </div>

                  <div className="border-l-4 border-green-500 pl-6 bg-green-50/50 dark:bg-green-900/10 rounded-r-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-bold text-gray-900 dark:text-white text-lg">POST /api/credentials</h5>
                      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm font-medium">POST</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">Create new credential set</p>
                    
                    <div className="bg-gray-900 dark:bg-gray-800 text-green-400 p-6 rounded-xl font-mono text-sm shadow-inner">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-gray-400">Request Body:</span>
                        <button 
                          onClick={() => copyToClipboard('{"appType": "slack", "appName": "Production Slack", "credentials": {"clientId": "...", "clientSecret": "..."}}')}
                          className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <pre className="text-green-400">{`{
  "appType": "slack",
  "appName": "Production Slack",
  "credentials": {
    "clientId": "your_client_id",
    "clientSecret": "your_client_secret"
  }
}`}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'troubleshooting':
        return (
          <div className="space-y-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-3xl p-8">
              <h3 className="text-2xl font-semibold text-red-900 dark:text-red-100 mb-6 flex items-center">
                <AlertTriangle className="h-8 w-8 mr-4 text-red-600" />
                Common Issues
              </h3>
              
              <div className="space-y-6">
                <div className="border border-red-200 dark:border-red-600 rounded-2xl p-6 bg-white dark:bg-gray-800">
                  <h4 className="font-semibold text-red-900 dark:text-red-100 mb-3 text-lg">Connection Failed Errors</h4>
                  <p className="text-red-800 dark:text-red-200 mb-3">If you're seeing "Failed to test connection" errors:</p>
                  <ul className="text-red-800 dark:text-red-200 space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Verify your API credentials are correct</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Check network connectivity to the service</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Ensure proper permissions are granted</span>
                    </li>
                  </ul>
                </div>

                <div className="border border-red-200 dark:border-red-600 rounded-2xl p-6 bg-white dark:bg-gray-800">
                  <h4 className="font-semibold text-red-900 dark:text-red-100 mb-3 text-lg">Dark Mode Toggle Not Working</h4>
                  <p className="text-red-800 dark:text-red-200 mb-3">If the dark mode toggle is not switching themes:</p>
                  <ul className="text-red-800 dark:text-red-200 space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Check if Tailwind CSS dark mode is configured with 'class' strategy</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Verify the toggle function is properly updating document.documentElement.classList</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Ensure dark mode classes are applied to all components</span>
                    </li>
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
      title="Platform Overview"
      description="Complete guide to the SaaSDor Management Platform"
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

export default PlatformOverview;
