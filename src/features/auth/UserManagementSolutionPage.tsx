import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Cloud, 
  ArrowLeft, 
  Users, 
  Shield, 
  Eye, 
  CheckCircle, 
  Database,
  GitBranch,
  MessageSquare,
  Globe,
  BarChart3,
  Settings,
  Lock,
  UserCheck,
  UserX,
  AlertTriangle
} from 'lucide-react'

const UserManagementSolutionPage: React.FC = () => {
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
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unified User Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Centralize user control across AWS, GitHub, Slack, and Google Workspace. 
            Get complete visibility into user access, permissions, and activity.
          </p>
        </div>

        {/* Problem Section */}
        <section className="mb-16">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              The Challenge
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Scattered User Data</h3>
                <p className="text-gray-700">User information spread across multiple platforms makes it impossible to get a complete picture of access and permissions.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Security Blind Spots</h3>
                <p className="text-gray-700">Without centralized visibility, ghost users and excessive permissions go unnoticed, creating security vulnerabilities.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Manual Processes</h3>
                <p className="text-gray-700">Onboarding and offboarding requires manual work across each platform, leading to delays and human errors.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Compliance Gaps</h3>
                <p className="text-gray-700">Audit trails are fragmented across systems, making compliance reporting time-consuming and error-prone.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="mb-16">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              SaasDor Solution
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Centralized Dashboard</h3>
                <p className="text-gray-700 mb-4">View all users across AWS, GitHub, Slack, and Google Workspace in a single, unified interface.</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Real-time user synchronization
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Cross-platform user matching
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Activity timeline tracking
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Analytics</h3>
                <p className="text-gray-700 mb-4">Identify ghost users, unused licenses, and security risks with intelligent analytics.</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Ghost user detection
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    License optimization insights
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Security risk scoring
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Coverage */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Platform Coverage</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AWS</h3>
              <p className="text-sm text-gray-600 mb-4">IAM users, groups, roles, and policies across multiple accounts</p>
              <div className="space-y-1 text-xs text-gray-500">
                <div>• User access tracking</div>
                <div>• Permission analysis</div>
                <div>• Multi-account visibility</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <GitBranch className="w-8 h-8 text-gray-800" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">GitHub</h3>
              <p className="text-sm text-gray-600 mb-4">Organization members, teams, and repository access</p>
              <div className="space-y-1 text-xs text-gray-500">
                <div>• Team membership</div>
                <div>• Repository permissions</div>
                <div>• Activity monitoring</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Slack</h3>
              <p className="text-sm text-gray-600 mb-4">Workspace members, channels, and admin roles</p>
              <div className="space-y-1 text-xs text-gray-500">
                <div>• Workspace access</div>
                <div>• Channel participation</div>
                <div>• Admin privileges</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Google Workspace</h3>
              <p className="text-sm text-gray-600 mb-4">Domain users, groups, and organizational units</p>
              <div className="space-y-1 text-xs text-gray-500">
                <div>• User directory</div>
                <div>• Group memberships</div>
                <div>• Admin roles</div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Complete Visibility</h3>
              <p className="text-gray-600">See all users across platforms in one dashboard. Track access patterns, last login times, and permission levels.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ghost User Detection</h3>
              <p className="text-gray-600">Automatically identify inactive users, duplicate accounts, and unused licenses to optimize costs and security.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Security Monitoring</h3>
              <p className="text-gray-600">Monitor admin access, track permission changes, and identify potential security risks across all platforms.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cross-Platform Analytics</h3>
              <p className="text-gray-600">Analyze user behavior patterns across platforms. Identify power users, inactive accounts, and access trends.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Automated Reporting</h3>
              <p className="text-gray-600">Generate compliance reports, access reviews, and user activity summaries automatically.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Access Control</h3>
              <p className="text-gray-600">Centralized view of user permissions and access levels across all integrated platforms and services.</p>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Common Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Offboarding</h3>
              <p className="text-gray-600 mb-4">Ensure departing employees are properly removed from all systems and their access is revoked.</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Identify all accounts across platforms</li>
                <li>• Track access removal progress</li>
                <li>• Generate offboarding reports</li>
                <li>• Verify complete access revocation</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Audits</h3>
              <p className="text-gray-600 mb-4">Prepare for security audits with comprehensive user access reports and activity logs.</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Generate access control matrices</li>
                <li>• Track permission changes over time</li>
                <li>• Identify privileged users</li>
                <li>• Document access justifications</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">License Optimization</h3>
              <p className="text-gray-600 mb-4">Identify unused licenses and optimize software spending across your organization.</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Find inactive user accounts</li>
                <li>• Track license utilization</li>
                <li>• Identify duplicate accounts</li>
                <li>• Calculate potential savings</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Reviews</h3>
              <p className="text-gray-600 mb-4">Regular security assessments to identify and mitigate access-related risks.</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Review admin privileges</li>
                <li>• Identify excessive permissions</li>
                <li>• Monitor suspicious activity</li>
                <li>• Track security incidents</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Centralize Your User Management?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Start your free trial and see all your users in one place within minutes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Start Free Trial
              </Link>
              <Link
                to="/"
                className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default UserManagementSolutionPage
