import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";

// Video Checker Helper
const isVideoFile = (url) => {
  if (!url) return false;
  return /\.(mp4|webm|ogg)$/i.test(url);
};

const ProjectDetails = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 FIXED IMAGE URL HELPER: Matches your working Projects.js logic
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/1200x800?text=No+Image";
    if (path.startsWith('http')) return path;

    // Root domain nikalne ke liye logic
    const rootDomain = ADMIN_BASE_URL.split('/backend/admin')[0]; 
    const cleanPath = path.replace(/^\/+/, ''); 
    
    return `${rootDomain}/${cleanPath}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProject = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects.php?t=${Date.now()}`);
        if (!response.ok) throw new Error("Failed to fetch project details");
        
        const data = await response.json();
        if (data.status !== "success") throw new Error(data.message || "Could not load data");

        const foundProject = data.data.find((item) => item.slug === slug);
        if (!foundProject) throw new Error("Project not found");

        setProject(foundProject);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-color">
        <div className="text-xl font-bold text-primary animate-pulse">Loading project details...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-color px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-3 text-red-500">Project not found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/projects" className="bg-primary text-white px-6 py-3 rounded-lg">Back to Projects</Link>
        </div>
      </div>
    );
  }

  const finalMediaUrl = getImageUrl(project.image_url);

  return (
    <div className="bg-bg-color min-h-screen ">
      {/* Hero Header */}
      <section className="bg-primary text-white pt-20 pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 backdrop-blur-sm">
            {project.category}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-8 max-w-4xl mx-auto leading-tight drop-shadow-sm">
            {project.title}
          </h1>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-xl md:text-2xl font-medium text-green-50">
              <span className="opacity-80">📍</span>
              <span>{project.location}</span>
            </div>
            {project.district && (
              <div className="flex items-center gap-2 text-base md:text-lg text-green-100/80 bg-white/10 px-4 py-1 rounded-full border border-white/10">
                <span className="text-sm opacity-70">District:</span>
                <span className="font-semibold">{project.district}</span>
              </div>
            )}
            {project.village && (
              <div className="flex items-center gap-2 text-sm md:text-base text-green-200/70 italic">
                <span>🏠</span>
                <span>Village/Area: {project.village}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="lg:w-2/3 flex flex-col gap-8">
            <div className="relative h-80 md:h-125 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-gray-200 flex items-center justify-center">
              {isVideoFile(project.image_url) ? (
                <video src={finalMediaUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline controls />
              ) : (
                <img src={finalMediaUrl} alt={project.title} className="w-full h-full object-cover" 
                  onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/1200x800?text=Image+Not+Found"; }} />
              )}
              <div className="absolute top-4 left-4 z-10">
                <span className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md ${project.status === "active" ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}>
                  Status: {project.status || "active"}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
              <h2 className="text-3xl font-serif text-text-primary mb-6 flex items-center gap-3">
                <span className="text-primary text-2xl">⚡</span> About the Project
              </h2>
              <div className="prose prose-lg text-gray-600 max-w-none">
                {project.description?.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-5 leading-relaxed">{paragraph}</p>
                ))}
              </div>
              {project.goal && (
                <div className="mt-12 mb-4 relative bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-8 shadow-sm overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10"><span className="text-8xl font-serif">"</span></div>
                  <div className="relative z-10 flex gap-4">
                    <div className="w-1.5 rounded-full bg-primary shrink-0"></div>
                    <div>
                      <h3 className="font-serif text-primary font-bold mb-3 tracking-wide uppercase text-sm">Project Goal</h3>
                      <p className="text-gray-800 text-xl font-serif italic leading-relaxed">{project.goal}</p>
                    </div>
                  </div>
                </div>
              )}
              {project.activities && (
                <div className="mt-12">
                  <h3 className="text-2xl font-serif text-text-primary mb-6 flex items-center gap-3 border-b pb-4 border-gray-100">Key Activities</h3>
                  <div className="flex flex-col gap-4">
                    {project.activities.split("\n").filter(a => a.trim()).map((act, i) => (
                      <div key={i} className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm flex items-start gap-4">
                        <div className="mt-1 bg-green-100 text-primary w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold">✓</div>
                        <p className="text-gray-700 leading-relaxed flex-1">{act}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {project.achievements && (
                <div className="mt-12 mb-4">
                  <h3 className="text-2xl font-serif text-text-primary mb-6 flex items-center gap-3 border-b pb-4 border-gray-100">Major Achievements</h3>
                  <div className="space-y-4">
                    {project.achievements.split("\n").filter(a => a.trim()).map((ach, i) => (
                      <div key={i} className="group relative bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:bg-yellow-50/30 transition-all flex items-center gap-5">
                        <div className="bg-yellow-100 text-yellow-600 w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xl">🏆</div>
                        <p className="flex-1 leading-relaxed text-gray-700 font-medium">{ach}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-28 flex flex-col gap-6">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
                <h3 className="text-xl font-serif font-bold text-text-primary border-b border-gray-100 pb-4 mb-6">Project Overview</h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 text-lg">📍</div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Location</p>
                      <p className="font-medium text-gray-800">{project.location}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0 text-lg">🏷️</div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Category</p>
                      <p className="font-medium text-gray-800">{project.category}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 text-lg">📊</div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Current Status</p>
                      <p className="font-medium text-gray-800 capitalize">{project.status || "Active"}</p>
                    </div>
                  </li>
                  {project.beneficiaries && (
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 text-lg">👥</div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Beneficiaries</p>
                        <p className="font-medium text-gray-800">{project.beneficiaries}</p>
                      </div>
                    </li>
                  )}
                  {project.cost && (
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0 text-lg">💰</div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Total Cost</p>
                        <p className="font-medium text-gray-800">{project.cost}</p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
              <div className="bg-[#233520] rounded-2xl shadow-lg p-8 text-center relative overflow-hidden text-white">
                <span className="text-4xl block mb-4">🤝</span>
                <h3 className="text-2xl font-serif font-bold mb-3">Support Our Cause</h3>
                <p className="text-sm text-green-100 mb-8 opacity-90 leading-relaxed">Your contribution helps us expand projects like this and reach more beneficiaries.</p>
                <Link to="/donate" className="block w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3.5 px-4 rounded-xl shadow-md transition-all">Donate to Initiative</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 mt-8 border-t border-gray-100 text-center">
        <Link to="/projects" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold tracking-wide">
          <span className="text-xl">←</span> Return to Ongoing Projects
        </Link>
      </section>
    </div>
  );
};

export default ProjectDetails;