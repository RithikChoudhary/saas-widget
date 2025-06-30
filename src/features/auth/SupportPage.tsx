import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Cloud, 
  ArrowLeft, 
  Headphones, 
  MessageCircle, 
  Mail, 
  Phone,
  Search,
  Book,
  FileText,
  Video,
  Clock,
  CheckCircle,
  HelpCircle
} from 'lucide-react'

const SupportPage: React.FC = () => {
  const faqItems = [
    {
      question: "How do I connect my AWS account to SaasDor?",
      answer: "You can connect your AWS account by navigating to the Integrations page and clicking 'Add AWS Account'. You'll need to provide your AWS access key and secret key with appropriate IAM permissions."
    },
    {
      question: "What permissions does SaasDor need for GitHub integration?",
      answer: "SaasDor requires read access to your GitHub organization, including user management, team membership, and repository access. We use personal access tokens with specific scopes for secure integration."
    },
    {
      question: "How often does SaasDor sync data from connected platforms?",
      answer: "Data synchronization occurs every 4 hours for most platforms. Critical security events and user changes are synced in near real-time (within 5 minutes)."
    },
    {
      question: "Can I export compliance reports for audits?",
      answer: "Yes, SaasDor provides comprehensive compliance reports in PDF and CSV formats. You can generate reports for SOC 2, ISO 27001, and custom compliance frameworks."
    },
    {
      question: "How does ghost user detection work?",
      answer: "Our ghost user detection algorithm analyzes login patterns, activity levels, and access usage across all connected platforms to identify inactive users who may be consuming licenses unnecessarily."
    },
    {
      question: "Is my data secure with SaasDor?",
      answer: "Absolutely. We use enterprise-grade encryption (AES-256) for data at rest and in transit. All credentials are encrypted and stored securely. We're SOC 2 Type II compliant and follow industry best practices."
    }
  ]

  const supportChannels = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7 for Enterprise customers",
      action: "Start Chat",
      color: "blue"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      availability: "Response within 4 hours",
      action: "Send Email",
      color: "green"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our experts",
      availability: "Business hours (9 AM - 6 PM PST)",
      action: "Schedule Call",
      color: "purple"
    },
    {
      icon: Book,
      title: "Knowledge Base",
      description: "Browse our comprehensive guides",
      availability: "Available 24/7",
      action: "Browse Articles",
      color: "orange"
    }
  ]

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
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Headphones className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get the support you need to make the most of SaasDor. Our team is here to help you succeed.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for help articles, guides, or FAQs..."
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </div>
        </div>

        {/* Support Channels */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Get Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => {
              const getColorClasses = (color: string) => {
                switch (color) {
                  case 'blue':
                    return {
                      bg: 'bg-blue-100',
                      text: 'text-blue-600',
                      button: 'bg-blue-600 hover:bg-blue-700'
                    }
                  case 'green':
                    return {
                      bg: 'bg-green-100',
                      text: 'text-green-600',
                      button: 'bg-green-600 hover:bg-green-700'
                    }
                  case 'purple':
                    return {
                      bg: 'bg-purple-100',
                      text: 'text-purple-600',
                      button: 'bg-purple-600 hover:bg-purple-700'
                    }
                  case 'orange':
                    return {
                      bg: 'bg-orange-100',
                      text: 'text-orange-600',
                      button: 'bg-orange-600 hover:bg-orange-700'
                    }
                  default:
                    return {
                      bg: 'bg-gray-100',
                      text: 'text-gray-600',
                      button: 'bg-gray-600 hover:bg-gray-700'
                    }
                }
              }
              const colors = getColorClasses(channel.color)
              
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <channel.icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{channel.title}</h3>
                  <p className="text-gray-600 mb-3">{channel.description}</p>
                  <p className="text-sm text-gray-500 mb-4">{channel.availability}</p>
                  <button className={`w-full ${colors.button} text-white py-2 px-4 rounded-lg font-medium transition-colors`}>
                    {channel.action}
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        {/* Quick Links */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Quick Links</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Book className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Getting Started Guide</h3>
              <p className="text-gray-600 mb-4">Complete setup guide for new users to get up and running quickly.</p>
              <Link to="/documentation" className="text-blue-600 hover:text-blue-700 font-medium">
                Read Guide →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Integration Setup</h3>
              <p className="text-gray-600 mb-4">Step-by-step instructions for connecting AWS, GitHub, Slack, and more.</p>
              <Link to="/documentation" className="text-blue-600 hover:text-blue-700 font-medium">
                View Instructions →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Video Tutorials</h3>
              <p className="text-gray-600 mb-4">Watch our video tutorials to learn SaasDor features and best practices.</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Watch Videos →
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer">
                    <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>
                    <HelpCircle className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </section>

        {/* Status and Updates */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">System Status</h2>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-600 font-medium">All Systems Operational</span>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="font-medium">API Services</span>
                </div>
                <p className="text-sm text-gray-600">99.9% uptime</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="font-medium">Data Sync</span>
                </div>
                <p className="text-sm text-gray-600">Real-time updates</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="font-medium">Dashboard</span>
                </div>
                <p className="text-sm text-gray-600">Fully operational</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Our support team is standing by to assist you with any questions or issues
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                Contact Support
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200">
                Schedule Demo
              </button>
            </div>
            <div className="mt-8 text-blue-100">
              <p>Email: support@saasdor.com | Phone: 1-800-SAASDOR</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SupportPage
