import React from 'react';
import { Zap, Clock, Cpu, Code, MoreVertical } from 'lucide-react';

interface LambdaFunction {
  id: string;
  resourceId: string;
  resourceName: string;
  region: string;
  status: string;
  metadata: {
    runtime?: string;
    handler?: string;
    codeSize?: number;
    memorySize?: number;
    timeout?: number;
    lastModified?: string;
  };
  cost: number;
}

interface LambdaFunctionsListProps {
  functions: LambdaFunction[];
}

const LambdaFunctionsList: React.FC<LambdaFunctionsListProps> = ({ functions }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCodeSize = (bytes?: number) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getRuntimeIcon = (runtime?: string) => {
    if (runtime?.includes('python')) return '🐍';
    if (runtime?.includes('nodejs')) return '📦';
    if (runtime?.includes('java')) return '☕';
    if (runtime?.includes('go')) return '🐹';
    if (runtime?.includes('ruby')) return '💎';
    return '⚡';
  };

  if (functions.length === 0) {
    return (
      <div className="text-center py-12">
        <Zap className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Lambda functions found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Click "Sync Resources" to fetch your Lambda functions.
        </p>
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Function</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Runtime</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Memory</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeout</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code Size</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
          <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {functions.map((func) => (
          <tr key={func.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">{func.resourceName}</div>
                  <div className="text-sm text-gray-500">{func.region}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <span className="mr-2 text-lg">{getRuntimeIcon(func.metadata.runtime)}</span>
                <div>
                  <div className="text-sm text-gray-900">{func.metadata.runtime || 'Unknown'}</div>
                  {func.metadata.handler && (
                    <div className="text-xs text-gray-500">{func.metadata.handler}</div>
                  )}
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center text-sm text-gray-900">
                <Cpu className="h-4 w-4 mr-1 text-gray-400" />
                {func.metadata.memorySize || 0} MB
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center text-sm text-gray-900">
                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                {func.metadata.timeout || 0}s
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center text-sm text-gray-900">
                <Code className="h-4 w-4 mr-1 text-gray-400" />
                {formatCodeSize(func.metadata.codeSize)}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatDate(func.metadata.lastModified)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-4 w-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LambdaFunctionsList;
