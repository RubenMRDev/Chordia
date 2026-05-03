import React from 'react';
import BaseSkeleton from './BaseSkeleton';

interface SongCardSkeletonProps {
  showUserInfo?: boolean;
}

const SongCardSkeleton: React.FC<SongCardSkeletonProps> = ({ showUserInfo = false }) => {
  return (
    <div className="bg-[#1a223a] rounded-lg overflow-hidden shadow-md">
      {/* Header/Image Area */}
      <div className="relative h-40 bg-[#162032] flex items-center justify-center p-4">
        <BaseSkeleton className="w-24 h-24 rounded-full" />
        {/* Play button skeleton */}
        <BaseSkeleton className="absolute bottom-4 right-4 w-12 h-12 rounded-full" />
      </div>
      
      {/* Content Area */}
      <div className="p-4">
        {/* Title */}
        <BaseSkeleton className="h-6 w-3/4 mb-2 rounded" />
        
        {/* User info (for admin page) */}
        {showUserInfo && (
          <BaseSkeleton className="h-4 w-1/2 mb-3 rounded" />
        )}
        
        {/* Song details (Key, Time signature, BPM) */}
        <div className="flex flex-wrap gap-4 mb-4">
          <BaseSkeleton className="h-6 w-16 rounded" />
          <BaseSkeleton className="h-6 w-12 rounded" />
          <BaseSkeleton className="h-6 w-20 rounded" />
        </div>
        
        {/* Footer with date and actions */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <BaseSkeleton className="w-3 h-3 rounded-full" />
            <BaseSkeleton className="h-4 w-20 rounded" />
          </div>
          <div className="flex gap-3">
            <BaseSkeleton className="w-4 h-4 rounded" />
            {showUserInfo && <BaseSkeleton className="w-4 h-4 rounded" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongCardSkeleton;