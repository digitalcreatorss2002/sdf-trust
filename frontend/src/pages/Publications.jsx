import { useEffect, useState } from "react";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom"; // 🔥 NEW

const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [inPublications, setInPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 TAB STATE
  const [activeTab, setActiveTab] = useState("annual-reports");

  const location = useLocation(); // 🔥 NEW

  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${ADMIN_BASE_URL}${path}`;
  };

  // 🔥 NEW: HANDLE HASH (MAIN FIX)
  useEffect(() => {
    if (location.hash) {
      const tab = location.hash.replace("#", "");

      // Only allow valid tabs
      if (["annual-reports", "case-studies", "in-publications"].includes(tab)) {
        setActiveTab(tab);
      }
    } else {
      setActiveTab("annual-reports"); // default
    }
  }, [location]);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pubRes, inPubRes] = await Promise.all([
          fetch(`${API_BASE_URL}/publications.php?t=${Date.now()}`),
          fetch(`${API_BASE_URL}/in_publications.php?t=${Date.now()}`)
        ]);

        if (!pubRes.ok || !inPubRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const pubData = await pubRes.json();
        const inPubData = await inPubRes.json();

        if (pubData.status === "success" && inPubData.status === "success") {
          setPublications(pubData.data);
          setInPublications(inPubData.data);
        } else {
          throw new Error("Failed to load data from server");
        }
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-primary font-bold animate-pulse">Loading Publications...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-20 font-bold">{error}</div>;
  }

  const reports = publications.filter((p) => p.type === "report");
  const caseStudies = publications.filter((p) => p.type === "case_study");

  return (
    <div className="bg-bg-color min-h-screen">
      {/* HEADER */}
      <section className="bg-primary text-white py-20 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-4 font-serif"
        >
          Publications & Resources
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary-50">
          Explore our reports, case studies, and books showcasing our impact-driven work.
        </motion.p>
      </section>

      {/* TABS */}
      <section className="border-b sticky top-20 bg-white z-40 shadow-sm border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center space-x-8 overflow-x-auto no-scrollbar">
            {[
              { id: "annual-reports", label: "Reports 📊" },
              { id: "case-studies", label: "Case Studies 📝" },
              { id: "in-publications", label: "Our Publications 📚" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.history.replaceState(null, "", `#${tab.id}`);
                }}
                className={`py-4 border-b-2 font-bold whitespace-nowrap transition-colors outline-none ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
        {/* REPORTS */}
        {activeTab === "annual-reports" && (
          reports.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {reports.map((r) => (
                <a
                  key={r.id}
                  href={getFullUrl(r.file_url)}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white p-6 rounded-xl shadow border border-gray-100 hover:shadow-md flex items-center justify-between transition-shadow"
                >
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-red-50 text-red-500 rounded flex items-center justify-center font-bold shrink-0">PDF</div>
                     <div>
                       <h3 className="font-bold text-gray-900 leading-tight">{r.title}</h3>
                       {r.file_size && <p className="text-sm text-gray-500 mt-1 block">{r.file_size}</p>}
                     </div>
                  </div>
                  <span className="text-primary font-bold text-xl ml-4">↓</span>
                </a>
              ))}
            </div>
          ) : (
             <p className="text-gray-500 text-center py-8">No annual reports available.</p>
          )
        )}

        {/* CASE STUDIES */}
        {activeTab === "case-studies" && (
          caseStudies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {caseStudies.map((c) => (
                <div key={c.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:-translate-y-1 transition-transform border border-gray-100 flex flex-col">
                  <div className="h-48 bg-gray-200">
                    <img
                      src={getFullUrl(c.image_url) || 'https://images.unsplash.com/photo-1544027993-37dbddc92582?q=80&w=400&auto=format&fit=crop'}
                      alt={c.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider mb-2 block">{c.category}</span>
                    <h3 className="font-bold text-gray-900 text-lg flex-1 mb-4 leading-tight">{c.title}</h3>
                    {c.file_url && (
                        <a href={getFullUrl(c.file_url)} target="_blank" rel="noreferrer" className="text-primary hover:text-[#5a6425] text-sm font-bold flex items-center gap-1 mt-auto">Read Study <span className="text-lg">→</span></a>
                    )}
                  </div>
                </div>
              ))}
            </div>
           ) : (
             <p className="text-gray-500 text-center py-8">No case studies available.</p>
          )
        )}

        {/* IN PUBLICATIONS */}
        {activeTab === "in-publications" && (
          inPublications.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {inPublications.map((book) => (
                <div key={book.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all flex flex-col">
                    <div className="aspect-[3/4] bg-gray-100 relative">
                      <img src={getFullUrl(book.image_url)} alt={book.title} className="absolute inset-0 w-full h-full object-cover" onError={(e) => e.currentTarget.src='https://via.placeholder.com/400x500?text=No+Cover'} />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between items-center text-center">
                      <h3 className="font-bold text-lg text-gray-900 mb-4 leading-tight">{book.title}</h3>
                      {book.pdf_url && (
                          <a href={getFullUrl(book.pdf_url)} target="_blank" rel="noreferrer" className="bg-[#6a752b] text-white hover:bg-[#5a6425] w-full py-2.5 rounded text-sm font-bold shadow-sm transition-colors block mt-auto">
                              Read PDF
                          </a>
                      )}
                    </div>
                </div>
              ))}
            </div>
           ) : (
             <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                 <p className="text-gray-500 font-medium">No books available at the moment.</p>
             </div>
          )
        )}
      </div>
    </div>
  );
};

export default Publications;