import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const [showRedirect, setShowRedirect] = useState(false);

  console.log(user?.role);
  

  useEffect(() => {
    if (user === null) {
      setShowRedirect(true);
      const timer = setTimeout(() => setShowRedirect(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // If user is still being fetched, show loading spinner briefly
  if (user === null) {
    return showRedirect ? (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
        <span className="ml-3 text-gray-700">Redirecting to login...</span>
      </div>
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }

  // If user is logged in but not authorized
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // User is authorized
  return <Outlet />;
};

export default ProtectedRoute;
