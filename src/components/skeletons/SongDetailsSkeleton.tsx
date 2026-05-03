import React from 'react';
import BaseSkeleton from './BaseSkeleton';
import PianoSkeleton from './PianoSkeleton';

const SongDetailsSkeleton: React.FC = () => {
  return (
    <div className="bg-[#0a101b] min-h-screen text-white">
      {/* Header skeleton */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-4 mb-4">
          <BaseSkeleton className="w-8 h-8 rounded" />
          <BaseSkeleton className="h-8 w-64 rounded" />
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Song info skeleton */}
        <div className="text-center mb-8">
          <BaseSkeleton className="h-10 w-80 mx-auto mb-4 rounded" />
          <div className="flex justify-center gap-6 mb-6">
            <BaseSkeleton className="h-6 w-20 rounded" />
            <BaseSkeleton className="h-6 w-16 rounded" />
            <BaseSkeleton className="h-6 w-24 rounded" />
          </div>
        </div>

        {/* Current chord section */}
        <div className="text-center mb-8">
          <BaseSkeleton className="h-8 w-32 mx-auto mb-4 rounded" />
          <BaseSkeleton className="h-12 w-24 mx-auto mb-6 rounded" />
        </div>

        {/* Piano skeleton */}
        <div className="mb-8">
          <PianoSkeleton />
        </div>

        {/* Controls skeleton */}
        <div className="flex justify-center gap-4 mb-8">
          <BaseSkeleton className="w-12 h-12 rounded-full" />
          <BaseSkeleton className="w-12 h-12 rounded-full" />
          <BaseSkeleton className="w-12 h-12 rounded-full" />
          <BaseSkeleton className="w-12 h-12 rounded-full" />
        </div>

        {/* Chord progression section */}
        <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-6">
          <BaseSkeleton className="h-6 w-48 mb-6 rounded" />
          
          {/* Chord progression grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={`chord-skeleton-${index}`} className="bg-[rgba(255,255,255,0.1)] rounded-lg p-4">
                <div className="text-center mb-2">
                  <BaseSkeleton className="h-5 w-12 mx-auto rounded" />
                </div>
                
                {/* Mini piano */}
                <div className="relative h-[40px] w-full">
                  <div className="flex h-full w-full relative z-10">
                    {Array.from({ length: 7 }, (_, keyIndex) => (
                      <BaseSkeleton 
                        key={`mini-white-${keyIndex}`}
                        className={`flex-1 h-full border border-gray-600 rounded-b-sm ${keyIndex === 0 ? '' : 'border-l'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MIDI section skeleton */}
        <div className="mt-8 text-center">
          <BaseSkeleton className="h-12 w-48 mx-auto rounded" />
        </div>
      </div>
    </div>
  );
};

export default SongDetailsSkeleton;