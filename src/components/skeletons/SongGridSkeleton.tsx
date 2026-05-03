import React from 'react';
import SongCardSkeleton from './SongCardSkeleton';

interface SongGridSkeletonProps {
  count?: number;
  showUserInfo?: boolean;
}

const SongGridSkeleton: React.FC<SongGridSkeletonProps> = ({ count = 6, showUserInfo = false }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <SongCardSkeleton key={`skeleton-${index}`} showUserInfo={showUserInfo} />
      ))}
    </div>
  );
};

export default SongGridSkeleton;