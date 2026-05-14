import { useEffect, useState } from "react";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";

const PROJECTS_API = `${API_BASE_URL}/projects.php`;

const ProjectSlider = () => {
  const [projects, setProjects] = useState([]);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH PROJECTS
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // This forces the browser to fetch fresh data from the database every time
const res = await fetch(`${PROJECTS_API}?t=${new Date().getTime()}`);
        const data = await res.json();

        if (data.status === "success") {
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
    }, 5000);

    return () => clearInterval(interval);
  }, [projects]);

  // 🔥 YOUTUBE VIDEO FORMATTER
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com/embed/")) return url;

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
  };

  // 🔥 LOCAL VIDEO CHECKER
  const isLocalVideo = (url) => {
    if (!url) return false;
    return /\.(mp4|webm|ogg)$/i.test(url);
  };

  if (loading) {
    return (
      <div className="text-center py-20 bg-[#F3EFE4]">
        <p className="text-xl">Loading projects...</p>
      </div>
    );
  }

  if (!projects.length) return null;

  const project = projects[index];
  const youtubeSrc = getEmbedUrl(project.youtube); // Assuming you have a youtube column, else ignore
  
  // Format the media URL securely
  const mediaUrl = project.image_url 
    ? `${ADMIN_BASE_URL}${project.image_url.replace(/^\/+/, '')}` 
    : "/banner/fallback.jpg";

  const isVideoFile = isLocalVideo(project.image_url);

  return (
    <section
      className="py-24 relative overflow-hidden bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')", 
      }}
    >
      {/* STUNNING GLASS OVERLAY */}
      <div className="absolute inset-0 bg-linear-to-br from-[#233520]/80 via-black/60 to-[#6a752b]/80 backdrop-blur-[2px]"></div>

      <div className="relative max-w-7xl mx-auto px-4">

        <h2 className="text-4xl font-serif text-center mb-16 text-white drop-shadow-xl font-bold tracking-wide">
          Ongoing Projects
        </h2>

        {/* SLIDER */}
        <div
          className={`bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2 min-h-112.5 transition-all duration-700 ${
            animate
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-10"
          }`}
        >

          {/* LEFT */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <span className="text-sm font-bold text-[#6a752b] uppercase mb-3">
              {project.category}
            </span>

            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {project.title}
            </h3>

            <p className="text-gray-600 mb-6 line-clamp-4">
              {project.description}
            </p>

            <div className="text-gray-500 mb-6">
              📍 {project.location}
            </div>

            <a
              href={`/projectdetails/${project.slug}`}
              className="inline-block bg-[#6a752b] text-white px-8 py-3 rounded-full"
            >
              View Details →
            </a>
          </div>

          {/* RIGHT */}
          <div className="relative h-75 md:h-auto bg-black">
            {youtubeSrc ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={youtubeSrc}
                title={project.title}
                allowFullScreen
              />
            ) : isVideoFile ? (
              <video
                src={mediaUrl}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={mediaUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

        </div>

        {/* DOTS */}
        <div className="flex justify-center mt-8 gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setAnimate(false);
                setTimeout(() => {
                  setIndex(i);
                  setAnimate(true);
                }, 100);
              }}
              className={`h-2 rounded-full transition-all ${
                index === i ? "w-8 bg-white" : "w-2 bg-gray-400"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProjectSlider;