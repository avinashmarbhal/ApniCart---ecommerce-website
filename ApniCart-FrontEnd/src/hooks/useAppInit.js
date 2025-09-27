import { useEffect, useState } from "react";
import useAuthCheck from "./useAuthCheck";
import useDefaultAddress from "./useDefaultAddress";
import useFetchCart from "./useFetchCart";

const useAppInit = () => {
  const role = useAuthCheck(); // 'verifyUser', 'admin', 'seller', or 'not'
  const shouldFetchUserData = role === "verifyUser";

  const addressReady = useDefaultAddress(shouldFetchUserData);
  const cartReady = useFetchCart(shouldFetchUserData);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (role === "verifyUser" && addressReady && cartReady) {
      setIsReady(true);
    } else if (role === "admin" || role === "seller" || role === "not") {
      setIsReady(true);
    }
  }, [role, addressReady, cartReady]);

  return isReady;
};

export default useAppInit;
