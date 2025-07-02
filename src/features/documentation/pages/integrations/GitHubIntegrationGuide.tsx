import React, { useState } from 'react';
import { Github, Shield, Database, Code, CheckCircle, AlertTriangle, Zap, Users, GitBranch } from 'lucide-react';
import DocumentationLayout from '../../components/DocumentationLayout';

const GitHubIntegrationGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: Github, description: 'GitHub integration capabilities' },
    { id: 'prerequisites', title: 'Prerequisites', icon: CheckCircle, description: 'GitHub App and token setup' },
    { id: 'authentication', title: 'Authentication', icon: Shield, description: 'Personal Access Token and GitHub App' },
    { id: 'database', title: 'Database Models', icon: Database, description: 'GitHub data models' },
    { id: 'backend', title: 'Backend Implementation', icon: Code, description: 'Services and API endpoints' },
    { id: 'sync', title: 'Data Synchronization', icon: Zap, description: 'Repository and team sync' },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: AlertTriangle, description: 'Common issues and solutions' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 dark:from-gray-900/20 dark:via-slate-900/20 dark:to-zinc-900/20 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center shadow-lg">
                  <Github className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">GitHub Integration</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-lg">Repository and team management</p>
                </div>
              </div>
              
              <p className="text-gray-800 dark:text-gray-200 mb-8 text-lg leading-relaxed">
                Integrate GitHub to manage repositories, teams, and user access. 
                This integration supports both Personal Access Tokens and GitHub App authentication for comprehensive repository management.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center text-lg">
                    <Zap className="h-6 w-6 mr-3 text-yellow-500" />
                    Key Features
                  </h4>
                  <ul className="text-sm text-gray-800 dark:text-gray-200 space-y-3">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Repository Access</strong> - Public and private repos</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Team Management</strong> - Team and member sync</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>User Synchronization</strong> - Organization members</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Activity Tracking</strong> - Commits and contributions</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center text-lg">
                    <Shield className="h-6 w-6 mr-3 text-blue-500" />
                    Authentication Methods
                  </h4>
                  <ul className="text-sm text-gray-800 dark:text-gray-200 space-y-3">
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🔑</span>
                      <span><strong>Personal Access Token</strong> - User-based access</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🤖</span>
                      <span><strong>GitHub App</strong> - Organization-wide access</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🔐</span>
                      <span><strong>OAuth App</strong> - User authorization flow</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🎯</span>
                      <span><strong>Fine-grained Tokens</strong> - Repository-specific access</span>
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
      title="GitHub Integration Guide"
      description="Complete guide for integrating GitHub repositories and teams"
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

export default GitHubIntegrationGuide;
