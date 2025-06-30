import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Shield, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Cloud, 
  Zap,
  CheckCircle,
  AlertTriangle,
  Plus,
  ArrowRight,
  Building2,
  Globe,
  Lock,
  UserCheck
} from 'lucide-react';
import { api } from '../../shared/utils';
import { Layout } from '../../shared/components';

interface DashboardStats {
  connectedServices: number;
  totalUsers: number;
  activeIntegrations: number;
  monthlyCost: number;
  costSavings: number;
  securityScore: number;
}

interface ConnectedService {
  id: string;
  name: string;
  type: 'aws' | 'azure' | 'office365' | 'github';
  status: 'connected' | 'warning' | 'error';
  users: number;
  lastSync: string;
  accounts?: number;
}

interface RecentActivity {
  id: string;
  type: 'user_added' | 'service_connected' | 'cost_alert' | 'security_update';
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'success';
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    connectedServices: 0,
    totalUsers: 0,
    activeIntegrations: 0,
    monthlyCost: 0,
    costSavings: 0,
    securityScore: 0
  });
  const [connectedServices, setConnectedServices] = useState<ConnectedService[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      // Get user data from token
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          let companyData = null;
          if (payload.companyId && typeof payload.companyId === 'string') {
            try {
              companyData = JSON.parse(payload.companyId);
            } catch (e) {
              const nameMatch = payload.companyId.match(/name:\s*'([^']+)'/);
              if (nameMatch) {
                companyData = { name: nameMatch[1] };
              }
            }
          }
          
          setUser({ 
            name: `${payload.firstName || 'User'} ${payload.lastName || ''}`.trim() || payload.email,
            company: companyData?.name || 'Your Company'
          });
        } catch (e) {
          setUser({ name: 'User', company: 'Your Company' });
        }
      }

      // Fetch real dashboard overview data
      try {
        const overviewResponse = await api.get('/dashboard/overview');
        if (overviewResponse.data.success) {
          const data = overviewResponse.data.data;
          setStats({
            connectedServices: data.connectedServices || 0,
            totalUsers: data.totalUsers || 0,
            activeIntegrations: data.totalAccounts || 0,
            monthlyCost: data.monthlyCost || 0,
            costSavings: 0, // TODO: Calculate from cost optimization data
            securityScore: data.securityScore || 0
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard overview:', error);
        // Set empty stats on error
        setStats({
          connectedServices: 0,
          totalUsers: 0,
          activeIntegrations: 0,
          monthlyCost: 0,
          costSavings: 0,
          securityScore: 0
        });
      }

      // Fetch real connected services data
      try {
        const servicesResponse = await api.get('/dashboard/connected-services');
        if (servicesResponse.data.success) {
          const services = servicesResponse.data.data;
          setConnectedServices(services.map((service: any) => ({
            id: service.id,
            name: service.name,
            type: service.type,
            status: service.status,
            users: service.users || 0,
            lastSync: service.lastSync ? new Date(service.lastSync).toLocaleString() : 'Never',
            accounts: service.accounts
          })));
        }
      } catch (error) {
        console.error('Error fetching connected services:', error);
        setConnectedServices([]);
      }

      // Fetch real recent activity data
      try {
        const activityResponse = await api.get('/dashboard/recent-activity');
        if (activityResponse.data.success) {
          const activities = activityResponse.data.data;
          setRecentActivity(activities.map((activity: any) => ({
            id: activity.id,
            type: activity.type,
            message: activity.message,
            timestamp: new Date(activity.timestamp).toLocaleString(),
            severity: activity.severity
          })));
        }
      } catch (error) {
        console.error('Error fetching recent activity:', error);
        setRecentActivity([]);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'aws': return '☁️';
      case 'azure': return '🔷';
      case 'office365': return '📧';
      case 'github': return '🐙';
      default: return '🔧';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_added': return <UserCheck className="h-4 w-4" />;
      case 'service_connected': return <CheckCircle className="h-4 w-4" />;
      case 'cost_alert': return <DollarSign className="h-4 w-4" />;
      case 'security_update': return <Shield className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                Welcome to {user?.company} SaaS Management Platform
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Centralize, secure, and optimize all your cloud services and applications from one powerful dashboard
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate('/apps')}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Connect New Service
                </button>
                <button
                  onClick={() => navigate('/users')}
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Manage Users
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Features Overview */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Platform Does</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Streamline your organization's SaaS management with comprehensive tools for security, compliance, and cost optimization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Cloud className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Cloud Management</h3>
              <p className="text-gray-600">Manage AWS, Azure, Google Cloud, and more from one interface</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User Lifecycle Management</h3>
              <p className="text-gray-600">Automate user provisioning, deprovisioning, and access control</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Security & Compliance</h3>
              <p className="text-gray-600">Monitor security posture and ensure compliance across all services</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cost Optimization</h3>
              <p className="text-gray-600">Track spending, identify savings opportunities, and optimize costs</p>
            </div>
          </div>

          {/* Key Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Connected Services</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.connectedServices}</p>
                </div>
                <Cloud className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-xs text-green-600 mt-2">+2 this month</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-green-600 mt-2">+12 this week</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Integrations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeIntegrations}</p>
                </div>
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-xs text-blue-600 mt-2">All systems operational</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.monthlyCost.toFixed(0)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <p className="text-xs text-red-600 mt-2">+15% from last month</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cost Savings</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.costSavings}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-green-600 mt-2">Saved this quarter</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Security Score</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.securityScore}%</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-xs text-green-600 mt-2">Excellent rating</p>
            </div>
          </div>

          {/* Connected Services and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Connected Services */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Connected Services</h3>
                  <button
                    onClick={() => navigate('/apps')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {connectedServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">{getServiceIcon(service.type)}</div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-900">{service.name}</h4>
                            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(service.status)}`}>
                              {service.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {service.users} users • Last sync: {service.lastSync}
                            {service.accounts && ` • ${service.accounts} accounts`}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate(`/apps/${service.type}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Manage
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className={`flex-shrink-0 ${getActivityColor(activity.severity)} mt-1`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All Activity
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-12 bg-white rounded-lg shadow p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => navigate('/apps')}
                className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
              >
                <div className="text-center">
                  <Plus className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Add New Integration</p>
                  <p className="text-xs text-gray-500">Connect AWS, Azure, Office 365, and more</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/users')}
                className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
              >
                <div className="text-center">
                  <Users className="h-8 w-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Invite Users</p>
                  <p className="text-xs text-gray-500">Add team members and assign roles</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/settings')}
                className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group"
              >
                <div className="text-center">
                  <BarChart3 className="h-8 w-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Generate Report</p>
                  <p className="text-xs text-gray-500">Security, compliance, and cost reports</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
