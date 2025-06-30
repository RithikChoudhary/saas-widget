import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Users, 
  Grid3X3, 
  Settings, 
  LogOut,
  Home,
  Building2,
  ChevronDown,
  Cloud,
  Mail,
  Code,
  Database,
  Shield,
  DollarSign,
  UserPlus,
  Link,
  Server,
  CheckCircle,
  Plus,
  Key,
  User
} from 'lucide-react';
import { awsApi } from '../../features/apps/aws/services/awsApi';
import api from '../utils/api';

interface LayoutProps {
  children: React.ReactNode;
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  services: Service[];
}

interface Service {
  id: string;
  name: string;
  icon: string;
  subItems: SubItem[];
  status?: 'connected' | 'available' | 'coming-soon';
  accounts?: number;
}

interface SubItem {
  id: string;
  name: string;
  href: string;
  description: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appsDropdownOpen, setAppsDropdownOpen] = useState(false);
  const [awsAccountCount, setAwsAccountCount] = useState(0);
  const [awsStatus, setAwsStatus] = useState<'connected' | 'available'>('available');
  const [currentUser, setCurrentUser] = useState<{
    name?: string;
    email?: string;
    role?: string;
  } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch current user information
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          // Decode JWT token to get user info (basic implementation)
          const payload = JSON.parse(atob(token.split('.')[1]));
          setCurrentUser({
            email: payload.email,
            name: payload.name || payload.email?.split('@')[0],
            role: payload.role
          });
          console.log('👤 Current user loaded:', payload.email);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        // If token is invalid, redirect to login
        if (error instanceof Error && error.message.includes('token')) {
          handleLogout();
        }
      }
    };

    fetchCurrentUser();
  }, []);

  const [connectedApps, setConnectedApps] = useState<any[]>([]);

  // Fetch real connected services status
  useEffect(() => {
    const fetchConnectedServices = async () => {
      try {
        // Fetch credentials to see what's connected
        const credentialsResponse = await api.get('/credentials');
        
        if (credentialsResponse.data.success) {
          const credentials = credentialsResponse.data.data || [];
          setConnectedApps(credentials);
          
          // Update AWS status for backward compatibility
          const awsCredentials = credentials.filter((cred: any) => cred.appType === 'aws');
          if (awsCredentials.length > 0) {
            setAwsAccountCount(awsCredentials.length);
            setAwsStatus('connected');
          } else {
            setAwsAccountCount(0);
            setAwsStatus('available');
          }
        }
      } catch (error) {
        console.error('Error fetching connected services:', error);
        setConnectedApps([]);
        setAwsAccountCount(0);
        setAwsStatus('available');
      }
    };

    fetchConnectedServices();
    
    // Refresh status when dropdown opens
    if (appsDropdownOpen) {
      fetchConnectedServices();
    }
  }, [appsDropdownOpen]);

  // App type configurations
  const appConfigs = {
    aws: {
      name: 'Amazon Web Services',
      icon: '☁️',
      subItems: [
        { id: 'aws-connections', name: 'Account Connections', href: '/apps/aws/connections', description: 'Manage AWS account connections' },
        { id: 'aws-users', name: 'IAM Users & Groups', href: '/apps/aws/users', description: 'Manage IAM users and groups' },
        { id: 'aws-organizations', name: 'Organizations & OUs', href: '/apps/aws/organizations', description: 'Organizational units management' },
        { id: 'aws-billing', name: 'Billing & Cost Management', href: '/apps/aws/billing', description: 'Cost optimization and billing' },
        { id: 'aws-security', name: 'Security & Compliance', href: '/apps/aws/security', description: 'Security posture and compliance' },
        { id: 'aws-resources', name: 'Resource Management', href: '/apps/aws/resources', description: 'EC2, S3, Lambda, and other AWS resources' }
      ]
    },
    github: {
      name: 'GitHub',
      icon: '🐙',
      subItems: [
        { id: 'github-repositories', name: 'Repositories', href: '/apps/github/repositories', description: 'Manage GitHub repositories' },
        { id: 'github-teams', name: 'Teams & Members', href: '/apps/github/teams', description: 'Manage GitHub teams and members' },
        { id: 'github-users', name: 'Users & Access', href: '/apps/github/users', description: 'Manage GitHub users and access' },
        { id: 'github-analytics', name: 'Analytics', href: '/apps/github/analytics', description: 'GitHub usage analytics' }
      ]
    },
    slack: {
      name: 'Slack',
      icon: '💬',
      subItems: [
        { id: 'slack-workspaces', name: 'Workspaces', href: '/apps/slack/workspaces', description: 'Manage Slack workspaces' },
        { id: 'slack-channels', name: 'Channels', href: '/apps/slack/channels', description: 'Manage Slack channels' },
        { id: 'slack-users', name: 'Users & Members', href: '/apps/slack/users', description: 'Manage Slack users and members' },
        { id: 'slack-analytics', name: 'Analytics', href: '/apps/slack/analytics', description: 'Slack usage analytics' }
      ]
    },
    zoom: {
      name: 'Zoom',
      icon: '📹',
      subItems: [
        { id: 'zoom-meetings', name: 'Meetings', href: '/apps/zoom/meetings', description: 'Manage Zoom meetings' },
        { id: 'zoom-users', name: 'Users & Accounts', href: '/apps/zoom/users', description: 'Manage Zoom users and accounts' },
        { id: 'zoom-analytics', name: 'Analytics', href: '/apps/zoom/analytics', description: 'Zoom usage analytics' }
      ]
    },
    'google-workspace': {
      name: 'Google Workspace',
      icon: '📧',
      subItems: [
        { id: 'google-users', name: 'Users & Groups', href: '/apps/google-workspace/users', description: 'Manage Google Workspace users' },
        { id: 'google-orgunits', name: 'Organizational Units', href: '/apps/google-workspace/orgunits', description: 'Manage organizational units' },
        { id: 'google-analytics', name: 'Analytics', href: '/apps/google-workspace/analytics', description: 'Google Workspace analytics' }
      ]
    }
  };

  // Dynamic service categories based on connected services
  const connectedServices: any[] = [];
  const availableServices: any[] = [];

  // Group connected apps by type
  const connectedAppTypes = [...new Set(connectedApps.map(app => app.appType))];
  
  // Add connected services
  connectedAppTypes.forEach(appType => {
    const config = appConfigs[appType as keyof typeof appConfigs];
    if (config) {
      const appsOfType = connectedApps.filter(app => app.appType === appType);
      connectedServices.push({
        id: appType,
        name: config.name,
        icon: config.icon,
        status: 'connected',
        accounts: appsOfType.length,
        subItems: config.subItems
      });
    }
  });

  // Add available services (not connected)
  Object.entries(appConfigs).forEach(([appType, config]) => {
    if (!connectedAppTypes.includes(appType)) {
      availableServices.push({
        id: appType,
        name: config.name,
        icon: config.icon,
        status: 'available',
        href: `/apps/${appType}`
      });
    }
  });

  // Add additional available services
  availableServices.push(
    {
      id: 'azure',
      name: 'Microsoft Azure',
      icon: '🔷',
      status: 'available',
      href: '/apps/azure'
    },
    {
      id: 'office365',
      name: 'Microsoft Office 365',
      icon: '📊',
      status: 'available',
      href: '/apps/office365'
    }
  );

  const serviceCategories: ServiceCategory[] = [
    {
      id: 'connected-services',
      name: 'Connected Services',
      icon: CheckCircle,
      services: connectedServices.map(service => ({
        id: service.id,
        name: service.name,
        icon: service.icon,
        status: service.status as 'connected' | 'available' | 'coming-soon',
        accounts: service.accounts,
        subItems: service.subItems || []
      }))
    },
    {
      id: 'available-services',
      name: 'Available Services',
      icon: Plus,
      services: availableServices.map(service => ({
        id: service.id,
        name: service.name,
        icon: service.icon,
        status: service.status as 'connected' | 'available' | 'coming-soon',
        subItems: [
          { id: `${service.id}-connect`, name: 'Connect Service', href: service.href, description: `Connect ${service.name}` }
        ]
      }))
    }
  ];

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Apps', href: '/apps', icon: Grid3X3, hasDropdown: true },
    { name: 'Credentials', href: '/credentials', icon: Key },
    { name: 'Analytics', href: '/analytics', icon: Database },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Company', href: '/company-settings', icon: Building2 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAppsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Connected</span>;
      case 'available':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">Available</span>;
      case 'coming-soon':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Coming Soon</span>;
      default:
        return null;
    }
  };

  const handleAppsClick = () => {
    // Navigate to apps page and toggle dropdown
    navigate('/apps');
    setAppsDropdownOpen(!appsDropdownOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">SaaS Manager</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      if (item.hasDropdown) {
                        handleAppsClick();
                      } else {
                        navigate(item.href);
                      }
                      setSidebarOpen(false);
                    }}
                    className={`${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md w-full text-left`}
                  >
                    <Icon className="mr-4 h-6 w-6" />
                    {item.name}
                    {item.hasDropdown && <ChevronDown className="ml-auto h-4 w-4" />}
                  </button>
                );
              })}
            </nav>
          </div>
          {/* Mobile User Profile Section */}
          {currentUser && (
            <div className="flex-shrink-0 border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-900 truncate">
                    {currentUser.name || 'User'}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900 w-full"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          )}
          
          {/* Fallback logout for mobile if no user data */}
          {!currentUser && (
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-gray-900">SaaS Manager</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.name} className="relative" ref={item.hasDropdown ? dropdownRef : undefined}>
                      <button
                        onClick={() => {
                          if (item.hasDropdown) {
                            handleAppsClick();
                          } else {
                            navigate(item.href);
                          }
                        }}
                        className={`${
                          isActive(item.href)
                            ? 'bg-blue-100 text-blue-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left`}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.name}
                        {item.hasDropdown && (
                          <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${appsDropdownOpen ? 'rotate-180' : ''}`} />
                        )}
                      </button>

                      {/* Simple Apps Dropdown */}
                      {item.hasDropdown && appsDropdownOpen && (
                        <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                          <div className="py-2">
                            {connectedAppTypes.map(appType => {
                              const config = appConfigs[appType as keyof typeof appConfigs];
                              if (!config) return null;
                              
                              return (
                                <div key={appType} className="px-3 py-2">
                                  <div className="flex items-center space-x-2 text-sm font-medium text-gray-900 mb-1">
                                    <span>{config.icon}</span>
                                    <span>{config.name}</span>
                                  </div>
                                  <div className="ml-6 space-y-1">
                                    {config.subItems.map((subItem) => (
                                      <button
                                        key={subItem.id}
                                        onClick={() => {
                                          navigate(subItem.href);
                                          setAppsDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-2 py-1 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                      >
                                        {subItem.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
            {/* User Profile Section */}
            {currentUser && (
              <div className="flex-shrink-0 border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {currentUser.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-gray-900 text-sm w-full"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
            
            {/* Fallback logout if no user data */}
            {!currentUser && (
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-gray-900 text-sm"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
