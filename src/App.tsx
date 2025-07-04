import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage, LoginPage, RegisterPage } from './features/auth'
import UserManagementSolutionPage from './features/auth/UserManagementSolutionPage'
import { 
  DocumentationHub, 
  IntegrationGuide,
  PlatformOverview,
  SlackIntegrationGuide,
  GoogleWorkspaceIntegrationGuide,
  GitHubIntegrationGuide,
  AWSIntegrationGuide,
  ZoomIntegrationGuide,
  AzureIntegrationGuide,
  Office365IntegrationGuide,
  DatadogIntegrationGuide
} from './features/documentation'
import AuthenticationFAQ from './features/documentation/pages/AuthenticationFAQ'
import CostOptimizationSolutionPage from './features/auth/CostOptimizationSolutionPage'
import SecurityComplianceSolutionPage from './features/auth/SecurityComplianceSolutionPage'
import BlogPage from './features/auth/BlogPage'
import SupportPage from './features/auth/SupportPage'
import { Dashboard, ActivityPage } from './features/dashboard'
import { Users } from './features/users'
import { CompanySettings } from './features/company'
import { Settings } from './features/settings'
import { 
  AppsOverview, 
  AWSConnections, 
  AWSOverview, 
  AWSUsers, 
  AWSOrganizations,
  AWSResources,
  AWSBilling,
  AzureOverview,
  GitHubOverview,
  GitHubUsers,
  GitHubTeams,
  GitHubRepositories,
  GitHubConnections,
  SlackOverview,
  SlackUsersPage,
  SlackWorkspaces,
  ZoomOverview,
  GoogleWorkspaceOverview,
  GoogleWorkspaceUsers,
  GoogleWorkspaceGroups
} from './features/apps'
import DatadogOverview from './features/apps/datadog/UI/pages/DatadogOverview'
import DatadogUsers from './features/apps/datadog/UI/pages/DatadogUsers'
import DatadogTeams from './features/apps/datadog/UI/pages/DatadogTeams'
import DatadogSettings from './features/apps/datadog/UI/pages/DatadogSettings'
import { CredentialsManagement } from './features/credentials'
import {
  AnalyticsDashboard,
  GhostUsersDashboard,
  SecurityDashboard,
  LicenseOptimization,
  CrossPlatformUsers
} from './features/analytics'
import { Layout } from './shared/components'
import GitHubAuth from './features/apps/github/UI/pages/GitHubAuth'
import AWSAuth from './features/apps/aws/UI/pages/AWSAuth'
import ZoomAuth from './features/apps/zoom/UI/pages/ZoomAuth'
import DatadogAuth from './features/apps/datadog/UI/pages/DatadogAuth'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* New Documentation System Routes */}
          <Route path="/docs" element={<DocumentationHub />} />
          <Route path="/docs/platform-overview" element={<PlatformOverview />} />
          <Route path="/docs/integration-guide" element={<IntegrationGuide />} />
          <Route path="/docs/integrations/slack" element={<SlackIntegrationGuide />} />
          <Route path="/docs/integrations/google-workspace" element={<GoogleWorkspaceIntegrationGuide />} />
          <Route path="/docs/integrations/github" element={<GitHubIntegrationGuide />} />
          <Route path="/docs/integrations/aws" element={<AWSIntegrationGuide />} />
          <Route path="/docs/integrations/zoom" element={<ZoomIntegrationGuide />} />
          <Route path="/docs/integrations/azure" element={<AzureIntegrationGuide />} />
          <Route path="/docs/integrations/office365" element={<Office365IntegrationGuide />} />
          <Route path="/docs/integrations/datadog" element={<DatadogIntegrationGuide />} />
          <Route path="/docs/authentication-faq" element={<AuthenticationFAQ />} />
          
          <Route path="/user-management" element={<UserManagementSolutionPage />} />
          <Route path="/cost-optimization" element={<CostOptimizationSolutionPage />} />
          <Route path="/security-compliance" element={<SecurityComplianceSolutionPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/apps" element={<AppsOverview />} />
          <Route path="/users" element={<Users />} />
          <Route path="/credentials" element={<CredentialsManagement />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/company-settings" element={<CompanySettings />} />
          
          {/* Authentication Routes */}
          <Route path="/apps/github/auth" element={<GitHubAuth />} />
          <Route path="/apps/aws/auth" element={<AWSAuth />} />
          <Route path="/apps/zoom/auth" element={<ZoomAuth />} />
          <Route path="/apps/datadog/auth" element={<DatadogAuth />} />
          
          {/* AWS Routes */}
          <Route path="/apps/aws" element={<AWSOverview />} />
          <Route path="/apps/aws/connections" element={<AWSConnections />} />
          <Route path="/apps/aws/users" element={<AWSUsers />} />
          <Route path="/apps/aws/organizations" element={<AWSOrganizations />} />
          <Route path="/apps/aws/billing" element={<AWSBilling />} />
          <Route path="/apps/aws/security" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">AWS Security & Compliance</h1>
                <p className="text-gray-600">Coming Soon - Security posture, compliance monitoring, and policies</p>
              </div>
            </Layout>
          } />
          <Route path="/apps/aws/resources" element={<AWSResources />} />
          
          {/* Azure Routes */}
          <Route path="/apps/azure" element={<AzureOverview />} />
          <Route path="/apps/azure/subscriptions" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Azure Subscriptions</h1>
                <p className="text-gray-600">Coming Soon - Manage Azure subscriptions</p>
              </div>
            </Layout>
          } />
          <Route path="/apps/azure/ad" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Azure Active Directory</h1>
                <p className="text-gray-600">Coming Soon - Azure AD user management</p>
              </div>
            </Layout>
          } />
          <Route path="/apps/azure/management" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Azure Management Groups</h1>
                <p className="text-gray-600">Coming Soon - Resource organization</p>
              </div>
            </Layout>
          } />
          <Route path="/apps/azure/cost" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Azure Cost Management</h1>
                <p className="text-gray-600">Coming Soon - Cost analysis and optimization</p>
              </div>
            </Layout>
          } />
          
          {/* Office 365 Routes */}
          <Route path="/apps/office365" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Microsoft Office 365</h1>
                <p className="text-gray-600">Coming Soon - Office 365 management</p>
              </div>
            </Layout>
          } />
          <Route path="/apps/office365/tenants" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Office 365 Tenants</h1>
                <p className="text-gray-600">Coming Soon - Manage Office 365 tenants</p>
              </div>
            </Layout>
          } />
          <Route path="/apps/office365/users" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Office 365 Users</h1>
                <p className="text-gray-600">Coming Soon - User lifecycle management</p>
              </div>
            </Layout>
          } />
          <Route path="/apps/office365/exchange" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Exchange Management</h1>
                <p className="text-gray-600">Coming Soon - Email and calendar management</p>
              </div>
            </Layout>
          } />
          <Route path="/apps/office365/security" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Office 365 Security</h1>
                <p className="text-gray-600">Coming Soon - Security and compliance monitoring</p>
              </div>
            </Layout>
          } />
          
          {/* GitHub Routes */}
          <Route path="/apps/github" element={<GitHubOverview />} />
          <Route path="/apps/github/connections" element={<GitHubConnections />} />
          <Route path="/apps/github/users" element={<GitHubUsers />} />
          <Route path="/apps/github/teams" element={<GitHubTeams />} />
          <Route path="/apps/github/repositories" element={<GitHubRepositories />} />
          <Route path="/apps/github/packages" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">GitHub Packages</h1>
                <p className="text-gray-600">Coming Soon - Package management and releases</p>
              </div>
            </Layout>
          } />
          <Route path="/apps/github/security" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">GitHub Security</h1>
                <p className="text-gray-600">Coming Soon - Security scanning and alerts</p>
              </div>
            </Layout>
          } />
          
          {/* Slack Routes */}
          <Route path="/apps/slack" element={<SlackOverview />} />
          <Route path="/apps/slack/workspaces" element={<SlackWorkspaces />} />
          <Route path="/apps/slack/channels" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Slack Channels</h1>
                <p className="text-gray-600">Coming Soon - Channel browser</p>
              </div>
            </Layout>
          } />
          <Route path="/apps/slack/users" element={<SlackUsersPage />} />
          
          {/* Zoom Routes */}
          <Route path="/apps/zoom" element={<ZoomOverview />} />
          <Route path="/apps/zoom/users" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Zoom Users</h1>
                <p className="text-gray-600">Coming Soon - User management and licenses</p>
              </div>
            </Layout>
          } />
          <Route path="/apps/zoom/meetings" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Zoom Meetings</h1>
                <p className="text-gray-600">Coming Soon - Meeting analytics and history</p>
              </div>
            </Layout>
          } />
          <Route path="/apps/zoom/licenses" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Zoom Licenses</h1>
                <p className="text-gray-600">Coming Soon - License management and optimization</p>
              </div>
            </Layout>
          } />
          <Route path="/apps/zoom/analytics" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Zoom Analytics</h1>
                <p className="text-gray-600">Coming Soon - Usage statistics and reporting</p>
              </div>
            </Layout>
          } />
          
          {/* Google Workspace Routes */}
          <Route path="/apps/google-workspace" element={<GoogleWorkspaceOverview />} />
          <Route path="/apps/google-workspace/users" element={<GoogleWorkspaceUsers />} />
          <Route path="/apps/google-workspace/groups" element={<GoogleWorkspaceGroups />} />
          <Route path="/apps/google-workspace/security" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Google Workspace Security</h1>
                <p className="text-gray-600">Coming Soon - Admin roles and 2FA monitoring</p>
              </div>
            </Layout>
          } />
          <Route path="/apps/google-workspace/analytics" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Google Workspace Analytics</h1>
                <p className="text-gray-600">Coming Soon - Usage statistics and license optimization</p>
              </div>
            </Layout>
          } />
          <Route path="/apps/google-workspace/drives" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Google Workspace Drives</h1>
                <p className="text-gray-600">Coming Soon - Shared drives and storage analysis</p>
              </div>
            </Layout>
          } />
          
          {/* Datadog Routes */}
          <Route path="/apps/datadog" element={<DatadogOverview />} />
          <Route path="/apps/datadog/users" element={<DatadogUsers />} />
          <Route path="/apps/datadog/teams" element={<DatadogTeams />} />
          <Route path="/apps/datadog/settings" element={<DatadogSettings />} />
          <Route path="/apps/datadog/analytics" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Datadog Analytics</h1>
                <p className="text-gray-600">Coming Soon - Usage analytics and cost optimization</p>
              </div>
            </Layout>
          } />
          
          {/* Analytics Routes */}
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/analytics/ghost-users" element={<GhostUsersDashboard />} />
          <Route path="/analytics/security" element={<SecurityDashboard />} />
          <Route path="/analytics/license-optimization" element={<LicenseOptimization />} />
          <Route path="/analytics/cross-platform-users" element={<CrossPlatformUsers />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
