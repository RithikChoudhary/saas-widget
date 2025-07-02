import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronRight, Shield, Key, Users, Globe, AlertTriangle, CheckCircle } from 'lucide-react';
import DocumentationLayout from '../components/DocumentationLayout';

const AuthenticationFAQ: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sections = [
    { id: 'overview', title: 'Overview', icon: HelpCircle, description: 'Authentication methods comparison' },
    { id: 'github', title: 'GitHub', icon: Shield, description: 'GitHub authentication methods' },
    { id: 'aws', title: 'AWS', icon: Key, description: 'AWS authentication methods' },
    { id: 'zoom', title: 'Zoom', icon: Users, description: 'Zoom authentication methods' },
    { id: 'datadog', title: 'Datadog', icon: Globe, description: 'Datadog authentication methods' },
    { id: 'google-workspace', title: 'Google Workspace', icon: Shield, description: 'Google Workspace authentication' },
    { id: 'slack', title: 'Slack', icon: Key, description: 'Slack authentication methods' },
    { id: 'best-practices', title: 'Best Practices', icon: CheckCircle, description: 'Security recommendations' }
  ];

  const renderContent = () => {
    return (
      <div className="space-y-8">
        {/* Overview Section */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-3xl p-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Authentication Methods FAQ
          </h2>
          <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed mb-6">
            Our platform supports different authentication methods for each service integration. 
            This FAQ explains the differences, use cases, and recommendations for each approach.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">OAuth 2.0</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">User authorization with scopes</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">API Keys</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Direct programmatic access</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Service Accounts</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Machine-to-machine authentication</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Role-based</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Temporary credential assumption</p>
            </div>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-4">
          {/* GitHub Authentication */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => toggleSection('github')}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">GitHub Authentication Methods</h3>
                  <p className="text-gray-600 dark:text-gray-400">Personal Access Tokens, GitHub Apps, and OAuth Apps</p>
                </div>
              </div>
              {expandedSections.includes('github') ? (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections.includes('github') && (
              <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                <div className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Personal Access Token</h4>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                        <li><strong>Use Case:</strong> Individual developer access</li>
                        <li><strong>Scope:</strong> User-level permissions</li>
                        <li><strong>Security:</strong> Tied to user account</li>
                        <li><strong>Best For:</strong> Testing and personal projects</li>
                      </ul>
                    </div>
                    
                    <div className="border border-green-200 dark:border-green-700 rounded-xl p-4">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">GitHub App</h4>
                      <ul className="text-sm text-green-800 dark:text-green-200 space-y-2">
                        <li><strong>Use Case:</strong> Organization-wide integration</li>
                        <li><strong>Scope:</strong> Fine-grained permissions</li>
                        <li><strong>Security:</strong> App-level authentication</li>
                        <li><strong>Best For:</strong> Production environments</li>
                      </ul>
                    </div>
                    
                    <div className="border border-purple-200 dark:border-purple-700 rounded-xl p-4">
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">OAuth App</h4>
                      <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-2">
                        <li><strong>Use Case:</strong> User authorization flow</li>
                        <li><strong>Scope:</strong> User-granted permissions</li>
                        <li><strong>Security:</strong> User consent required</li>
                        <li><strong>Best For:</strong> Multi-user applications</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4">
                    <h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      GitHub Recommendation
                    </h5>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>GitHub Apps are recommended</strong> for production use as they provide better security, 
                      fine-grained permissions, and don't depend on individual user accounts.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AWS Authentication */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => toggleSection('aws')}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center">
                  <Key className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">AWS Authentication Methods</h3>
                  <p className="text-gray-600 dark:text-gray-400">Access Keys, IAM Roles, and STS Assume Role</p>
                </div>
              </div>
              {expandedSections.includes('aws') ? (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections.includes('aws') && (
              <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                <div className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border border-orange-200 dark:border-orange-700 rounded-xl p-4">
                      <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">Access Keys</h4>
                      <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-2">
                        <li><strong>Use Case:</strong> Direct programmatic access</li>
                        <li><strong>Scope:</strong> User/service permissions</li>
                        <li><strong>Security:</strong> Long-lived credentials</li>
                        <li><strong>Best For:</strong> Simple integrations</li>
                      </ul>
                    </div>
                    
                    <div className="border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">IAM Role</h4>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                        <li><strong>Use Case:</strong> Service-to-service access</li>
                        <li><strong>Scope:</strong> Role-based permissions</li>
                        <li><strong>Security:</strong> No long-lived credentials</li>
                        <li><strong>Best For:</strong> EC2, Lambda, containers</li>
                      </ul>
                    </div>
                    
                    <div className="border border-green-200 dark:border-green-700 rounded-xl p-4">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">STS Assume Role</h4>
                      <ul className="text-sm text-green-800 dark:text-green-200 space-y-2">
                        <li><strong>Use Case:</strong> Cross-account access</li>
                        <li><strong>Scope:</strong> Temporary credentials</li>
                        <li><strong>Security:</strong> Time-limited tokens</li>
                        <li><strong>Best For:</strong> Multi-account setups</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
                    <h5 className="font-medium text-green-900 dark:text-green-100 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      AWS Recommendation
                    </h5>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      <strong>STS Assume Role is recommended</strong> for production environments as it provides 
                      temporary credentials, better security, and supports cross-account access patterns.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Zoom Authentication */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => toggleSection('zoom')}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Zoom Authentication Methods</h3>
                  <p className="text-gray-600 dark:text-gray-400">OAuth 2.0, JWT (Legacy), and Server-to-Server OAuth</p>
                </div>
              </div>
              {expandedSections.includes('zoom') ? (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections.includes('zoom') && (
              <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                <div className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">OAuth 2.0</h4>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                        <li><strong>Use Case:</strong> User authorization flow</li>
                        <li><strong>Scope:</strong> User-granted permissions</li>
                        <li><strong>Security:</strong> User consent required</li>
                        <li><strong>Best For:</strong> User-facing applications</li>
                      </ul>
                    </div>
                    
                    <div className="border border-yellow-200 dark:border-yellow-700 rounded-xl p-4">
                      <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">JWT (Legacy)</h4>
                      <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
                        <li><strong>Use Case:</strong> Server-to-server (deprecated)</li>
                        <li><strong>Scope:</strong> Account-level access</li>
                        <li><strong>Security:</strong> API key based</li>
                        <li><strong>Status:</strong> Being phased out</li>
                      </ul>
                    </div>
                    
                    <div className="border border-green-200 dark:border-green-700 rounded-xl p-4">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">Server-to-Server OAuth</h4>
                      <ul className="text-sm text-green-800 dark:text-green-200 space-y-2">
                        <li><strong>Use Case:</strong> Direct API access</li>
                        <li><strong>Scope:</strong> Account-level permissions</li>
                        <li><strong>Security:</strong> OAuth 2.0 based</li>
                        <li><strong>Best For:</strong> Backend integrations</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
                    <h5 className="font-medium text-green-900 dark:text-green-100 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Zoom Recommendation
                    </h5>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      <strong>Server-to-Server OAuth is recommended</strong> for new integrations as it replaces 
                      the deprecated JWT apps and provides better security with OAuth 2.0 standards.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Datadog Authentication */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => toggleSection('datadog')}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Datadog Authentication</h3>
                  <p className="text-gray-600 dark:text-gray-400">API Key + Application Key authentication</p>
                </div>
              </div>
              {expandedSections.includes('datadog') ? (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections.includes('datadog') && (
              <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                <div className="pt-6 space-y-6">
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-6">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-4">Unique Authentication Model</h4>
                    <p className="text-purple-800 dark:text-purple-200 mb-4">
                      Datadog uses a unique dual-key authentication system that combines organization-level and user-level access:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4">
                        <h5 className="font-medium text-purple-900 dark:text-purple-100 mb-2">API Key</h5>
                        <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                          <li>• Organization-level authentication</li>
                          <li>• Identifies your Datadog organization</li>
                          <li>• Required for all API calls</li>
                          <li>• Can be shared across applications</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4">
                        <h5 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Application Key</h5>
                        <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                          <li>• User-specific permissions</li>
                          <li>• Inherits user's role and access</li>
                          <li>• Required for write operations</li>
                          <li>• Should be kept private per user</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                    <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Site Selection Important
                    </h5>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Datadog operates multiple sites (US1, EU1, US3, etc.). You must select the correct site 
                      where your account was created, as API endpoints differ between sites.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Best Practices */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => toggleSection('best-practices')}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Security Best Practices</h3>
                  <p className="text-gray-600 dark:text-gray-400">Recommendations for secure authentication</p>
                </div>
              </div>
              {expandedSections.includes('best-practices') ? (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections.includes('best-practices') && (
              <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                <div className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-green-900 dark:text-green-100">✅ Recommended Practices</h4>
                      <ul className="space-y-3 text-sm text-green-800 dark:text-green-200">
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Use service accounts</strong> or app-based authentication for production</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Implement credential rotation</strong> regularly</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Use environment variables</strong> for storing credentials</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Apply principle of least privilege</strong> for permissions</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Monitor API usage</strong> and set up alerts</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-red-900 dark:text-red-100">❌ Avoid These Practices</h4>
                      <ul className="space-y-3 text-sm text-red-800 dark:text-red-200">
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Don't hardcode credentials</strong> in source code</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Don't use personal accounts</strong> for production integrations</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Don't grant excessive permissions</strong> beyond what's needed</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Don't ignore credential expiration</strong> warnings</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Don't share credentials</strong> across multiple environments</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
                    <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Production Deployment Checklist</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h6 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Before Deployment:</h6>
                        <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                          <li>□ Credentials stored in secure vault</li>
                          <li>□ Minimum required permissions granted</li>
                          <li>□ Rotation schedule established</li>
                          <li>□ Monitoring and alerting configured</li>
                        </ul>
                      </div>
                      <div>
                        <h6 className="font-medium text-blue-800 dark:text-blue-200 mb-2">After Deployment:</h6>
                        <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                          <li>□ Test authentication flows</li>
                          <li>□ Verify API rate limits</li>
                          <li>□ Document credential management</li>
                          <li>□ Train team on security practices</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <DocumentationLayout
      title="Authentication Methods FAQ"
      description="Comprehensive guide to authentication methods across all supported integrations"
      sections={sections}
      activeSection="overview"
      onSectionChange={() => {}}
      showBackButton
      backTo="/docs"
    >
      {renderContent()}
    </DocumentationLayout>
  );
};

export default AuthenticationFAQ;
