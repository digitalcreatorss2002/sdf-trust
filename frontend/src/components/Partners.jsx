import { useEffect, useState } from "react";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";

const PartnersSection = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch partners data
  useEffect(() => {
    fetch(`${API_BASE_URL}/partners.php?t=${Date.now()}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          setPartners(result.data);
        }
      })
      .catch((err) => console.error("Error loading partners:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null; // Or add a loading spinner if you prefer
  if (partners.length === 0) return null; // Don't show section if no partners exist

  return (
    <section className="py-20 bg-[#F3EFE4]">
      <div className="max-w-7xl mx-auto px-4 text-center">
        
        {/* Heading */}
        <h2 className="text-4xl font-serif mb-12 text-[#233520]">
          Our Partners & Supporters
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          
          {partners.map((partner, index) => {
            // Handle local vs absolute image URLs
            let imgSrc = partner.img;
            if (imgSrc && !imgSrc.startsWith("http")) {
              imgSrc = `${ADMIN_BASE_URL}${imgSrc}`;
            }
            if (!imgSrc) imgSrc = 'https://via.placeholder.com/150';

            return (
              <a
                key={partner.id || index}
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 
                flex flex-col items-center justify-center 
                transition-all duration-300 ease-in-out 
                hover:scale-105 hover:shadow-lg group"
              >
                {/* Logo */}
                <img
                  src={imgSrc}
                  alt={partner.title || "partner"}
                  className="w-[80%] h-auto max-h-20 object-contain mb-4 
                  transition-transform duration-300 group-hover:scale-110"
                />

                {/* Title */}
                <p className="text-sm font-bold text-gray-600 text-center leading-snug">
                  {partner.title}
                </p>
              </a>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default PartnersSection;