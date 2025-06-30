import React, { useState, useEffect } from 'react';
import { X, Search, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../../../shared/utils/api';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: () => void;
  accountId: string;
}

interface Policy {
  arn: string;
  name: string;
  description?: string;
  isAWSManaged: boolean;
}

export default function CreateGroupModal({ isOpen, onClose, onGroupCreated, accountId }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [path, setPath] = useState('/');
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [availablePolicies, setAvailablePolicies] = useState<Policy[]>([]);
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPolicyDropdown, setShowPolicyDropdown] = useState(false);
  const [loadingPolicies, setLoadingPolicies] = useState(false);

  useEffect(() => {
    if (isOpen && accountId) {
      fetchAvailablePolicies();
    }
  }, [isOpen, accountId]);

  useEffect(() => {
    // Filter policies based on search term
    if (searchTerm) {
      const filtered = availablePolicies.filter(policy => 
        policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPolicies(filtered);
    } else {
      setFilteredPolicies(availablePolicies);
    }
  }, [searchTerm, availablePolicies]);

  const fetchAvailablePolicies = async () => {
    setLoadingPolicies(true);
    try {
      const response = await api.get(`/integrations/aws/iam/policies?accountId=${accountId}`);
      if (response.data.success) {
        setAvailablePolicies(response.data.data);
        setFilteredPolicies(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
    } finally {
      setLoadingPolicies(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/integrations/aws/iam/groups', {
        groupName,
        path,
        policies: selectedPolicies,
        accountId
      });

      if (response.data.success) {
        onGroupCreated();
        handleClose();
      } else {
        setError(response.data.message || 'Failed to create group');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setGroupName('');
    setPath('/');
    setSelectedPolicies([]);
    setSearchTerm('');
    setError('');
    setShowPolicyDropdown(false);
    onClose();
  };

  const togglePolicy = (policyArn: string) => {
    setSelectedPolicies(prev => {
      if (prev.includes(policyArn)) {
        return prev.filter(p => p !== policyArn);
      } else {
        return [...prev, policyArn];
      }
    });
  };

  const getSelectedPolicyNames = () => {
    return selectedPolicies.map(arn => {
      const policy = availablePolicies.find(p => p.arn === arn);
      return policy?.name || arn;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Create IAM Group</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
                  Group Name *
                </label>
                <input
                  type="text"
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="path" className="block text-sm font-medium text-gray-700">
                  Path
                </label>
                <input
                  type="text"
                  id="path"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="/"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Optional: Organize groups hierarchically (e.g., /developers/, /admins/)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Policies
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPolicyDropdown(!showPolicyDropdown)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        {selectedPolicies.length === 0 
                          ? 'Select policies...' 
                          : `${selectedPolicies.length} policies selected`}
                      </span>
                      {showPolicyDropdown ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {showPolicyDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
                      <div className="p-2 border-b">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search policies..."
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div className="max-h-48 overflow-y-auto">
                        {loadingPolicies ? (
                          <div className="p-4 text-center text-sm text-gray-500">
                            Loading policies...
                          </div>
                        ) : filteredPolicies.length === 0 ? (
                          <div className="p-4 text-center text-sm text-gray-500">
                            No policies found
                          </div>
                        ) : (
                          filteredPolicies.map((policy) => (
                            <label
                              key={policy.arn}
                              className="flex items-start p-2 hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedPolicies.includes(policy.arn)}
                                onChange={() => togglePolicy(policy.arn)}
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <div className="ml-2 flex-1">
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-gray-900">
                                    {policy.name}
                                  </span>
                                  {policy.isAWSManaged && (
                                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                                      AWS Managed
                                    </span>
                                  )}
                                </div>
                                {policy.description && (
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {policy.description}
                                  </p>
                                )}
                              </div>
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {selectedPolicies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getSelectedPolicyNames().map((name, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 pt-0 flex justify-end space-x-3 border-t flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !groupName}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
