import React from 'react';
import BaseSkeleton from './BaseSkeleton';

const PianoSkeleton: React.FC = () => {
  return (
    <div className="relative h-[120px] w-full max-w-[500px] mx-auto">
      {/* White keys skeleton */}
      <div className="flex h-full w-full relative z-10">
        {Array.from({ length: 14 }, (_, index) => (
          <BaseSkeleton 
            key={`white-key-${index}`}
            className={`flex-1 h-full border border-gray-600 rounded-b-sm ${index === 0 ? '' : 'border-l'}`} 
          />
        ))}
      </div>
      
      {/* Black keys skeleton */}
      <div className="absolute top-0 left-0 h-[60%] w-full z-20 pointer-events-none">
        {Array.from({ length: 10 }, (_, index) => {
          // Calculate position for black keys (skip positions where there are no black keys)
          const blackKeyPositions = [0.65, 1.65, 3.65, 4.65, 5.65, 7.65, 8.65, 10.65, 11.65, 12.65];
          const leftPosition = (blackKeyPositions[index] / 14) * 100;
          
          return (
            <BaseSkeleton
              key={`black-key-${index}`}
              className="absolute h-full w-[6%] rounded-b-sm"
              style={{ left: `${leftPosition}%` }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PianoSkeleton;