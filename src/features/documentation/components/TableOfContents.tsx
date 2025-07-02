import React from 'react';
import { ChevronRight } from 'lucide-react';

interface TocItem {
  id: string;
  title: string;
  level: number;
  children?: TocItem[];
}

interface TableOfContentsProps {
  items: TocItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
  className?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  activeId,
  onItemClick,
  className = ''
}) => {
  const renderTocItem = (item: TocItem, index: number) => {
    const isActive = activeId === item.id;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="space-y-1">
        <button
          onClick={() => onItemClick?.(item.id)}
          className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 ${
            isActive
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          } ${item.level > 1 ? `ml-${(item.level - 1) * 4}` : ''}`}
        >
          <span className={`font-medium ${item.level === 1 ? 'text-base' : 'text-sm'}`}>
            {item.title}
          </span>
          {hasChildren && (
            <ChevronRight className={`h-4 w-4 transition-transform ${isActive ? 'rotate-90' : ''}`} />
          )}
        </button>

        {hasChildren && isActive && (
          <div className="ml-4 space-y-1">
            {item.children!.map((child, childIndex) => renderTocItem(child, childIndex))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={`space-y-2 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Table of Contents
      </h3>
      <div className="space-y-1">
        {items.map((item, index) => renderTocItem(item, index))}
      </div>
    </nav>
  );
};

export default TableOfContents;
