import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Shield, 
  Users, 
  BarChart3, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Cloud,
  Lock,
  TrendingUp,
  Globe,
  Star,
  Play,
  ChevronDown,
  Database,
  GitBranch,
  MessageSquare,
  DollarSign,
  Eye,
  Settings,
  FileText,
  Headphones,
  Book,
  Monitor
} from 'lucide-react'

const LandingPage: React.FC = () => {
  const [showSolutionsDropdown, setShowSolutionsDropdown] = useState(false)
  const [showIntegrationsDropdown, setShowIntegrationsDropdown] = useState(false)
  const [showResourcesDropdown, setShowResourcesDropdown] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SaasDor
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              {/* Solutions Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  onMouseEnter={() => setShowSolutionsDropdown(true)}
                  onMouseLeave={() => setShowSolutionsDropdown(false)}
                >
                  Solutions
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {showSolutionsDropdown && (
                  <div
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-4 z-50"
                    onMouseEnter={() => setShowSolutionsDropdown(true)}
                    onMouseLeave={() => setShowSolutionsDropdown(false)}
                  >
                    <Link to="/user-management" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                      <Users className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <div className="font-medium">User Management</div>
                        <div className="text-sm text-gray-500">Centralized user control</div>
                      </div>
                    </Link>
                    <Link to="/cost-optimization" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                      <DollarSign className="w-5 h-5 mr-3 text-green-600" />
                      <div>
                        <div className="font-medium">Cost Optimization</div>
                        <div className="text-sm text-gray-500">Reduce SaaS spending</div>
                      </div>
                    </Link>
                    <Link to="/security-compliance" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                      <Shield className="w-5 h-5 mr-3 text-red-600" />
                      <div>
                        <div className="font-medium">Security & Compliance</div>
                        <div className="text-sm text-gray-500">Enterprise security</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Integrations Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  onMouseEnter={() => setShowIntegrationsDropdown(true)}
                  onMouseLeave={() => setShowIntegrationsDropdown(false)}
                >
                  Integrations
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {showIntegrationsDropdown && (
                  <div
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-4 z-50"
                    onMouseEnter={() => setShowIntegrationsDropdown(true)}
                    onMouseLeave={() => setShowIntegrationsDropdown(false)}
                  >
                    <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                      <Database className="w-5 h-5 mr-3 text-orange-600" />
                      <div>
                        <div className="font-medium">AWS</div>
                        <div className="text-sm text-gray-500">Cloud infrastructure</div>
                      </div>
                    </a>
                    <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                      <GitBranch className="w-5 h-5 mr-3 text-gray-800" />
                      <div>
                        <div className="font-medium">GitHub</div>
                        <div className="text-sm text-gray-500">Code repositories</div>
                      </div>
                    </a>
                    <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                      <MessageSquare className="w-5 h-5 mr-3 text-purple-600" />
                      <div>
                        <div className="font-medium">Slack</div>
                        <div className="text-sm text-gray-500">Team communication</div>
                      </div>
                    </a>
                    <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                      <Globe className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <div className="font-medium">Google Workspace</div>
                        <div className="text-sm text-gray-500">Productivity suite</div>
                      </div>
                    </a>
                  </div>
                )}
              </div>

              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>

              {/* Resources Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  onMouseEnter={() => setShowResourcesDropdown(true)}
                  onMouseLeave={() => setShowResourcesDropdown(false)}
                >
                  Resources
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {showResourcesDropdown && (
                  <div
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-4 z-50"
                    onMouseEnter={() => setShowResourcesDropdown(true)}
                    onMouseLeave={() => setShowResourcesDropdown(false)}
                  >
                    <Link to="/documentation" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                      <Book className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <div className="font-medium">Documentation</div>
                        <div className="text-sm text-gray-500">Setup guides & API docs</div>
                      </div>
                    </Link>
                    <Link to="/blog" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                      <FileText className="w-5 h-5 mr-3 text-green-600" />
                      <div>
                        <div className="font-medium">Blog</div>
                        <div className="text-sm text-gray-500">Best practices & insights</div>
                      </div>
                    </Link>
                    <Link to="/support" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                      <Headphones className="w-5 h-5 mr-3 text-purple-600" />
                      <div>
                        <div className="font-medium">Support</div>
                        <div className="text-sm text-gray-500">Help center & contact</div>
                      </div>
                    </Link>
                    <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                      <Monitor className="w-5 h-5 mr-3 text-orange-600" />
                      <div>
                        <div className="font-medium">Live Demo</div>
                        <div className="text-sm text-gray-500">Interactive walkthrough</div>
                      </div>
                    </a>
                  </div>
                )}
              </div>

              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-8">
              <Star className="w-4 h-4 mr-2" />
              Built for modern SaaS management
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Master Your
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SaaS Universe
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              The ultimate platform to centralize, secure, and optimize your entire SaaS ecosystem. 
              Gain complete visibility and control over your applications, users, and spending.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-3 hover:bg-gray-200 transition-colors">
                  <Play className="w-5 h-5 ml-1" />
                </div>
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">4</div>
              <div className="text-gray-600">Platform Integrations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">5</div>
              <div className="text-gray-600">Analytics Dashboards</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">100%</div>
              <div className="text-gray-600">Data Security</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage SaaS
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools to streamline your SaaS operations, enhance security, and optimize costs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Unified User Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Centrally manage users across AWS, GitHub, Slack, and Google Workspace. Track user access and permissions in one dashboard.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Ghost user detection, license optimization insights, security risk analysis, and cross-platform user analytics.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Security Dashboard</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor security risks, track admin access, and ensure compliance across your integrated platforms.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Database className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AWS Integration</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete AWS management - users, organizations, billing, resources, and security monitoring.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <GitBranch className="w-6 h-6 text-gray-800" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">GitHub Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Manage GitHub users, teams, repositories, and track development activity across your organization.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Slack & Workspace</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor Slack workspaces and Google Workspace users with centralized access control and reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Seamless Integrations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with your existing tools and platforms for complete visibility
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AWS</h3>
              <p className="text-sm text-gray-600">Complete cloud infrastructure management</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <GitBranch className="w-8 h-8 text-gray-800" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">GitHub</h3>
              <p className="text-sm text-gray-600">Repository and team management</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Slack</h3>
              <p className="text-sm text-gray-600">Workspace and user monitoring</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Google Workspace</h3>
              <p className="text-sm text-gray-600">Productivity suite integration</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">More integrations coming soon:</p>
            <div className="flex justify-center items-center space-x-8 text-gray-400">
              <span className="font-medium">Azure</span>
              <span className="font-medium">Office 365</span>
              <span className="font-medium">Zoom</span>
              <span className="font-medium">Salesforce</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your organization's needs. All plans include our core features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <p className="text-gray-600 mb-6">Perfect for small teams</p>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Up to 50 users</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">2 platform integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Basic analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Email support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Monthly reports</span>
                </li>
              </ul>
              
              <Link
                to="/register"
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-center block"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-500 p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
                <p className="text-gray-600 mb-6">For growing companies</p>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-gray-900">$99</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Up to 500 users</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">All platform integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Advanced analytics & insights</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Custom reports</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Security dashboard</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">API access</span>
                </li>
              </ul>
              
              <Link
                to="/register"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-center block"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-6">For large organizations</p>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-gray-900">Custom</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Unlimited users</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">All integrations + custom</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Advanced security features</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Dedicated support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Custom workflows</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">On-premise deployment</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">SLA guarantee</span>
                </li>
              </ul>
              
              <button className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">All plans include:</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-700">
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                14-day free trial
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                No setup fees
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Cancel anytime
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                99.9% uptime SLA
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to transform your SaaS management?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join hundreds of companies already saving time and money with SaasDor
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Start Free Trial
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SaasDor</span>
              </div>
              <p className="text-gray-400">
                The ultimate SaaS management platform for modern businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SaasDor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
