import React from 'react';

interface BaseSkeletonProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const BaseSkeleton: React.FC<BaseSkeletonProps> = ({ className = '', children, style }) => {
  return (
    <div className={`skeleton-shimmer bg-gray-700/50 ${className}`} style={style}>
      {children}
    </div>
  );
};

export default BaseSkeleton;