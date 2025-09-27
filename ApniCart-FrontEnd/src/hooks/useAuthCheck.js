import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../features/user/userSlice";

const api = import.meta.env.VITE_API_URL;

function useAuthCheck() {
  const dispatch = useDispatch();
  const [role, setRole] = useState("not"); // undefined = loading, null = not logged in

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(`${api}/verify`, {
          withCredentials: true,
        });

        const user = res.data.user;
        if (user) {
          dispatch(setUser(user));
          setRole(user.role);
        } else {
          dispatch(clearUser());
          setRole(null);
        }
      } catch (err) {
        dispatch(clearUser());
        setRole(null);
      }
    };

    verifyUser();
  }, [dispatch]);

  return role; // undefined → still loading, null → not authenticated
}

export default useAuthCheck;
