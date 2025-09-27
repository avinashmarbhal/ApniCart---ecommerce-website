import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderCard from "./OrderCard";
import noOrder from "../assets/no-order.json";
import Lottie from "lottie-react";

const api = import.meta.env.VITE_API_URL;

const OrdersComp = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get(`${api}/order/orders`, { withCredentials: true })
      .then((res) => {
        setOrders(res.data.orders || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 max-w-screen-lg mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center sm:text-left">
        Your Orders
      </h1>

      {orders.length > 0 ? (
        orders.map((order) => <OrderCard key={order._id} order={order} />)
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <Lottie
            animationData={noOrder}
            loop
            style={{ height: 250, width: 250 }}
          />
          <p className="text-xl sm:text-2xl text-gray-600 mt-4 text-center">
            No Orders Found!
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdersComp;
