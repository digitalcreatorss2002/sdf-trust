import { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from "react-router-dom";
import { API_BASE_URL, ADMIN_BASE_URL } from '../config';
 
import { motion } from 'framer-motion';

const MediaAndStories = () => {
  const [activeTab, setActiveTab] = useState('photos');
  const location = useLocation(); 
  
  // 🔥 NEW CONTINUOUS GALLERY MODAL STATES
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // States for Photos
  const [medias, setMedias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // States for Videos
  const [videos, setVideos] = useState([]);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState(null);

  // States for Press
  const [pressCov, setPressCov] = useState([]);
  const [isPressLoading, setIsPressLoading] = useState(true);

  // Handle URL hash navigation (e.g., /media#videos)
  useEffect(() => {
    if (location.hash) {
      const targetTab = location.hash.replace('#', '');
      
      setTimeout(() => {
        setActiveTab(targetTab);
      }, 0);

      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.hash]);

  // 1. Fetch Photos from Database
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/media.php?t=${Date.now()}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setMedias(data.data);
        } else {
          setError(data.message || 'Failed to fetch photos');
        }
       
      } catch (err) {
        setError('Could not connect to the database API. Check if your PHP server is running.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
  }, []);

  // 2. Fetch Videos from Database
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/videos.php?t=${Date.now()}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setVideos(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch videos', err);
      } finally {
        setIsVideoLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // 3. Fetch Press Coverage from Database
  useEffect(() => {
    const fetchPressCoverage = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/press_coverage.php?t=${Date.now()}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setPressCov(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch press coverage', err);
      } finally {
        setIsPressLoading(false);
      }
    };

    fetchPressCoverage();
  }, []);

  // Helper function to turn normal YouTube links into playable embedded links
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${ADMIN_BASE_URL}${path.replace(/^\/+/, "")}`;
  };

  // 🔥 Gallery Navigation Handlers
  const handlePrevPhoto = useCallback((e) => {
    e?.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev === 0 ? medias.length - 1 : prev - 1));
  }, [medias.length]);

  const handleNextPhoto = useCallback((e) => {
    e?.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev === medias.length - 1 ? 0 : prev + 1));
  }, [medias.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPhotoModalOpen) return;
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'Escape') setIsPhotoModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPhotoModalOpen, handlePrevPhoto, handleNextPhoto]);

  // Press Coverage states have been defined via useState above

  return (
    <div className="bg-white min-h-screen relative">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Media & Stories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl max-w-3xl mx-auto"
          >
            Discover the stories of change, our latest news, and the visual journey of our impact.
          </motion.p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="border-b border-gray-200 sticky top-20 bg-white z-40">
        <div className="max-w-xl mx-auto px-4 justify-center">
          <div className="flex overflow-x-auto hide-scrollbar space-x-8 ">
            {[
              { id: 'photos', label: 'Photo Gallery', icon: '📸' },
              { id: 'videos', label: 'Video Gallery', icon: '🎥' },
              { id: 'press', label: 'Press Coverage', icon: '🗞️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 whitespace-nowrap font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Area */}
      <section className="py-12 px-4 bg-gray-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto">

          {/* Photo Gallery */}
          {activeTab === 'photos' && (
            <motion.div
              id="photos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {isLoading ? (
                <div className="col-span-full py-12 text-center text-gray-500 flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  Loading photos...
                </div>
              ) : error ? (
                <div className="col-span-full py-8 px-6 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center">
                  ⚠️ {error}
                </div>
              ) : medias.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No active photos found at the moment.
                </div>
              ) : (
                medias.map((media, idx) => (
                  <div 
                    key={media.id} 
                    className="aspect-square bg-gray-200 rounded-xl overflow-hidden relative group cursor-pointer"
                    onClick={() => {
                      setCurrentPhotoIndex(idx);
                      setIsPhotoModalOpen(true);
                    }}
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-gray-300 to-gray-200 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform duration-500">
                      <img src={getImageUrl(media.image_url)} alt={media.title || 'Gallery Image'} className='w-full h-full object-cover' />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">View Gallery</span>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* Video Gallery */}
          {activeTab === 'videos' && (
            <motion.div
              id="videos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {isVideoLoading ? (
                <div className="col-span-full py-12 text-center text-gray-500 flex flex-col items-center">
                   <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                   Loading videos...
                </div>
              ) : videos.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No videos found. Check back later!
                </div>
              ) : (
                videos.map((video) => (
                  <a 
                    key={video.id}
                    href={video.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                    onMouseEnter={() => setPlayingVideoId(video.id)}
                    onMouseLeave={() => setPlayingVideoId(null)}
                  >
                    <div className="aspect-video bg-gray-900 relative">
                      
                      {playingVideoId === video.id ? (
                        <iframe
                          src={`${getYouTubeEmbedUrl(video.video_url)}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&disablekb=1`}
                          title={video.title}
                          className="absolute inset-0 w-full h-full pointer-events-none"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        ></iframe>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img 
                            src={getImageUrl(video.image_url)} 
                            alt={video.title} 
                            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300" 
                          />
                          
                          <div className="absolute w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg group-hover:bg-[#6a752b] group-hover:scale-110 transition-all duration-300 z-10">
                            <svg 
                              className="w-8 h-8 text-white ml-1" 
                              fill="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}

                    </div>
                    <div className="p-4 border-t border-gray-100 relative z-10 bg-white">
                      <h3 className="font-bold text-text-primary mb-1 line-clamp-2">{video.title}</h3>
                      <p className="text-xs text-gray-500">
                        {video.duration ? `${video.duration} • ` : ''} {video.views} views
                      </p>
                    </div>
                  </a>
                ))
              )}
            </motion.div>
          )}

          {/* Press Coverage */}
          {activeTab === 'press' && (
            <motion.div
              id="press"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              {isPressLoading ? (
                <div className="py-12 text-center text-gray-500 flex flex-col items-center">
                   <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                   Loading press coverage...
                </div>
              ) : pressCov.length === 0 ? (
                <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No press coverage found at the moment.
                </div>
              ) : (
                pressCov.map(item => (
                  <Link key={item.id} to={`/press-coverage/${item.slug}`} className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="md:w-48 h-32 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 shrink-0 overflow-hidden">
                      <div className="group-hover:scale-105 transition-transform w-full h-full">
                        <img src={getImageUrl(item.image_url || item.image)} alt="" className='w-full h-full object-cover' />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">{item.tag || "Press coverage"}</span>
                        <span className="text-gray-400 text-sm">• {item.datee}</span>
                      </div>
                      <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {item.para}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </motion.div>
          )}
          
        </div>
      </section>

      {/* 🔥 THE CONTINUOUS GALLERY MODAL */}
      {isPhotoModalOpen && medias.length > 0 && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-md transition-opacity"
          onClick={() => setIsPhotoModalOpen(false)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white text-4xl font-light transition-colors z-50"
            onClick={() => setIsPhotoModalOpen(false)}
          >
            &times;
          </button>

          {/* Main Image Container */}
          <div className="relative flex items-center justify-center w-full max-w-5xl flex-1 max-h-[75vh]">
            
            {/* Prev Button */}
            {medias.length > 1 && (
              <button 
                onClick={handlePrevPhoto}
                className="absolute left-0 md:-left-12 text-white/50 hover:text-white bg-black/20 hover:bg-black/50 p-4 rounded-full backdrop-blur-sm transition-all z-50"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
            )}

            <motion.img 
              key={currentPhotoIndex} // forces animation on change
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={getImageUrl(medias[currentPhotoIndex].image_url)} 
              alt="Gallery Image" 
              className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
              onClick={(e) => e.stopPropagation()} 
            />

            {/* Next Button */}
            {medias.length > 1 && (
              <button 
                onClick={handleNextPhoto}
                className="absolute right-0 md:-right-12 text-white/50 hover:text-white bg-black/20 hover:bg-black/50 p-4 rounded-full backdrop-blur-sm transition-all z-50"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            )}
          </div>

          {/* Thumbnails (Shows ALL images in the gallery) */}
          {medias.length > 1 && (
            <div 
              className="w-full max-w-4xl mt-6 flex gap-2 overflow-x-auto py-2 custom-scrollbar justify-start md:justify-center px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {medias.map((media, idx) => (
                <button
                  key={media.id}
                  onClick={() => setCurrentPhotoIndex(idx)}
                  className={`relative shrink-0 h-16 md:h-20 aspect-square rounded-md overflow-hidden transition-all duration-300 ${
                    currentPhotoIndex === idx ? 'ring-2 ring-white scale-105 opacity-100' : 'opacity-40 hover:opacity-100'
                  }`}
                >
                  <img src={getImageUrl(media.image_url)} className="w-full h-full object-cover" alt={`Thumb ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}

          {/* Counter text */}
          {medias.length > 1 && (
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium tracking-widest">
               {currentPhotoIndex + 1} / {medias.length}
             </div>
          )}

        </div>
      )}
    </div>
  );
};

export default MediaAndStories;