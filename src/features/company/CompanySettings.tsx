import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Settings, 
  CreditCard, 
  Users, 
  Shield, 
  Bell, 
  Save,
  Upload,
  Eye,
  EyeOff,
  Crown,
  Zap,
  Star
} from 'lucide-react';
import { api } from '../../shared/utils';
import { Layout } from '../../shared/components';

interface Company {
  _id: string;
  name: string;
  domain: string;
  logo?: string;
  industry: string;
  size: string;
  subscription: {
    plan: string;
    status: string;
    startDate: string;
    endDate: string;
    maxUsers: number;
    maxApps: number;
  };
  settings: {
    allowSelfRegistration: boolean;
    requireEmailVerification: boolean;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
    ssoEnabled: boolean;
    mfaRequired: boolean;
  };
  billing: {
    email: string;
    address: string;
    paymentMethod?: string;
  };
  daysRemaining: number;
  planLimits: {
    maxUsers: number;
    maxApps: number;
  };
}

const CompanySettings: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showPasswordPolicy, setShowPasswordPolicy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchCompanyDetails();
  }, [navigate]);

  const fetchCompanyDetails = async () => {
    try {
      console.log('🏢 CompanySettings: Fetching company details...');
      const response = await api.get('/company');
      console.log('🏢 CompanySettings: API response:', response.data);
      
      if (response.data.success) {
        console.log('✅ CompanySettings: Setting company data:', response.data.data);
        setCompany(response.data.data);
      } else {
        console.log('❌ CompanySettings: API returned success=false');
        // Fallback to mock data if API fails
        setCompany({
          _id: 'mock-id',
          name: 'Acme Corporation',
          domain: 'acme.com',
          industry: 'Technology',
          size: '50-100 employees',
          subscription: {
            plan: 'professional',
            status: 'active',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            maxUsers: 100,
            maxApps: 50
          },
          settings: {
            allowSelfRegistration: true,
            requireEmailVerification: true,
            passwordPolicy: {
              minLength: 8,
              requireUppercase: true,
              requireLowercase: true,
              requireNumbers: true,
              requireSpecialChars: false
            },
            ssoEnabled: false,
            mfaRequired: false
          },
          billing: {
            email: 'billing@acme.com',
            address: '123 Business St, City, State 12345'
          },
          daysRemaining: 365,
          planLimits: {
            maxUsers: 100,
            maxApps: 50
          }
        });
      }
    } catch (error) {
      console.error('❌ CompanySettings: Error fetching company details:', error);
      // Fallback to mock data on error
      setCompany({
        _id: 'mock-id',
        name: 'Acme Corporation',
        domain: 'acme.com',
        industry: 'Technology',
        size: '50-100 employees',
        subscription: {
          plan: 'professional',
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          maxUsers: 100,
          maxApps: 50
        },
        settings: {
          allowSelfRegistration: true,
          requireEmailVerification: true,
          passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: false
          },
          ssoEnabled: false,
          mfaRequired: false
        },
        billing: {
          email: 'billing@acme.com',
          address: '123 Business St, City, State 12345'
        },
        daysRemaining: 365,
        planLimits: {
          maxUsers: 100,
          maxApps: 50
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section: string, data: any) => {
    setSaving(true);
    try {
      const response = await api.put(`/company/${section}`, data);
      if (response.data.success) {
        setCompany(response.data.data);
        alert('Settings saved successfully!');
      }
    } catch (error: any) {
      console.error('Error saving settings:', error);
      alert(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const getSubscriptionBadge = (plan: string) => {
    const badges = {
      starter: { icon: Zap, color: 'bg-blue-100 text-blue-800', label: 'Starter' },
      professional: { icon: Star, color: 'bg-purple-100 text-purple-800', label: 'Professional' },
      enterprise: { icon: Crown, color: 'bg-yellow-100 text-yellow-800', label: 'Enterprise' }
    };
    
    const badge = badges[plan as keyof typeof badges] || badges.starter;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        <Icon className="h-4 w-4 mr-1" />
        {badge.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      trial: 'bg-yellow-100 text-yellow-800',
      expired: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || colors.trial}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!company) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Company not found</h2>
            <p className="text-gray-600">Unable to load company settings.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
                  <p className="text-sm text-gray-600">{company.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {getSubscriptionBadge(company.subscription.plan)}
                {getStatusBadge(company.subscription.status)}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:w-64">
              <nav className="bg-white rounded-lg shadow p-4">
                <ul className="space-y-2">
                  {[
                    { id: 'general', label: 'General', icon: Building2 },
                    { id: 'subscription', label: 'Subscription', icon: CreditCard },
                    { id: 'security', label: 'Security', icon: Shield },
                    { id: 'users', label: 'User Settings', icon: Users },
                    { id: 'notifications', label: 'Notifications', icon: Bell }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                            activeTab === tab.id
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-3" />
                          {tab.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow">
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">General Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={company.name}
                          onChange={(e) => setCompany({...company, name: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Domain
                        </label>
                        <input
                          type="text"
                          value={company.domain}
                          onChange={(e) => setCompany({...company, domain: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Industry
                        </label>
                        <select
                          value={company.industry}
                          onChange={(e) => setCompany({...company, industry: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="technology">Technology</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="finance">Finance</option>
                          <option value="education">Education</option>
                          <option value="manufacturing">Manufacturing</option>
                          <option value="retail">Retail</option>
                          <option value="consulting">Consulting</option>
                          <option value="media">Media</option>
                          <option value="real estate">Real Estate</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Size
                        </label>
                        <select
                          value={company.size}
                          onChange={(e) => setCompany({...company, size: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-500">201-500 employees</option>
                          <option value="501-1000">501-1000 employees</option>
                          <option value="1000+">1000+ employees</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={() => handleSave('general', {
                          name: company.name,
                          domain: company.domain,
                          industry: company.industry,
                          size: company.size
                        })}
                        disabled={saving}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Subscription Settings */}
                {activeTab === 'subscription' && (
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Subscription & Billing</h3>
                    
                    {/* Current Plan */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">Current Plan</h4>
                          <div className="mt-2 flex items-center space-x-4">
                            {getSubscriptionBadge(company.subscription.plan)}
                            {getStatusBadge(company.subscription.status)}
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Max Users:</span>
                              <span className="ml-2 font-medium">{company.subscription.maxUsers === -1 ? 'Unlimited' : company.subscription.maxUsers}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Max Apps:</span>
                              <span className="ml-2 font-medium">{company.subscription.maxApps === -1 ? 'Unlimited' : company.subscription.maxApps}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Days Remaining:</span>
                              <span className="ml-2 font-medium">{company.daysRemaining} days</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Renewal Date:</span>
                              <span className="ml-2 font-medium">{new Date(company.subscription.endDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                          Upgrade Plan
                        </button>
                      </div>
                    </div>

                    {/* Billing Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Billing Email
                        </label>
                        <input
                          type="email"
                          value={company.billing.email}
                          onChange={(e) => setCompany({
                            ...company,
                            billing: { ...company.billing, email: e.target.value }
                          })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Method
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={company.billing.paymentMethod || 'No payment method'}
                            readOnly
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                          />
                          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                            Update
                          </button>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Billing Address
                        </label>
                        <textarea
                          value={company.billing.address}
                          onChange={(e) => setCompany({
                            ...company,
                            billing: { ...company.billing, address: e.target.value }
                          })}
                          rows={3}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={() => handleSave('billing', company.billing)}
                        disabled={saving}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Billing Info'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h3>
                    
                    <div className="space-y-6">
                      {/* SSO Settings */}
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Single Sign-On (SSO)</h4>
                          <p className="text-sm text-gray-500">Enable SSO for your organization</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={company.settings.ssoEnabled}
                            onChange={(e) => setCompany({
                              ...company,
                              settings: { ...company.settings, ssoEnabled: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      {/* MFA Settings */}
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Multi-Factor Authentication</h4>
                          <p className="text-sm text-gray-500">Require MFA for all users</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={company.settings.mfaRequired}
                            onChange={(e) => setCompany({
                              ...company,
                              settings: { ...company.settings, mfaRequired: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      {/* Password Policy */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Password Policy</h4>
                            <p className="text-sm text-gray-500">Configure password requirements</p>
                          </div>
                          <button
                            onClick={() => setShowPasswordPolicy(!showPasswordPolicy)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            {showPasswordPolicy ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>

                        {showPasswordPolicy && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Minimum Length
                              </label>
                              <input
                                type="number"
                                min="6"
                                max="32"
                                value={company.settings.passwordPolicy.minLength}
                                onChange={(e) => setCompany({
                                  ...company,
                                  settings: {
                                    ...company.settings,
                                    passwordPolicy: {
                                      ...company.settings.passwordPolicy,
                                      minLength: parseInt(e.target.value)
                                    }
                                  }
                                })}
                                className="w-24 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              {[
                                { key: 'requireUppercase', label: 'Require Uppercase' },
                                { key: 'requireLowercase', label: 'Require Lowercase' },
                                { key: 'requireNumbers', label: 'Require Numbers' },
                                { key: 'requireSpecialChars', label: 'Require Special Characters' }
                              ].map((policy) => (
                                <label key={policy.key} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={company.settings.passwordPolicy[policy.key as keyof typeof company.settings.passwordPolicy] as boolean}
                                    onChange={(e) => setCompany({
                                      ...company,
                                      settings: {
                                        ...company.settings,
                                        passwordPolicy: {
                                          ...company.settings.passwordPolicy,
                                          [policy.key]: e.target.checked
                                        }
                                      }
                                    })}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">{policy.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={() => handleSave('security', company.settings)}
                        disabled={saving}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Security Settings'}
                      </button>
                    </div>
                  </div>
                )}

                {/* User Settings */}
                {activeTab === 'users' && (
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">User Management Settings</h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Allow Self Registration</h4>
                          <p className="text-sm text-gray-500">Let users register themselves with company domain</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={company.settings.allowSelfRegistration}
                            onChange={(e) => setCompany({
                              ...company,
                              settings: { ...company.settings, allowSelfRegistration: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Require Email Verification</h4>
                          <p className="text-sm text-gray-500">Users must verify their email before accessing the platform</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={company.settings.requireEmailVerification}
                            onChange={(e) => setCompany({
                              ...company,
                              settings: { ...company.settings, requireEmailVerification: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={() => handleSave('user-settings', {
                          allowSelfRegistration: company.settings.allowSelfRegistration,
                          requireEmailVerification: company.settings.requireEmailVerification
                        })}
                        disabled={saving}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Saving...' : 'Save User Settings'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                {activeTab === 'notifications' && (
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Settings</h3>
                    
                    <div className="space-y-4">
                      {[
                        { id: 'user_added', label: 'New User Added', description: 'Notify when a new user joins the company' },
                        { id: 'app_connected', label: 'App Connected', description: 'Notify when a new app is connected' },
                        { id: 'subscription_expiry', label: 'Subscription Expiry', description: 'Notify before subscription expires' },
                        { id: 'security_alerts', label: 'Security Alerts', description: 'Notify about security-related events' },
                        { id: 'usage_reports', label: 'Usage Reports', description: 'Weekly usage and analytics reports' }
                      ].map((notification) => (
                        <div key={notification.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{notification.label}</h4>
                            <p className="text-sm text-gray-500">{notification.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked={true}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        disabled={saving}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Notification Settings'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default
CompanySettings;
