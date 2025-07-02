import React, { useState } from 'react';
import { Database, Shield, Code, CheckCircle, AlertTriangle, Zap, Cloud, Server } from 'lucide-react';
import DocumentationLayout from '../../components/DocumentationLayout';

const AWSIntegrationGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: Cloud, description: 'AWS integration capabilities' },
    { id: 'prerequisites', title: 'Prerequisites', icon: CheckCircle, description: 'IAM setup and access keys' },
    { id: 'authentication', title: 'Authentication', icon: Shield, description: 'Access Keys and IAM Roles' },
    { id: 'database', title: 'Database Models', icon: Database, description: 'AWS data models' },
    { id: 'backend', title: 'Backend Implementation', icon: Code, description: 'Services and API endpoints' },
    { id: 'sync', title: 'Resource Synchronization', icon: Zap, description: 'AWS resource and billing sync' },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: AlertTriangle, description: 'Common issues and solutions' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-orange-900/20 dark:via-yellow-900/20 dark:to-amber-900/20 border border-orange-200/50 dark:border-orange-700/50 rounded-3xl p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Cloud className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">AWS Integration</h3>
                  <p className="text-orange-700 dark:text-orange-300 text-lg">Cloud infrastructure management</p>
                </div>
              </div>
              
              <p className="text-orange-800 dark:text-orange-200 mb-8 text-lg leading-relaxed">
                Integrate AWS to manage cloud resources, monitor costs, and control user access across your AWS infrastructure. 
                This integration supports Access Keys and IAM Roles for comprehensive cloud management.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-4 flex items-center text-lg">
                    <Zap className="h-6 w-6 mr-3 text-yellow-500" />
                    Key Features
                  </h4>
                  <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-3">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Resource Management</strong> - EC2, S3, RDS, and more</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Cost Tracking</strong> - Billing and usage analytics</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>User Access Control</strong> - IAM users and policies</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Security Monitoring</strong> - CloudTrail and compliance</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-4 flex items-center text-lg">
                    <Shield className="h-6 w-6 mr-3 text-blue-500" />
                    Authentication Methods
                  </h4>
                  <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-3">
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🔑</span>
                      <span><strong>Access Keys</strong> - Programmatic access</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">👤</span>
                      <span><strong>IAM Roles</strong> - Assume role access</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🔐</span>
                      <span><strong>STS Tokens</strong> - Temporary credentials</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🏢</span>
                      <span><strong>Organizations</strong> - Multi-account management</span>
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
      title="AWS Integration Guide"
      description="Complete guide for integrating AWS cloud services"
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

export default AWSIntegrationGuide;
