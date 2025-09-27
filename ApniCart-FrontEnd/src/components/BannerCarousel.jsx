import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.png";
import img5 from "../assets/img5.png";

const rawSlides = [
  {
    id: 1,
    image: img1,
    alt: "fashion",
    path: "/SearchCategory/",
    categoryId: "682744df0a392e4d00d858fa",
  },
  {
    id: 2,
    image: img2,
    alt: "Fitness",
    path: "/SearchCategory/",
    categoryId: "682745030a392e4d00d85900",
  },
  {
    id: 3,
    image: img3,
    alt: "Electronics",
    path: "/SearchCategory/",
    categoryId: "682744d10a392e4d00d858f8",
  },
  {
    id: 4,
    image: img4,
    alt: "Fruits",
    path: "/SearchCategory/",
    categoryId: "6827452c0a392e4d00d85908",
  },
  {
    id: 5,
    image: img5,
    alt: "Mobile",
    path: "/SearchCategory/",
    categoryId: "682744d10a392e4d00d858f8",
  },
];

const BannerCarousel = () => {
  const slides = [...rawSlides, rawSlides[0]]; // clone first at end
  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      goToNextSlide();
    }, 3000);

    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  const goToNextSlide = () => {
    if (current < slides.length - 1) {
      setCurrent((prev) => prev + 1);
      setTransition(true);
    }
  };

  const goToPrevSlide = () => {
    if (current === 0) {
      setTransition(false);
      setCurrent(slides.length - 2);
    } else {
      setCurrent((prev) => Math.max(0, prev - 1));
      setTransition(true);
    }
  };

  const handleTransitionEnd = () => {
    if (current === slides.length - 1) {
      setTransition(false);
      setCurrent(0);
    }
  };

  return (
    <div className="relative w-full overflow-hidden min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[400px]">
      {/* Slide Track */}
      <div
        className="flex h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px]"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: transition ? "transform 0.7s ease-in-out" : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((slide, index) => (
          <Link
            key={index}
            to={`${slide.path}${slide.categoryId}`}
            className="w-full flex-shrink-0"
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
          </Link>
        ))}
      </div>

      {/* Left Button */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 sm:p-2 z-20"
      >
        <span className="text-lg sm:text-xl font-bold text-gray-700">&lt;</span>
      </button>

      {/* Right Button */}
      <button
        onClick={goToNextSlide}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 sm:p-2 z-20"
      >
        <span className="text-lg sm:text-xl font-bold text-gray-700">&gt;</span>
      </button>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-white to-transparent z-10" />
    </div>
  );
};

export default BannerCarousel;
