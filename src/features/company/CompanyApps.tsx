import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Settings, 
  Users, 
  Shield, 
  DollarSign, 
  Activity,
  ChevronRight,
  Cloud,
  Mail,
  Code,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter
} from 'lucide-react';
import { Layout } from '../../shared/components';
import { api } from '../../shared/utils';

interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  services: Service[];
}

interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: 'connected' | 'available' | 'coming-soon';
  accounts?: number;
  users?: number;
  lastSync?: string;
  monthlyCost?: number;
  features: string[];
  subServices: SubService[];
}

interface SubService {
  id: string;
  name: string;
  description: string;
  href: string;
  status: 'active' | 'inactive' | 'setup-required';
}

const CompanyApps: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const navigate = useNavigate();

  // Service categories with detailed information
  const serviceCategories: ServiceCategory[] = [
    {
      id: 'cloud-providers',
      name: 'Cloud Providers',
      icon: Cloud,
      description: 'Manage your cloud infrastructure and services',
      services: [
        {
          id: 'aws',
          name: 'Amazon Web Services',
          icon: '☁️',
          description: 'Comprehensive cloud computing platform with 200+ services',
          status: 'connected',
          accounts: 3,
          users: 45,
          lastSync: '2 minutes ago',
          monthlyCost: 2850,
          features: ['EC2 Instances', 'S3 Storage', 'IAM Management', 'Cost Optimization', 'Security Monitoring'],
          subServices: [
            { id: 'aws-connections', name: 'Account Connections', description: 'Manage multiple AWS accounts', href: '/apps/aws/connections', status: 'active' },
            { id: 'aws-users', name: 'IAM Users & Groups', description: 'User and permission management', href: '/apps/aws/users', status: 'active' },
            { id: 'aws-organizations', name: 'Organizations & OUs', description: 'Organizational structure management', href: '/apps/aws/organizations', status: 'active' },
            { id: 'aws-billing', name: 'Billing & Cost Management', description: 'Cost tracking and optimization', href: '/apps/aws/billing', status: 'active' },
            { id: 'aws-security', name: 'Security & Compliance', description: 'Security posture monitoring', href: '/apps/aws/security', status: 'setup-required' }
          ]
        },
        {
          id: 'azure',
          name: 'Microsoft Azure',
          icon: '🔷',
          description: 'Microsoft\'s cloud computing service for building, testing, and deploying applications',
          status: 'available',
          features: ['Virtual Machines', 'Azure AD', 'Storage Accounts', 'Cost Management', 'Security Center'],
          subServices: [
            { id: 'azure-subscriptions', name: 'Subscriptions', description: 'Manage Azure subscriptions', href: '/apps/azure/subscriptions', status: 'inactive' },
            { id: 'azure-ad', name: 'Active Directory', description: 'Identity and access management', href: '/apps/azure/ad', status: 'inactive' },
            { id: 'azure-management', name: 'Management Groups', description: 'Resource organization', href: '/apps/azure/management', status: 'inactive' },
            { id: 'azure-cost', name: 'Cost Management', description: 'Cost analysis and budgeting', href: '/apps/azure/cost', status: 'inactive' }
          ]
        },
        {
          id: 'gcp',
          name: 'Google Cloud Platform',
          icon: '🌐',
          description: 'Google\'s suite of cloud computing services',
          status: 'coming-soon',
          features: ['Compute Engine', 'Cloud Storage', 'IAM', 'BigQuery', 'Kubernetes Engine'],
          subServices: [
            { id: 'gcp-projects', name: 'Projects', description: 'Manage GCP projects', href: '/apps/gcp/projects', status: 'inactive' },
            { id: 'gcp-iam', name: 'IAM & Admin', description: 'Identity and access management', href: '/apps/gcp/iam', status: 'inactive' },
            { id: 'gcp-billing', name: 'Billing', description: 'Cost management and billing', href: '/apps/gcp/billing', status: 'inactive' }
          ]
        }
      ]
    },
    {
      id: 'productivity-suites',
      name: 'Productivity Suites',
      icon: Mail,
      description: 'Email, collaboration, and productivity tools',
      services: [
        {
          id: 'office365',
          name: 'Microsoft Office 365',
          icon: '📧',
          description: 'Complete productivity suite with email, documents, and collaboration tools',
          status: 'connected',
          users: 120,
          lastSync: '5 minutes ago',
          monthlyCost: 1800,
          features: ['Exchange Online', 'SharePoint', 'Teams', 'OneDrive', 'Security & Compliance'],
          subServices: [
            { id: 'o365-tenants', name: 'Tenant Connections', description: 'Manage Office 365 tenants', href: '/apps/office365/tenants', status: 'active' },
            { id: 'o365-users', name: 'Users & Groups', description: 'User lifecycle management', href: '/apps/office365/users', status: 'active' },
            { id: 'o365-exchange', name: 'Exchange Management', description: 'Email and calendar management', href: '/apps/office365/exchange', status: 'active' },
            { id: 'o365-security', name: 'Security Center', description: 'Security and compliance monitoring', href: '/apps/office365/security', status: 'setup-required' }
          ]
        },
        {
          id: 'google-workspace',
          name: 'Google Workspace',
          icon: '📊',
          description: 'Google\'s suite of productivity and collaboration tools',
          status: 'available',
          features: ['Gmail', 'Google Drive', 'Google Meet', 'Google Calendar', 'Admin Console'],
          subServices: [
            { id: 'gws-domains', name: 'Domain Management', description: 'Manage workspace domains', href: '/apps/google-workspace/domains', status: 'inactive' },
            { id: 'gws-users', name: 'Users & Groups', description: 'User lifecycle management', href: '/apps/google-workspace/users', status: 'inactive' },
            { id: 'gws-apps', name: 'App Management', description: 'Google Workspace applications', href: '/apps/google-workspace/apps', status: 'inactive' }
          ]
        }
      ]
    },
    {
      id: 'development-tools',
      name: 'Development Tools',
      icon: Code,
      description: 'Version control, CI/CD, and development platforms',
      services: [
        {
          id: 'github',
          name: 'GitHub',
          icon: '🐙',
          description: 'World\'s leading software development platform',
          status: 'connected',
          users: 25,
          lastSync: '1 hour ago',
          monthlyCost: 450,
          features: ['Repositories', 'Actions', 'Security', 'Team Management', 'Analytics'],
          subServices: [
            { id: 'github-orgs', name: 'Organizations', description: 'Manage GitHub organizations', href: '/apps/github/organizations', status: 'active' },
            { id: 'github-teams', name: 'Teams & Members', description: 'Team and member management', href: '/apps/github/teams', status: 'active' },
            { id: 'github-repos', name: 'Repository Analytics', description: 'Repository insights and analytics', href: '/apps/github/repositories', status: 'setup-required' },
            { id: 'github-security', name: 'Security', description: 'Security scanning and alerts', href: '/apps/github/security', status: 'active' }
          ]
        },
        {
          id: 'gitlab',
          name: 'GitLab',
          icon: '🦊',
          description: 'Complete DevOps platform delivered as a single application',
          status: 'available',
          features: ['Git Repository', 'CI/CD', 'Issue Tracking', 'Security Scanning', 'Container Registry'],
          subServices: [
            { id: 'gitlab-groups', name: 'Groups', description: 'Manage GitLab groups', href: '/apps/gitlab/groups', status: 'inactive' },
            { id: 'gitlab-projects', name: 'Projects', description: 'Project management and CI/CD', href: '/apps/gitlab/projects', status: 'inactive' },
            { id: 'gitlab-users', name: 'Users', description: 'User and permission management', href: '/apps/gitlab/users', status: 'inactive' }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'available':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'coming-soon':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Connected</span>;
      case 'available':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Available</span>;
      case 'coming-soon':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Coming Soon</span>;
      default:
        return null;
    }
  };

  const getSubServiceStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Active</span>;
      case 'inactive':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>;
      case 'setup-required':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">Setup Required</span>;
      default:
        return null;
    }
  };

  const filteredCategories = serviceCategories.map(category => ({
    ...category,
    services: category.services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || category.id === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || service.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
  })).filter(category => category.services.length > 0);

  const totalConnectedServices = serviceCategories.reduce((total, category) => 
    total + category.services.filter(service => service.status === 'connected').length, 0
  );

  const totalMonthlyCost = serviceCategories.reduce((total, category) => 
    total + category.services.reduce((serviceTotal, service) => 
      serviceTotal + (service.monthlyCost || 0), 0
    ), 0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Connected Apps & Services</h1>
                <p className="mt-2 text-gray-600">Manage all your organization's SaaS applications and cloud services</p>
              </div>
              <button
                onClick={() => navigate('/apps/connect-new')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Connect New Service
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Connected Services</p>
                  <p className="text-2xl font-bold text-gray-900">{totalConnectedServices}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">190</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
                  <p className="text-2xl font-bold text-gray-900">${totalMonthlyCost.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Integrations</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Services</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    <option value="cloud-providers">Cloud Providers</option>
                    <option value="productivity-suites">Productivity Suites</option>
                    <option value="development-tools">Development Tools</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="connected">Connected</option>
                    <option value="available">Available</option>
                    <option value="coming-soon">Coming Soon</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Service Categories */}
          <div className="space-y-8">
            {filteredCategories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <div key={category.id} className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <CategoryIcon className="h-6 w-6 text-gray-600" />
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {category.services.map((service) => (
                        <div key={service.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-3xl">{service.icon}</span>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                                  {getStatusIcon(service.status)}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                              </div>
                            </div>
                            {getStatusBadge(service.status)}
                          </div>

                          {/* Service Stats */}
                          {service.status === 'connected' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                              {service.accounts && (
                                <div className="text-center">
                                  <p className="text-sm font-medium text-gray-900">{service.accounts}</p>
                                  <p className="text-xs text-gray-600">Accounts</p>
                                </div>
                              )}
                              {service.users && (
                                <div className="text-center">
                                  <p className="text-sm font-medium text-gray-900">{service.users}</p>
                                  <p className="text-xs text-gray-600">Users</p>
                                </div>
                              )}
                              {service.monthlyCost && (
                                <div className="text-center">
                                  <p className="text-sm font-medium text-gray-900">${service.monthlyCost}</p>
                                  <p className="text-xs text-gray-600">Monthly</p>
                                </div>
                              )}
                              {service.lastSync && (
                                <div className="text-center">
                                  <p className="text-sm font-medium text-gray-900">{service.lastSync}</p>
                                  <p className="text-xs text-gray-600">Last Sync</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Features */}
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features</h4>
                            <div className="flex flex-wrap gap-1">
                              {service.features.slice(0, 3).map((feature, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  {feature}
                                </span>
                              ))}
                              {service.features.length > 3 && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  +{service.features.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Sub Services */}
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Management Areas</h4>
                            <div className="space-y-2">
                              {service.subServices.slice(0, 3).map((subService) => (
                                <div key={subService.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-medium text-gray-900">{subService.name}</span>
                                      {getSubServiceStatusBadge(subService.status)}
                                    </div>
                                    <p className="text-xs text-gray-600">{subService.description}</p>
                                  </div>
                                  <button
                                    onClick={() => navigate(subService.href)}
                                    disabled={service.status !== 'connected'}
                                    className="ml-2 p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <ChevronRight className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                              {service.subServices.length > 3 && (
                                <div className="text-center">
                                  <button className="text-xs text-blue-600 hover:text-blue-800">
                                    View all {service.subServices.length} areas
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex space-x-2">
                            {service.status === 'connected' ? (
                              <>
                                <button
                                  onClick={() => navigate(`/apps/${service.id}/dashboard`)}
                                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                  <Settings className="h-4 w-4 mr-1" />
                                  Manage
                                </button>
                                <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                  <ExternalLink className="h-4 w-4" />
                                </button>
                              </>
                            ) : service.status === 'available' ? (
                              <button
                                onClick={() => navigate(`/apps/${service.id}/connect`)}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Connect
                              </button>
                            ) : (
                              <button
                                disabled
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed"
                              >
                                <Clock className="h-4 w-4 mr-1" />
                                Coming Soon
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CompanyApps;
