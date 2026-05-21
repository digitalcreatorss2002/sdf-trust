import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";
import "leaflet/dist/leaflet.css";
import MapSection from "../components/MapSection";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";

// Video Checker Helper
const isVideoFile = (url) => {
  if (!url) return false;
  const cleanUrl = url.split('?')[0];
  return /\.(mp4|webm|ogg)$/i.test(cleanUrl);
};

const Projects = () => {
  const location = useLocation();
  const scrollRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState("all");
  const [selectedMapState, setSelectedMapState] = useState(null);
  const [mapTotals, setMapTotals] = useState({
      totalStates: 12,
      totalDistricts: "45+",
      totalProjects: "15+",
      totalBeneficiaries: "2M+"
  });

  // Category state under dynamic dynamic listings - defaults to null to show all projects initially
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 🔥 UPDATED IMAGE URL HELPER: Aligned with Bluehost backend/admin/uploads structure
  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/600x400?text=No+Media";
    
    if (path.startsWith('http')) return path;

    // ADMIN_BASE_URL (https://hrntechsolutions.com/backend/admin) se root nikalna
    const rootDomain = ADMIN_BASE_URL.split('/backend/admin')[0].replace(/\/+$/, ""); 
    
    // Path clean karna (shuruat ke slashes hatana)
    const cleanPath = path.replace(/^\/+/, ""); 
    
    // Final URL: Root + backend/admin + uploads path
    return `${rootDomain}/backend/admin/${cleanPath}`;
  };

  const formatCompact = (num) => {
      if (!num) return "0";
      if (typeof num === "string" && num.includes("+")) return num;
      return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
  };

  const mapRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: mapRef,
    offset: ["start 90%", "center center"],
  });

  const mapScale = useTransform(scrollYProgress, [0, 0.7, 1], [0.6, 0.85, 1]);

  const mapClipPercentage = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    [40, 60, 150],
  );

  const mapClipPath = useMotionTemplate`circle(${mapClipPercentage}% at 50% 50%)`;

  const stateStaticData = {
    "Andhra Pradesh": { image: "map/AndhraPradesh.jpg", livesImpacted: "800k+" },
    "Arunachal Pradesh": { image: "map/ArunachalPradesh.jpg", livesImpacted: "50k+" },
    "Assam": { image: "map/Assam.jpg", livesImpacted: "200k+" },
    "Bihar": { image: "map/Bihar.jpg", livesImpacted: "1M+" },
    "Chhattisgarh": { image: "map/Chhattisgarh.jpg", livesImpacted: "300k+" },
    "Goa": { image: "map/Goa.jpg", livesImpacted: "20k+" },
    "Gujarat": { image: "map/Gujarat.jpg", livesImpacted: "600k+" },
    "Haryana": { image: "map/Haryana.jpg", livesImpacted: "400k+" },
    "Himachal Pradesh": { image: "map/Himachal Pradesh.jpg", livesImpacted: "150k+" },
    "Jharkhand": { image: "map/Jharkhand.jpg", livesImpacted: "500k+" },
    "Karnataka": { image: "map/Karnataka.jpg", livesImpacted: "750k+" },
    "Kerala": { image: "map/Kerala.jpg", livesImpacted: "300k+" },
    "Madhya Pradesh": { image: "map/Madhya Pradesh.jpg", livesImpacted: "1.2M+" },
    "Maharashtra": { image: "map/Maharashtra.jpg", livesImpacted: "2M+" },
    "Manipur": { image: "map/Manipur.jpg", livesImpacted: "40k+" },
    "Meghalaya": { image: "map/Meghalaya.jpg", livesImpacted: "60k+" },
    "Mizoram": { image: "map/Mizoram.jpg", livesImpacted: "30k+" },
    "Nagaland": { image: "map/Nagaland.jpg", livesImpacted: "45k+" },
    "Odisha": { image: "map/Odisha.jpg", livesImpacted: "900k+" },
    "Punjab": { image: "map/Punjab.jpg", livesImpacted: "400k+" },
    "Rajasthan": { image: "map/Rajasthan.jpg", livesImpacted: "1.1M+" },
    "Sikkim": { image: "map/Sikkim.jpg", livesImpacted: "25k+" },
    "Tamil Nadu": { image: "map/TamilNadu.jpg", livesImpacted: "850k+" },
    "Telangana": { image: "map/Telangana.jpg", livesImpacted: "600k+" },
    "Tripura": { image: "map/Tripura.jpg", livesImpacted: "70k+" },
    "Uttar Pradesh": { image: "map/Uttar Pradesh.jpg", livesImpacted: "2.5M+" },
    "Uttarakhand": { image: "map/Uttarakhand.jpg", livesImpacted: "200k+" },
    "West Bengal": { image: "map/WestBengal.jpg", livesImpacted: "1.3M+" },
    "Jammu and Kashmir": { image: "map/Jammu and Kashmir.png", livesImpacted: "100k+" },
  };

  useEffect(() => {
    if (location.hash) {
      const tab = decodeURIComponent(location.hash.replace("#", ""));
      if (tab === "all" || tab === "ongoing") {
        setActiveTab("all");
      } else if (tab === "completed") {
        setActiveTab("completed");
      } else if (tab === "planned") {
        setActiveTab("planned");
      } else if (tab === "listings") {
        setActiveTab("listings");
      } else {
        setActiveTab("all");
      }
    } else {
      setActiveTab("all");
    }
  }, [location.hash]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects.php?t=${Date.now()}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setProjects(data.data);
        } else {
          setError(data.message || 'Failed to fetch projects');
        }
      } catch (err) {
        setError('Could not connect to the database API.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [location.hash]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollAmount = 300;
      const scrollTo = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  // Dynamically pulls unique categories from backend projects
  const uniqueCategories = [
    ...new Set(projects.map((p) => p.category?.trim()).filter(Boolean)),
  ];

  const uniqueStates = [
    ...new Set(projects.flatMap(p => {
      let states = [];
      try {
         const locs = JSON.parse(p.state_locations || "[]");
         states = locs.map(l => l.state?.trim());
      } catch(e) {}
      if (states.length === 0 && p.location) {
         states = p.location.split(',').map(s => s.trim());
      }
      return states;
    }).filter(Boolean))
  ].sort();

  const [activeState, setActiveState] = useState(null);

  useEffect(() => {
    if (uniqueStates.length > 0 && !activeState) {
        setActiveState(uniqueStates[0]);
    }
  }, [uniqueStates, activeState]);

  const formatTabLabel = (label) => {
    return label.replace(/[_-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Calculate dynamic completed projects counts directly from the array for global snapshot view
  const globalCompletedCount = projects.filter(p => p.status?.toLowerCase() === 'completed').length;

  // Exact conditional schema validation logic aligned with dynamic tabs
  let displayProjects = [];
  if (activeTab === "all") {
      displayProjects = projects.filter((p) => p.status?.toLowerCase() === 'active' || p.status?.toLowerCase() === 'ongoing');
      if (selectedCategory) {
          displayProjects = displayProjects.filter((p) => p.category?.trim() === selectedCategory);
      }
  } else if (activeTab === "completed") {
      displayProjects = projects.filter((p) => p.status?.toLowerCase() === 'completed');
      if (selectedCategory) {
          displayProjects = displayProjects.filter((p) => p.category?.trim() === selectedCategory);
      }
  } else if (activeTab === "planned") {
      displayProjects = projects.filter((p) => p.status?.toLowerCase() === 'planned');
      if (selectedCategory) {
          displayProjects = displayProjects.filter((p) => p.category?.trim() === selectedCategory);
      }
  } else if (activeTab === "listings") {
      displayProjects = projects.filter(p => {
          let states = [];
          try {
             const locs = JSON.parse(p.state_locations || "[]");
             states = locs.map(l => l.state?.trim());
          } catch(e) {}
          if (states.length === 0 && p.location) {
             states = p.location.split(',').map(s => s.trim());
          }
          return states.includes(activeState);
      });
  }

  return (
    <div className="bg-bg-color min-h-screen pb-20">
      <section id="ongoing" className="bg-accent text-white py-20 relative overflow-hidden scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            {activeTab === "completed" ? "Completed Projects" : activeTab === "planned" ? "Planned Projects" : "Ongoing Projects"}
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-blue-50">
            {activeTab === "completed" 
              ? "Take a look at our successfully delivered programs and sustained institutional milestones." 
              : activeTab === "planned" 
              ? "Explore upcoming strategies, planned programs, and future field operations." 
              : "Discover our active interventions and on-ground activities across various geographies."}
          </p>
        </div>
      </section>

      <section className="border-b sticky top-20 bg-white z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group">
          <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow-lg rounded-full hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center w-10 h-10 border border-gray-100">
            <span>❮</span>
          </button>
          
          {/* Main Top Navigation Header with Completed and Planned Tabs Reinstated */}
          <div ref={scrollRef} className="flex items-center justify-center space-x-8 overflow-x-auto no-scrollbar scroll-smooth px-12">
            <button onClick={() => { setActiveTab("all"); setSelectedCategory(null); window.history.replaceState(null, "", `#all`); }} className={`py-4 border-b-2 font-bold whitespace-nowrap transition-colors shrink-0 ${activeTab === "all" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-primary"}`}>Ongoing Projects 🏢</button>
            <button onClick={() => { setActiveTab("completed"); setSelectedCategory(null); window.history.replaceState(null, "", `#completed`); }} className={`py-4 border-b-2 font-bold whitespace-nowrap transition-colors shrink-0 ${activeTab === "completed" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-primary"}`}>Completed Projects ✅</button>
            <button onClick={() => { setActiveTab("planned"); setSelectedCategory(null); window.history.replaceState(null, "", `#planned`); }} className={`py-4 border-b-2 font-bold whitespace-nowrap transition-colors shrink-0 ${activeTab === "planned" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-primary"}`}>Planned Projects 📋</button>
            <button onClick={() => { setActiveTab("listings"); window.history.replaceState(null, "", `#listings`); }} className={`py-4 border-b-2 font-bold whitespace-nowrap transition-colors shrink-0 ${activeTab === "listings" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-primary"}`}>State-wise Listings 📍</button>
          </div>

          {/* Sub-menu Row: Core Dynamic Sub-Categories shown across status variations */}
          {(activeTab === "all" || activeTab === "completed" || activeTab === "planned") && uniqueCategories.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 pb-4 bg-white border-t pt-3 border-gray-50 animate-in fade-in duration-300">
              {uniqueCategories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedCategory === cat ? "bg-[#6a752b] text-white shadow" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}>{formatTabLabel(cat)}</button>
              ))}
            </div>
          )}

          {/* Sub-menu Row: States show here ONLY when "State-wise Listings" is active */}
          {activeTab === "listings" && uniqueStates.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 pb-4 bg-white border-t pt-3 border-gray-50 animate-in fade-in duration-300">
              {uniqueStates.map(state => (
                <button key={state} onClick={() => setActiveState(state)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeState === state ? "bg-[#6a752b] text-white shadow" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}>{state}</button>
              ))}
            </div>
          )}
          
          <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow-lg rounded-full hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center w-10 h-10 border border-gray-100">
            <span>❯</span>
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            <div className="col-span-2 py-12 text-center text-gray-500 flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              Loading projects...
            </div>
          ) : error ? (
            <div className="col-span-2 py-8 px-6 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center">⚠️ {error}</div>
          ) : displayProjects.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">No projects found.</div>
          ) : (
            displayProjects.map((project) => {
              const finalMediaUrl = getImageUrl(project.image_url);
              const isVideo = isVideoFile(project.image_url);
              
              return (
                <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                  <div className="w-full md:w-48 h-48 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                    {isVideo ? (
                      <video 
                        src={finalMediaUrl} 
                        className="w-full h-full object-cover" 
                        autoPlay loop muted playsInline 
                      />
                    ) : (
                      <img 
                        src={finalMediaUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = "https://placehold.co/600x400?text=Media+Not+Found";
                        }} 
                      />
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] font-bold text-accent uppercase tracking-widest">{project.category}</div>
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${project.status?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-700' : project.status?.toLowerCase() === 'planned' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-700'}`}>
                        {project.status}
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-text-primary mb-2 leading-tight">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 mt-auto">
                      <span className="text-base">📍</span> {project.location}
                    </div>
                    <Link to={`/projectdetails/${project.slug}`} className="inline-block bg-primary hover:bg-[#5a6425] text-white px-5 py-2 rounded font-medium text-sm transition-colors text-center self-start shadow-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section id="listings" className="py-16 bg-bg-color">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-text-primary mb-10 text-center">State-wise Listings & Snapshot</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div ref={mapRef} className="lg:col-span-2 relative h-150 md:h-200 flex items-center justify-center bg-transparent">
              <motion.div style={{ scale: mapScale, clipPath: mapClipPath, WebkitClipPath: mapClipPath, transformOrigin: "center center", backfaceVisibility: "hidden", width: "100%", height: "100%", position: "relative", zIndex: 10 }} className="bg-accent rounded-xl overflow-hidden shadow-lg">
                <MapSection onStateSelect={setSelectedMapState} onDataLoad={(totals) => setMapTotals({
                    totalStates: totals.totalStates,
                    totalDistricts: totals.totalDistricts,
                    totalProjects: totals.totalProjects,
                    totalBeneficiaries: formatCompact(totals.totalBeneficiaries)
                })} />
              </motion.div>
            </div>
            <div id="impact" className="bg-white sticky top-24 rounded-xl shadow-sm border border-gray-100 p-8 min-h-112.5">
              {selectedMapState ? (
                <div className="animate-in fade-in duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-serif font-bold text-text-primary flex items-center gap-2"><span className="text-2xl">📊</span> Impact Snapshot</h3>
                    <button onClick={() => setSelectedMapState(null)} className="text-gray-400 hover:text-red-500 text-3xl font-light transition-colors p-1">&times;</button>
                  </div>
                  <div className="mb-4">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">Currently Viewing</p>
                    <h4 className="text-2xl font-serif font-bold text-text-primary">📍 {selectedMapState.name}</h4>
                  </div>
                  <div className="mb-8 rounded-xl overflow-hidden h-54 bg-gray-100 border border-gray-100 shadow-inner">
                    <img src={stateStaticData[selectedMapState.name]?.image || "https://placehold.co/600x400?text=SDF+Impact"} alt={selectedMapState.name} className="w-full h-full object-cover" />
                  </div>
                  <ul className="space-y-6">
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-[#576123]/10 text-[#576123] flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-105">{selectedMapState.districtCount || 0}</div>
                      <div>
                        <div className="text-sm font-bold text-gray-800 uppercase tracking-tight">Districts Covered</div>
                        <div className="text-[11px] text-gray-400 uppercase font-bold tracking-tighter">Local Intervention</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-105">{selectedMapState.blockCount || 0}</div>
                      <div>
                        <div className="text-sm font-bold text-gray-800 uppercase tracking-tight">Blocks Covered</div>
                        <div className="text-[11px] text-gray-400 uppercase font-bold tracking-tighter">Block Intervention</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-105">{selectedMapState.villageCount || 0}</div>
                      <div>
                        <div className="text-sm font-bold text-gray-800 uppercase tracking-tight">Villages Covered</div>
                        <div className="text-[11px] text-gray-400 uppercase font-bold tracking-tighter">Village Level</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-105">{selectedMapState.projects?.length || 0}</div>
                      <div>
                        <div className="text-sm font-bold text-gray-800 uppercase tracking-tight">Major Projects</div>
                        <div className="text-[11px] text-gray-400 uppercase font-bold tracking-tighter">Active Currently</div>
                      </div>
                    </li>
                    
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-105">
                        {selectedMapState.projects?.filter(p => p.status?.toLowerCase() === 'completed' || p.is_completed).length || 0}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800 uppercase tracking-tight">Total Complete Projects</div>
                        <div className="text-[11px] text-gray-400 uppercase font-bold tracking-tighter">Successfully Delivered</div>
                      </div>
                    </li>

                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-105">{selectedMapState.livesImpacted || "0"}</div>
                      <div>
                        <div className="text-sm font-bold text-gray-800 uppercase tracking-tight">Lives Impacted</div>
                        <div className="text-[11px] text-gray-400 uppercase font-bold tracking-tighter">Total Beneficiaries</div>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-8 pt-4 border-t border-gray-50 text-center">
                    <p className="text-[10px] text-gray-400 italic">Regional statistics for {selectedMapState.name}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-serif font-bold text-text-primary mb-8 flex items-center gap-2"><span className="text-2xl mr-2">📊</span> Impact Snapshot</h3>
                  <ul className="space-y-7">
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110">{mapTotals.totalStates}</div>
                      <div><div className="text-sm font-bold text-gray-800">States Covered</div><div className="text-[11px] text-gray-500 uppercase tracking-tighter">Across India</div></div>
                    </li>
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110">{mapTotals.totalDistricts}</div>
                      <div><div className="text-sm font-bold text-gray-800">Districts Covered</div><div className="text-[11px] text-gray-500 uppercase tracking-tighter">Local Intervention</div></div>
                    </li>
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110">{mapTotals.totalProjects}</div>
                      <div><div className="text-sm font-bold text-gray-800">Major Projects</div><div className="text-[11px] text-gray-500 uppercase tracking-tighter">Active Currently</div></div>
                    </li>

                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110">
                        {globalCompletedCount}
                      </div>
                      <div><div className="text-sm font-bold text-gray-800">Total Complete Projects</div><div className="text-[11px] text-gray-500 uppercase tracking-tighter">Successfully Delivered</div></div>
                    </li>

                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110">{mapTotals.totalBeneficiaries}</div>
                      <div><div className="text-sm font-bold text-gray-800">Lives Impacted</div><div className="text-[11px] text-gray-500 uppercase tracking-tighter">Total Beneficiaries</div></div>
                    </li>
                  </ul>
                  <div className="mt-10 pt-6 border-t border-gray-100 text-center">
                    <div className="inline-block animate-bounce mb-2">👆</div>
                    <p className="text-xs text-gray-400 italic px-4">Click any highlighted state on the map to view local project details.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
