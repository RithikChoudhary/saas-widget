import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight,
  Server,
  Database,
  HardDrive,
  Cloud,
  Globe,
  Shield,
  Activity,
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  XCircle,
  Cpu,
  Zap
} from 'lucide-react';
import { Layout } from '../../../shared/components';
import S3BucketsList from './components/S3BucketsList';
import LambdaFunctionsList from './components/LambdaFunctionsList';
import RDSInstancesList from './components/RDSInstancesList';

interface ResourceSummary {
  ec2Instances: {
    total: number;
    running: number;
    stopped: number;
    terminated: number;
  };
  s3Buckets: {
    total: number;
    totalSize: string;
    largestBucket: string;
  };
  rdsInstances: {
    total: number;
    available: number;
    maintenance: number;
  };
  lambdaFunctions: {
    total: number;
    invocations24h: number;
    errors24h: number;
  };
  vpcCount: number;
  elasticIPs: number;
  loadBalancers: number;
  securityGroups: number;
}

interface EC2Instance {
  id: string;
  instanceId: string;
  name: string;
  type: string;
  state: 'running' | 'stopped' | 'terminated' | 'pending';
  availabilityZone: string;
  publicIP?: string;
  privateIP: string;
  launchTime: string;
  platform?: string;
}

const AWSResources: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [resourceSummary, setResourceSummary] = useState<ResourceSummary | null>(null);
  const [ec2Instances, setEc2Instances] = useState<EC2Instance[]>([]);
  const [s3Buckets, setS3Buckets] = useState<any[]>([]);
  const [lambdaFunctions, setLambdaFunctions] = useState<any[]>([]);
  const [rdsInstances, setRdsInstances] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResourceType, setSelectedResourceType] = useState('ec2');
  const [syncing, setSyncing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResourceData();
  }, []);

  useEffect(() => {
    fetchResourcesByType();
  }, [selectedResourceType]);

  const fetchResourcesByType = async () => {
    try {
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      };

      switch (selectedResourceType) {
        case 'ec2':
          const ec2Response = await fetch('/api/integrations/aws/resources/ec2', { headers });
          if (ec2Response.ok) {
            const ec2Data = await ec2Response.json();
            if (ec2Data.success) {
              setEc2Instances(ec2Data.data || []);
            }
          }
          break;

        case 's3':
          const s3Response = await fetch('/api/integrations/aws/resources?resourceType=S3', { headers });
          if (s3Response.ok) {
            const s3Data = await s3Response.json();
            if (s3Data.success) {
              setS3Buckets(s3Data.data || []);
            }
          }
          break;

        case 'lambda':
          const lambdaResponse = await fetch('/api/integrations/aws/resources?resourceType=Lambda', { headers });
          if (lambdaResponse.ok) {
            const lambdaData = await lambdaResponse.json();
            if (lambdaData.success) {
              setLambdaFunctions(lambdaData.data || []);
            }
          }
          break;

        case 'rds':
          const rdsResponse = await fetch('/api/integrations/aws/resources?resourceType=RDS', { headers });
          if (rdsResponse.ok) {
            const rdsData = await rdsResponse.json();
            if (rdsData.success) {
              setRdsInstances(rdsData.data || []);
            }
          }
          break;
      }
    } catch (error) {
      console.error('Error fetching resources by type:', error);
    }
  };

  const fetchResourceData = async () => {
    try {
      setLoading(true);
      
      // Fetch resource summary
      const summaryResponse = await fetch('/api/integrations/aws/resources/summary', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json();
        if (summaryData.success) {
          setResourceSummary(summaryData.data);
        }
      }

      // Fetch resources based on selected type
      await fetchResourcesByType();
    } catch (error) {
      console.error('Error fetching resource data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      
      const response = await fetch('/api/integrations/aws/resources/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (response.ok) {
        await fetchResourceData();
      }
    } catch (error) {
      console.error('Error syncing resource data:', error);
    } finally {
      setSyncing(false);
    }
  };

  const getFilteredResources = () => {
    const searchLower = searchTerm.toLowerCase();
    
    switch (selectedResourceType) {
      case 'ec2':
        return ec2Instances.filter(instance => 
          instance.name.toLowerCase().includes(searchLower) ||
          instance.instanceId.includes(searchLower) ||
          instance.type.toLowerCase().includes(searchLower)
        );
      case 's3':
        return s3Buckets.filter(bucket => 
          bucket.resourceName.toLowerCase().includes(searchLower) ||
          bucket.region.toLowerCase().includes(searchLower)
        );
      case 'lambda':
        return lambdaFunctions.filter(func => 
          func.resourceName.toLowerCase().includes(searchLower) ||
          func.metadata?.runtime?.toLowerCase().includes(searchLower) ||
          func.region.toLowerCase().includes(searchLower)
        );
      case 'rds':
        return rdsInstances.filter(instance => 
          instance.resourceName.toLowerCase().includes(searchLower) ||
          instance.metadata?.engine?.toLowerCase().includes(searchLower) ||
          instance.region.toLowerCase().includes(searchLower)
        );
      default:
        return [];
    }
  };

  const filteredResources = getFilteredResources();

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'running':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'stopped':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      case 'terminated':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStateBadge = (state: string) => {
    switch (state) {
      case 'running':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Running</span>;
      case 'stopped':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Stopped</span>;
      case 'terminated':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Terminated</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/apps/aws')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
                <div className="flex items-center space-x-3">
                  <Server className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">AWS Resources</h1>
                    <p className="mt-1 text-gray-600">Monitor and manage your AWS infrastructure</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync Resources'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Resource Type Selector */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                <button
                  onClick={() => setSelectedResourceType('ec2')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedResourceType === 'ec2'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Server className="h-4 w-4" />
                    <span>EC2 Instances</span>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedResourceType('s3')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedResourceType === 's3'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <HardDrive className="h-4 w-4" />
                    <span>S3 Buckets</span>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedResourceType('rds')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedResourceType === 'rds'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4" />
                    <span>RDS Databases</span>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedResourceType('lambda')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedResourceType === 'lambda'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <span>Lambda Functions</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Stats Cards */}
          {resourceSummary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Server className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">EC2 Instances</p>
                    <p className="text-2xl font-bold text-gray-900">{resourceSummary.ec2Instances.total}</p>
                    <p className="text-xs text-green-600">{resourceSummary.ec2Instances.running} running</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HardDrive className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">S3 Buckets</p>
                    <p className="text-2xl font-bold text-gray-900">{resourceSummary.s3Buckets.total}</p>
                    <p className="text-xs text-gray-600">{resourceSummary.s3Buckets.totalSize}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Database className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">RDS Instances</p>
                    <p className="text-2xl font-bold text-gray-900">{resourceSummary.rdsInstances.total}</p>
                    <p className="text-xs text-green-600">{resourceSummary.rdsInstances.available} available</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Zap className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Lambda Functions</p>
                    <p className="text-2xl font-bold text-gray-900">{resourceSummary.lambdaFunctions.total}</p>
                    <p className="text-xs text-gray-600">{resourceSummary.lambdaFunctions.invocations24h} invocations</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search resources..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </button>
              </div>
            </div>
          </div>

          {/* EC2 Instances Table */}
          {selectedResourceType === 'ec2' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">EC2 Instances</h3>
              </div>
              <div className="overflow-x-auto">
                {filteredResources.length === 0 ? (
                  <div className="text-center py-12">
                    <Server className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No EC2 instances found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {ec2Instances.length === 0 
                        ? 'Click "Sync Resources" to fetch your AWS resources.'
                        : 'Try adjusting your search criteria.'
                      }
                    </p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability Zone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Addresses</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Launch Time</th>
                        <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredResources.map((instance: any) => (
                        <tr key={instance.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <Server className="h-5 w-5 text-blue-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{instance.name}</div>
                                <div className="text-sm text-gray-500">{instance.instanceId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{instance.type}</div>
                            {instance.platform && (
                              <div className="text-sm text-gray-500">{instance.platform}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getStateIcon(instance.state)}
                              <span className="ml-2">{getStateBadge(instance.state)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {instance.availabilityZone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {instance.publicIP && <div>Public: {instance.publicIP}</div>}
                              <div>Private: {instance.privateIP}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(instance.launchTime).toLocaleDateString()}
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
                )}
              </div>
            </div>
          )}

          {/* S3 Buckets Table */}
          {selectedResourceType === 's3' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">S3 Buckets</h3>
              </div>
              <div className="overflow-x-auto">
                <S3BucketsList buckets={filteredResources} />
              </div>
            </div>
          )}

          {/* Lambda Functions Table */}
          {selectedResourceType === 'lambda' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Lambda Functions</h3>
              </div>
              <div className="overflow-x-auto">
                <LambdaFunctionsList functions={filteredResources} />
              </div>
            </div>
          )}

          {/* RDS Instances Table */}
          {selectedResourceType === 'rds' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">RDS Instances</h3>
              </div>
              <div className="overflow-x-auto">
                <RDSInstancesList instances={filteredResources} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AWSResources;
