import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

export default function Carousel({ items, autoplay = true, autoplayDelay = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  // Update container width and mobile status dynamically
  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        setContainerWidth(carouselRef.current.offsetWidth);
      }
      setIsMobile(window.innerWidth < 768);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Autoplay effect
  useEffect(() => {
    if (autoplay) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [autoplay, autoplayDelay, items.length]);

  const handleCarouselClick = () => {
    // Navigate to events page with a hash to scroll to featured events
    navigate("/events#featured-events");
  };

  return (
    <div ref={carouselRef} className="relative w-full overflow-hidden">
      <motion.div
        className="flex w-full"
        animate={{ x: -(currentIndex * containerWidth) }}
        transition={SPRING_OPTIONS}
        style={{ width: `${items.length * containerWidth}px` }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="relative shrink-0 text-white flex flex-col justify-end p-4 cursor-pointer"
            onClick={handleCarouselClick}
            style={{
              backgroundImage: `url(${item.image})`,
              width: `${containerWidth}px`,
              height: isMobile ? "50vh" : "80vh", 
              backgroundSize: isMobile ? "contain" : "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="bg-black bg-opacity-50 p-4 rounded">
              <div className="flex items-center gap-2">
                <FiCircle className="h-[16px] w-[16px] text-white" />
                <h3 className="text-lg font-bold">{item.title}</h3>
              </div>
              <p className="text-sm">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      {/* <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm pointer-events-none z-10">
        Click to view featured events
      </div> */}
    </div>
  );
}