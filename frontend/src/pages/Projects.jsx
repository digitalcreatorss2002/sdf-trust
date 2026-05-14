import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";
import "leaflet/dist/leaflet.css";
import MapSection from "../components/MapSection";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";

// Video Checker Helper
const isVideoFile = (url) => {
  if (!url) return false;
  return /\.(mp4|webm|ogg)$/i.test(url);
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
    "Andhra Pradesh": { image: "/images/states/ap.jpg", livesImpacted: "800k+" },
    "Arunachal Pradesh": { image: "/images/states/arunachal.jpg", livesImpacted: "50k+" },
    Assam: { image: "/images/states/assam.jpg", livesImpacted: "200k+" },
    Bihar: { image: "/about/news3.png", livesImpacted: "1M+" },
    Chhattisgarh: { image: "/images/states/cg.jpg", livesImpacted: "300k+" },
    Goa: { image: "/images/states/goa.jpg", livesImpacted: "20k+" },
    Gujarat: { image: "/images/states/gujarat.jpg", livesImpacted: "600k+" },
    Haryana: { image: "/images/states/haryana.jpg", livesImpacted: "400k+" },
    "Himachal Pradesh": { image: "/images/states/hp.jpg", livesImpacted: "150k+" },
    Jharkhand: { image: "/images/states/jharkhand.jpg", livesImpacted: "500k+" },
    Karnataka: { image: "/images/states/karnataka.jpg", livesImpacted: "750k+" },
    Kerala: { image: "/images/states/kerala.jpg", livesImpacted: "300k+" },
    "Madhya Pradesh": { image: "/images/states/mp.jpg", livesImpacted: "1.2M+" },
    Maharashtra: { image: "/images/states/maharashtra.jpg", livesImpacted: "2M+" },
    Manipur: { image: "/images/states/manipur.jpg", livesImpacted: "40k+" },
    Meghalaya: { image: "/images/states/meghalaya.jpg", livesImpacted: "60k+" },
    Mizoram: { image: "/images/states/mizoram.jpg", livesImpacted: "30k+" },
    Nagaland: { image: "/images/states/nagaland.jpg", livesImpacted: "45k+" },
    Odisha: { image: "/images/states/odisha.jpg", livesImpacted: "900k+" },
    Punjab: { image: "/images/states/punjab.jpg", livesImpacted: "400k+" },
    Rajasthan: { image: "/images/states/rajasthan.jpg", livesImpacted: "1.1M+" },
    Sikkim: { image: "/images/states/sikkim.jpg", livesImpacted: "25k+" },
    "Tamil Nadu": { image: "/images/states/tn.jpg", livesImpacted: "850k+" },
    Telangana: { image: "/images/states/telangana.jpg", livesImpacted: "600k+" },
    Tripura: { image: "/images/states/tripura.jpg", livesImpacted: "70k+" },
    "Uttar Pradesh": { image: "/images/states/up.jpg", livesImpacted: "2.5M+" },
    Uttarakhand: { image: "/images/states/uttarakhand.jpg", livesImpacted: "200k+" },
    "West Bengal": { image: "/images/states/wb.jpg", livesImpacted: "1.3M+" },
    "Jammu and Kashmir": { image: "/images/states/jk.jpg", livesImpacted: "100k+" },
  };

  // 🔥 HANDLE HASH FOR TABS
  useEffect(() => {
    if (location.hash) {
      const tab = decodeURIComponent(location.hash.replace("#", ""));
      if (tab === "ongoing" || tab === "impact") {
        setActiveTab("all");
      } else {
        setActiveTab(tab);
      }
    } else {
      setActiveTab("all");
    }
  }, [location.hash]);

  // FETCH DATA
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects.php?t=${Date.now()}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setProjects(data.data);
          
          // Set default tab to "all" or first available category if no hash
          if (!location.hash) {
            setActiveTab("all");
          }
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

  // 🔥 SCROLL LOGIC FOR ARROWS
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollAmount = 300;
      const scrollTo = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  // 🔥 EXTRACT UNIQUE CATEGORIES
  const uniqueCategories = [
    ...new Set(projects.map((p) => p.category?.trim()).filter(Boolean)),
  ];

  // 🔥 EXTRACT UNIQUE STATES
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

  const [activeState, setActiveState] = useState(uniqueStates.length > 0 ? uniqueStates[0] : null);

  useEffect(() => {
    if (uniqueStates.length > 0 && !activeState) {
        setActiveState(uniqueStates[0]);
    }
  }, [uniqueStates, activeState]);

  // Helper to format tab labels
  const formatTabLabel = (label) => {
    if (label === "all") return "All Projects 🏢";
    return label.replace(/[_-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // 🔥 FILTER PROJECTS
  let displayProjects = projects;
  if (activeTab === "listings") {
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
  } else if (activeTab !== "all") {
      displayProjects = projects.filter((p) => p.category?.trim() === activeTab);
  }

  return (
    <div className="bg-bg-color min-h-screen pb-20">
      
      {/* HERO SECTION */}
      <section id="ongoing" className="bg-accent text-white py-20 relative overflow-hidden scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Ongoing Projects</h1>
          <p className="text-xl max-w-2xl mx-auto text-blue-50">
            Discover our active interventions and on-ground activities across various geographies.
          </p>
        </div>
      </section>

      {/* 🔥 TABS NAVBAR (Banner ke thik niche) */}
      <section className="border-b sticky top-20 bg-white z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group">
          
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow-lg rounded-full hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center w-10 h-10 border border-gray-100"
          >
            <span>❮</span>
          </button>

          {/* Scrollable Tabs */}
          <div
            ref={scrollRef}
            className="flex items-center space-x-8 overflow-x-auto no-scrollbar scroll-smooth px-12"
          >
            <button
              onClick={() => {
                setActiveTab("all");
                window.history.replaceState(null, "", `#all`);
              }}
              className={`py-4 border-b-2 font-bold whitespace-nowrap transition-colors shrink-0 ${
                activeTab === "all"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-primary"
              }`}
            >
              All Projects 🏢
            </button>
            <button
              onClick={() => {
                setActiveTab("listings");
                window.history.replaceState(null, "", `#listings`);
              }}
              className={`py-4 border-b-2 font-bold whitespace-nowrap transition-colors shrink-0 ${
                activeTab === "listings"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-primary"
              }`}
            >
              State-wise Listings 📍
            </button>
            {uniqueCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveTab(cat);
                  window.history.replaceState(null, "", `#${cat}`);
                }}
                className={`py-4 border-b-2 font-bold whitespace-nowrap transition-colors shrink-0 ${
                  activeTab === cat
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-primary"
                }`}
              >
                {formatTabLabel(cat)}
              </button>
            ))}
          </div>

          {/* Sub-navbar for States when 'listings' is active */}
          {activeTab === "listings" && uniqueStates.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pb-4 bg-white">
              {uniqueStates.map(state => (
                <button
                  key={state}
                  onClick={() => setActiveState(state)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeState === state
                      ? "bg-[#6a752b] text-white shadow"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          )}

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow-lg rounded-full hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center w-10 h-10 border border-gray-100"
          >
            <span>❯</span>
          </button>
        </div>
      </section>

      {/* PROJECT LISTING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            <div className="col-span-2 py-12 text-center text-gray-500 flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              Loading active projects...
            </div>
          ) : error ? (
            <div className="col-span-2 py-8 px-6 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center">
              ⚠️ {error}
            </div>
          ) : displayProjects.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              No projects found in this category.
            </div>
          ) : (
            displayProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                
                {/* Media Section */}
                <div className="w-full md:w-48 h-48 shrink-0">
                  {isVideoFile(project.image_url) ? (
                    <video 
                      src={`${ADMIN_BASE_URL}${project.image_url.replace(/^\/+/, '')}`} 
                      className="w-full h-full object-cover rounded-lg"
                      autoPlay loop muted playsInline
                    />
                  ) : (
                    <img 
                      src={`${ADMIN_BASE_URL}${project.image_url.replace(/^\/+/, '')}`} 
                      alt={project.title} 
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image" }}
                    />
                  )}
                </div>

                {/* Content Section */}
                <div className="flex flex-col">
                  <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2">{project.category}</div>
                  <h3 className="text-2xl font-serif font-bold text-text-primary mb-2 leading-tight">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 mt-auto">
                    <span className="text-base">📍</span> {project.location}
                  </div>
                  <Link to={`/projectdetails/${project.slug}`} className="inline-block bg-primary hover:bg-[#5a6425] text-white px-5 py-2 rounded font-medium text-sm transition-colors text-center self-start">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Map Section Grassroots Presence */}
      <section id="listings" className="py-16 bg-bg-color">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-text-primary mb-10 text-center">
            State-wise Listings & Snapshot
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* MAP COLUMN */}
            <div
              ref={mapRef}
              className="lg:col-span-2 relative h-150 md:h-200 flex items-center justify-center bg-transparent"
            >
              <motion.div
                style={{
                  scale: mapScale,
                  clipPath: mapClipPath,
                  WebkitClipPath: mapClipPath,
                  transformOrigin: "center center",
                  backfaceVisibility: "hidden",
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  zIndex: 10,
                }}
                className="bg-accent rounded-xl overflow-hidden shadow-lg"
              >
                <MapSection onStateSelect={setSelectedMapState} onDataLoad={(totals) => setMapTotals({
                    totalStates: totals.totalStates,
                    totalDistricts: totals.totalDistricts,
                    totalProjects: totals.totalProjects,
                    totalBeneficiaries: formatCompact(totals.totalBeneficiaries)
                })} />
              </motion.div>
            </div>

            {/* SIDEBAR COLUMN: IMPACT SNAPSHOT */}
            <div
              id="impact"
              className="bg-white sticky top-24 rounded-xl shadow-sm border border-gray-100 p-8 min-h-112.5"
            >
              {selectedMapState ? (
                <div className="animate-in fade-in duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-serif font-bold text-text-primary flex items-center gap-2">
                      <span className="text-2xl">📊</span> Impact Snapshot
                    </h3>
                    <button
                      onClick={() => setSelectedMapState(null)}
                      className="text-gray-400 hover:text-red-500 text-3xl font-light transition-colors p-1"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="mb-4">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">
                      Currently Viewing
                    </p>
                    <h4 className="text-2xl font-serif font-bold text-text-primary">
                      📍 {selectedMapState.name}
                    </h4>
                  </div>

                  <div className="mb-8 rounded-xl overflow-hidden h-44 bg-gray-100 border border-gray-100 shadow-inner">
                    <img
                      src={
                        stateStaticData[selectedMapState.name]?.image ||
                        "https://via.placeholder.com/400x250?text=SDF+Impact"
                      }
                      alt={selectedMapState.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <ul className="space-y-6">
                    {/* Districts Operated */}
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-[#576123]/10 text-[#576123] flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-105">
                        {selectedMapState.districtCount || 0}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800 uppercase tracking-tight">
                          Districts Covered
                        </div>
                        <div className="text-[11px] text-gray-400 uppercase font-bold tracking-tighter">
                          Local Intervention
                        </div>
                      </div>
                    </li>

                    {/* Blocks Operated */}
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-105">
                        {selectedMapState.blockCount || 0}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800 uppercase tracking-tight">
                          Blocks Covered
                        </div>
                        <div className="text-[11px] text-gray-400 uppercase font-bold tracking-tighter">
                          Block Intervention
                        </div>
                      </div>
                    </li>

                    {/* Villages Operated */}
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-105">
                        {selectedMapState.villageCount || 0}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800 uppercase tracking-tight">
                          Villages Covered
                        </div>
                        <div className="text-[11px] text-gray-400 uppercase font-bold tracking-tighter">
                          Village Level
                        </div>
                      </div>
                    </li>

                    {/* Major Projects */}
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-105">
                        {selectedMapState.projects.length}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800 uppercase tracking-tight">
                          Major Projects
                        </div>
                        <div className="text-[11px] text-gray-400 uppercase font-bold tracking-tighter">
                          Active Currently
                        </div>
                      </div>
                    </li>

                    {/* Lives Impacted */}
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-105">
                        {selectedMapState.livesImpacted || "0"}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800 uppercase tracking-tight">
                          Lives Impacted
                        </div>
                        <div className="text-[11px] text-gray-400 uppercase font-bold tracking-tighter">
                          Total Beneficiaries
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-8 pt-4 border-t border-gray-50 text-center">
                    <p className="text-[10px] text-gray-400 italic">
                      Regional statistics for {selectedMapState.name}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-serif font-bold text-text-primary mb-8 flex items-center gap-2">
                    <span className="text-2xl mr-2">📊</span> Impact Snapshot
                  </h3>
                  <ul className="space-y-7">
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110">
                        {mapTotals.totalStates}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800">
                          States Covered
                        </div>
                        <div className="text-[11px] text-gray-500 uppercase tracking-tighter">
                          Across India
                        </div>
                      </div>
                    </li>
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110">
                        {mapTotals.totalDistricts}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800">
                          Districts Covered
                        </div>
                        <div className="text-[11px] text-gray-500 uppercase tracking-tighter">
                          Local Intervention
                        </div>
                      </div>
                    </li>
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110">
                        {mapTotals.totalProjects}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800">
                          Major Projects
                        </div>
                        <div className="text-[11px] text-gray-500 uppercase tracking-tighter">
                          Active Currently
                        </div>
                      </div>
                    </li>
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110">
                        {mapTotals.totalBeneficiaries}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800">
                          Lives Impacted
                        </div>
                        <div className="text-[11px] text-gray-500 uppercase tracking-tighter">
                          Total Beneficiaries
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-10 pt-6 border-t border-gray-100 text-center">
                    <div className="inline-block animate-bounce mb-2">👆</div>
                    <p className="text-xs text-gray-400 italic px-4">
                      Click any highlighted state on the map to view local
                      project details.
                    </p>
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
