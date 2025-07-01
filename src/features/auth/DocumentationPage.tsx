import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Book, 
  Code, 
  Shield, 
  Database, 
  Cloud, 
  Key, 
  AlertTriangle, 
  Copy,
  Search,
  Zap,
  Lock,
  Monitor,
  Server,
  Terminal,
  Layers,
  Sparkles,
  Moon,
  Sun,
  CheckCircle
} from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  content: React.ReactNode;
}

const DocumentationPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

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

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const navigate = useNavigate();

  const docSections: DocSection[] = [
    {
      id: 'overview',
      title: 'Platform Overview',
      icon: Book,
      description: 'Introduction to the SaaSDor Management Platform',
      content: (
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
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'authentication',
      title: 'Authentication & Security',
      icon: Shield,
      description: 'Security implementation and authentication methods',
      content: (
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
                    <span><strong>AES-256</strong> for data at rest</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span><strong>TLS 1.3</strong> for data in transit</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h4 className="font-bold text-yellow-900 dark:text-yellow-100 mb-4 text-lg flex items-center">
                  <CheckCircle className="h-6 w-6 mr-3 text-blue-500" />
                  Compliance
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
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      icon: Code,
      description: 'Complete API documentation with examples',
      content: (
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
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: AlertTriangle,
      description: 'Common issues and solutions',
      content: (
        <div className="space-y-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-3xl p-8">
            <h3 className="text-2xl font-semibold text-red-900 dark:text-red-100 mb-6 flex items-center">
              <AlertTriangle className="h-8 w-8 mr-4 text-red-600" />
              Common Issues
            </h3>
            
            <div className="space-y-6">
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
            </div>
          </div>
        </div>
      )
    }
  ];

  const filteredSections = docSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SaaSDor</h1>
                <span className="text-gray-500 dark:text-gray-400 text-sm">Documentation</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Documentation</h1>
              <p className="mt-3 text-xl text-gray-600 dark:text-gray-400">Complete guide to using the SaaSDor Management Platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white w-80 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 sticky top-8 border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Table of Contents</h3>
              <nav className="space-y-3">
                {filteredSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 hover:scale-105'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className={`text-xs ${activeSection === section.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-500'}`}>
                          {section.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              {filteredSections.map((section) => (
                <div
                  key={section.id}
                  className={`${activeSection === section.id ? 'block' : 'hidden'}`}
                >
                  <div className="p-8 border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <section.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">{section.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    {section.content}
                  </div>
                </div>
              ))}

              {filteredSections.length === 0 && (
                <div className="p-16 text-center">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-3">No results found</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">Try adjusting your search query</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
