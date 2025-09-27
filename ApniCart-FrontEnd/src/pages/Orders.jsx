import React from "react";
import OrdersComp from "../components/OrdersComp";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Orders() {
  return (
    <div>
      <Navbar />
      <div className="mt-28">
        <OrdersComp />
      </div>
      <div className="-mt-20">
        <Footer />
      </div>
    </div>
  );
}

export default Orders;
