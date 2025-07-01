import React from 'react';
import { Layout } from '../../../../../shared/components';
import { Package, Archive, Download, Upload, Shield, Clock, AlertCircle } from 'lucide-react';

const GitHubPackages: React.FC = () => {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">GitHub Packages</h1>
            <p className="text-gray-600 mt-1">Manage packages and container images</p>
          </div>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <Package className="h-10 w-10 text-blue-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">GitHub Packages Integration Coming Soon</h2>
            
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              We're working on bringing you comprehensive GitHub Packages management. Soon you'll be able to manage 
              npm, Docker, Maven, NuGet, and RubyGems packages directly from this dashboard.
            </p>

            {/* Feature Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <Archive className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Package Registry</h3>
                <p className="text-sm text-gray-600">
                  View and manage all your packages across different ecosystems in one place
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Access Control</h3>
                <p className="text-sm text-gray-600">
                  Manage package permissions and visibility settings for your organization
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <Download className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Usage Analytics</h3>
                <p className="text-sm text-gray-600">
                  Track package downloads, dependencies, and usage across your projects
                </p>
              </div>
            </div>

            {/* Notification */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-blue-800">
                    <strong>Want to be notified?</strong> This feature is under active development. 
                    Your GitHub packages data is safe and will be automatically imported once this feature is available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What to Expect */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">What to Expect</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Supported Package Types</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <Package className="h-4 w-4 mr-2 text-gray-400" />
                    npm (Node.js packages)
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Package className="h-4 w-4 mr-2 text-gray-400" />
                    Docker container images
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Package className="h-4 w-4 mr-2 text-gray-400" />
                    Maven (Java packages)
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Package className="h-4 w-4 mr-2 text-gray-400" />
                    NuGet (.NET packages)
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Package className="h-4 w-4 mr-2 text-gray-400" />
                    RubyGems (Ruby packages)
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <Upload className="h-4 w-4 mr-2 text-gray-400" />
                    Package publishing workflows
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Download className="h-4 w-4 mr-2 text-gray-400" />
                    Download statistics and insights
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Shield className="h-4 w-4 mr-2 text-gray-400" />
                    Security vulnerability scanning
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    Version history and management
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Archive className="h-4 w-4 mr-2 text-gray-400" />
                    Storage usage monitoring
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GitHubPackages;
