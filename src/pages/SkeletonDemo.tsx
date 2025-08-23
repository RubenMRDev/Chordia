import React, { useState } from 'react';
import { 
  SongGridSkeleton, 
  SongDetailsSkeleton, 
  ChordProgressionSkeleton, 
  PianoSkeleton 
} from '../components/skeletons';

const SkeletonDemo: React.FC = () => {
  const [currentDemo, setCurrentDemo] = useState('song-grid');

  const demos = [
    { id: 'song-grid', name: 'Song Library Grid', component: <SongGridSkeleton count={8} /> },
    { id: 'admin-grid', name: 'Admin Song Management', component: <SongGridSkeleton count={6} showUserInfo={true} /> },
    { id: 'song-details', name: 'Song Details', component: <SongDetailsSkeleton /> },
    { id: 'chord-progression', name: 'Chord Progression', component: <ChordProgressionSkeleton chordCount={6} /> },
    { id: 'piano', name: 'Piano Component', component: <div className="p-8"><PianoSkeleton /></div> },
  ];

  return (
    <div className="min-h-screen bg-[#0a101b] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Skeleton Loading States Demo</h1>
          <p className="text-gray-400 mb-8">Enhanced user experience with shimmer loading animations</p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {demos.map((demo) => (
              <button
                key={demo.id}
                onClick={() => setCurrentDemo(demo.id)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  currentDemo === demo.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {demo.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#0f1419] rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {demos.find(d => d.id === currentDemo)?.name}
          </h2>
          
          <div>
            {demos.find(d => d.id === currentDemo)?.component}
          </div>
        </div>

        <div className="mt-8 bg-[#0f1419] rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Features:</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• <strong>Shimmer Animation:</strong> Smooth gradient animation across loading elements</li>
            <li>• <strong>Structural Consistency:</strong> Skeletons match the exact layout of loaded content</li>
            <li>• <strong>Responsive Design:</strong> Adapts to different screen sizes like the real components</li>
            <li>• <strong>User Experience:</strong> Users see content structure immediately, reducing perceived loading time</li>
            <li>• <strong>Component Variety:</strong> Different skeletons for song cards, piano interface, and chord progressions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SkeletonDemo;