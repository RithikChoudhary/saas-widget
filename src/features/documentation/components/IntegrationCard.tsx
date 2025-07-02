import React from 'react';
import { ExternalLink, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface IntegrationCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'implemented' | 'coming-soon' | 'in-progress';
  authMethods: string[];
  features: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  documentationPath: string;
  className?: string;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  id,
  name,
  description,
  icon,
  status,
  authMethods,
  features,
  difficulty,
  estimatedTime,
  documentationPath,
  className = ''
}) => {
  const navigate = useNavigate();

  const getStatusColor = () => {
    switch (status) {
      case 'implemented': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'coming-soon': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'implemented': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <AlertTriangle className="h-4 w-4" />;
      case 'coming-soon': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleCardClick = () => {
    if (status === 'implemented' || status === 'in-progress') {
      navigate(documentationPath);
    }
  };

  return (
    <div 
      className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
        status === 'coming-soon' ? 'opacity-75' : 'cursor-pointer'
      } ${className}`}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="capitalize">{status.replace('-', ' ')}</span>
          </span>
          {(status === 'implemented' || status === 'in-progress') && (
            <ExternalLink className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Authentication Methods */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Authentication Methods</h4>
        <div className="flex flex-wrap gap-2">
          {authMethods.map((method, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-lg"
            >
              {method}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Features</h4>
        <div className="space-y-1">
          {features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
              <span className="text-xs text-gray-600 dark:text-gray-400">{feature}</span>
            </div>
          ))}
          {features.length > 3 && (
            <div className="text-xs text-gray-500 dark:text-gray-500">
              +{features.length - 3} more features
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center space-x-4">
          <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor()}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-500">
            ~{estimatedTime}
          </span>
        </div>
        
        {status === 'coming-soon' && (
          <span className="text-xs text-gray-500 dark:text-gray-500 italic">
            Coming Soon
          </span>
        )}
      </div>
    </div>
  );
};

export default IntegrationCard;
