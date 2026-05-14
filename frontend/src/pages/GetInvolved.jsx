import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";

const GetInvolved = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("volunteer");
  
  // States for Careers
  const [careersList, setCareersList] = useState([]);
  const [careersLoading, setCareersLoading] = useState(true);

  // States for Funds (Partners EOI/RFQ)
  const [fundsList, setFundsList] = useState([]);
  const [fundsLoading, setFundsLoading] = useState(true);

  // Handle URL hash navigation (e.g., /get-involved#funds)
  useEffect(() => {
    if (location.hash) {
      const targetTab = location.hash.replace("#", "");
      if (["volunteer", "careers", "funds"].includes(targetTab)) {
        setTimeout(() => {
          setActiveTab(targetTab);
        }, 0);
      }
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.hash]);

  // Fetch Data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Careers
        const careerRes = await fetch(`${API_BASE_URL}/careers.php`);
        const careerData = await careerRes.json();
        if (careerData.status === "success") {
          setCareersList(careerData.data);
        }

        // Fetch Funds (Partners EOI/RFQ)
        const fundRes = await fetch(`${API_BASE_URL}/funds.php`);
        const fundData = await fundRes.json();
        if (fundData.status === "success") {
          setFundsList(fundData.data);
        }
      } catch (error) {
        console.error("Data fetching error:", error);
      } finally {
        setCareersLoading(false);
        setFundsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-bg-color min-h-screen pb-24 relative">
      {/* Hero Section */}
      <section className="bg-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Get Involved
          </h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Be a part of our movement. There are many ways to contribute your
            time, skills, and passion.
          </p>
        </div>
      </section>

      {/* Sticky Navigation Tabs */}
      <section className="border-b border-gray-200 sticky top-20 bg-white z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            {[
              { id: "volunteer", label: "Volunteer With Us", icon: "🤝", path: null },
              { id: "careers", label: "Careers", icon: "💼", path: null },
              { id: "funds", label: "Partners (EOI/RFQ)", icon: "🌱", path: null },
              // { id: "contact", label: "Contact Us", icon: "📞", path: "/contact" },
            ].map((tab) => {
              const isLink = tab.path !== null;
              const baseClass = `py-4 px-1 flex items-center gap-2 border-b-2 font-bold transition-all text-sm md:text-base ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`;

              if (isLink) {
                return (
                  <Link key={tab.id} to={tab.path} className={baseClass}>
                    <span>{tab.icon}</span> {tab.label}
                  </Link>
                );
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={baseClass}
                >
                  <span>{tab.icon}</span> {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[50vh]">
        
        {/* --- VOLUNTEER SECTION --- */}
        {activeTab === "volunteer" && (
          <section id="volunteer" className="mb-24 scroll-mt-32">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-sm h-96 relative">
                <img
                  src="about/vol.png"
                  alt="Volunteer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-8">
                  <h2 className="text-4xl text-white font-serif font-bold tracking-wide">
                    Volunteer With Us
                  </h2>
                </div>
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <p className="text-gray-600 text-lg leading-relaxed">
                  Volunteering is the ultimate exercise in democracy. Join our grassroots programs and make a tangible difference on the ground. We offer both field-based and remote skill-sharing opportunities.
                </p>
                <Link
                  to="/volunteerform"
                  className="bg-primary hover:bg-[#5a6425] text-white px-8 py-4 rounded-full font-bold shadow-md hover:-translate-y-1 transition-all mt-6 inline-block"
                >
                  Apply to Volunteer
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* --- CAREERS SECTION --- */}
        {activeTab === "careers" && (
          <section id="careers" className="scroll-mt-32 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-4xl mb-4 block animate-bounce">💼</span>
              <h2 className="text-3xl font-serif text-text-primary mb-4">Careers</h2>
              <p className="text-gray-500">Join our team of professionals driving sustainable development.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {careersLoading ? (
                <div className="p-10 text-center text-gray-400 italic">Fetching current openings...</div>
              ) : careersList.length > 0 ? (
                careersList.map((career) => (
                  <div key={career.id} className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition-colors">
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-1">{career.title}</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-2">📍 {career.location}</p>
                      {career.pdf_url && (
                        <a 
                          href={`${ADMIN_BASE_URL}${career.pdf_url.replace(/^\/+/, '')}`} 
                          target="_blank" rel="noreferrer" 
                          className="text-blue-600 hover:underline text-xs mt-2 inline-block font-bold"
                        >
                          📄 View Job Description
                        </a>
                      )}
                    </div>
                    <a href={career.apply_link} target="_blank" rel="noreferrer" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-2 rounded-full font-bold transition-all">
                      Apply Now
                    </a>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-gray-500">No open positions currently. Check back later!</div>
              )}
            </div>
          </section>
        )}

        {/* --- FUNDS (PARTNERS) SECTION --- */}
        {activeTab === "funds" && (
          <section id="funds" className="scroll-mt-32 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-4xl mb-4 block animate-float">🌱</span>
              <h2 className="text-3xl font-serif text-text-primary mb-4">Partners (EOI/RFQ)</h2>
              <p className="text-gray-500">Choose a specific fund to support the causes you care about most.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {fundsLoading ? (
                <div className="p-10 text-center text-gray-400 italic">Loading opportunities...</div>
              ) : fundsList.length > 0 ? (
                fundsList.map((fund) => (
                  <div key={fund.id} className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary mb-1">{fund.title}</h3>
                      <p className="text-gray-500 text-sm mb-3">📍 {fund.location}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{fund.description}</p>
                    </div>
                    <a
                      href={fund.donate_link}
                      target="_blank" rel="noreferrer"
                      className="shrink-0 border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-full font-bold transition-all hover:shadow-md"
                    >
                      Contribute
                    </a>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-gray-500">No active EOI/RFQ found at the moment.</div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default GetInvolved;