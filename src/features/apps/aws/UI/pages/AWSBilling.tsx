import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  RefreshCw,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Receipt
} from 'lucide-react';
import { Layout } from '../../../../../shared/components';

interface BillingSummary {
  currentMonthCost: number;
  lastMonthCost: number;
  monthOverMonthChange: number;
  forecastedCost: number;
  budgetLimit: number;
  budgetUsagePercentage: number;
  topServices: Array<{
    service: string;
    cost: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  costByAccount: Array<{
    accountId: string;
    accountName: string;
    cost: number;
    percentage: number;
  }>;
}

interface CostTrend {
  date: string;
  cost: number;
  services: {
    [key: string]: number;
  };
}

const AWSBilling: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null);
  const [costTrends, setCostTrends] = useState<CostTrend[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [syncing, setSyncing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBillingData();
  }, [selectedPeriod]);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      
      // Fetch billing summary
      const summaryResponse = await fetch(`http://localhost:5000/api/integrations/aws/billing/summary?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json();
        if (summaryData.success) {
          setBillingSummary(summaryData.data);
        }
      }

      // Fetch cost trends
      const trendsResponse = await fetch(`http://localhost:5000/api/integrations/aws/billing/trends?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (trendsResponse.ok) {
        const trendsData = await trendsResponse.json();
        if (trendsData.success) {
          setCostTrends(trendsData.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      
      const response = await fetch('http://localhost:5000/api/integrations/aws/billing/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (response.ok) {
        await fetchBillingData();
      }
    } catch (error) {
      console.error('Error syncing billing data:', error);
    } finally {
      setSyncing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) {
      return <ArrowUpRight className="h-4 w-4 text-red-600" />;
    } else if (change < 0) {
      return <ArrowDownRight className="h-4 w-4 text-green-600" />;
    }
    return null;
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
                  <DollarSign className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">AWS Billing & Cost Management</h1>
                    <p className="mt-1 text-gray-600">Monitor costs, budgets, and optimize spending</p>
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
                  {syncing ? 'Syncing...' : 'Sync Billing Data'}
                </button>
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Period Selector */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="12m">Last 12 months</option>
                  </select>
                </div>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </button>
              </div>
            </div>
          </div>

          {/* Cost Summary Cards */}
          {billingSummary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Month Cost</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(billingSummary.currentMonthCost)}
                    </p>
                    <div className="flex items-center mt-2">
                      {getChangeIcon(billingSummary.monthOverMonthChange)}
                      <span className={`text-sm ${
                        billingSummary.monthOverMonthChange > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {Math.abs(billingSummary.monthOverMonthChange)}% vs last month
                      </span>
                    </div>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Forecasted Cost</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(billingSummary.forecastedCost)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">End of month projection</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Budget Usage</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {billingSummary.budgetUsagePercentage}%
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${
                          billingSummary.budgetUsagePercentage > 90 ? 'bg-red-600' :
                          billingSummary.budgetUsagePercentage > 70 ? 'bg-yellow-600' :
                          'bg-green-600'
                        }`}
                        style={{ width: `${Math.min(billingSummary.budgetUsagePercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                  <CreditCard className="h-8 w-8 text-orange-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Month Cost</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(billingSummary.lastMonthCost)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Total for previous month</p>
                  </div>
                  <Receipt className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>
          )}

          {/* Cost by Service */}
          {billingSummary && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Top Services by Cost</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {billingSummary.topServices.map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">{service.service}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-semibold text-gray-900">
                                {formatCurrency(service.cost)}
                              </span>
                              {service.trend === 'up' && <TrendingUp className="h-3 w-3 text-red-600" />}
                              {service.trend === 'down' && <TrendingDown className="h-3 w-3 text-green-600" />}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${service.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Cost by Account</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {billingSummary.costByAccount.map((account, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <span className="text-sm font-medium text-gray-900">{account.accountName}</span>
                              <span className="text-xs text-gray-500 ml-2">({account.accountId})</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {formatCurrency(account.cost)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${account.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cost Trend Chart Placeholder */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Cost Trends</h3>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                  <PieChart className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="p-12">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Cost Visualization</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Interactive cost charts and trends coming soon.
                </p>
              </div>
            </div>
          </div>

          {/* Cost Optimization Recommendations */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Cost Optimization Tips</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Consider using Reserved Instances for long-running EC2 instances</li>
                    <li>Enable S3 lifecycle policies to move old data to cheaper storage classes</li>
                    <li>Review and terminate unused resources regularly</li>
                    <li>Use AWS Cost Explorer to identify cost optimization opportunities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AWSBilling;
