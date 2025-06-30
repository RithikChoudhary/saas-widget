import React, { useState, useEffect } from 'react';
import { X, User, Mail, Users, AlertCircle } from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateUser: (userData: {
    userName: string;
    email?: string;
    groups?: string[];
    accountId: string;
  }) => Promise<void>;
  availableGroups: Array<{ id: string; groupName: string }>;
  availableAccounts: Array<{ accountId: string; accountName: string }>;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onCreateUser,
  availableGroups,
  availableAccounts
}) => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    accountId: '',
    selectedGroups: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        userName: '',
        email: '',
        accountId: availableAccounts[0]?.accountId || '',
        selectedGroups: []
      });
      setError('');
    }
  }, [isOpen, availableAccounts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form
      if (!formData.userName.trim()) {
        throw new Error('User name is required');
      }

      if (!formData.accountId) {
        throw new Error('Please select an AWS account');
      }

      // Validate username format (AWS IAM requirements)
      const usernameRegex = /^[a-zA-Z0-9+=,.@_-]+$/;
      if (!usernameRegex.test(formData.userName)) {
        throw new Error('Username can only contain alphanumeric characters and +=,.@_-');
      }

      if (formData.userName.length > 64) {
        throw new Error('Username cannot exceed 64 characters');
      }

      // Validate email if provided
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      await onCreateUser({
        userName: formData.userName.trim(),
        email: formData.email.trim() || undefined,
        groups: formData.selectedGroups,
        accountId: formData.accountId
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleGroupToggle = (groupName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedGroups: prev.selectedGroups.includes(groupName)
        ? prev.selectedGroups.filter(g => g !== groupName)
        : [...prev.selectedGroups, groupName]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Create AWS IAM User</h3>
              <p className="text-sm text-gray-500">Add a new user to your AWS account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* AWS Account Selection */}
          <div>
            <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 mb-2">
              AWS Account *
            </label>
            <select
              id="accountId"
              value={formData.accountId}
              onChange={(e) => setFormData(prev => ({ ...prev, accountId: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select an account</option>
              {availableAccounts.map((account) => (
                <option key={account.accountId} value={account.accountId}>
                  {account.accountName} ({account.accountId})
                </option>
              ))}
            </select>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
              Username *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="userName"
                value={formData.userName}
                onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter username"
                required
                maxLength={64}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Username can contain letters, numbers, and +=,.@_- characters (max 64 chars)
            </p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email (Optional)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="user@company.com"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Email will be added as a tag to the IAM user
            </p>
          </div>

          {/* Groups */}
          {availableGroups.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Groups (Optional)
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-3">
                {availableGroups.map((group) => (
                  <label key={group.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.selectedGroups.includes(group.groupName)}
                      onChange={() => handleGroupToggle(group.groupName)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{group.groupName}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Select groups to add the user to
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.userName.trim() || !formData.accountId}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
