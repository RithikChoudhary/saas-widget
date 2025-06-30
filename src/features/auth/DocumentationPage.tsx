import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Cloud, 
  ArrowLeft, 
  Book, 
  Code, 
  Settings, 
  Shield, 
  Database,
  GitBranch,
  MessageSquare,
  Globe,
  ExternalLink,
  Download,
  Play
} from 'lucide-react'

const DocumentationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
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
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Book className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to get started with SaasDor, from setup guides to advanced configurations
          </p>
        </div>

        {/* Quick Start */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Start</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting Started</h3>
              <p className="text-gray-600 mb-4">Set up your SaasDor account and connect your first integration in under 5 minutes.</p>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                Read Guide <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuration</h3>
              <p className="text-gray-600 mb-4">Configure user management, security settings, and analytics dashboards.</p>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                View Config <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">API Reference</h3>
              <p className="text-gray-600 mb-4">Complete API documentation for developers and advanced integrations.</p>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                API Docs <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </section>

        {/* Integration Guides */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Integration Guides</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <Database className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">AWS Integration</h3>
              </div>
              <p className="text-gray-600 mb-4">Connect your AWS accounts, manage IAM users, monitor billing, and track resources across multiple accounts.</p>
              <div className="space-y-2">
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">• Setting up AWS credentials</a>
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">• Multi-account management</a>
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">• Billing and cost tracking</a>
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">• Security best practices</a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <GitBranch className="w-5 h-5 text-gray-800" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">GitHub Integration</h3>
              </div>
              <p className="text-gray-600 mb-4">Manage GitHub organizations, track team members, monitor repositories, and analyze development activity.</p>
              <div className="space-y-2">
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">• Personal access tokens</a>
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">• Organization management</a>
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">• Repository monitoring</a>
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">• Team analytics</a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Slack Integration</h3>
              </div>
              <p className="text-gray-600 mb-4">Connect Slack workspaces, monitor user activity, track channel usage, and manage workspace permissions.</p>
              <div className="space-y-2">
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">• OAuth app setup</a>
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">• Workspace monitoring</a>
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">• User activity tracking</a>
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">• Channel analytics</a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Google Workspace</h3>
              </div>
              <p className="text-gray-600 mb-4">Integrate with Google Workspace for user management, group monitoring, and organizational unit tracking.</p>
              <div className="space-y-2">
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">• Service account setup</a>
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">• Domain-wide delegation</a>
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">• User synchronization</a>
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">• Security monitoring</a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Documentation */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Dashboard</h3>
              <p className="text-gray-600 mb-4">Monitor security risks, track admin access, and ensure compliance across platforms.</p>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Learn More →</a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Engine</h3>
              <p className="text-gray-600 mb-4">Ghost user detection, license optimization, and cross-platform insights.</p>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Learn More →</a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
              <p className="text-gray-600 mb-4">Centralized user control across all integrated platforms and services.</p>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Learn More →</a>
            </div>
          </div>
        </section>

        {/* Downloads */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Downloads</h2>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup Guides</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center text-blue-600 hover:text-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    SaasDor Setup Guide (PDF)
                  </a>
                  <a href="#" className="flex items-center text-blue-600 hover:text-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Integration Checklist (PDF)
                  </a>
                  <a href="#" className="flex items-center text-blue-600 hover:text-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Security Best Practices (PDF)
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Code Examples</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center text-blue-600 hover:text-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    API Integration Examples
                  </a>
                  <a href="#" className="flex items-center text-blue-600 hover:text-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Webhook Configuration
                  </a>
                  <a href="#" className="flex items-center text-blue-600 hover:text-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Custom Dashboard Scripts
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default DocumentationPage
