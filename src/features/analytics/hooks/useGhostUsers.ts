import { useState, useEffect } from 'react';
import { analyticsApi, GhostUser } from '../services/analyticsApi';

export const useGhostUsers = () => {
  const [ghostUsers, setGhostUsers] = useState<GhostUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGhostUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsApi.getGhostUsers();
      setGhostUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ghost users');
      console.error('Error fetching ghost users:', err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchGhostUsers();
  };

  useEffect(() => {
    fetchGhostUsers();
  }, []);

  return {
    ghostUsers,
    loading,
    error,
    refresh
  };
};
