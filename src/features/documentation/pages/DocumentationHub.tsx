import React from 'react';
import { 
  Book, 
  Code, 
  Database, 
  Cloud, 
  MessageSquare, 
  Github, 
  Zap,
  Monitor,
  Shield,
  Settings,
  Users,
  BarChart3
} from 'lucide-react';
import DocumentationLayout from '../components/DocumentationLayout';
import IntegrationCard from '../components/IntegrationCard';
import { useNavigate } from 'react-router-dom';

const DocumentationHub: React.FC = () => {
  const navigate = useNavigate();

  const integrations = [
    {
      id: 'generic',
      name: 'Generic Integration Guide',
      description: 'Master template for all SaaS integrations',
      icon: <Book className="h-6 w-6 text-white" />,
      status: 'implemented' as const,
      authMethods: ['OAuth 2.0', 'API Keys', 'Service Accounts'],
      features: [
        'Step-by-step implementation guide',
        'Database schema templates',
        'Frontend component patterns',
        'Backend service architecture',
        'Authentication patterns',
        'Error handling strategies'
      ],
      difficulty: 'medium' as const,
      estimatedTime: '2-4 hours',
      documentationPath: '/docs/integration-guide'
    },
    {
      id: 'slack',
      name: 'Slack Integration',
      description: 'Workspace management and user synchronization',
      icon: <MessageSquare className="h-6 w-6 text-white" />,
      status: 'implemented' as const,
      authMethods: ['OAuth 2.0', 'Bot Token'],
      features: [
        'Workspace connection',
        'User and channel sync',
        'Message analytics',
        'Bot integration'
      ],
      difficulty: 'easy' as const,
      estimatedTime: '1-2 hours',
      documentationPath: '/docs/integrations/slack'
    },
    {
      id: 'google-workspace',
      name: 'Google Workspace',
      description: 'Complete Google Workspace management',
      icon: <Cloud className="h-6 w-6 text-white" />,
      status: 'implemented' as const,
      authMethods: ['Service Account', 'OAuth 2.0'],
      features: [
        'User management',
        'Group synchronization',
        'Organizational units',
        'Usage analytics'
      ],
      difficulty: 'hard' as const,
      estimatedTime: '4-6 hours',
      documentationPath: '/docs/integrations/google-workspace'
    },
    {
      id: 'github',
      name: 'GitHub Integration',
      description: 'Repository and team management',
      icon: <Github className="h-6 w-6 text-white" />,
      status: 'implemented' as const,
      authMethods: ['Personal Access Token', 'GitHub App'],
      features: [
        'Repository access',
        'Team management',
        'User synchronization',
        'Activity tracking'
      ],
      difficulty: 'medium' as const,
      estimatedTime: '2-3 hours',
      documentationPath: '/docs/integrations/github'
    },
    {
      id: 'aws',
      name: 'AWS Integration',
      description: 'Cloud infrastructure management',
      icon: <Database className="h-6 w-6 text-white" />,
      status: 'implemented' as const,
      authMethods: ['Access Keys', 'IAM Roles'],
      features: [
        'Resource management',
        'Cost tracking',
        'User access control',
        'Security monitoring'
      ],
      difficulty: 'hard' as const,
      estimatedTime: '3-5 hours',
      documentationPath: '/docs/integrations/aws'
    },
    {
      id: 'zoom',
      name: 'Zoom Integration',
      description: 'Meeting and user management',
      icon: <Monitor className="h-6 w-6 text-white" />,
      status: 'implemented' as const,
      authMethods: ['OAuth 2.0', 'JWT/API Keys'],
      features: [
        'Meeting management',
        'User synchronization',
        'Usage analytics',
        'Recording access'
      ],
      difficulty: 'medium' as const,
      estimatedTime: '2-3 hours',
      documentationPath: '/docs/integrations/zoom'
    },
    {
      id: 'datadog',
      name: 'Datadog Integration',
      description: 'Monitoring and observability platform',
      icon: <BarChart3 className="h-6 w-6 text-white" />,
      status: 'in-progress' as const,
      authMethods: ['API Key + App Key'],
      features: [
        'User management',
        'Team synchronization',
        'Monitor configuration',
        'Dashboard access',
        'Metrics and logs',
        'Organization settings'
      ],
      difficulty: 'medium' as const,
      estimatedTime: '3-4 hours',
      documentationPath: '/docs/integrations/datadog'
    },
    {
      id: 'azure',
      name: 'Azure Integration',
      description: 'Microsoft Azure cloud services',
      icon: <Cloud className="h-6 w-6 text-white" />,
      status: 'coming-soon' as const,
      authMethods: ['Service Principal', 'Managed Identity'],
      features: [
        'Resource management',
        'Active Directory sync',
        'Cost management',
        'Security center'
      ],
      difficulty: 'hard' as const,
      estimatedTime: '4-6 hours',
      documentationPath: '/docs/integrations/azure'
    },
    {
      id: 'office365',
      name: 'Office 365 Integration',
      description: 'Microsoft Office 365 suite',
      icon: <Users className="h-6 w-6 text-white" />,
      status: 'coming-soon' as const,
      authMethods: ['OAuth 2.0', 'App Registration'],
      features: [
        'User management',
        'Teams integration',
        'SharePoint access',
        'Exchange management'
      ],
      difficulty: 'hard' as const,
      estimatedTime: '4-5 hours',
      documentationPath: '/docs/integrations/office365'
    }
  ];

  const quickLinks = [
    {
      title: 'Platform Overview',
      description: 'Complete platform guide and architecture',
      icon: <Book className="h-6 w-6 text-blue-600" />,
      path: '/docs/platform-overview',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Getting Started',
      description: 'New to SaaS integrations? Start here',
      icon: <Zap className="h-6 w-6 text-green-600" />,
      path: '/docs/integration-guide',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Authentication Guide',
      description: 'OAuth, API Keys, and security best practices',
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      path: '/docs/integration-guide#authentication',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'API Reference',
      description: 'Complete API documentation',
      icon: <Code className="h-6 w-6 text-orange-600" />,
      path: '/docs/platform-overview#api-reference',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <DocumentationLayout
      title="Integration Documentation"
      description="Comprehensive guides for integrating SaaS applications into your platform"
    >
      <div className="p-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-3xl p-8 mb-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg mx-auto mb-6">
              <Book className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              SaaS Integration Hub
            </h2>
            <p className="text-xl text-blue-800 dark:text-blue-200 mb-8 max-w-3xl mx-auto">
              Everything you need to integrate new SaaS applications into your platform. 
              From authentication patterns to database schemas, we've got you covered.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => navigate(link.path)}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20 hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4`}>
                    {link.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{link.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{link.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Integration Cards */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Available Integrations</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Detailed implementation guides for each supported platform
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Implemented</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Coming Soon</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                {...integration}
              />
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Integration Statistics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {integrations.filter(i => i.status === 'implemented').length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Implemented</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">
                {integrations.filter(i => i.status === 'in-progress').length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-600 mb-2">
                {integrations.filter(i => i.status === 'coming-soon').length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Coming Soon</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {integrations.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Planned</div>
            </div>
          </div>
        </div>
      </div>
    </DocumentationLayout>
  );
};

export default DocumentationHub;
