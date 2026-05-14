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

function Testimonials() { // Removed props, we fetch inside now
  const [testimonials, setTestimonials] = useState([]);
  const scrollRef = useRef();

  // 1. Fetch data from PHP
  useEffect(() => {
    fetch(`${API_BASE_URL}/testimonial.php?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => setTestimonials(data))
      .catch(err => console.error("Error loading stories:", err));
  }, []);

  // 2. Your Auto-Scroll Animation Logic
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || testimonials.length === 0) return; // Don't scroll if empty

    let animationFrame;
    const speed = 0.5;

    const scroll = () => {
      container.scrollLeft += speed;
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
        container.scrollLeft = 0;
      }
      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrame);
  }, [testimonials]); // Re-run when testimonials are loaded

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-serif mb-10">Stories of Impact</h2>
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-8">
          {testimonials.map((item, index) => {
            let imgSrc = item.image;
            if (imgSrc && !imgSrc.startsWith("http")) {
              imgSrc = `${ADMIN_BASE_URL}${imgSrc}`;
            }
            if (!imgSrc) imgSrc = 'https://via.placeholder.com/150';

            return (
              <div key={index} className="min-w-75 bg-gray-100 p-6 rounded-2xl flex gap-4 text-left">
                <img 
                  src={imgSrc} 
                  className="w-16 h-16 rounded-full object-cover shrink-0" 
                />
                <div>
                  <p className="text-sm italic mb-2">"{item.message}"</p>
                  <h4 className="font-bold text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.title}</p>
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