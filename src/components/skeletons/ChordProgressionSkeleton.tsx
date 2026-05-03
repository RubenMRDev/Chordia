import React from 'react';
import BaseSkeleton from './BaseSkeleton';

interface ChordProgressionSkeletonProps {
  chordCount?: number;
}

const ChordProgressionSkeleton: React.FC<ChordProgressionSkeletonProps> = ({ chordCount = 4 }) => {
  return (
    <div className="space-y-4">
      {/* Title skeleton */}
      <BaseSkeleton className="h-6 w-48 rounded mb-6" />
      
      {/* Chord progression grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: chordCount }, (_, index) => (
          <div key={`chord-${index}`} className="bg-[#1a223a] rounded-lg p-4">
            {/* Chord name */}
            <BaseSkeleton className="h-5 w-16 rounded mb-3" />
            
            {/* Mini piano skeleton */}
            <div className="relative h-[50px] w-full mb-3">
              {/* White keys */}
              <div className="flex h-full w-full relative z-10">
                {Array.from({ length: 7 }, (_, keyIndex) => (
                  <BaseSkeleton 
                    key={`mini-white-${keyIndex}`}
                    className={`flex-1 h-full border border-gray-600 rounded-b-sm ${keyIndex === 0 ? '' : 'border-l'}`} 
                  />
                ))}
              </div>
              
              {/* Black keys */}
              <div className="absolute top-0 left-0 h-[65%] w-full z-20 pointer-events-none">
                {Array.from({ length: 5 }, (_, keyIndex) => {
                  const blackKeyPositions = [0.65, 1.65, 3.65, 4.65, 5.65];
                  const leftPosition = (blackKeyPositions[keyIndex] / 7) * 100;
                  
                  return (
                    <BaseSkeleton
                      key={`mini-black-${keyIndex}`}
                      className="absolute h-full w-[12%] rounded-b-sm"
                      style={{ left: `${leftPosition}%` }}
                    />
                  );
                })}
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-2">
              <BaseSkeleton className="h-8 flex-1 rounded" />
              <BaseSkeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChordProgressionSkeleton;