import React, { useState, useEffect } from "react";
import ProductList from "./ProductList";
import useCategoryData from "../hooks/useCategoryData";

const FeaturedCategoriesSection = () => {
  const { categories, loading } = useCategoryData();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setVisible(true), 100); // slight fade delay
    }
  }, [loading]);

  const getCategoryByName = (name) =>
    categories.find((cat) => cat.name === name);

  const electronics = getCategoryByName("Electronics");
  const fashion = getCategoryByName("Fashion");
  const home = getCategoryByName("Home & Kitchen");
  const sports = getCategoryByName("Sports & Fitness");
  const automotive = getCategoryByName("Automotive");
  const grocery = getCategoryByName("Grocery");

  const noCategories =
    !electronics && !fashion && !home && !sports && !automotive && !grocery;

  return (
    <div
      className={`min-h-[600px] transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      } flex flex-wrap justify-center gap-6 -mt-8 px-2 md:px-4 relative z-10`}
    >
      {loading ? null : (
        <>
          {electronics && (
            <ProductList categoryId={electronics._id} title="Top Electronics" />
          )}
          {fashion && (
            <ProductList categoryId={fashion._id} title="Top Fashion" />
          )}
          {home && (
            <ProductList
              categoryId={home._id}
              title="Top Home & Kitchen"
            />
          )}
          {sports && (
            <ProductList
              categoryId={sports._id}
              title="Top Sports & Fitness"
            />
          )}
          {automotive && (
            <ProductList categoryId={automotive._id} title="Top Automotive" />
          )}
          {grocery && (
            <ProductList categoryId={grocery._id} title="Top Grocery" />
          )}
          {noCategories && (
            <div className="text-center text-lg mt-6">
              No featured categories found.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeaturedCategoriesSection;
