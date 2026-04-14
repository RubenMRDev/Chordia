import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { FaMusic, FaPlay, FaUser, FaRandom, FaClock } from 'react-icons/fa';
import { useSongsWithUserData } from '../hooks/useSongsWithUserData';

type SortMethod = 'recent' | 'random';

const DiscoverPage: React.FC = () => {
  const { songs: allSongs, loading } = useSongsWithUserData();
  const [sortMethod, setSortMethod] = useState<SortMethod>('recent');
  const [animationsReady, setAnimationsReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimationsReady(false);
    const timer = setTimeout(() => {
      setAnimationsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [allSongs]);

  const sortSongs = (songsToSort: typeof allSongs, method: SortMethod) => {
    switch (method) {
      case 'recent':
        return [...songsToSort].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'random':
        return [...songsToSort].sort(() => Math.random() - 0.5);
      default:
        return songsToSort;
    }
  };

  const songs = sortSongs(allSongs, sortMethod);

  const handleSortChange = (method: SortMethod) => {
    setSortMethod(method);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAnimationDelay = (index: number): string => {
    return `${index * 100}ms`;
  };

  return (
    <div className="bg-[#0c141c] min-h-screen text-white">
      <Header />
      <div className="p-4 md:p-8">
        <h1 className="text-2xl md:text-4xl text-[#04e073] mb-8 text-center font-bold">
          Discover Music From All Users
        </h1>
        <div className="flex justify-center mb-8 gap-4 flex-wrap">
          <button
            onClick={() => handleSortChange('recent')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border-none cursor-pointer ${
              sortMethod === 'recent' 
                ? 'bg-[#04e073] text-black' 
                : 'bg-[#1e2638] text-white hover:bg-[#2a324d]'
            } transition-colors`}
          >
            <FaClock /> Most Recent
          </button>
          <button
            onClick={() => handleSortChange('random')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border-none cursor-pointer ${
              sortMethod === 'random' 
                ? 'bg-[#04e073] text-black' 
                : 'bg-[#1e2638] text-white hover:bg-[#2a324d]'
            } transition-colors`}
          >
            <FaRandom /> Random
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8">
            <p>Loading songs...</p>
          </div>
        ) : songs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-300 text-lg">
              No hay canciones disponibles en este momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {songs.map((song, index) => (
              <div 
                key={song.id}
                className={`bg-[#162032] rounded-lg overflow-hidden cursor-pointer shadow-md hover:-translate-y-[1px] transition-transform duration-200 border border-[#1e293b] opacity-0 translate-y-8 ${animationsReady ? 'animate-slide-in' : ''}`}
                onClick={() => navigate(`/song/${song.id}`)}
                style={{ animationDelay: getAnimationDelay(index) }}
              >
                <div className="text-[#04e073] p-3 border-b border-[#1e293b] flex items-center">
                  <FaUser className="mr-2" />
                  <span>{song.username}</span>
                </div>
                <div className="relative h-40 bg-[#11192a] flex items-center justify-center p-4">
                  <div className="w-24 h-24 border-2 border-[#04e073] rounded-full flex items-center justify-center bg-[#0c141c] shadow-inner">
                    <FaMusic className="text-4xl text-[#04e073]" />
                  </div>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/song/${song.id}`);
                    }}
                    className="absolute bottom-4 right-4 bg-[#04e073] text-black w-12 h-12 rounded-full flex items-center justify-center border-none cursor-pointer hover:bg-[#03d069] transition-colors shadow-md"
                  >
                    <FaPlay />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-xl mb-2 truncate font-medium text-gray-100">{song.title}</h3>
                  <div className="text-gray-300 text-sm mb-4 flex flex-wrap gap-4">
                    <div className="px-2 py-1 rounded bg-[#1e2638] inline-block">Key: {song.key}</div>
                    <div className="px-2 py-1 rounded bg-[#1e2638] inline-block">{song.timeSignature}</div>
                    <div className="px-2 py-1 rounded bg-[#1e2638] inline-block">{song.tempo} BPM</div>
                  </div>
                  <div className="text-gray-400 text-sm flex items-center gap-2">
                    <span>Created: {formatDate(song.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Link to="/dashboard" className="inline-block bg-[#04e073] text-black py-3 px-6 rounded-md no-underline font-bold hover:bg-[#03c664] transition-colors shadow-md">
            Volver al Dashboard
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.6s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default DiscoverPage;