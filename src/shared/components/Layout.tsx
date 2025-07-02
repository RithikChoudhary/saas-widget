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
  CheckCircle,
  Key,
  User,
  Moon,
  Sun,
  Book,
  BarChart3,
  Sparkles,
  Activity
} from 'lucide-react';
import api from '../utils/api';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appsDropdownOpen, setAppsDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [currentUser, setCurrentUser] = useState<{
    name?: string;
    email?: string;
    role?: string;
  } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [connectedApps, setConnectedApps] = useState<any[]>([]);

  // Fetch current user information
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setCurrentUser({
            email: payload.email,
            name: payload.name || payload.email?.split('@')[0],
            role: payload.role
          });
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        if (error instanceof Error && error.message.includes('token')) {
          handleLogout();
        }
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch connected services
  useEffect(() => {
    const fetchConnectedServices = async () => {
      try {
        const credentialsResponse = await api.get('/credentials');
        if (credentialsResponse.data.success) {
          const credentials = credentialsResponse.data.data || [];
          setConnectedApps(credentials);
        }
      } catch (error) {
        console.error('Error fetching connected services:', error);
        setConnectedApps([]);
      }
    };

    fetchConnectedServices();
    if (appsDropdownOpen) {
      fetchConnectedServices();
    }
  }, [appsDropdownOpen]);

  const appConfigs = {
    aws: {
      name: 'Amazon Web Services',
      icon: '☁️',
      subItems: [
        { id: 'aws-users', name: 'IAM Users & Groups', href: '/apps/aws/users' },
        { id: 'aws-organizations', name: 'Organizations & OUs', href: '/apps/aws/organizations' },
        { id: 'aws-billing', name: 'Billing & Cost Management', href: '/apps/aws/billing' },
        { id: 'aws-resources', name: 'Resource Management', href: '/apps/aws/resources' }
      ]
    },
    'google-workspace': {
      name: 'Google Workspace',
      icon: '📧',
      subItems: [
        { id: 'google-users', name: 'Users & Groups', href: '/apps/google-workspace/users' },
        { id: 'google-groups', name: 'Groups', href: '/apps/google-workspace/groups' },
        { id: 'google-analytics', name: 'Analytics', href: '/apps/google-workspace/analytics' }
      ]
    },
    github: {
      name: 'GitHub',
      icon: '🐙',
      subItems: [
        { id: 'github-repositories', name: 'Repositories', href: '/apps/github/repositories' },
        { id: 'github-teams', name: 'Teams & Members', href: '/apps/github/teams' },
        { id: 'github-users', name: 'Users & Access', href: '/apps/github/users' }
      ]
    },
    slack: {
      name: 'Slack',
      icon: '💬',
      subItems: [
        { id: 'slack-workspaces', name: 'Workspaces', href: '/apps/slack/workspaces' },
        { id: 'slack-channels', name: 'Channels', href: '/apps/slack/channels' },
        { id: 'slack-users', name: 'Users & Members', href: '/apps/slack/users' }
      ]
    },
    zoom: {
      name: 'Zoom',
      icon: '📹',
      subItems: [
        { id: 'zoom-meetings', name: 'Meetings', href: '/apps/zoom/meetings' },
        { id: 'zoom-users', name: 'Users & Accounts', href: '/apps/zoom/users' }
      ]
    }
  };

  const connectedAppTypes = [...new Set(connectedApps.map(app => app.appType))];

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: Home,
      description: 'Overview and insights',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      name: 'Apps', 
      href: '/apps', 
      icon: Grid3X3, 
      hasDropdown: true,
      description: 'Connected services',
      gradient: 'from-purple-500 to-purple-600'
    },
    { 
      name: 'Analytics', 
      href: '/analytics', 
      icon: BarChart3,
      description: 'Usage and performance',
      gradient: 'from-green-500 to-green-600'
    },
    { 
      name: 'Credentials', 
      href: '/credentials', 
      icon: Key,
      description: 'Security management',
      gradient: 'from-yellow-500 to-yellow-600'
    },
    { 
      name: 'Users', 
      href: '/users', 
      icon: Users,
      description: 'User management',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    { 
      name: 'Company', 
      href: '/company-settings', 
      icon: Building2,
      description: 'Organization settings',
      gradient: 'from-gray-500 to-gray-600'
    },
    { 
      name: 'Documentation', 
      href: '/docs', 
      icon: Book,
      description: 'Integration guides',
      gradient: 'from-teal-500 to-teal-600'
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: Settings,
      description: 'System preferences',
      gradient: 'from-red-500 to-red-600'
    },
  ];

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const handleAppsClick = () => {
    navigate('/apps');
    setAppsDropdownOpen(!appsDropdownOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-900 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-white/10 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            {/* Mobile Brand */}
            <div className="flex-shrink-0 flex items-center px-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SaaSDor</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Management Platform</p>
                </div>
              </div>
            </div>
            
            {/* Mobile Navigation */}
            <nav className="px-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
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
                    className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg transform scale-105'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 hover:scale-105'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className={`text-xs ${active ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                        {item.description}
                      </div>
                    </div>
                    {item.hasDropdown && <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${appsDropdownOpen ? 'rotate-180' : ''}`} />}
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Mobile User Profile */}
          {currentUser && (
            <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {currentUser.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm transition-colors"
                >
                  {darkMode ? (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      Dark Mode
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-72">
          <div className="flex flex-col h-0 flex-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
              {/* Brand */}
              <div className="flex-shrink-0 flex items-center px-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Sparkles className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SaaSDor</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Management Platform</p>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="px-6 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Connected Apps</span>
                    <Activity className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{connectedApps.length}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Active integrations</div>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="flex-1 px-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <div 
                      key={item.name} 
                      className="relative" 
                      ref={item.hasDropdown ? dropdownRef : undefined}
                      onMouseEnter={() => item.hasDropdown && setAppsDropdownOpen(true)}
                      onMouseLeave={() => item.hasDropdown && setAppsDropdownOpen(false)}
                    >
                      <button
                        onClick={() => {
                          if (item.hasDropdown) {
                            handleAppsClick();
                          } else {
                            navigate(item.href);
                          }
                        }}
                        className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                          active
                            ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg transform scale-105'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 hover:scale-105'
                        }`}
                      >
                        <Icon className={`mr-3 h-5 w-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{item.name}</div>
                          <div className={`text-xs ${active ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                            {item.description}
                          </div>
                        </div>
                        {item.hasDropdown && (
                          <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${appsDropdownOpen ? 'rotate-180' : ''}`} />
                        )}
                      </button>

                      {/* Enhanced Apps Dropdown */}
                      {item.hasDropdown && appsDropdownOpen && (
                        <div 
                          className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 backdrop-blur-xl"
                          onMouseEnter={() => setAppsDropdownOpen(true)}
                          onMouseLeave={() => setAppsDropdownOpen(false)}
                        >
                          <div className="p-4">
                            <div className="mb-4">
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Connected Services</h3>
                              {connectedAppTypes.length > 0 ? (
                                <div className="space-y-2">
                                  {connectedAppTypes.map(appType => {
                                    const config = appConfigs[appType as keyof typeof appConfigs];
                                    if (!config) return null;
                                    
                                    return (
                                      <div key={appType} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                                        <div className="flex items-center space-x-3 mb-2">
                                          <span className="text-lg">{config.icon}</span>
                                          <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{config.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                              {connectedApps.filter(app => app.appType === appType).length} connection(s)
                                            </div>
                                          </div>
                                          <CheckCircle className="h-4 w-4 text-green-500" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-1">
                                          {config.subItems.slice(0, 4).map((subItem) => (
                                            <button
                                              key={subItem.id}
                                              onClick={() => {
                                                navigate(subItem.href);
                                                setAppsDropdownOpen(false);
                                              }}
                                              className="text-left px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            >
                                              {subItem.name}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No connected services</p>
                              )}
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Available Services</h3>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => {
                                    navigate('/apps/aws');
                                    setAppsDropdownOpen(false);
                                  }}
                                  className="flex items-center space-x-2 p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                  <span className="text-sm">☁️</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-gray-900 dark:text-white truncate">AWS</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Connect</div>
                                  </div>
                                </button>
                                <button
                                  onClick={() => {
                                    navigate('/apps/google-workspace');
                                    setAppsDropdownOpen(false);
                                  }}
                                  className="flex items-center space-x-2 p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                  <span className="text-sm">📧</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-gray-900 dark:text-white truncate">Google Workspace</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Connect</div>
                                  </div>
                                </button>
                              </div>
                            </div>
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
              <div className="flex-shrink-0 border-t border-gray-200/50 dark:border-gray-700/50 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {currentUser.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {currentUser.email}
                    </p>
                    {currentUser.role && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-1">
                        {currentUser.role}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={toggleDarkMode}
                    className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {darkMode ? (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
