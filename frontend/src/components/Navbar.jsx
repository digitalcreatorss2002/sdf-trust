import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState(null);
  const [dynamicPrograms, setDynamicPrograms] = useState([]);

  // ✅ Fix for (EOI/RFQ) capitalization - Regex handles any case variation
  const formatLabel = (label) => {
    if (!label) return "";
    // Program ID format ko readable banana (e.g., lowercase dashes to uppercase/spaces)
    let formatted = label.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    return formatted.replace(/\(eoi\/rfq\)/gi, "(EOI/RFQ)");
  };

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/programs.php?t=${Date.now()}`,
        );
        const data = await response.json();
        if (data.status === "success") {
          const uniquePrograms = [];
          const seen = new Set();
          for (const prog of data.data) {
            const normalizedId = (prog.program_id || "").trim();
            if (normalizedId && !seen.has(normalizedId.toLowerCase())) {
              seen.add(normalizedId.toLowerCase());
              uniquePrograms.push({
                // 🔥 FIXED: Title ki jagah ab Program ID select ho raha hai dropdown label ke liye
                label: normalizedId, 
                path: `/programs?filter=${encodeURIComponent(normalizedId.toLowerCase())}`,
                icon: prog.icon || "📌",
              });
            }
          }
          setDynamicPrograms(uniquePrograms);
        }
      } catch (error) {
        console.error("Failed to fetch programs for navbar", error);
      }
    };
    fetchPrograms();
  }, []);

  const toggleMobileMenu = (menu) => {
    setActiveMobileMenu(activeMobileMenu === menu ? null : menu);
  };

  const menuItems = [
    {
      name: "About",
      path: "/about",
      hasDropdown: true,
      dropdownItems: [
        { label: "Who We Are", path: "/about#who-we-are", icon: "💡" },
        { label: "Leadership", path: "/about#leadership", icon: "👥" },
        { label: "Our Approach", path: "/about#approach", icon: "🎯" },
        { label: "Partners", path: "/about#partners", icon: "🤝" },
        { label: "FAQ", path: "/about#fAq", icon: "🙋" },
      ],
    },
    {
      name: "Programs",
      path: "/programs",
      hasDropdown: true,
      dropdownItems:
        dynamicPrograms.length > 0
          ? dynamicPrograms
          : [{ label: "Loading...", path: "/programs", icon: "⏳" }],
    },
    {
      name: "Our Work",
      path: "/projects",
      hasDropdown: true,
      dropdownItems: [
        { label: "Ongoing Projects", path: "/projects#ongoing", icon: "🏢" },
        {
          label: "State-wise Listings",
          path: "/projects#listings",
          icon: "🗺️",
        },
        { label: "Impact Snapshot", path: "/projects#impact", icon: "📊" },
      ],
    },
    {
      name: "Publications",
      path: "/publications",
      hasDropdown: true,
      dropdownItems: [
        {
          label: "Annual Reports",
          path: "/publications#annual-reports",
          icon: "📈",
        },
        {
          label: "Case Studies",
          path: "/publications#case-studies",
          icon: "📝",
        },
        {
          label: "Our Publications",
          path: "/publications#in-publications",
          icon: "📚",
        },
      ],
    },
    {
      name: "Media & Stories",
      path: "/media",
      hasDropdown: true,
      dropdownItems: [
        { label: "Photo Gallery", path: "/media#photos", icon: "📸" },
        { label: "Video Gallery", path: "/media#videos", icon: "🎥" },
        { label: "Press Coverage", path: "/media#press", icon: "🗞️" },
      ],
    },
    {
      name: "Get Involved",
      path: "/get-involved",
      hasDropdown: true,
      dropdownItems: [
        {
          label: "Volunteer With Us",
          path: "/get-involved#volunteer",
          icon: "🤝",
        },
        { label: "Careers", path: "/get-involved#careers", icon: "💼" },
        {
          label: "Partners (EOI/RFQ)",
          path: "/get-involved#funds",
          icon: "🌱",
        },
      ],
    },
    {
      name: "Contact Us",
      path: "/contact",
    },
  ];

  return (
    <nav className="bg-white backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center h-16 w-auto">
                <img
                  src="/logo/logo-bg.png"
                  alt="SDF Logo"
                  className="h-full object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <div key={item.name} className="relative group px-2 py-6">
                <Link
                  to={item.path}
                  className="text-text-primary hover:text-primary font-bold text-sm transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  {item.name}
                  {item.hasDropdown && (
                    <span className="text-[10px] text-gray-400 group-hover:rotate-180 transition-transform duration-300">
                      ▼
                    </span>
                  )}
                </Link>

                {item.hasDropdown && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-[90%] w-64 bg-white shadow-2xl border border-gray-100 rounded-xl opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-2 group-hover:pointer-events-auto transition-all duration-300 z-50">
                    <div className="p-2">
                      {item.dropdownItems.map((subItem) => (
                        <Link
                          key={subItem.label}
                          to={subItem.path}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group/link"
                        >
                          <span className="text-xl group-hover/link:scale-110 transition-transform">
                            {subItem.icon}
                          </span>
                          <span className="text-sm font-bold text-gray-700 group-hover/link:text-primary normal-case">
                            {formatLabel(subItem.label)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="pl-4">
              <Link
                to="/donate"
                className="inline-flex items-center justify-center bg-accent hover:bg-[#237586] text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-sm hover:-translate-y-0.5 hover:shadow-md ml-2"
              >
                Donate
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-primary hover:text-primary p-2 focus:outline-none"
            >
              <span className="text-2xl font-bold">{isOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-screen border-t border-gray-100" : "max-h-0"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1 bg-white shadow-inner max-h-[calc(100vh-80px)] overflow-y-auto">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className="border-b border-gray-50 last:border-0"
            >
              {item.hasDropdown ? (
                <>
                  <button
                    onClick={() => toggleMobileMenu(item.name)}
                    className="w-full flex items-center justify-between px-3 py-4 text-base font-bold text-text-primary focus:outline-none"
                  >
                    {item.name}
                    <span
                      className={`text-sm text-gray-400 transition-transform ${activeMobileMenu === item.name ? "rotate-180 text-primary" : ""}`}
                    >
                      ▼
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out bg-gray-50 rounded-lg ${
                      activeMobileMenu === item.name
                        ? "max-h-96 mb-2 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.dropdownItems.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to={subItem.path}
                        className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-gray-600 hover:text-primary hover:bg-white transition-colors normal-case"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="text-lg">{subItem.icon}</span>
                        {formatLabel(subItem.label)}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={item.path}
                  className="block px-3 py-4 text-base font-bold text-text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
          <div className="pt-6 pb-2">
            <Link
              to="/donate"
              className="block w-full text-center bg-accent text-white px-6 py-4 rounded-xl font-bold shadow-md"
              onClick={() => setIsOpen(false)}
            >
              ❤️ Donate Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;