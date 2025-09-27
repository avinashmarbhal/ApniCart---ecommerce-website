import React from "react";
import Navbar from "../components/Navbar";
import ManageProductComp from "../components/ManageProductComp";
import Footer from "../components/Footer";

function ManageProducts() {
  return (
    <div>
      <Navbar />
      <div className="mt-28">
        <ManageProductComp />
      </div>
      <div className="-mt-19">
        <Footer />
      </div>
    </div>
  );
}

export default ManageProducts;
