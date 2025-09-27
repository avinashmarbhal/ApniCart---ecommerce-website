import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BannerCarousel from "../components/BannerCarousel";
import FeaturedCategoriesSection from "../components/FeaturedCategoriesSection";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import RelatedProductRows from "../components/RelatedProductRows";
const api = import.meta.env.VITE_API_URL;
function Home() {
  console.log(api);
  
  const [scrollEffectEnabled, setScrollEffectEnabled] = useState(false);
  // Delay scroll-triggered behavior to prevent flicker
  useEffect(() => {
    const timer = setTimeout(() => {
      setScrollEffectEnabled(true);
    }, 600); // Enough time for product fade-in
    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar scrollReady={scrollEffectEnabled} />
      <div className="mt-40 md:mt-20">
      <BannerCarousel />
      </div>
      <div className="flex-1">
        <FeaturedCategoriesSection />
      </div>
      <RelatedProductRows
        currentProductId={"685196591f72b412ba330ce2"}
        currentCategoryId={"682744d10a392e4d00d858f8"}
      />
      <Footer />
    </div>
  );
}

export default Home;
