import React, { useState } from 'react';
import { Users, Shield, Database, Code, CheckCircle, AlertTriangle, Zap, Mail, Calendar } from 'lucide-react';
import DocumentationLayout from '../../components/DocumentationLayout';

const Office365IntegrationGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: Users, description: 'Office 365 integration capabilities' },
    { id: 'prerequisites', title: 'Prerequisites', icon: CheckCircle, description: 'App registration and permissions' },
    { id: 'authentication', title: 'Authentication', icon: Shield, description: 'OAuth 2.0 and App Registration' },
    { id: 'database', title: 'Database Models', icon: Database, description: 'Office 365 data models' },
    { id: 'backend', title: 'Backend Implementation', icon: Code, description: 'Services and API endpoints' },
    { id: 'sync', title: 'Data Synchronization', icon: Zap, description: 'Users, Teams, and SharePoint sync' },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: AlertTriangle, description: 'Common issues and solutions' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-3xl p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Office 365 Integration</h3>
                  <p className="text-blue-700 dark:text-blue-300 text-lg">Microsoft Office 365 suite</p>
                </div>
              </div>
              
              <p className="text-blue-800 dark:text-blue-200 mb-8 text-lg leading-relaxed">
                Integrate Microsoft Office 365 to manage users, Teams, SharePoint, and Exchange services. 
                This integration supports OAuth 2.0 and App Registration for comprehensive Office 365 management.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center text-lg">
                    <Zap className="h-6 w-6 mr-3 text-yellow-500" />
                    Key Features
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-3">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>User Management</strong> - Azure AD users and groups</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Teams Integration</strong> - Teams and channels</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>SharePoint Access</strong> - Sites and documents</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Exchange Management</strong> - Mailboxes and calendars</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center text-lg">
                    <Shield className="h-6 w-6 mr-3 text-green-500" />
                    Authentication Methods
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-3">
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🔐</span>
                      <span><strong>OAuth 2.0</strong> - User authorization flow</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">📱</span>
                      <span><strong>App Registration</strong> - Azure AD app</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🔑</span>
                      <span><strong>Client Credentials</strong> - App-only access</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🎯</span>
                      <span><strong>Graph API</strong> - Microsoft Graph access</span>
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
            <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-3">Coming Soon</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Office 365 integration is planned for future release.</p>
          </div>
        );
    }
  };

  return (
    <DocumentationLayout
      title="Office 365 Integration Guide"
      description="Complete guide for integrating Microsoft Office 365 suite"
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

export default Office365IntegrationGuide;
