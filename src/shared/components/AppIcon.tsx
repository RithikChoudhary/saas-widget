import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSlack, 
  faGithub, 
  faGoogle, 
  faMicrosoft, 
  faAws
} from '@fortawesome/free-brands-svg-icons';
import { 
  Database,
  Settings,
  Shield,
  Activity,
  Users,
  MessageCircle,
  Building,
  Cloud
} from 'lucide-react';

interface AppIconProps {
  appType: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const AppIcon: React.FC<AppIconProps> = ({ appType, size = 'md', className = '' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'md': return 'w-6 h-6';
      case 'lg': return 'w-8 h-8';
      case 'xl': return 'w-12 h-12';
      default: return 'w-6 h-6';
    }
  };

  const getFontAwesomeSize = () => {
    switch (size) {
      case 'sm': return '1x';
      case 'md': return 'lg';
      case 'lg': return '2x';
      case 'xl': return '3x';
      default: return 'lg';
    }
  };

  const iconClasses = `${getSizeClasses()} ${className}`;

  switch (appType.toLowerCase()) {
    case 'slack':
      return (
        <FontAwesomeIcon 
          icon={faSlack} 
          size={getFontAwesomeSize() as any}
          className={`text-purple-600 ${className}`}
        />
      );
    
    case 'github':
      return (
        <FontAwesomeIcon 
          icon={faGithub} 
          size={getFontAwesomeSize() as any}
          className={`text-gray-800 dark:text-white ${className}`}
        />
      );
    
    case 'google-workspace':
    case 'google':
      return (
        <FontAwesomeIcon 
          icon={faGoogle} 
          size={getFontAwesomeSize() as any}
          className={`text-blue-600 ${className}`}
        />
      );
    
    case 'microsoft':
    case 'azure':
    case 'office365':
      return (
        <FontAwesomeIcon 
          icon={faMicrosoft} 
          size={getFontAwesomeSize() as any}
          className={`text-blue-500 ${className}`}
        />
      );
    
    case 'aws':
    case 'amazon':
      return (
        <FontAwesomeIcon 
          icon={faAws} 
          size={getFontAwesomeSize() as any}
          className={`text-orange-500 ${className}`}
        />
      );
    
    case 'zoom':
      return (
        <div className={`${iconClasses} bg-blue-600 rounded flex items-center justify-center`}>
          <Activity className="w-3/4 h-3/4 text-white" />
        </div>
      );
    
    case 'datadog':
      return (
        <div className={`${iconClasses} bg-purple-600 rounded flex items-center justify-center`}>
          <Activity className="w-3/4 h-3/4 text-white" />
        </div>
      );
    
    case 'database':
      return <Database className={`${iconClasses} text-blue-600`} />;
    
    case 'users':
      return <Users className={`${iconClasses} text-green-600`} />;
    
    case 'building':
      return <Building className={`${iconClasses} text-gray-600`} />;
    
    case 'cloud':
      return <Cloud className={`${iconClasses} text-blue-500`} />;
    
    default:
      return <Settings className={`${iconClasses} text-gray-500`} />;
  }
};

export default AppIcon;
