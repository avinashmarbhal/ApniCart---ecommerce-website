import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  return user?.role=="verifyUser" || user?.role=="admin" || user?.role=="seller" ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
