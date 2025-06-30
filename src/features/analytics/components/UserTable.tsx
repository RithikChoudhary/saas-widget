import React from 'react';
import { ExternalLink, Mail, Shield, AlertTriangle } from 'lucide-react';
import RiskIndicator from './RiskIndicator';

interface User {
  _id: string;
  email: string;
  platforms: {
    googleWorkspace?: { name: string; isAdmin: boolean; status: string };
    github?: { login: string; isAdmin: boolean; status: string };
    slack?: { name: string; isAdmin: boolean; status: string };
    zoom?: { email: string; type: string; status: string };
    aws?: { userName: string; isAdmin: boolean; status: string };
  };
  isGhostUser?: boolean;
  securityRisks?: Array<{
    severity: 'critical' | 'high' | 'medium' | 'low';
    type: string;
  }>;
  estimatedMonthlyCost?: number;
}

interface UserTableProps {
  users: User[];
  loading?: boolean;
  onUserClick?: (user: User) => void;
  showCost?: boolean;
  showRisks?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading = false,
  onUserClick,
  showCost = true,
  showRisks = true
}) => {
  const getPlatformIcon = (platform: string) => {
    const icons = {
      googleWorkspace: '📧',
      github: '🐙',
      slack: '💬',
      zoom: '📹',
      aws: '☁️'
    };
    return icons[platform as keyof typeof icons] || '🔧';
  };

  const getHighestRiskSeverity = (risks: User['securityRisks']) => {
    if (!risks || risks.length === 0) return null;
    const severityOrder = ['critical', 'high', 'medium', 'low'];
    return risks.reduce((highest, risk) => {
      const currentIndex = severityOrder.indexOf(risk.severity);
      const highestIndex = severityOrder.indexOf(highest);
      return currentIndex < highestIndex ? risk.severity : highest;
    }, 'low' as 'critical' | 'high' | 'medium' | 'low');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="divide-y divide-gray-200">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Users ({users.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Platforms
              </th>
              {showRisks && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Security Risk
                </th>
              )}
              {showCost && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Cost
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => {
              const highestRisk = getHighestRiskSeverity(user.securityRisks);
              const platformCount = Object.keys(user.platforms).length;
              
              return (
                <tr
                  key={user._id}
                  className={`hover:bg-gray-50 ${onUserClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onUserClick?.(user)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.email}
                        </div>
                        {user.isGhostUser && (
                          <div className="text-xs text-orange-600 font-medium">
                            👻 Ghost User
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {Object.entries(user.platforms).map(([platform, data]) => (
                        <div
                          key={platform}
                          className="flex items-center space-x-1"
                          title={`${platform}: ${
                            'name' in data ? data.name :
                            'login' in data ? data.login :
                            'userName' in data ? data.userName :
                            'email' in data ? data.email : ''
                          }`}
                        >
                          <span className="text-lg">{getPlatformIcon(platform)}</span>
                          {(('isAdmin' in data && data.isAdmin) || ('type' in data && data.type === 'admin')) && (
                            <Shield className="h-3 w-3 text-blue-600" />
                          )}
                        </div>
                      ))}
                      <span className="text-xs text-gray-500 ml-2">
                        ({platformCount} platforms)
                      </span>
                    </div>
                  </td>
                  {showRisks && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {highestRisk ? (
                        <RiskIndicator
                          severity={highestRisk}
                          showLabel={false}
                          size="sm"
                        />
                      ) : (
                        <span className="text-xs text-green-600">No risks</span>
                      )}
                    </td>
                  )}
                  {showCost && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.estimatedMonthlyCost !== undefined
                        ? `$${user.estimatedMonthlyCost.toFixed(2)}`
                        : '-'
                      }
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {user.isGhostUser ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Inactive
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                      {onUserClick && (
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="text-gray-500">No users found</div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
