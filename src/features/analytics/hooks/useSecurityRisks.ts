import { useState, useEffect } from 'react';
import { analyticsApi, SecurityRisk } from '../services/analyticsApi';

export const useSecurityRisks = () => {
  const [securityRisks, setSecurityRisks] = useState<SecurityRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSecurityRisks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsApi.getSecurityRisks();
      setSecurityRisks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch security risks');
      console.error('Error fetching security risks:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateRiskStatus = async (riskId: string, status: 'acknowledged' | 'resolved') => {
    try {
      await analyticsApi.updateSecurityRiskStatus(riskId, status);
      // Update local state
      setSecurityRisks(prev => 
        prev.map(risk => 
          risk._id === riskId ? { ...risk, status } : risk
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update risk status');
      throw err;
    }
  };

  const refresh = () => {
    fetchSecurityRisks();
  };

  useEffect(() => {
    fetchSecurityRisks();
  }, []);

  return {
    securityRisks,
    loading,
    error,
    refresh,
    updateRiskStatus
  };
};
