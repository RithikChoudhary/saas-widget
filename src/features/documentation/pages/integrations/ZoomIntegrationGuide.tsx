import React, { useState } from 'react';
import { Monitor, Shield, Database, Code, CheckCircle, AlertTriangle, Zap, Users, Video } from 'lucide-react';
import DocumentationLayout from '../../components/DocumentationLayout';

const ZoomIntegrationGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: Monitor, description: 'Zoom integration capabilities' },
    { id: 'prerequisites', title: 'Prerequisites', icon: CheckCircle, description: 'Zoom App and JWT setup' },
    { id: 'authentication', title: 'Authentication', icon: Shield, description: 'OAuth 2.0 and JWT/API Keys' },
    { id: 'database', title: 'Database Models', icon: Database, description: 'Zoom data models' },
    { id: 'backend', title: 'Backend Implementation', icon: Code, description: 'Services and API endpoints' },
    { id: 'sync', title: 'Data Synchronization', icon: Zap, description: 'Meeting and user sync' },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: AlertTriangle, description: 'Common issues and solutions' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-teal-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-3xl p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Monitor className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Zoom Integration</h3>
                  <p className="text-blue-700 dark:text-blue-300 text-lg">Meeting and user management</p>
                </div>
              </div>
              
              <p className="text-blue-800 dark:text-blue-200 mb-8 text-lg leading-relaxed">
                Integrate Zoom to manage meetings, users, and account settings. 
                This integration supports both OAuth 2.0 for user authorization and JWT/API Keys for automated operations.
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
                      <span><strong>Meeting Management</strong> - Create, update, and monitor meetings</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>User Synchronization</strong> - Account users and settings</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Usage Analytics</strong> - Meeting and participant insights</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Recording Access</strong> - Cloud recording management</span>
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
                      <span className="text-lg">🔑</span>
                      <span><strong>JWT/API Keys</strong> - Server-to-server auth</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🎯</span>
                      <span><strong>Scoped Access</strong> - Meeting and user permissions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🏢</span>
                      <span><strong>Account-level</strong> - Organization management</span>
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
      title="Zoom Integration Guide"
      description="Complete guide for integrating Zoom meetings and users"
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

export default ZoomIntegrationGuide;
