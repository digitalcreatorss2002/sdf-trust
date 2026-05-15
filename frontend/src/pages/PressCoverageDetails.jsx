import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";

const PressCoverageDetails = () => {
  const { slug } = useParams();

  const [coverage, setCoverage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ GALLERY MODAL STATES
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔥 FIXED IMAGE URL HELPER: Aligned with Bluehost root structure
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/1200x800?text=No+Image";
    if (path.startsWith('http')) return path;

    // ADMIN_BASE_URL (https://hrntechsolutions.com/backend/admin) se root domain nikalna
    const rootDomain = ADMIN_BASE_URL.split('/backend/admin')[0].replace(/\/+$/, ""); 
    const cleanPath = path.replace(/^\/+/, ''); 
    
    // Path: domain/backend/admin/uploads/...
    return `${rootDomain}/backend/admin/${cleanPath}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchCoverage = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/press_coverage.php?t=${Date.now()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch press coverage details");
        }

        const data = await response.json();

        if (data.status !== "success") {
          throw new Error(data.message || "Could not load coverage data");
        }

        const foundCoverage = data.data.find((item) => item.slug === slug);

        if (!foundCoverage) {
          throw new Error("Coverage not found");
        }

        // ✅ HANDLE MULTIPLE IMAGES & MAIN IMAGE
        let galleryImages = [];
        try {
            // Check if images is a JSON string or array
            const rawImages = typeof foundCoverage.images === 'string' 
                ? JSON.parse(foundCoverage.images) 
                : foundCoverage.images;
            
            if (Array.isArray(rawImages) && rawImages.length > 0) {
                galleryImages = rawImages.map(img => getImageUrl(img));
            } else {
                galleryImages = [getImageUrl(foundCoverage.image_url || foundCoverage.image)];
            }
        } catch (e) {
            galleryImages = [getImageUrl(foundCoverage.image_url || foundCoverage.image)];
        }

        setCoverage({
          ...foundCoverage,
          mainImage: getImageUrl(foundCoverage.image_url || foundCoverage.image),
          images: galleryImages,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoverage();
  }, [slug]);

  const openModal = (img, index) => {
    setSelectedImage(img);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % coverage.images.length;
    setSelectedImage(coverage.images[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  const prevImage = () => {
    const prevIndex =
      (currentIndex - 1 + coverage.images.length) %
      coverage.images.length;
    setSelectedImage(coverage.images[prevIndex]);
    setCurrentIndex(prevIndex);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-bold text-primary animate-pulse">
        Loading Press Details...
      </div>
    );
  }

  if (error || !coverage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <h2 className="text-2xl text-red-500 font-bold mb-4">Error loading data</h2>
            <Link to="/media" className="text-primary underline">Back to Media</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <article className="max-w-4xl mx-auto px-4 pt-16 pb-12">
        
        {/* Meta Info */}
        <div className="flex items-center gap-3 mb-4 text-sm font-bold text-primary uppercase tracking-widest">
            <span>{coverage.tag || "Press Coverage"}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-400">{coverage.datee}</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-serif font-bold mb-8 text-gray-900 leading-tight">
            {coverage.title}
        </h1>

        {/* ✅ FEATURE IMAGE */}
        <div className="relative group mb-10 overflow-hidden rounded-2xl shadow-lg border border-gray-100">
            <img
              src={coverage.mainImage}
              alt={coverage.title}
              className="w-full h-[300px] md:h-[500px] object-cover cursor-pointer transition-transform duration-700 group-hover:scale-105"
              onClick={() => openModal(coverage.mainImage, 0)}
            />
        </div>

        {/* ✅ TEXT CONTENT */}
        <div className="prose prose-lg max-w-none mb-12">
            {(coverage.para || "").split("\n").map((p, i) => (
              <p key={i} className="mb-6 text-gray-700 leading-relaxed text-lg">
                {p}
              </p>
            ))}
        </div>

        {/* ✅ IMAGE GALLERY (If multiple images exist) */}
        {coverage.images && coverage.images.length > 1 && (
          <div className="mt-16">
            <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-1 bg-primary rounded-full"></span>
                Photo Highlights
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {coverage.images.map((img, i) => (
                <div key={i} className="aspect-video overflow-hidden rounded-xl shadow-sm border border-gray-100 group cursor-pointer" onClick={() => openModal(img, i)}>
                    <img
                        src={img}
                        alt={`Gallery ${i}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>
                ))}
            </div>
          </div>
        )}
      </article>

      {/* ✅ MODAL FOR GALLERY */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] backdrop-blur-md transition-opacity" onClick={closeModal}>
          
          {/* Close */}
          <button className="absolute top-8 right-8 text-white/70 hover:text-white text-5xl font-light z-50 transition-colors" onClick={closeModal}>&times;</button>

          {/* Prev */}
          <button className="absolute left-4 md:left-8 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full z-50 transition-all" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>

          {/* Image */}
          <div className="relative max-w-5xl max-h-[85vh] px-4" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedImage}
                className="max-w-full max-h-[80vh] object-contain rounded shadow-2xl border border-white/10"
                alt="Enlarged"
              />
              <div className="text-white/40 text-center mt-4 text-sm font-medium tracking-widest">
                  {currentIndex + 1} / {coverage.images.length}
              </div>
          </div>

          {/* Next */}
          <button className="absolute right-4 md:right-8 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full z-50 transition-all" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}

      <div className="text-center py-16 border-t border-gray-50">
        <Link to="/media" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-all font-black uppercase text-xs tracking-widest">
            <span className="text-xl">←</span> Back to Media & Stories
        </Link>
      </div>
    </div>
  );
};

export default PressCoverageDetails;