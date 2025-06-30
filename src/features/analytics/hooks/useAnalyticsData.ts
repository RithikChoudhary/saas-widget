import { useState, useEffect, useCallback } from 'react';
import { analyticsApi, DashboardData } from '../services/analyticsApi';

export const useAnalyticsData = (autoRefresh = false, refreshInterval = 300000) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      console.log('🔍 Analytics Hook: Fetching dashboard data...');
      setLoading(true);
      setError(null);
      
      const dashboardData = await analyticsApi.getDashboard();
      console.log('✅ Analytics Hook: Dashboard data received:', dashboardData);
      
      setData(dashboardData);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('❌ Analytics Hook: Error fetching data:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch analytics data';
      setError(errorMessage);
      
      // Set empty data structure to prevent UI crashes
      setData({
        overview: {
          totalUsers: 0,
          totalGhostUsers: 0,
          totalSecurityRisks: 0,
          totalWastedCost: 0,
          totalLicenseCost: 0,
          wastePercentage: '0'
        },
        platformBreakdown: {
          googleWorkspace: 0,
          github: 0,
          slack: 0,
          zoom: 0,
          aws: 0
        },
        ghostUsersByPlatform: {
          googleWorkspace: 0,
          github: 0,
          slack: 0,
          zoom: 0,
          aws: 0
        },
        securityRiskBreakdown: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0
        },
        recommendations: [],
        lastUpdated: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const correlateUsers = async () => {
    try {
      console.log('🔄 Analytics Hook: Starting user correlation...');
      setError(null);
      
      const result = await analyticsApi.correlateUsers();
      console.log('✅ Analytics Hook: User correlation completed:', result);
      
      // Refresh dashboard data after correlation
      await fetchData();
      return result;
    } catch (err: any) {
      console.error('❌ Analytics Hook: Correlation error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to correlate users';
      setError(errorMessage);
      throw err;
    }
  };

  const refresh = useCallback(() => {
    console.log('🔄 Analytics Hook: Manual refresh triggered');
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    console.log('🚀 Analytics Hook: Initial data fetch');
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      console.log(`⏰ Analytics Hook: Setting up auto-refresh every ${refreshInterval}ms`);
      const interval = setInterval(() => {
        console.log('⏰ Analytics Hook: Auto-refresh triggered');
        fetchData();
      }, refreshInterval);
      return () => {
        console.log('⏰ Analytics Hook: Clearing auto-refresh interval');
        clearInterval(interval);
      };
    }
  }, [autoRefresh, refreshInterval, fetchData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    correlateUsers
  };
};
