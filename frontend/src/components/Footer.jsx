import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#75843a] text-white font-sans">
      {/* 🔥 MAIN CONTENT AREA - Padding 'px' reduced as requested */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 items-start">
          {/* 🌿 LEFT SIDE - Increased width for Paragraph */}
          <div className="space-y-8 flex flex-col justify-start lg:col-span-1">
            <p
              className="text-white/95 text-2xl md:text-[21px] leading-[1.4] max-w-[420px] text-left"
              style={{
                fontFamily: "'Dancing Script', cursive",
                textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              Empowering communities and sustaining the future through
              integrated development programs across health, education, and
              environment.
            </p>

            <div className="flex space-x-3">
              <a
                href="#"
                className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <span className="text-sm">f</span>
              </a>
              <a
                href="#"
                className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <span className="text-sm">𝕏</span>
              </a>
              <a
                href="#"
                className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <span className="text-sm">in</span>
              </a>
            </div>
          </div>

          {/* 🔗 Quick Links */}
          <div className="lg:pl-4">
            <h4 className="text-xl font-bold mb-6 border-b-2 border-white/30 w-fit pb-1">
              Quick Links
            </h4>
            <ul className="space-y-4 text-[15px] font-medium opacity-90">
              <li>
                <Link
                  to="/about"
                  className="hover:opacity-75 transition-opacity"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/programs"
                  className="hover:opacity-75 transition-opacity"
                >
                  Our Programs
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="hover:opacity-75 transition-opacity"
                >
                  Ongoing Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/impact"
                  className="hover:opacity-75 transition-opacity"
                >
                  Impact & Evidence
                </Link>
              </li>
              
            </ul>
          </div>

          {/* 🎯 Our Programs */}
          <div>
            <h4 className="text-xl font-bold mb-6 border-b-2 border-white/30 w-fit pb-1">
              Our Programs
            </h4>
            <ul className="space-y-4 text-[15px] font-medium opacity-90">
              <li>Health & Nutrition</li>
              <li>Education & Child Care</li>
              <li>Women Empowerment</li>
              <li>Agriculture & Climate</li>
              <li>Environment & WASH</li>
            </ul>
          </div>

          {/* 📍 Contact Information */}
          <div>
            <h4 className="text-xl font-bold mb-6 border-b-2 border-white/30 w-fit pb-1">
              Contact
            </h4>
            <ul className="space-y-6 text-[14px] leading-relaxed opacity-95">
              <li className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <span>
                  Sustainable Development Foundation (SDF), Near Dwarka More,
                  Sector-15, Dwarka, Delhi – 110059
                </span>
              </li>

              <li className="flex items-center gap-3">
                <span className="text-xl">📞</span>
                <a href="tel:+919289222127" className="hover:underline">
                  +91 9289222127
                </a>
              </li>

              <li className="flex items-center gap-3">
                <span className="text-xl">✉️</span>
                <a
                  href="mailto:contact@sdfoundation.org"
                  className="hover:underline"
                >
                  contact@sdfoundation.org
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 🔻 BOTTOM STRIP */}
      <div className="border-t border-white/10 bg-black/5 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-row flex-wrap items-center justify-center text-center text-[13px] opacity-80 gap-x-2">
          <p>
            © {new Date().getFullYear()} Sustainable Development Foundation. All
            rights reserved.
          </p>
          <span className="hidden sm:inline">||</span>
          <p>
            
            <a
              href="https://hrntechsolutions.com/digital_creators"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-bold"
            >
              Digital Creators
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
