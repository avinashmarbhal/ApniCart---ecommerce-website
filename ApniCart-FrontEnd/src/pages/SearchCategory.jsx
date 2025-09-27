import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import SearchCategoryComp from "../components/SearchCategoryComp";

function SearchCategory() {
  const { id } = useParams();
  return (
    <div>
      <Navbar />
      <div className="mt-40">
        <SearchCategoryComp id={id} />
      </div>
      <Footer />
    </div>
  );
}

export default SearchCategory;
