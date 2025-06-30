import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Cloud, 
  ArrowLeft, 
  DollarSign, 
  TrendingDown, 
  Eye, 
  CheckCircle, 
  Database,
  GitBranch,
  MessageSquare,
  Globe,
  BarChart3,
  Users,
  AlertTriangle,
  PieChart,
  Calculator,
  Target
} from 'lucide-react'

const CostOptimizationSolutionPage: React.FC = () => {
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
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SaaS Cost Optimization
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Identify unused licenses, ghost users, and optimization opportunities across AWS, GitHub, Slack, and Google Workspace to reduce your SaaS spending by up to 30%.
          </p>
        </div>

        {/* Problem Section */}
        <section className="mb-16">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              The Cost Problem
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Hidden Waste</h3>
                <p className="text-gray-700">Organizations typically waste 20-30% of their SaaS budget on unused licenses, inactive users, and redundant subscriptions.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">No Visibility</h3>
                <p className="text-gray-700">Without centralized tracking, it's impossible to see which licenses are being used and which are just burning money.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Ghost Users</h3>
                <p className="text-gray-700">Former employees and inactive accounts continue consuming licenses long after they should have been removed.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Over-Provisioning</h3>
                <p className="text-gray-700">Teams often purchase more licenses than needed, leading to significant overspend on SaaS subscriptions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="mb-16">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              SaasDor Cost Intelligence
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Automated Discovery</h3>
                <p className="text-gray-700 mb-4">Automatically identify all users, licenses, and subscriptions across your SaaS platforms.</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Real-time license tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Usage pattern analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Cost allocation insights
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Recommendations</h3>
                <p className="text-gray-700 mb-4">Get actionable recommendations to reduce costs while maintaining productivity.</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Ghost user identification
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    License rightsizing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Savings calculations
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cost Analytics Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Cost Analytics Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ghost User Detection</h3>
              <p className="text-gray-600">Automatically identify inactive users who haven't logged in for 30, 60, or 90 days across all platforms.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <PieChart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">License Utilization</h3>
              <p className="text-gray-600">Track license usage rates and identify opportunities to downgrade or consolidate subscriptions.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Calculator className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cost Projections</h3>
              <p className="text-gray-600">Calculate potential savings from removing ghost users and optimizing license allocations.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Spending Trends</h3>
              <p className="text-gray-600">Monitor spending patterns over time and identify cost spikes or unusual usage patterns.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Optimization Targets</h3>
              <p className="text-gray-600">Set cost reduction goals and track progress toward achieving your optimization targets.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingDown className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">ROI Tracking</h3>
              <p className="text-gray-600">Measure the return on investment from your cost optimization efforts and SaasDor implementation.</p>
            </div>
          </div>
        </section>

        {/* Platform-Specific Savings */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Platform-Specific Savings</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <Database className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">AWS Cost Optimization</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Identify unused IAM users and roles</li>
                <li>• Track resource utilization across accounts</li>
                <li>• Monitor billing anomalies and spikes</li>
                <li>• Optimize reserved instance usage</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <GitBranch className="w-5 h-5 text-gray-800" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">GitHub License Management</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Remove inactive organization members</li>
                <li>• Optimize seat allocations</li>
                <li>• Track repository access patterns</li>
                <li>• Identify unused private repositories</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Slack Workspace Optimization</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Identify inactive workspace members</li>
                <li>• Optimize paid plan usage</li>
                <li>• Track guest user allocations</li>
                <li>• Monitor app and integration costs</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Google Workspace Savings</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Remove suspended or inactive users</li>
                <li>• Optimize license tier assignments</li>
                <li>• Track storage usage and costs</li>
                <li>• Monitor add-on subscriptions</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ROI Calculator */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">Potential Savings Calculator</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">20-30%</div>
                <div className="text-green-100">Average Cost Reduction</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">$50K+</div>
                <div className="text-green-100">Annual Savings (500 users)</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">3 months</div>
                <div className="text-green-100">Typical ROI Payback</div>
              </div>
            </div>
            <div className="text-center mt-8">
              <p className="text-xl text-green-100 mb-6">
                See how much you could save with SaasDor's cost optimization
              </p>
              <Link
                to="/register"
                className="bg-white text-green-600 px-8 py-3 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Calculate Your Savings
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your SaaS Costs?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Start identifying cost savings opportunities across your SaaS portfolio today
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

export default CostOptimizationSolutionPage
