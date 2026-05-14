import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";

const BASE_URL = ADMIN_BASE_URL;

const makeImageUrl = (path) => {
  if (!path) {
    return "https://via.placeholder.com/1200x800?text=No+Image";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${BASE_URL}${path.replace(/^\/+/, "")}`;
};

const PressCoverageDetails = () => {
  const { slug } = useParams();

  const [coverage, setCoverage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ NEW STATES
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchCoverage = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/press_coverage.php?t=${Date.now()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch press coverage details");
        }

        const data = await response.json();

        if (data.status !== "success") {
          throw new Error(data.message || "Could not load coverage data");
        }

        const foundCoverage = data.data.find((item) => item.slug === slug);

        if (!foundCoverage) {
          throw new Error("Coverage not found");
        }

        // ✅ MULTIPLE IMAGES HANDLE
        const images = foundCoverage.images
          ? foundCoverage.images.map((img) => makeImageUrl(img))
          : [makeImageUrl(foundCoverage.image)];

        setCoverage({
          ...foundCoverage,
          image: makeImageUrl(foundCoverage.image),
          images,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoverage();
  }, [slug]);

  const openModal = (img, index) => {
    setSelectedImage(img);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % coverage.images.length;
    setSelectedImage(coverage.images[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  const prevImage = () => {
    const prevIndex =
      (currentIndex - 1 + coverage.images.length) %
      coverage.images.length;
    setSelectedImage(coverage.images[prevIndex]);
    setCurrentIndex(prevIndex);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !coverage) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      <article className="max-w-4xl mx-auto px-4 pt-16 pb-12">

        <h1 className="text-4xl font-bold mb-6">{coverage.title}</h1>

        {/* ✅ FEATURE IMAGE */}
        <img
          src={coverage.image}
          className="w-full h-96 object-cover rounded-xl mb-8 cursor-pointer"
          onClick={() => openModal(coverage.image, 0)}
        />

        {/* ✅ IMAGE GALLERY */}
        {coverage.images && coverage.images.length > 1 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {coverage.images.map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-full h-40 object-cover rounded-lg cursor-pointer hover:scale-105 transition"
                onClick={() => openModal(img, i)}
              />
            ))}
          </div>
        )}

        {/* ✅ TEXT */}
        {(coverage.para || "").split("\n").map((p, i) => (
          <p key={i} className="mb-4 text-gray-700">
            {p}
          </p>
        ))}
      </article>

      {/* ✅ MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">

          {/* Close */}
          <button
            className="absolute top-5 right-5 text-white text-3xl"
            onClick={closeModal}
          >
            ✕
          </button>

          {/* Prev */}
          <button
            className="absolute left-5 text-white text-3xl"
            onClick={prevImage}
          >
            ←
          </button>

          {/* Image */}
          <img
            src={selectedImage}
            className="max-h-[80vh] max-w-[90vw] rounded-lg"
          />

          {/* Next */}
          <button
            className="absolute right-5 text-white text-3xl"
            onClick={nextImage}
          >
            →
          </button>
        </div>
      )}

      <div className="text-center pb-10">
        <Link to="/media">Back</Link>
      </div>
    </div>
  );
};

export default PressCoverageDetails;