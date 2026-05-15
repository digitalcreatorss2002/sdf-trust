import { useEffect, useState } from "react";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";

const PROJECTS_API = `${API_BASE_URL}/projects.php`;

const ProjectSlider = () => {
  const [projects, setProjects] = useState([]);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [loading, setLoading] = useState(true);

  // 🔥 FIXED IMAGE URL HELPER: Matches your Bluehost structure logic
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/800x500?text=SDF+Project"; 
    if (path.startsWith('http')) return path;

    // Root domain nikalne ke liye logic (e.g., https://hrntechsolutions.com)
    const rootDomain = ADMIN_BASE_URL.split('/backend/admin')[0].replace(/\/+$/, ""); 
    const cleanPath = path.replace(/^\/+/, ''); 
    
    // Images are in backend/admin/uploads/projects/ usually
    // Using the common pattern we fixed in other components
    return `${rootDomain}/backend/admin/${cleanPath}`;
  };

  // 🔥 FETCH PROJECTS
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${PROJECTS_API}?t=${new Date().getTime()}`);
        const data = await res.json();

        if (data.status === "success") {
          // Filtering only active or featured if needed, otherwise all
          setProjects(data.data);
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // 🔥 AUTO SLIDE
  useEffect(() => {
    if (!projects || projects.length <= 1) return;

    const interval = setInterval(() => {
      setAnimate(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % projects.length);
        setAnimate(true);
      }, 500);
    }, 6000); // 6 seconds for better reading time

    return () => clearInterval(interval);
  }, [projects]);

  // 🔥 YOUTUBE VIDEO FORMATTER
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com/embed/")) return url;

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&loop=1&playlist=${match[2]}`;
    }
    return null;
  };

  // 🔥 LOCAL VIDEO CHECKER
  const isLocalVideo = (url) => {
    if (!url) return false;
    const cleanUrl = url.split('?')[0];
    return /\.(mp4|webm|ogg)$/i.test(cleanUrl);
  };

  if (loading) {
    return (
      <div className="text-center py-20 bg-[#F3EFE4]">
        <div className="w-10 h-10 border-4 border-[#6a752b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl font-serif">Loading ongoing projects...</p>
      </div>
    );
  }

  if (!projects.length) return null;

  const project = projects[index];
  const youtubeSrc = getEmbedUrl(project.youtube); 
  const mediaUrl = getImageUrl(project.image_url);
  const isVideoFile = isLocalVideo(project.image_url);

  return (
    <section
      className="py-24 relative overflow-hidden bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1920')", 
      }}
    >
      {/* GLASS OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#233520]/90 via-black/70 to-[#6a752b]/80 backdrop-blur-[2px]"></div>

      <div className="relative max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-serif text-center mb-16 text-white drop-shadow-xl font-bold tracking-wide">
          Our Impact Projects
        </h2>

        {/* SLIDER CONTAINER */}
        <div
          className={`bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2 min-h-[450px] transition-all duration-700 ease-in-out ${
            animate ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {/* LEFT CONTENT */}
          <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
            <span className="inline-block text-xs font-black text-[#6a752b] uppercase tracking-widest mb-4 bg-[#6a752b]/10 px-3 py-1 rounded-full w-fit">
              {project.category || "Development"}
            </span>

            <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-gray-900 leading-tight">
              {project.title}
            </h3>

            <p className="text-gray-600 mb-6 line-clamp-4 leading-relaxed">
              {project.description}
            </p>

            <div className="flex items-center gap-2 text-gray-500 font-bold text-sm mb-8">
              <span className="text-xl">📍</span> {project.location}
            </div>

            <a
              href={`/projectdetails/${project.slug}`}
              className="inline-block bg-[#6a752b] hover:bg-[#5a6425] text-white px-10 py-3.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg text-center self-start"
            >
              Explore Project →
            </a>
          </div>

          {/* RIGHT MEDIA */}
          <div className="relative h-64 md:h-auto bg-gray-900 overflow-hidden">
            {youtubeSrc ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={youtubeSrc}
                title={project.title}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : isVideoFile ? (
              <video
                key={mediaUrl}
                src={mediaUrl}
                className="w-full h-full object-cover"
                autoPlay loop muted playsInline
              />
            ) : (
              <img
                key={mediaUrl}
                src={mediaUrl}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-110"
                onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/800x600?text=SDF+Project+Image"; }}
              />
            )}
            {/* Visual indicator for media */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full">
              {youtubeSrc || isVideoFile ? "🎥" : "🖼️"}
            </div>
          </div>
        </div>

        {/* PROGRESS DOTS */}
        <div className="flex justify-center mt-12 gap-3">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if(index === i) return;
                setAnimate(false);
                setTimeout(() => {
                  setIndex(i);
                  setAnimate(true);
                }, 100);
              }}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                index === i ? "w-12 bg-white" : "w-2.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectSlider;