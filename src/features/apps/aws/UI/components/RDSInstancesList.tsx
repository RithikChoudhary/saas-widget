import React from 'react';
import { Database, Server, HardDrive, Activity, CheckCircle, AlertCircle, MoreVertical } from 'lucide-react';

interface RDSInstance {
  id: string;
  resourceId: string;
  resourceName: string;
  region: string;
  status: string;
  metadata: {
    engine?: string;
    engineVersion?: string;
    instanceClass?: string;
    allocatedStorage?: number;
    multiAZ?: boolean;
    endpoint?: string;
    port?: number;
    createdTime?: string;
  };
  cost: number;
}

interface RDSInstancesListProps {
  instances: RDSInstance[];
}

const RDSInstancesList: React.FC<RDSInstancesListProps> = ({ instances }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  const getEngineIcon = (engine?: string) => {
    if (engine?.includes('mysql')) return '🐬';
    if (engine?.includes('postgres')) return '🐘';
    if (engine?.includes('mariadb')) return '🦭';
    if (engine?.includes('oracle')) return '🔶';
    if (engine?.includes('sqlserver')) return '🪟';
    if (engine?.includes('aurora')) return '🌌';
    return '🗄️';
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'creating':
      case 'modifying':
      case 'backing-up':
        return <Activity className="h-4 w-4 text-yellow-600" />;
      case 'failed':
      case 'deleting':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    let colorClass = 'bg-gray-100 text-gray-800';
    
    if (statusLower === 'available') colorClass = 'bg-green-100 text-green-800';
    else if (['creating', 'modifying', 'backing-up'].includes(statusLower)) colorClass = 'bg-yellow-100 text-yellow-800';
    else if (['failed', 'deleting'].includes(statusLower)) colorClass = 'bg-red-100 text-red-800';

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {status}
      </span>
    );
  };

  if (instances.length === 0) {
    return (
      <div className="text-center py-12">
        <Database className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No RDS instances found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Click "Sync Resources" to fetch your RDS instances.
        </p>
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instance</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engine</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class & Storage</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
          <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {instances.map((instance) => (
          <tr key={instance.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Database className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">{instance.resourceName}</div>
                  <div className="text-sm text-gray-500">{instance.region}</div>
                  {instance.metadata.multiAZ && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Multi-AZ
                    </span>
                  )}
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <span className="mr-2 text-lg">{getEngineIcon(instance.metadata.engine)}</span>
                <div>
                  <div className="text-sm text-gray-900">{instance.metadata.engine || 'Unknown'}</div>
                  <div className="text-xs text-gray-500">{instance.metadata.engineVersion}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                {getStatusIcon(instance.status)}
                <span className="ml-2">{getStatusBadge(instance.status)}</span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                <div className="flex items-center">
                  <Server className="h-4 w-4 mr-1 text-gray-400" />
                  {instance.metadata.instanceClass || 'Unknown'}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <HardDrive className="h-3 w-3 mr-1" />
                  {instance.metadata.allocatedStorage || 0} GB
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {instance.metadata.endpoint ? (
                <div className="text-sm">
                  <div className="text-gray-900 font-mono text-xs truncate max-w-xs">
                    {instance.metadata.endpoint}
                  </div>
                  <div className="text-gray-500">Port: {instance.metadata.port || 'N/A'}</div>
                </div>
              ) : (
                <span className="text-sm text-gray-500">No endpoint</span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatDate(instance.metadata.createdTime)}
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

export default RDSInstancesList;
