import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddress } from "../features/address/addressSlice";
import axios from "axios";

const api = import.meta.env.VITE_API_URL;

const useDefaultAddress = (shouldFetch = false) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!shouldFetch) return;
    const fetchDefaultAddress = async () => {
      try {
        const res = await axios.get(`${api}/address/getDefaultAddress`, {
          withCredentials: true,
        });
        dispatch(setAddress(res.data.defaultAddress));
      } catch (error) {
        console.error("❌ Failed to fetch default address:", error);
      } finally {
        setIsLoaded(true); // ✅ mark complete
      }
    };

    if (user) {
      fetchDefaultAddress();
    } else {
      setIsLoaded(true); // if no user, still mark as loaded to prevent block
    }
  }, [user, dispatch]);

  return isLoaded;
};

export default useDefaultAddress;
