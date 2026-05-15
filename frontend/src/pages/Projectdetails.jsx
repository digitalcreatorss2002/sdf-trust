import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";

// Video Checker Helper
const isVideoFile = (url) => {
  if (!url) return false;
  // URL se query params hatane ke liye
  const cleanUrl = url.split('?')[0];
  return /\.(mp4|webm|ogg)$/i.test(cleanUrl);
};

const ProjectDetails = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 FIXED IMAGE URL HELPER: Aligned with your Bluehost folder structure
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/1200x800?text=SDF+Project";
    if (path.startsWith('http')) return path;

    // Root domain nikalna (e.g., https://hrntechsolutions.com)
    const rootDomain = ADMIN_BASE_URL.split('/backend/admin')[0].replace(/\/+$/, ""); 
    const cleanPath = path.replace(/^\/+/, ''); 
    
    // Images are in backend/admin/uploads/projects/
    return `${rootDomain}/backend/admin/${cleanPath}`;
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
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-xl font-bold text-primary animate-pulse">Loading project details...</div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-color px-4 text-center">
        <div>
          <h2 className="text-3xl font-bold mb-3 text-red-500">Project not found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/projects" className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#5a6425] transition-all">Back to Projects</Link>
        </div>
      </div>
    );
  }

  const finalMediaUrl = getImageUrl(project.image_url);

  return (
    <div className="bg-bg-color min-h-screen ">
      {/* Hero Header */}
      <section className="bg-primary text-white pt-20 pb-28 relative overflow-hidden">
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block bg-white/20 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] mb-6 backdrop-blur-md border border-white/10">
            {project.category || "General Intervention"}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-8 max-w-4xl mx-auto leading-tight drop-shadow-md">
            {project.title}
          </h1>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-xl md:text-2xl font-medium text-green-50">
              <span className="opacity-80">📍</span>
              <span className="tracking-tight">{project.location}</span>
            </div>
            {project.district && (
              <div className="flex items-center gap-2 text-sm md:text-base text-green-100/80 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                <span className="opacity-70 font-bold uppercase text-[10px]">Districts:</span>
                <span className="font-medium">{project.district}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="lg:w-2/3 flex flex-col gap-8">
            {/* Media Container */}
            <div className="relative h-80 md:h-140 rounded-3xl overflow-hidden shadow-2xl border-[6px] border-white bg-gray-100 group">
              {isVideoFile(project.image_url) ? (
                <video 
                    src={finalMediaUrl} 
                    className="w-full h-full object-cover" 
                    autoPlay loop muted playsInline controls 
                />
              ) : (
                <img 
                    src={finalMediaUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/1200x800?text=SDF+Project+Media"; }} 
                />
              )}
              <div className="absolute top-6 left-6 z-10">
                <span className={`text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-xl border border-white/20 backdrop-blur-md ${project.status === "active" ? "bg-green-600 text-white" : "bg-gray-700 text-white"}`}>
                  {project.status || "active"}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
              <h2 className="text-3xl font-serif text-text-primary mb-8 flex items-center gap-3">
                <span className="text-primary text-3xl">🌱</span> Our Intervention
              </h2>
              
              <div className="prose prose-lg text-gray-600 max-w-none mb-12 leading-relaxed">
                {project.description?.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-6">{paragraph}</p>
                ))}
              </div>

              {project.goal && (
                <div className="mt-12 mb-12 relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border border-green-100 p-10 shadow-sm overflow-hidden">
                  <div className="absolute -top-6 -right-4 p-8 opacity-5"><span className="text-[12rem] font-serif">"</span></div>
                  <div className="relative z-10 flex gap-6">
                    <div className="w-1.5 rounded-full bg-primary shrink-0 h-20"></div>
                    <div>
                      <h3 className="font-bold text-primary mb-4 tracking-widest uppercase text-[10px]">The Objective</h3>
                      <p className="text-gray-800 text-2xl font-serif italic leading-relaxed">
                        {project.goal}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {project.activities && (
                <div className="mt-16">
                  <h3 className="text-2xl font-serif text-text-primary mb-8 flex items-center gap-3 border-b pb-6 border-gray-100">
                    Key Activities & Operations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.activities.split("\n").filter(a => a.trim()).map((act, i) => (
                      <div key={i} className="bg-gray-50 border border-gray-100 p-6 rounded-2xl flex items-start gap-4 hover:bg-white hover:shadow-md transition-all">
                        <div className="mt-1 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold">✓</div>
                        <p className="text-gray-700 text-sm leading-relaxed">{act}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.achievements && (
                <div className="mt-16">
                  <h3 className="text-2xl font-serif text-text-primary mb-8 flex items-center gap-3 border-b pb-6 border-gray-100">
                    Project Milestones
                  </h3>
                  <div className="space-y-4">
                    {project.achievements.split("\n").filter(a => a.trim()).map((ach, i) => (
                      <div key={i} className="group bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:border-yellow-200 hover:bg-yellow-50/20 transition-all flex items-center gap-6">
                        <div className="bg-yellow-100 text-yellow-600 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-2xl group-hover:scale-110 transition-transform">🏆</div>
                        <p className="flex-1 leading-relaxed text-gray-800 font-medium">{ach}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          {/* Sidebar Snapshot Section Updated */}
<div className="lg:w-1/3">
  <div className="sticky top-28 flex flex-col gap-8">
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
      <h3 className="text-xl font-serif font-bold text-text-primary border-b border-gray-100 pb-5 mb-8">Snapshot</h3>
      <ul className="space-y-6">
        
        {/* State/Location */}
        <li className="flex items-start gap-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 text-lg shadow-sm">📍</div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">State</p>
            <p className="font-bold text-gray-800 leading-tight">{project.location}</p>
          </div>
        </li>

        {/* District - conditional */}
        {project.district && (
          <li className="flex items-start gap-5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 text-lg shadow-sm">🏙️</div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">District</p>
              <p className="font-bold text-gray-800 leading-tight">{project.district}</p>
            </div>
          </li>
        )}

        {/* Block - conditional */}
        {project.block && (
          <li className="flex items-start gap-5">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 text-lg shadow-sm">🏘️</div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Block</p>
              <p className="font-bold text-gray-800 leading-tight">{project.block}</p>
            </div>
          </li>
        )}

        {/* Village - conditional */}
        {project.village && (
          <li className="flex items-start gap-5">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-500 flex items-center justify-center shrink-0 text-lg shadow-sm">🏡</div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Village / Area</p>
              <p className="font-bold text-gray-800 leading-tight">{project.village}</p>
            </div>
          </li>
        )}

        {/* Beneficiaries */}
        <li className="flex items-start gap-5">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 text-xl shadow-sm">👥</div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Target Base</p>
            <p className="font-bold text-gray-800 leading-tight">{project.beneficiaries || "Community Wide"}</p>
          </div>
        </li>

        {/* Funding/Cost */}
        <li className="flex items-start gap-5">
          <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0 text-xl shadow-sm">💰</div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Funding Support</p>
            <p className="font-bold text-gray-800 leading-tight">{project.cost || "Grant Based"}</p>
          </div>
        </li>
      </ul>
    </div>

    {/* Donation CTA */}
    <div className="bg-[#233520] rounded-3xl shadow-2xl p-10 text-center relative overflow-hidden text-white group">
      <span className="text-5xl block mb-6 animate-float">🤝</span>
      <h3 className="text-2xl font-serif font-bold mb-4">Empower Our Work</h3>
      <p className="text-sm text-green-100/70 mb-10 leading-relaxed font-medium italic">"Small acts, when multiplied by millions of people, can transform the world."</p>
      <Link to="/donate" className="block w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 px-6 rounded-2xl shadow-xl transition-all hover:-translate-y-1 uppercase text-xs tracking-widest">Contribute Now</Link>
    </div>
  </div>
</div>
        </div>
      </section>

      <section className="py-20 mt-12 border-t border-gray-100 text-center">
        <Link to="/projects" className="group inline-flex items-center gap-3 text-gray-400 hover:text-primary transition-all font-black uppercase text-xs tracking-[0.2em]">
          <span className="text-2xl transition-transform group-hover:-translate-x-2">←</span> Return to Projects
        </Link>
      </section>
    </div>
  );
};

export default ProjectDetails;