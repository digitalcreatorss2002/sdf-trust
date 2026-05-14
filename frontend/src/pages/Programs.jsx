import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";

const Programs = () => {
  const location = useLocation();
  const scrollRef = useRef(null);

  const [programsList, setProgramsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // 🔥 HANDLE HASH FOR TABS
  useEffect(() => {
    if (location.hash) {
      const tab = location.hash.replace("#", "");
      setActiveTab(tab);
    } else {
      setActiveTab("all");
    }
  }, [location]);

  // FETCH DATA
  // FETCH DATA
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/programs.php?t=${Date.now()}`);
        if (!response.ok) throw new Error("Failed to fetch programs");

        const data = await response.json();
        if (data.status === "success") {
          setProgramsList(data.data);

          // 🔥 SET DEFAULT TAB TO FIRST CATEGORY IF NO HASH EXISTS
          if (!location.hash && data.data.length > 0) {
            const firstCat = data.data[0].program_id?.trim().toLowerCase();
            if (firstCat) setActiveTab(firstCat);
          }
        } else {
          throw new Error(data.message || "Error fetching programs");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
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

  // 🔥 EXTRACT UNIQUE CATEGORIES (Removed "all")
  const uniqueCategories = [
    ...new Set(
      programsList
        .map((p) => p.program_id?.trim().toLowerCase())
        .filter(Boolean)
    ),
  ];

  // Helper to format tab labels
  const formatTabLabel = (id) => {
    if (id === "all") return "All Programs 🌍";
    return id.replace(/[_-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // 🔥 FILTER PROGRAMS
  // 🔥 FILTER PROGRAMS (Simplified)
  const displayPrograms = programsList.filter(
    (p) => (p.program_id || "").toLowerCase().trim() === activeTab.toLowerCase().trim()
  );

  if (loading) {
    return (
      <div className="bg-bg-color min-h-screen py-20 flex items-center justify-center">
        <div className="text-xl text-primary font-bold animate-pulse">Loading Programs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-bg-color min-h-screen py-20 flex items-center justify-center">
        <div className="text-red-500 font-bold px-4 text-center">
          <p className="text-2xl mb-4">Oops! Something went wrong.</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-color min-h-screen pb-20">

      {/* HEADER SECTION */}
      <section className="bg-secondary text-white py-20 bg-opacity-90 relative">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Programmes</h1>
          <p className="text-xl max-w-2xl mx-auto text-green-50">
            Impact-driven initiatives targeting the most critical challenges facing our communities today.
          </p>
        </div>
      </section>

      {/* 🔥 TABS SECTION WITH ARROWS */}
      <section className="border-b sticky top-20 bg-white z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group">

          {/* Left Arrow Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow-lg rounded-full hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center w-10 h-10 border border-gray-100"
          >
            <span className="text-lg">❮</span>
          </button>

          {/* Scrollable Tab Container */}
          <div
            ref={scrollRef}
            /* px-12 gives room for arrows so they don't cover "All Programs" */
            className="flex items-center space-x-8 overflow-x-auto no-scrollbar scroll-smooth px-12"
          >
            {uniqueCategories.map((tabId) => (
              <button
                key={tabId}
                onClick={() => {
                  setActiveTab(tabId);
                  window.history.replaceState(null, "", `#${tabId}`);
                }}
                /* shrink-0 is vital so the text doesn't squash */
                className={`py-4 border-b-2 font-bold whitespace-nowrap transition-colors shrink-0 ${activeTab === tabId
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-primary"
                  }`}
              >
                {formatTabLabel(tabId)}
              </button>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow-lg rounded-full hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center w-10 h-10 border border-gray-100"
          >
            <span className="text-lg">❯</span>
          </button>

        </div>
      </section>

      {/* CONTENT GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {displayPrograms.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
              No programs found for this category.
            </div>
          )}

          {displayPrograms.map((program, idx) => (
            <div
              key={program.id || idx}
              id={program.program_id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col scroll-mt-28"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={`${ADMIN_BASE_URL}${program.image_url}`}
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image" }}
                />
              </div>

              <div className="p-8 relative grow flex flex-col">
                <div className="absolute -top-10 right-6 w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-xl border border-gray-50 hover:scale-110 transition-transform duration-300">
                  {program.icon || "📌"}
                </div>

                <h3 className="text-2xl font-serif font-bold text-text-primary mb-4 mt-4 leading-tight">
                  {program.title}
                </h3>

                <p className="text-gray-600 mb-6 grow line-clamp-4">
                  {program.description}
                </p>

                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100 flex-wrap">
                  <span className="bg-[#E9EFE1] text-primary text-xs font-bold px-3 py-1 rounded-full">
                    {program.beneficiaries || "N/A"} Beneficiaries
                  </span>
                  <span className="bg-blue-50 text-accent text-xs font-bold px-3 py-1 rounded-full">
                    {program.regions || "N/A"} Active
                  </span>
                </div>

                <Link
                  to={`/programdetails/${program.slug}`}
                  className="text-primary font-bold hover:text-secondary uppercase tracking-wider text-sm self-start transition-colors mt-6"
                >
                  Explore Project &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Programs;