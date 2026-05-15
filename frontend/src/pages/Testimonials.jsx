// import { useEffect, useRef } from "react";

// function Testimonials({ testimonials }) {
//   const scrollRef = useRef();

//   useEffect(() => {
//     const container = scrollRef.current;
//     let animationFrame;

//     const speed = 0.5;

//     const scroll = () => {
//       if (!container) return;

//       container.scrollLeft += speed;

     
//       if (
//         container.scrollLeft + container.clientWidth >=
//         container.scrollWidth
//       ) {
//         container.scrollLeft = 0;
//       }

//       animationFrame = requestAnimationFrame(scroll);
//     };

//     animationFrame = requestAnimationFrame(scroll);

//     return () => cancelAnimationFrame(animationFrame);
//   }, []);

//   return (
//     <section className="py-10 bg-white">
//       <div className="max-w-7xl mx-auto px-4 text-center">
//         <h2 className="text-3xl font-serif mb-10">Stories of Impact</h2>

        
//         <div
//           ref={scrollRef}
//           className="flex gap-6 overflow-x-auto scrollbar-hide pb-8"
//         >
//           {testimonials.map((item, index) => (
//             <div
//               key={index}
//               className="min-w-70 bg-gray-100 p-6 rounded-2xl flex gap-4"
//             >
//               <img
//                 src={item.image}
//                 className="w-16 h-16 rounded-full object-cover"
//               />

//               <div>
//                 <p className="text-sm italic">{item.message}</p>
//                 <h4 className="font-bold text-sm">{item.title}</h4>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Testimonials;



import { useEffect, useRef, useState } from "react";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const scrollRef = useRef();

  // 🔥 FIXED: Direct root extraction logic for Bluehost
  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/150x150?text=SDF";
    if (path.startsWith("http")) return path;

    // ADMIN_BASE_URL (https://hrntechsolutions.com/backend/admin) se root nikalna
    const rootDomain = ADMIN_BASE_URL.split("/backend/admin")[0].replace(/\/+$/, "");
    const cleanPath = path.replace(/^\/+/, "");

    // Path structure: domain/backend/admin/uploads/...
    return `${rootDomain}/backend/admin/${cleanPath}`;
  };

  // 1. Fetch data from PHP
  useEffect(() => {
    fetch(`${API_BASE_URL}/testimonial.php?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        // Checking if data is coming correctly
        if (data.status === "success") {
          setTestimonials(data.data);
        } else if (Array.isArray(data)) {
          setTestimonials(data);
        }
      })
      .catch((err) => console.error("Error loading stories:", err));
  }, []);

  // 2. Auto-Scroll Animation Logic
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || testimonials.length === 0) return;

    let animationFrame;
    const speed = 0.5;

    const scroll = () => {
      container.scrollLeft += speed;
      // Restart scroll when it reaches the end
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
        container.scrollLeft = 0;
      }
      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrame);
  }, [testimonials]);

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-serif mb-10">Stories of Impact</h2>
        
        <div 
          ref={scrollRef} 
          className="flex gap-6 overflow-x-auto no-scrollbar pb-8 cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((item, index) => {
            // FIXED: Using helper for image path
            const imgSrc = getImageUrl(item.image);

            return (
              <div 
                key={item.id || index} 
                className="min-w-[300px] md:min-w-[350px] bg-gray-50 p-6 rounded-2xl flex gap-4 text-left border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <img 
                  src={imgSrc} 
                  alt={item.name}
                  className="w-16 h-16 rounded-full object-cover shrink-0 border-2 border-primary/10" 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://placehold.co/150x150?text=No+User";
                  }}
                />
                <div>
                  <p className="text-sm italic mb-2 text-gray-600">"{item.message}"</p>
                  <h4 className="font-bold text-sm text-text-primary">{item.name}</h4>
                  <p className="text-[10px] uppercase font-bold text-primary tracking-wider">{item.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;