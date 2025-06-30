import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';

interface AppConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName: string;
  appId: string;
  onConnectionSuccess: () => void;
}

interface CredentialField {
  name: string;
  label: string;
  type: 'text' | 'password' | 'textarea' | 'file';
  placeholder: string;
  required: boolean;
  description?: string;
}

const AppConnectionModal: React.FC<AppConnectionModalProps> = ({
  isOpen,
  onClose,
  appName,
  appId,
  onConnectionSuccess
}) => {
  const [step, setStep] = useState<'requirements' | 'credentials' | 'testing' | 'success'>('requirements');
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionResult, setConnectionResult] = useState<any>(null);

  // Define credential requirements for each app
  const getAppConfig = (appName: string) => {
    switch (appName.toLowerCase()) {
      case 'office 365':
      case 'microsoft 365':
        return {
          fields: [
            {
              name: 'tenantId',
              label: 'Tenant ID',
              type: 'text' as const,
              placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
              required: true,
              description: 'Your Azure AD Tenant ID'
            },
            {
              name: 'clientId',
              label: 'Client ID',
              type: 'text' as const,
              placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
              required: true,
              description: 'Application (client) ID from Azure AD'
            },
            {
              name: 'clientSecret',
              label: 'Client Secret',
              type: 'password' as const,
              placeholder: 'your-client-secret',
              required: true,
              description: 'Client secret from Azure AD app registration'
            }
          ],
          permissions: [
            'User.Read.All',
            'Directory.Read.All',
            'Group.Read.All'
          ],
          setupSteps: [
            '1. Go to Azure Portal > Azure Active Directory',
            '2. Navigate to App registrations > New registration',
            '3. Register your application',
            '4. Go to API permissions and add required permissions',
            '5. Create a client secret under Certificates & secrets',
            '6. Copy Tenant ID, Client ID, and Client Secret'
          ]
        };

      case 'github':
        return {
          fields: [
            {
              name: 'personalAccessToken',
              label: 'Personal Access Token',
              type: 'password' as const,
              placeholder: 'ghp_xxxxxxxxxxxxxxxxxxxx',
              required: true,
              description: 'GitHub personal access token'
            },
            {
              name: 'organization',
              label: 'Organization',
              type: 'text' as const,
              placeholder: 'your-org-name',
              required: false,
              description: 'GitHub organization name (optional)'
            }
          ],
          permissions: [
            'read:user',
            'read:org',
            'admin:org (for member management)'
          ],
          setupSteps: [
            '1. Go to GitHub Settings > Developer settings',
            '2. Navigate to Personal access tokens > Tokens (classic)',
            '3. Generate new token (classic)',
            '4. Select required scopes: read:user, read:org',
            '5. Copy the generated token'
          ]
        };

      case 'slack':
        return {
          fields: [
            {
              name: 'botToken',
              label: 'Bot User OAuth Token',
              type: 'password' as const,
              placeholder: 'xoxb-xxxxxxxxxxxx-xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx',
              required: true,
              description: 'Slack Bot User OAuth Token'
            },
            {
              name: 'workspaceId',
              label: 'Workspace ID',
              type: 'text' as const,
              placeholder: 'T1234567890',
              required: false,
              description: 'Slack workspace ID (optional)'
            }
          ],
          permissions: [
            'users:read',
            'users:read.email',
            'team:read'
          ],
          setupSteps: [
            '1. Go to api.slack.com/apps',
            '2. Create New App > From scratch',
            '3. Add OAuth Scopes: users:read, users:read.email, team:read',
            '4. Install App to Workspace',
            '5. Copy Bot User OAuth Token'
          ]
        };

      case 'atlassian - jira':
      case 'jira':
        return {
          fields: [
            {
              name: 'domain',
              label: 'Atlassian Domain',
              type: 'text' as const,
              placeholder: 'your-domain',
              required: true,
              description: 'Your Atlassian domain (without .atlassian.net)'
            },
            {
              name: 'email',
              label: 'Email',
              type: 'text' as const,
              placeholder: 'your-email@company.com',
              required: true,
              description: 'Your Atlassian account email'
            },
            {
              name: 'apiToken',
              label: 'API Token',
              type: 'password' as const,
              placeholder: 'your-api-token',
              required: true,
              description: 'Atlassian API token'
            }
          ],
          permissions: [
            'Read access to JIRA projects',
            'User management permissions'
          ],
          setupSteps: [
            '1. Go to id.atlassian.com/manage-profile/security/api-tokens',
            '2. Create API token',
            '3. Copy your domain name from JIRA URL',
            '4. Use your Atlassian account email'
          ]
        };

      case 'notion':
        return {
          fields: [
            {
              name: 'integrationToken',
              label: 'Integration Token',
              type: 'password' as const,
              placeholder: 'secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
              required: true,
              description: 'Notion integration token'
            }
          ],
          permissions: [
            'Read content',
            'Read user information'
          ],
          setupSteps: [
            '1. Go to www.notion.so/my-integrations',
            '2. Create new integration',
            '3. Copy the Internal Integration Token',
            '4. Share your workspace with the integration'
          ]
        };

      case 'amazon web services (aws)':
      case 'aws':
      case 'amazon web services':
        return {
          fields: [
            {
              name: 'accessKeyId',
              label: 'Access Key ID',
              type: 'text' as const,
              placeholder: 'AKIAIOSFODNN7EXAMPLE',
              required: true,
              description: 'Your AWS access key ID'
            },
            {
              name: 'secretAccessKey',
              label: 'Secret Access Key',
              type: 'password' as const,
              placeholder: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
              required: true,
              description: 'Your AWS secret access key'
            },
            {
              name: 'region',
              label: 'Region',
              type: 'text' as const,
              placeholder: 'us-east-1',
              required: false,
              description: 'AWS region (optional, defaults to us-east-1)'
            }
          ],
          permissions: [
            'iam:ListUsers',
            'iam:GetUser',
            'iam:CreateUser',
            'iam:UpdateUser',
            'iam:DeleteUser'
          ],
          setupSteps: [
            '1. Go to AWS IAM Console',
            '2. Create a new IAM user for integration',
            '3. Attach the required IAM policies',
            '4. Generate access keys for the user',
            '5. Copy the Access Key ID and Secret Access Key'
          ]
        };

      case 'docker':
        return {
          fields: [
            {
              name: 'username',
              label: 'Docker Hub Username',
              type: 'text' as const,
              placeholder: 'your-docker-username',
              required: true,
              description: 'Your Docker Hub username'
            },
            {
              name: 'password',
              label: 'Docker Hub Password',
              type: 'password' as const,
              placeholder: 'your-docker-password',
              required: true,
              description: 'Your Docker Hub password'
            },
            {
              name: 'organization',
              label: 'Organization Name',
              type: 'text' as const,
              placeholder: 'your-org-name',
              required: false,
              description: 'Docker Hub organization name (optional)'
            }
          ],
          permissions: [
            'Read access to user profile',
            'Read access to organization members (if applicable)'
          ],
          setupSteps: [
            '1. Go to Docker Hub (hub.docker.com)',
            '2. Use your existing account credentials',
            '3. If you have an organization, note the organization name',
            '4. Ensure you have admin access to the organization (for member lists)'
          ]
        };

      case 'figma':
        return {
          fields: [
            {
              name: 'personalAccessToken',
              label: 'Personal Access Token',
              type: 'password' as const,
              placeholder: 'figd_...',
              required: true,
              description: 'Your Figma personal access token'
            },
            {
              name: 'teamId',
              label: 'Team ID',
              type: 'text' as const,
              placeholder: '123456789',
              required: false,
              description: 'Figma team ID (optional, found in team URL)'
            }
          ],
          permissions: [
            'Read access to user profile',
            'Read access to team members',
            'Team admin permissions (for member lists)'
          ],
          setupSteps: [
            '1. Go to Figma Settings (figma.com/settings)',
            '2. Scroll to "Personal access tokens"',
            '3. Click "Generate new token"',
            '4. Copy the generated token',
            '5. Get your team ID from the Figma team URL (optional)'
          ]
        };

      case 'google cloud platform':
        return {
          fields: [
            {
              name: 'serviceAccountKey',
              label: 'Service Account JSON',
              type: 'textarea' as const,
              placeholder: '{"type": "service_account", "project_id": "your-project", ...}',
              required: true,
              description: 'Complete service account JSON key file content'
            },
            {
              name: 'projectId',
              label: 'Project ID',
              type: 'text' as const,
              placeholder: 'your-gcp-project-id',
              required: true,
              description: 'Your Google Cloud Platform project ID'
            }
          ],
          permissions: [
            'https://www.googleapis.com/auth/cloud-platform',
            'https://www.googleapis.com/auth/iam'
          ],
          setupSteps: [
            '1. Go to Google Cloud Console',
            '2. Create or select a project',
            '3. Enable the IAM API',
            '4. Create a service account',
            '5. Download the service account JSON key',
            '6. Copy the entire JSON content'
          ]
        };

      default:
        return {
          fields: [],
          permissions: [],
          setupSteps: []
        };
    }
  };

  const appConfig = getAppConfig(appName);

  const handleCredentialChange = (fieldName: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPassword(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const testConnection = async () => {
    setIsLoading(true);
    setError(null);
    setStep('testing');

    try {
      const response = await fetch('http://localhost:5000/api/real-sync/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          appName,
          credentials
        })
      });

      const result = await response.json();

      if (result.success) {
        setConnectionResult(result.data);
        setStep('success');
      } else {
        setError(result.message || 'Connection failed');
        setStep('credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Connection failed');
      setStep('credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const syncUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/real-sync/sync/${appId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const result = await response.json();

      if (result.success) {
        onConnectionSuccess();
        onClose();
      } else {
        setError(result.message || 'Sync failed');
      }
    } catch (err: any) {
      setError(err.message || 'Sync failed');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRequirements = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Setup Requirements</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Required Permissions:</h4>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            {appConfig.permissions.map((permission, index) => (
              <li key={index} className="text-sm">{permission}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-2">Setup Steps:</h4>
        <ol className="space-y-2">
          {appConfig.setupSteps.map((step, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                {index + 1}
              </span>
              <span className="text-gray-700">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={() => setStep('credentials')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continue to Credentials
        </button>
      </div>
    </div>
  );

  const renderCredentials = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Enter Credentials</h3>
        <p className="text-gray-600 mb-4">
          Provide your {appName} credentials to establish the connection.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {appConfig.fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                value={credentials[field.name] || ''}
                onChange={(e) => handleCredentialChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={6}
                required={field.required}
              />
            ) : (
              <div className="relative">
                <input
                  type={field.type === 'password' && !showPassword[field.name] ? 'password' : 'text'}
                  value={credentials[field.name] || ''}
                  onChange={(e) => handleCredentialChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required={field.required}
                />
                {field.type === 'password' && (
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(field.name)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword[field.name] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                )}
              </div>
            )}
            
            {field.description && (
              <p className="text-sm text-gray-500 mt-1">{field.description}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setStep('requirements')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <button
          onClick={testConnection}
          disabled={isLoading || !appConfig.fields.filter(f => f.required).every(f => credentials[f.name])}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Testing Connection...
            </>
          ) : (
            'Test Connection'
          )}
        </button>
      </div>
    </div>
  );

  const renderTesting = () => (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Testing Connection</h3>
        <p className="text-gray-600">
          Connecting to {appName} with your credentials...
        </p>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Successful!</h3>
        <p className="text-gray-600">
          Successfully connected to {appName}
        </p>
      </div>

      {connectionResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">Connection Details:</h4>
          <pre className="text-sm text-green-800 whitespace-pre-wrap">
            {JSON.stringify(connectionResult, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Close
        </button>
        <button
          onClick={syncUsers}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Syncing Users...
            </>
          ) : (
            'Sync Users Now'
          )}
        </button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Connect to {appName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {step === 'requirements' && renderRequirements()}
          {step === 'credentials' && renderCredentials()}
          {step === 'testing' && renderTesting()}
          {step === 'success' && renderSuccess()}
        </div>
      </div>
    </div>
  );
};

export default AppConnectionModal;
