import { useEffect, useState } from "react";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";

const PartnersSection = () => {
  const [partners, setPartners] = useState([]);
  const [publicPartners, setPublicPartners] = useState([]);
  const [societyPartners, setSocietyPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch partners data
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/partners.php?t=${Date.now()}`).then(res => res.json()),
      fetch(`${API_BASE_URL}/public_partners.php?t=${Date.now()}`).then(res => res.json()),
      fetch(`${API_BASE_URL}/society_partners.php?t=${Date.now()}`).then(res => res.json())
    ])
    .then(([partnersRes, publicRes, societyRes]) => {
      if (partnersRes.status === "success") setPartners(partnersRes.data);
      if (publicRes.status === "success") setPublicPartners(publicRes.data);
      if (societyRes.status === "success") setSocietyPartners(societyRes.data);
    })
    .catch((err) => console.error("Error loading partners:", err))
    .finally(() => setLoading(false));
  }, []);

  if (loading) return null; // Or add a loading spinner if you prefer
  if (partners.length === 0 && publicPartners.length === 0 && societyPartners.length === 0) return null; 

  const renderPartnerGrid = (title, data) => {
    if (!data || data.length === 0) return null;
    return (
      <div className="mb-16">
        <h3 className="text-2xl font-serif mb-8 text-[#4a5840]">{title}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {data.map((partner, index) => {
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
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg group"
              >
                <img src={imgSrc} alt={partner.title || "partner"} className="w-[80%] h-auto max-h-20 object-contain mb-4 transition-transform duration-300 group-hover:scale-110" />
                <p className="text-sm font-bold text-gray-600 text-center leading-snug">{partner.title}</p>
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 bg-[#F3EFE4]" id="partners">
      <div className="max-w-7xl mx-auto px-4 text-center">
        
        {/* Heading */}
        <h2 className="text-4xl font-serif mb-12 text-[#233520]">
          Our Partners & Supporters
        </h2>

        {renderPartnerGrid("Corporate Partners", partners)}
        {/* {renderPartnerGrid("Public Partners", publicPartners)}
        {renderPartnerGrid("Society Partners", societyPartners)} */}
      </div>
    </section>
  );
};

export default PartnersSection;