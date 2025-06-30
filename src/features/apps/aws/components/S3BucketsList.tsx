import React from 'react';
import { HardDrive, Globe, Lock, Calendar, MoreVertical } from 'lucide-react';

interface S3Bucket {
  id: string;
  resourceId: string;
  resourceName: string;
  region: string;
  status: string;
  metadata: {
    creationDate?: string;
    versioning?: string;
  };
  cost: number;
}

interface S3BucketsListProps {
  buckets: S3Bucket[];
}

const S3BucketsList: React.FC<S3BucketsListProps> = ({ buckets }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  const getRegionDisplay = (region: string) => {
    const regionMap: { [key: string]: string } = {
      'us-east-1': 'US East (N. Virginia)',
      'us-west-2': 'US West (Oregon)',
      'eu-west-1': 'EU (Ireland)',
      'ap-southeast-1': 'Asia Pacific (Singapore)',
      'ap-northeast-1': 'Asia Pacific (Tokyo)'
    };
    return regionMap[region] || region;
  };

  if (buckets.length === 0) {
    return (
      <div className="text-center py-12">
        <HardDrive className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No S3 buckets found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Click "Sync Resources" to fetch your S3 buckets.
        </p>
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bucket</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Versioning</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Cost</th>
          <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {buckets.map((bucket) => (
          <tr key={bucket.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <HardDrive className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">{bucket.resourceName}</div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Globe className="h-3 w-3 mr-1" />
                    Public Access
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{getRegionDisplay(bucket.region)}</div>
              <div className="text-sm text-gray-500">{bucket.region}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                bucket.metadata.versioning === 'Enabled' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {bucket.metadata.versioning || 'Disabled'}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(bucket.metadata.creationDate)}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              ${bucket.cost.toFixed(2)}
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

export default S3BucketsList;
