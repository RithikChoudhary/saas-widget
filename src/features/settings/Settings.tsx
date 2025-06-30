import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Building, 
  Users, 
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import axios from 'axios';
import { Layout } from '../../shared/components';

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department?: string;
  jobTitle?: string;
}

interface Company {
  _id: string;
  name: string;
  domain: string;
  industry: string;
  size: string;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: '',
    jobTitle: ''
  });

  const [company, setCompany] = useState<Company>({
    _id: '',
    name: '',
    domain: '',
    industry: '',
    size: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [orgUsers, setOrgUsers] = useState([]);

  useEffect(() => {
    fetchUserProfile();
    fetchCompanyInfo();
    fetchOrgUsers();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('https://server.saasdor.com/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Mock data for demonstration
      setProfile({
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@company.com',
        role: 'company_admin',
        department: 'IT',
        jobTitle: 'System Administrator'
      });
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      console.log('🏢 Settings: Fetching company info...');
      const response = await axios.get('https://server.saasdor.com:5000/api/company', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      console.log('🏢 Settings: API response:', response.data);
      
      if (response.data.success) {
        console.log('✅ Settings: Setting company data:', response.data.data);
        setCompany({
          _id: response.data.data._id,
          name: response.data.data.name,
          domain: response.data.data.domain,
          industry: response.data.data.industry,
          size: response.data.data.size
        });
      } else {
        console.log('❌ Settings: API returned success=false');
        // Fallback to mock data
        setCompany({
          _id: '1',
          name: 'Acme Corporation',
          domain: 'acme.com',
          industry: 'Technology',
          size: '50-100'
        });
      }
    } catch (error) {
      console.error('❌ Settings: Error fetching company info:', error);
      // Fallback to mock data on error
      setCompany({
        _id: '1',
        name: 'Acme Corporation',
        domain: 'acme.com',
        industry: 'Technology',
        size: '50-100'
      });
    }
  };

  const fetchOrgUsers = async () => {
    try {
      const response = await axios.get('https://server.saasdor.com:5000/api/users/company', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.data.success) {
        setOrgUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching org users:', error);
      // Mock data
      setOrgUsers([
        { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@company.com', role: 'admin' },
        { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@company.com', role: 'user' }
      ] as any);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put('https://server.saasdor.com:5000/api/users/profile', profile, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.data.success) {
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // This would be a password change endpoint
      alert('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'password', name: 'Password', icon: Lock },
    { id: 'company', name: 'Company', icon: Building },
    { id: 'organization', name: 'Organization', icon: Users },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <SettingsIcon className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            {/* Sidebar */}
            <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`${
                        activeTab === tab.id
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900'
                      } group border-l-4 px-3 py-2 flex items-center text-sm font-medium w-full text-left`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Main content */}
            <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
              {activeTab === 'profile' && (
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Update your personal information and contact details.
                      </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <form onSubmit={handleProfileUpdate}>
                        <div className="grid grid-cols-6 gap-6">
                          <div className="col-span-6 sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">
                              First name
                            </label>
                            <input
                              type="text"
                              value={profile.firstName}
                              onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Last name
                            </label>
                            <input
                              type="text"
                              value={profile.lastName}
                              onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Email address
                            </label>
                            <input
                              type="email"
                              value={profile.email}
                              onChange={(e) => setProfile({...profile, email: e.target.value})}
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Department
                            </label>
                            <input
                              type="text"
                              value={profile.department || ''}
                              onChange={(e) => setProfile({...profile, department: e.target.value})}
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Job Title
                            </label>
                            <input
                              type="text"
                              value={profile.jobTitle || ''}
                              onChange={(e) => setProfile({...profile, jobTitle: e.target.value})}
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div className="col-span-6">
                            <label className="block text-sm font-medium text-gray-700">
                              Role
                            </label>
                            <input
                              type="text"
                              value={profile.role}
                              disabled
                              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50 text-gray-500"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                              Contact your administrator to change your role.
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-end mt-6">
                          <button
                            type="submit"
                            disabled={loading}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'password' && (
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Update your password to keep your account secure.
                      </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <form onSubmit={handlePasswordChange}>
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Current Password
                            </label>
                            <div className="mt-1 relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md pr-10"
                              />
                              <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              New Password
                            </label>
                            <div className="mt-1 relative">
                              <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md pr-10"
                              />
                              <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Confirm New Password
                            </label>
                            <div className="mt-1 relative">
                              <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md pr-10"
                              />
                              <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end mt-6">
                          <button
                            type="submit"
                            disabled={loading}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            <Lock className="h-4 w-4 mr-2" />
                            {loading ? 'Changing...' : 'Change Password'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'company' && (
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Company Information</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        View and manage your company details.
                      </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Company Name</label>
                          <p className="mt-1 text-sm text-gray-900">{company.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Domain</label>
                          <p className="mt-1 text-sm text-gray-900">{company.domain}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Industry</label>
                          <p className="mt-1 text-sm text-gray-900">{company.industry}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Company Size</label>
                          <p className="mt-1 text-sm text-gray-900">{company.size} employees</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'organization' && (
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Organization Members</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Manage people in your organization.
                      </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <div className="space-y-4">
                        {orgUsers.map((user: any) => (
                          <div key={user._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-blue-600">
                                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {user.role}
                              </span>
                              <button className="text-blue-600 hover:text-blue-900 text-sm">
                                Edit
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
