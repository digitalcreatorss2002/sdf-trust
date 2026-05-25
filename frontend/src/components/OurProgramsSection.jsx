import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config"; 

const OurProgramsSection = () => {
  const [programsList, setProgramsList] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [programsError, setProgramsError] = useState(null);

  // FETCH PROGRAMS (ProjectSlider logic)
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/programs.php?t=${new Date().getTime()}`);
        const data = await res.json();

        if (data.status === "success") {
          // डेटा को रिवर्स किया ताकि लेटेस्ट पहले आए
          const latestProgramsFirst = [...data.data].reverse();
          setProgramsList(latestProgramsFirst);
        }
      } catch (err) {
        console.error("API Error:", err);
        setProgramsError(err.message || "Failed to fetch programs");
      } finally {
        setProgramsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return (
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
              {/* 🔥 यहाँ हमने .slice(0, 4) जोड़ दिया है, जिससे सिर्फ टॉप 4 लेटेस्ट प्रोग्राम ही दिखेंगे */}
              {programsList.slice(0, 4).map((program, idx) => (
                <div
                  key={program.id || idx}
                  className="bg-white rounded-xl border border-gray-100 text-left hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={program.image_url?.startsWith("http") ? program.image_url : `https://hrntechsolutions.com/backend/admin/${program.image_url}`}
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
                      {program.description && program.description.length > 100
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
  );
};

export default OurProgramsSection;