import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Cloud, 
  ArrowLeft, 
  FileText, 
  Calendar, 
  User, 
  Clock,
  ArrowRight,
  TrendingUp,
  Shield,
  DollarSign,
  Users
} from 'lucide-react'

const BlogPage: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Hidden Costs of SaaS Sprawl: How to Identify and Eliminate Waste",
      excerpt: "Organizations waste an average of 30% of their SaaS budget on unused licenses and ghost users. Learn how to identify and eliminate this waste.",
      author: "Sarah Chen",
      date: "December 15, 2024",
      readTime: "8 min read",
      category: "Cost Optimization",
      image: "💰",
      featured: true
    },
    {
      id: 2,
      title: "Security Best Practices for Multi-Platform SaaS Management",
      excerpt: "Essential security practices for managing user access across AWS, GitHub, Slack, and Google Workspace in enterprise environments.",
      author: "Michael Rodriguez",
      date: "December 10, 2024",
      readTime: "12 min read",
      category: "Security",
      image: "🔒"
    },
    {
      id: 3,
      title: "Ghost Users: The Silent Threat to Your SaaS Security and Budget",
      excerpt: "Inactive user accounts pose both security risks and financial waste. Here's how to detect and manage ghost users effectively.",
      author: "Emily Johnson",
      date: "December 5, 2024",
      readTime: "6 min read",
      category: "User Management",
      image: "👻"
    },
    {
      id: 4,
      title: "SOC 2 Compliance Made Simple: Automated Audit Trails for SaaS",
      excerpt: "Streamline your SOC 2 compliance process with automated audit trails and continuous monitoring across all your SaaS platforms.",
      author: "David Park",
      date: "November 28, 2024",
      readTime: "10 min read",
      category: "Compliance",
      image: "📋"
    },
    {
      id: 5,
      title: "AWS IAM Best Practices: Managing Users Across Multiple Accounts",
      excerpt: "Learn how to implement least privilege access and manage IAM users effectively across multiple AWS accounts in your organization.",
      author: "Alex Thompson",
      date: "November 20, 2024",
      readTime: "15 min read",
      category: "AWS",
      image: "☁️"
    },
    {
      id: 6,
      title: "The Complete Guide to GitHub Organization Security",
      excerpt: "Secure your GitHub organization with proper access controls, team management, and security monitoring best practices.",
      author: "Lisa Wang",
      date: "November 15, 2024",
      readTime: "9 min read",
      category: "GitHub",
      image: "🔧"
    }
  ]

  const categories = ["All", "Cost Optimization", "Security", "User Management", "Compliance", "AWS", "GitHub"]

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
            <FileText className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SaasDor Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, best practices, and expert advice on SaaS management, security, and cost optimization
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === "All" 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center mb-4">
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium mr-3">
                Featured
              </span>
              <span className="text-blue-100">{blogPosts[0].category}</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">{blogPosts[0].title}</h2>
            <p className="text-xl text-blue-100 mb-6">{blogPosts[0].excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-blue-100">
                <User className="w-4 h-4 mr-2" />
                <span className="mr-4">{blogPosts[0].author}</span>
                <Calendar className="w-4 h-4 mr-2" />
                <span className="mr-4">{blogPosts[0].date}</span>
                <Clock className="w-4 h-4 mr-2" />
                <span>{blogPosts[0].readTime}</span>
              </div>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center">
                Read More
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogPosts.slice(1).map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{post.image}</span>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <User className="w-4 h-4 mr-1" />
                  <span className="mr-3">{post.author}</span>
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="mr-3">{post.date}</span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{post.readTime}</span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Stay Updated with SaaS Management Insights
            </h2>
            <p className="text-gray-600 mb-6">
              Get the latest articles, best practices, and industry insights delivered to your inbox weekly
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Popular Topics */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Cost Optimization</h3>
            <p className="text-sm text-gray-600">Learn how to reduce SaaS spending and eliminate waste</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Security Best Practices</h3>
            <p className="text-sm text-gray-600">Secure your SaaS environment with proven strategies</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">User Management</h3>
            <p className="text-sm text-gray-600">Centralize and streamline user access control</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Industry Trends</h3>
            <p className="text-sm text-gray-600">Stay ahead with the latest SaaS management trends</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPage
