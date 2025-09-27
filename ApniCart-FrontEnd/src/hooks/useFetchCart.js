import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCartData } from "../features/cart/cartSlice";
import axios from "axios";
import { toast } from "react-hot-toast";

const api = import.meta.env.VITE_API_URL;

const useFetchCart = (shouldFetch = false) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!shouldFetch) return;
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${api}/cart`, {
          withCredentials: true,
        });

        const cart = res.data.cart;

        dispatch(
          setCartData({
            cartItems: cart.item || [],
            totalItems: cart.totalItems || 0,
            totalMrpPrice: cart.totalMrpPrice || 0,
            totalDiscountedPrice: cart.totalDiscountedPrice || 0,
          })
        );
      } catch (err) {
        // toast.error("❌ Failed to fetch cart");
        console.error(err);
      } finally {
        setIsLoaded(true); // ✅ Always mark as loaded (success or fail)
      }
    };

    if (user?._id) {
      fetchCart();
    } else {
      setIsLoaded(true); // ✅ No user = nothing to fetch
    }
  }, [user, dispatch]);

  return isLoaded;
};

export default useFetchCart;
