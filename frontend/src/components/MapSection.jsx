import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { API_BASE_URL } from "../config";

// --- STATIC STATE DATA ---
const stateDataMap = {
  "Andhra Pradesh": { image: "/images/states/ap.jpg", livesImpacted: "800k+" },
  "Arunachal Pradesh": { image: "/images/states/arunachal.jpg", livesImpacted: "50k+" },
  "Assam": { image: "/images/states/assam.jpg", livesImpacted: "200k+" },
  "Bihar": { image: "/about/news3.png", livesImpacted: "1.5M+" },
  "Chhattisgarh": { image: "/images/states/cg.jpg", livesImpacted: "300k+" },
  "Goa": { image: "/images/states/goa.jpg", livesImpacted: "20k+" },
  "Gujarat": { image: "/images/states/gujarat.jpg", livesImpacted: "600k+" },
  "Haryana": { image: "/images/states/haryana.jpg", livesImpacted: "400k+" },
  "Himachal Pradesh": { image: "/images/states/hp.jpg", livesImpacted: "150k+" },
  "Jharkhand": { image: "/images/states/jharkhand.jpg", livesImpacted: "500k+" },
  "Karnataka": { image: "/images/states/karnataka.jpg", livesImpacted: "750k+" },
  "Kerala": { image: "/images/states/kerala.jpg", livesImpacted: "300k+" },
  "Madhya Pradesh": { image: "/images/states/mp.jpg", livesImpacted: "1.2M+" },
  "Maharashtra": { image: "/images/states/maharashtra.jpg", livesImpacted: "2M+" },
  "Manipur": { image: "/images/states/manipur.jpg", livesImpacted: "40k+" },
  "Meghalaya": { image: "/images/states/meghalaya.jpg", livesImpacted: "60k+" },
  "Mizoram": { image: "/images/states/mizoram.jpg", livesImpacted: "30k+" },
  "Nagaland": { image: "/images/states/nagaland.jpg", livesImpacted: "45k+" },
  "Odisha": { image: "/images/states/odisha.jpg", livesImpacted: "900k+" },
  "Punjab": { image: "/images/states/punjab.jpg", livesImpacted: "400k+" },
  "Rajasthan": { image: "/images/states/rajasthan.jpg", livesImpacted: "1.1M+" },
  "Sikkim": { image: "/images/states/sikkim.jpg", livesImpacted: "25k+" },
  "Tamil Nadu": { image: "/images/states/tn.jpg", livesImpacted: "850k+" },
  "Telangana": { image: "/images/states/telangana.jpg", livesImpacted: "600k+" },
  "Tripura": { image: "/images/states/tripura.jpg", livesImpacted: "70k+" },
  "Uttar Pradesh": { image: "/images/states/up.jpg", livesImpacted: "2.5M+" },
  "Uttarakhand": { image: "/images/states/uttarakhand.jpg", livesImpacted: "200k+" },
  "West Bengal": { image: "/images/states/wb.jpg", livesImpacted: "1.3M+" },
  "Jammu and Kashmir": { image: "/images/states/jk.jpg", livesImpacted: "100k+" }
};

const MapSection = ({ onStateSelect, onDataLoad }) => {
  const mapRef = useRef(null);
  const geoLayerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
      }).setView([22.9734, 78.6569], 5);

      mapRef.current.setMaxBounds([
        [6, 68],
        [38, 97],
      ]);

      mapRef.current.on("click", () => {
        if (onStateSelect) onStateSelect(null);
      });
    }

    const map = mapRef.current;
    let projectData = {};

    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/projects.php?t=${Date.now()}`);
        const result = await res.json();
        const projects = result.data || [];

        projects.forEach((p) => {
          let stateLocations = [];
          if (p.state_locations) {
            try {
              stateLocations = JSON.parse(p.state_locations);
            } catch(e) {}
          }
          
          const benef = parseInt(p.beneficiaries) || 0;

          if (stateLocations && stateLocations.length > 0) {
            stateLocations.forEach(loc => {
              const state = loc.state ? loc.state.trim() : null;
              if (state) {
                if (!projectData[state]) {
                  projectData[state] = {
                    list: [],
                    districtSet: new Set(),
                    blockSet: new Set(),
                    villageSet: new Set(),
                    totalBeneficiaries: 0
                  };
                }
                
                // Add project uniquely per state
                if (!projectData[state].list.find(proj => proj.id === p.id)) {
                    projectData[state].list.push(p);
                    projectData[state].totalBeneficiaries += benef;
                }
                
                if (loc.district) loc.district.split(",").forEach(d => { if (d.trim()) projectData[state].districtSet.add(d.trim().toLowerCase()); });
                if (loc.block) loc.block.split(",").forEach(b => { if (b.trim()) projectData[state].blockSet.add(b.trim().toLowerCase()); });
                if (loc.village) loc.village.split(",").forEach(v => { if (v.trim()) projectData[state].villageSet.add(v.trim().toLowerCase()); });
              }
            });
          } else {
            // Fallback for older entries without state_locations JSON
            const states = p.location ? p.location.split(",").map((s) => s.trim()) : [];
            const districts = p.district ? p.district.split(",").map((d) => d.trim()) : [];
            const blocks = p.block ? p.block.split(",").map((b) => b.trim()) : [];
            const villages = p.village ? p.village.split(",").map((v) => v.trim()) : [];

            states.forEach((state) => {
              if (state) {
                if (!projectData[state]) {
                  projectData[state] = {
                    list: [],
                    districtSet: new Set(),
                    blockSet: new Set(),
                    villageSet: new Set(),
                    totalBeneficiaries: 0
                  };
                }

                projectData[state].list.push(p);
                projectData[state].totalBeneficiaries += benef;

                districts.forEach(d => { if (d) projectData[state].districtSet.add(d.toLowerCase()); });
                blocks.forEach(b => { if (b) projectData[state].blockSet.add(b.toLowerCase()); });
                villages.forEach(v => { if (v) projectData[state].villageSet.add(v.toLowerCase()); });
              }
            });
          }
        });

        // Pass total aggregates back to parent
        if (onDataLoad) {
          const totalProjects = projects.length;
          let totalBeneficiaries = 0;
          let overallDistricts = new Set();
          
          projects.forEach(p => {
             totalBeneficiaries += parseInt(p.beneficiaries) || 0;
             let stateLocations = [];
             try { stateLocations = JSON.parse(p.state_locations || "[]"); } catch(e) {}
             
             if(stateLocations.length > 0) {
                 stateLocations.forEach(loc => {
                     if (loc.district) loc.district.split(',').forEach(d => { if(d.trim()) overallDistricts.add(d.trim().toLowerCase()); });
                 });
             } else {
                 if (p.district) p.district.split(',').forEach(d => { if(d.trim()) overallDistricts.add(d.trim().toLowerCase()); });
             }
          });
          
          const activeStatesCount = Object.keys(projectData).length;
          onDataLoad({
            totalStates: activeStatesCount,
            totalDistricts: overallDistricts.size,
            totalProjects: totalProjects,
            totalBeneficiaries: totalBeneficiaries
          });
        }

        const geoRes = await fetch("/india_states.geojson");
        const geoData = await geoRes.json();

        if (geoLayerRef.current) {
          map.removeLayer(geoLayerRef.current);
        }

        geoLayerRef.current = L.geoJSON(geoData, {
          style: (feature) => {
            const hasProjects = projectData[feature.properties.NAME_1]?.list.length > 0;
            return {
              color: "#ffffff",
              weight: 1.5,
              fillColor: hasProjects ? "#576123" : "#333333",
              fillOpacity: hasProjects ? 0.95 : 0.7,
              className: "state-feature transition-all duration-300",
            };
          },
          onEachFeature: (feature, layer) => {
            const stateName = feature.properties.NAME_1;
            const data = projectData[stateName] || { list: [], districtSet: new Set(), blockSet: new Set(), villageSet: new Set(), totalBeneficiaries: 0 };
            const districtCount = data.districtSet.size;
            const blockCount = data.blockSet.size;
            const villageCount = data.villageSet.size;
            const livesImpactedNum = data.totalBeneficiaries;

            const hasProjects = data.list.length > 0;

            if (hasProjects) {
              layer.bindTooltip(`<div style="display:flex; flex-direction:column; align-items:center; line-height:1.2;"><span>📍</span><span><b>${stateName}</b></span></div>`, {
                permanent: true,
                direction: "center",
                className: "custom-tooltip-permanent",
              });
            } else {
              layer.bindTooltip(`<b>${stateName}</b>`, {
                direction: "center",
                className: "custom-tooltip",
              });
            }

            layer.on({
              mouseover: (e) => {
                const l = e.target;
                l.setStyle({ fillColor: "#1A2718", fillOpacity: 1, weight: 2 });
                if (l._path) l._path.classList.add("state-hovered");
              },
              mouseout: (e) => {
                const l = e.target;
                geoLayerRef.current.resetStyle(l);
                if (l._path) l._path.classList.remove("state-hovered");
              },
              click: (e) => {
                L.DomEvent.stopPropagation(e);
                if (onStateSelect) {
                  // Get static data from the mapping
                  const staticInfo = stateDataMap[stateName] || { 
                    image: "https://via.placeholder.com/400x250?text=SDF+Presence", 
                    livesImpacted: "0" 
                  };

                  onStateSelect({
                    name: stateName,
                    projects: data.list,
                    districtCount: districtCount,
                    blockCount: blockCount,
                    villageCount: villageCount,
                    staticImage: staticInfo.image,
                    livesImpacted: livesImpactedNum > 0 ? livesImpactedNum : staticInfo.livesImpacted
                  });
                }
              },
            });
          },
        }).addTo(map);

        map.fitBounds(geoLayerRef.current.getBounds());
        setLoading(false);
      } catch (error) {
        console.error("Map Data Error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [onStateSelect]);

  return (
    <div className="relative w-full h-full bg-transparent overflow-hidden">
      <style>{`
        .leaflet-container { background: transparent !important; }
        path.state-feature {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), fill 0.3s ease;
            cursor: pointer;
            outline: none;
        }
        path.state-hovered {
            transform: scale(1.015) translate(0, -2px);
            filter: drop-shadow(0px 8px 15px rgba(0, 0, 0, 0.5));
            z-index: 999 !important;
        }
        .custom-tooltip {
            background: white !important;
            border: none !important;
            border-radius: 8px !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
            padding: 8px 12px !important;
            color: #1a1a1a !important;
            font-weight: bold;
        }
        .custom-tooltip-permanent {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            color: white !important;
            font-weight: bold;
            font-size: 0.85rem;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
            pointer-events: none;
        }
      `}</style>

      {loading && (
        <div className="map-loader absolute inset-0 flex items-center justify-center font-bold text-[#576123]">
          Loading Map Data...
        </div>
      )}

      <div id="map" style={{ height: "100%", width: "100%", zIndex: 1 }}></div>
    </div>
  );
};

export default MapSection;