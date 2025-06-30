import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Cloud, 
  ArrowLeft, 
  Shield, 
  Lock, 
  Eye, 
  CheckCircle, 
  Database,
  GitBranch,
  MessageSquare,
  Globe,
  AlertTriangle,
  UserCheck,
  FileText,
  Activity,
  Bell,
  Search
} from 'lucide-react'

const SecurityComplianceSolutionPage: React.FC = () => {
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
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Security & Compliance
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor security risks, ensure compliance, and maintain audit trails across AWS, GitHub, Slack, and Google Workspace with comprehensive security analytics.
          </p>
        </div>

        {/* Security Challenges */}
        <section className="mb-16">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              Security Challenges
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Fragmented Security</h3>
                <p className="text-gray-700">Security monitoring is scattered across platforms, making it impossible to get a unified view of your security posture.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Compliance Gaps</h3>
                <p className="text-gray-700">Manual compliance processes are error-prone and time-consuming, leading to audit failures and regulatory issues.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Privileged Access</h3>
                <p className="text-gray-700">Excessive admin privileges and unmonitored access changes create significant security vulnerabilities.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Audit Complexity</h3>
                <p className="text-gray-700">Preparing for security audits requires manual data collection from multiple systems, consuming valuable time and resources.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="mb-16">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              SaasDor Security Dashboard
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Unified Security Monitoring</h3>
                <p className="text-gray-700 mb-4">Monitor security events, access changes, and risk indicators across all platforms in real-time.</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Real-time security alerts
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Access change tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Risk scoring and prioritization
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Automated Compliance</h3>
                <p className="text-gray-700 mb-4">Automate compliance reporting and maintain continuous audit readiness with comprehensive documentation.</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Automated audit trails
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Compliance reporting
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Policy enforcement
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Security Analytics Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <UserCheck className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Admin Access Monitoring</h3>
              <p className="text-gray-600">Track all admin-level access across platforms and identify potential privilege escalation risks.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Activity Anomaly Detection</h3>
              <p className="text-gray-600">Identify unusual user behavior patterns and potential security incidents across all platforms.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Real-time Alerts</h3>
              <p className="text-gray-600">Get instant notifications for critical security events and policy violations.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Compliance Reporting</h3>
              <p className="text-gray-600">Generate comprehensive compliance reports for SOC 2, ISO 27001, and other frameworks.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Audit Trail Search</h3>
              <p className="text-gray-600">Quickly search and filter audit logs across all platforms for investigation and compliance.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Access Reviews</h3>
              <p className="text-gray-600">Automated access reviews and certification processes to ensure least privilege principles.</p>
            </div>
          </div>
        </section>

        {/* Platform Security Coverage */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Platform Security Coverage</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <Database className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">AWS Security Monitoring</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• IAM policy changes and violations</li>
                <li>• Root account usage monitoring</li>
                <li>• Multi-factor authentication compliance</li>
                <li>• CloudTrail event analysis</li>
                <li>• Security group modifications</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <GitBranch className="w-5 h-5 text-gray-800" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">GitHub Security Analytics</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Repository access changes</li>
                <li>• Admin privilege modifications</li>
                <li>• Two-factor authentication status</li>
                <li>• Branch protection violations</li>
                <li>• Secret scanning alerts</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Slack Security Monitoring</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Workspace admin changes</li>
                <li>• Guest user access tracking</li>
                <li>• App installation monitoring</li>
                <li>• Data loss prevention alerts</li>
                <li>• External sharing violations</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Google Workspace Security</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Admin role assignments</li>
                <li>• Super admin activity monitoring</li>
                <li>• OAuth app permissions</li>
                <li>• Mobile device compliance</li>
                <li>• Data sharing policy violations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Compliance Frameworks */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Compliance Framework Support</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">SOC 2 Type II</h3>
              <p className="text-sm text-gray-600">Automated controls mapping and evidence collection for SOC 2 compliance</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">ISO 27001</h3>
              <p className="text-sm text-gray-600">Information security management system controls and documentation</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">GDPR</h3>
              <p className="text-sm text-gray-600">Data protection and privacy compliance monitoring and reporting</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">HIPAA</h3>
              <p className="text-sm text-gray-600">Healthcare data protection and access control compliance</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">PCI DSS</h3>
              <p className="text-sm text-gray-600">Payment card industry data security standard compliance</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Custom Frameworks</h3>
              <p className="text-sm text-gray-600">Support for industry-specific and custom compliance requirements</p>
            </div>
          </div>
        </section>

        {/* Security Metrics */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">Security Metrics Dashboard</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">99.9%</div>
                <div className="text-red-100">Security Event Detection</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">&lt; 5 min</div>
                <div className="text-red-100">Alert Response Time</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-red-100">Audit Trail Coverage</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-red-100">Continuous Monitoring</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Secure Your SaaS Environment Today</h2>
            <p className="text-xl text-blue-100 mb-8">
              Start monitoring security risks and ensuring compliance across all your platforms
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Start Security Monitoring
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

export default SecurityComplianceSolutionPage
