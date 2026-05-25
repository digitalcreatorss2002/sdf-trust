import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";
import Herosection from "../components/Herosection";
import Testimonials from "./Testimonials";
import MapSection from "../components/MapSection";
import PartnersSection from "../components/Partners";
import ProjectSlider from "../components/ProjectSlider";
// import ProjectMap from "../components/ProjectMap";

const PROGRAMS_API_URL = `${API_BASE_URL}/programs.php?t=` + Date.now();
const SUBSCRIBE_API_URL = `${API_BASE_URL}/subscribe.php`;

// Video Checker Helper
const isVideoFile = (url) => {
  if (!url) return false;
  return /\.(mp4|webm|ogg)$/i.test(url);
};

// Direct root extraction to match your working Project details/listing logic
const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/800x500?text=No+Image";
  if (path.startsWith("http")) return path;

  const rootDomain = ADMIN_BASE_URL.split("/backend/admin")[0].replace(
    /\/+$/,
    "",
  );
  const cleanPath = path.replace(/^\/+/, "");

  // Images are in backend/admin/uploads/
  return `${rootDomain}/backend/admin/${cleanPath}`;
};

const createSlug = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const Home = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [programsList, setProgramsList] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [programsError, setProgramsError] = useState("");

  const [focusAreas, setFocusAreas] = useState([]);
  const [selectedMapState, setSelectedMapState] = useState(null);
  const [mapTotals, setMapTotals] = useState({
    totalStates: 12,
    totalDistricts: "45+",
    totalProjects: "15+",
    totalBeneficiaries: "2M+",
  });

  const [aboutData, setAboutData] = useState(null);

  // State for raw list of all backend projects to support live calculations
  const [allProjects, setAllProjects] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);

  // Map Animation hooks
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

  // Focus Areas Animation hooks
  const focusRef = useRef(null);
  const { scrollYProgress: focusScrollY } = useScroll({
    target: focusRef,
    offset: ["start end", "center center"],
  });

  const focusMaxWidth = useTransform(focusScrollY, [0, 1], ["100%", "90%"]);
  const focusBorderRadius = useTransform(focusScrollY, [0, 1], ["0px", "80px"]);
  const focusScale = useTransform(focusScrollY, [0, 1], [1, 0.92]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(PROGRAMS_API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch programs");
        }

        const data = await response.json();

        const rawPrograms = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : [];

        const normalizedPrograms = rawPrograms
          .slice(0, 4)
          .map((program, index) => ({
            ...program,
            id: program.id || index + 1,
            title: program.title || "Untitled Program",
            description: program.description || "No description available.",
            image_url: program.image_url,
            slug:
              program.slug ||
              createSlug(program.title) ||
              `program-${index + 1}`,
          }));

        setProgramsList(normalizedPrograms);
      } catch (error) {
        console.error("Programs fetch error:", error);
        setProgramsError(error.message || "Failed to load programs");
      } finally {
        setProgramsLoading(false);
      }
    };

    const fetchFocusAreas = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/focus_areas.php?t=${Date.now()}`,
        );
        const data = await response.json();
        if (data.status === "success") {
          setFocusAreas(data.data);
        }
      } catch (error) {
        console.error("Focus areas fetch error:", error);
      }
    };

    const fetchAboutData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/about_who_we_are.php?t=${Date.now()}`,
        );
        const data = await response.json();
        if (data.status === "success" && data.data) {
          setAboutData(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch about data:", err);
      }
    };

    const fetchRecentProjects = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/projects.php?t=${Date.now()}`,
        );
        const data = await response.json();
        if (data.status === "success" && Array.isArray(data.data)) {
          setAllProjects(data.data);
          setRecentProjects(data.data.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch recent projects:", err);
      }
    };

    fetchPrograms();
    fetchFocusAreas();
    fetchAboutData();
    fetchRecentProjects();
  }, []);

  const formatCompact = (num) => {
    if (!num) return "0";
    if (typeof num === "string" && num.includes("+")) return num;
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(SUBSCRIBE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setMessage({
          text: data.message || "Subscribed successfully.",
          type: "success",
        });
        setEmail("");
      } else {
        setMessage({
          text: data.message || "Subscription failed.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setMessage({
        text: "Failed to connect to the server. Please ensure the PHP backend is running on localhost.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // National/Global Counters derived directly from dynamic live database collection array
  const globalCompletedCount = allProjects.filter(
    (p) => p.status?.toLowerCase() === "completed",
  ).length;

  // Dynamic summation parser logic loop computing dynamic numeric beneficiaries metrics values natively
  const globalLivesImpactedSum = allProjects.reduce((acc, curr) => {
    if (!curr.beneficiaries) return acc;
    const parsed = parseInt(
      curr.beneficiaries.toString().replace(/[^0-9]/g, ""),
      10,
    );
    return isNaN(parsed) ? acc : acc + parsed;
  }, 0);

  const stateStaticData = {
    "Andhra Pradesh": {
      image: "map/AndhraPradesh.jpg",
      livesImpacted: "800k+",
    },
    "Arunachal Pradesh": {
      image: "map/ArunachalPradesh.jpg",
      livesImpacted: "50k+",
    },
    Assam: { image: "map/Assam.jpg", livesImpacted: "200k+" },
    Bihar: { image: "map/Bihar.jpg", livesImpacted: "1M+" },
    Chhattisgarh: { image: "map/Chhattisgarh.jpg", livesImpacted: "300k+" },
    Goa: { image: "map/Goa.jpg", livesImpacted: "20k+" },
    Gujarat: { image: "map/Gujarat.jpg", livesImpacted: "600k+" },
    Haryana: { image: "map/Haryana.jpg", livesImpacted: "400k+" },
    "Himachal Pradesh": {
      image: "map/Himachal Pradesh.jpg",
      livesImpacted: "150k+",
    },
    Jharkhand: { image: "map/Jharkhand.jpg", livesImpacted: "500k+" },
    Karnataka: { image: "map/Karnataka.jpg", livesImpacted: "750k+" },
    Kerala: { image: "map/Kerala.jpg", livesImpacted: "300k+" },
    "Madhya Pradesh": {
      image: "map/Madhya Pradesh.jpg",
      livesImpacted: "1.2M+",
    },
    Maharashtra: { image: "map/Maharashtra.jpg", livesImpacted: "2M+" },
    Manipur: { image: "map/Manipur.jpg", livesImpacted: "40k+" },
    Meghalaya: { image: "map/Meghalaya.jpg", livesImpacted: "60k+" },
    Mizoram: { image: "map/Mizoram.jpg", livesImpacted: "30k+" },
    Nagaland: { image: "map/Nagaland.jpg", livesImpacted: "45k+" },
    Odisha: { image: "map/Odisha.jpg", livesImpacted: "900k+" },
    Punjab: { image: "map/Punjab.jpg", livesImpacted: "400k+" },
    Rajasthan: { image: "map/Rajasthan.jpg", livesImpacted: "1.1M+" },
    Sikkim: { image: "map/Sikkim.jpg", livesImpacted: "25k+" },
    "Tamil Nadu": { image: "map/TamilNadu.jpg", livesImpacted: "850k+" },
    Telangana: { image: "map/Telangana.jpg", livesImpacted: "600k+" },
    Tripura: { image: "map/Tripura.jpg", livesImpacted: "70k+" },
    "Uttar Pradesh": { image: "map/Uttar Pradesh.jpg", livesImpacted: "2.5M+" },
    Uttarakhand: { image: "map/Uttarakhand.jpg", livesImpacted: "200k+" },
    "West Bengal": { image: "map/WestBengal.jpg", livesImpacted: "1.3M+" },
    "Jammu and Kashmir": {
      image: "map/Jammu and Kashmir.png",
      livesImpacted: "100k+",
    },
  };

  // Helper routine computing live state wise filtered beneficiaries values directly
  const getStateLivesImpactedCount = (stateName) => {
    const stateProjects = allProjects.filter((p) => {
      let states = [];
      try {
        const locs = JSON.parse(p.state_locations || "[]");
        states = locs.map((l) => l.state?.trim().toLowerCase());
      } catch (e) {}
      if (states.length === 0 && p.location) {
        states = p.location.split(",").map((s) => s.trim().toLowerCase());
      }
      return states.includes(stateName.toLowerCase());
    });

    const sum = stateProjects.reduce((acc, curr) => {
      if (!curr.beneficiaries) return acc;
      const parsed = parseInt(
        curr.beneficiaries.toString().replace(/[^0-9]/g, ""),
        10,
      );
      return isNaN(parsed) ? acc : acc + parsed;
    }, 0);

    return sum > 0
      ? formatCompact(sum)
      : stateStaticData[stateName]?.livesImpacted || "0";
  };

  return (
    <div>
      <Herosection />

      <section className="py-10 relative bg-bg-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Block: Info Content */}
            <div className="lg:w-1/3">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl shadow-sm animate-float">
                  🌱
                </div>
                <h2 className="text-3xl md:text-3xl font-serif text-text-primary leading-tight">
                  Why Sustainable
                  <br />
                  Development Foundation ?
                </h2>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed line-clamp-9">
                {aboutData && aboutData.who_we_are_text
                  ? aboutData.who_we_are_text
                  : "Established in 2014 by a dedicated group of professional social workers, the Sustainable Development Foundation (SDF) is a distinguished autonomous and 'not-for-profit' organization in India..."}
              </p>

              <Link to="/about">
                <button className="bg-primary hover:bg-[#5a6425] text-white px-8 py-2.5 rounded-full font-medium transition-colors">
                  View More
                </button>
              </Link>
            </div>

            {/* Right Block: Complete Projects Grid Only */}
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
              {(() => {
                // फ़िल्टर: सिर्फ 'completed' स्टेटस वाले प्रोजेक्ट्स को ही एरे में रखें
                const completedProjects = recentProjects.filter(
                  (project) => project && project.status === "completed",
                );

                if (completedProjects.length > 0) {
                  return completedProjects.map((project, idx) => {
                    const finalMediaUrl = getImageUrl(project.image_url);
                    return (
                      <div
                        key={project.id || idx}
                        className="bg-white rounded-2xl shadow-sm text-center border border-gray-100 pb-6 flex flex-col h-full hover:shadow-md transition-shadow"
                      >
                        {/* Media Wrapper */}
                        <div className="p-4 h-40">
                          {isVideoFile(project.image_url) ? (
                            <video
                              src={finalMediaUrl}
                              className="w-full h-full object-cover rounded-xl shadow-sm"
                              autoPlay
                              loop
                              muted
                              playsInline
                            />
                          ) : (
                            <img
                              src={finalMediaUrl}
                              alt={project.title}
                              className="w-full h-full object-cover rounded-xl shadow-sm"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/500x300?text=Image+Not+Found";
                              }}
                            />
                          )}
                        </div>

                        {/* Text Content Area */}
                        <div className="p-5 grow flex flex-col">
                          <h3 className="text-xl font-serif text-text-primary mb-3 line-clamp-2">
                            {project.title}
                          </h3>
                          <p className="text-gray-500 text-sm mb-6 grow line-clamp-3">
                            {project.description}
                          </p>

                          <Link
                            to={`/projectdetails/${project.slug}`}
                            className="text-primary font-bold text-sm hover:underline mt-auto"
                          >
                            View Project →
                          </Link>
                        </div>
                      </div>
                    );
                  });
                } else {
                  // अगर कोई भी प्रोजेक्ट कम्प्लीटेड नहीं है या डेटा लोड हो रहा है
                  return (
                    <div className="col-span-3 text-center text-gray-500 py-10 bg-white/50 rounded-2xl border border-dashed">
                      <p className="font-medium">
                        No completed projects found.
                      </p>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      </section>

      <section
        ref={focusRef}
        className="bg-bg-color relative flex justify-center py-4 overflow-hidden"
      >
        <motion.div
          style={{
            width: "100%",
            maxWidth: focusMaxWidth,
            borderRadius: focusBorderRadius,
            scale: focusScale,
          }}
          className="mx-auto bg-accent text-center py-16 md:py-24 px-6 sm:px-12 lg:px-16 shadow-xl relative group"
        >
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl font-serif text-white mb-12 relative z-10 inline-block px-4"
          >
            Our Focus Areas
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 relative z-10">
            {focusAreas.length > 0 ? (
              focusAreas.map((area, index) => (
                <motion.div
                  key={area.id}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="bg-white p-6 rounded-3xl shadow-sm hover:-translate-y-2 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row items-center gap-4 justify-center border border-gray-100"
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-sm ${area.color_class} ${area.animation_class}`}
                  >
                    {area.icon}
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-2xl font-bold text-gray-900">
                      {area.number_text}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      {area.title}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="col-span-2 md:col-span-4 text-white">
                Loading Focus Areas...
              </p>
            )}
          </div>
        </motion.div>
      </section>

      <ProjectSlider />

      <section className="py-10 bg-bg-color">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 className="text-3xl font-serif text-text-primary mb-12">
      Our Programs
    </h2>

    {programsLoading ? (
      <p className="text-primary font-semibold">Loading programs...</p>
    ) : programsError ? (
      <p className="text-red-500 font-semibold">{programsError}</p>
    ) : programsList.length === 0 ? (
      <p className="text-gray-500">No programs found.</p>
    ) : (
      <>
        {/* Grid Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 🔥 यहाँ [...programsList].reverse() एकदम परफेक्टली सेट है, 
              ताकि जो प्रोग्राम सबसे लास्ट में ऐड हुआ है, वो यहाँ सबसे पहले दिखे। */}
          {[...programsList].reverse().map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-xl border border-gray-100 text-left hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={getImageUrl(program.image_url)}
                  alt={program.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/800x500?text=Image+Not+Found";
                  }}
                />
              </div>

              {/* Content Area */}
              <div className="p-6 grow flex flex-col">
                <h3 className="text-xl font-serif font-bold text-text-primary mb-3 leading-tight">
                  {program.title}
                </h3>

                <p className="text-gray-500 text-sm mb-6 grow">
                  {program.description.length > 100
                    ? `${program.description.slice(0, 100)}...`
                    : program.description}
                </p>

                <Link
                  to={`/programdetails/${program.slug}`}
                  className="bg-primary hover:bg-[#5a6425] text-white px-6 py-2 rounded-full font-medium text-sm transition-colors self-start mt-auto inline-block"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Navigation Button */}
        <div className="mt-10">
          <Link
            to="/programs"
            className="inline-block border border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-full font-semibold transition-colors"
          >
            View All Programs
          </Link>
        </div>
      </>
    )}
  </div>
</section>

      <Testimonials />

      <section
        className="py-20 relative bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 relative">
          <h2 className="text-4xl font-serif text-white mb-4 drop-shadow-lg">
            Get Involved
          </h2>
          <p className="text-xl text-gray-200 mb-12 drop-shadow-md">
            Join Us in Making a Difference
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <a href="/volunteerform">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm relative group cursor-pointer h-80">
                <img
                  src="about/vol.png"
                  alt="Volunteer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/800x500?text=Volunteer";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="text-3xl text-white font-serif font-bold tracking-wide">
                    Volunteer With Us
                  </h3>
                </div>
              </div>
            </a>

            <a href="/donate">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm relative group cursor-pointer h-80">
                <img
                  src="banner/donate-page.png"
                  alt="Donate"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/800x500?text=Donate";
                  }}
                />
                <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                  <h3 className="text-3xl text-white font-serif font-bold tracking-wide">
                    Make a Donation
                  </h3>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Map Section Grassroots Presence */}
      <section className="py-16 bg-bg-color">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-text-primary mb-10 text-center">
            Our Grassroots Presence
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div
              key="map-container"
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
                <MapSection
                  onStateSelect={setSelectedMapState}
                  onDataLoad={(totals) =>
                    setMapTotals({
                      totalStates: totals.totalStates,
                      totalDistricts: totals.totalDistricts,
                      totalProjects: totals.totalProjects,
                      totalBeneficiaries: totals.totalBeneficiaries
                        ? formatCompact(totals.totalBeneficiaries)
                        : mapTotals.totalBeneficiaries,
                    })
                  }
                />
              </motion.div>
            </div>

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

                  <div className="mb-8 rounded-xl overflow-hidden h-54 bg-gray-100 border border-gray-100 shadow-inner">
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
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-[#576123]/10 text-[#576123] flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-105">
                        {selectedMapState.districtCount || 0}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800 uppercase tracking-tight">
                          Districts Operated
                        </div>
                        <div className="text-[11px] text-gray-400 uppercase font-bold tracking-tighter">
                          Local Intervention
                        </div>
                      </div>
                    </li>

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

                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-105">
                        {selectedMapState.projects?.length || 0}
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

                    {/* 🔥 Dynamic State wise Completed Project Count calculation */}
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-105">
                        {selectedMapState.projects?.filter(
                          (p) =>
                            p.status?.toLowerCase() === "completed" ||
                            p.is_completed,
                        ).length || 0}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800 uppercase tracking-tight">
                          Total Complete Projects
                        </div>
                        <div className="text-[11px] text-gray-400 uppercase font-bold tracking-tighter">
                          Successfully Delivered
                        </div>
                      </div>
                    </li>

                    {/* 🔥 Dynamic State wise Beneficiaries Mapping */}
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-105">
                        {getStateLivesImpactedCount(selectedMapState.name)}
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

                    {/* 🔥 Dynamic Live National Counter for Completed Projects */}
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110">
                        {globalCompletedCount > 0
                          ? globalCompletedCount
                          : "45+"}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800">
                          Total Complete Projects
                        </div>
                        <div className="text-[11px] text-gray-500 uppercase tracking-tighter">
                          Successfully Delivered
                        </div>
                      </div>
                    </li>

                    {/* 🔥 Dynamic Live National Counter for Lives Impacted Summation */}
                    <li className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110">
                        {globalLivesImpactedSum > 0
                          ? formatCompact(globalLivesImpactedSum)
                          : mapTotals.totalBeneficiaries}
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

      <PartnersSection />

      <section className="py-10 bg-primary/10 border-t border-primary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-4xl mb-4 block animate-float">✉️</span>
          <h2 className="text-3xl font-serif text-text-primary mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Stay updated with our latest projects, success stories, and ways you
            can help. Join our community of changemakers today.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="grow px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white shadow-sm"
              required
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-[#5a6425] text-white px-8 py-4 rounded-full font-bold transition-all shadow-md hover:-translate-y-1 hover:shadow-lg whitespace-nowrap disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          {message.text && (
            <div
              className={`max-w-lg mx-auto mt-4 p-3 rounded-lg text-sm font-medium ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
