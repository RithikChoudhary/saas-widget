// Analytics feature exports
export { default as AnalyticsDashboard } from './pages/AnalyticsDashboard';
export { default as GhostUsersDashboard } from './pages/GhostUsersDashboard';
export { default as SecurityDashboard } from './pages/SecurityDashboard';
export { default as LicenseOptimization } from './pages/LicenseOptimization';
export { default as CrossPlatformUsers } from './pages/CrossPlatformUsers';

// Components
export { default as KPICard } from './components/KPICard';
export { default as PlatformChart } from './components/PlatformChart';
export { default as UserTable } from './components/UserTable';
export { default as RiskIndicator } from './components/RiskIndicator';
export { default as CostSavingsChart } from './components/CostSavingsChart';

// Hooks
export { useAnalyticsData } from './hooks/useAnalyticsData';
export { useGhostUsers } from './hooks/useGhostUsers';
export { useSecurityRisks } from './hooks/useSecurityRisks';

// Services
export { analyticsApi } from './services/analyticsApi';
