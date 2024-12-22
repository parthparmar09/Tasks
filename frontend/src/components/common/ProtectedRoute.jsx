import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useLazyFetchUserQuery } from "../../redux/slices/userApiSlice";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";

const ProtectedRoute = ({ roles = [], children }) => {
  const { user, login } = useAuth();
  const [fetchUser] = useLazyFetchUserQuery();
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthorized: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const validateUser = async () => {
      if (!token) {
        setAuthState({ isLoading: false, isAuthorized: false });
        return;
      }

      try {
        if (!user) {
          const userData = await fetchUser().unwrap();
          login(userData);
        }

        const userHasAccess = roles.length === 0 || roles.includes(user?.role);

        setAuthState({ isLoading: false, isAuthorized: userHasAccess });
      } catch (err) {
        console.error("Error validating user:", err);
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("authToken");
        setAuthState({ isLoading: false, isAuthorized: false });
      }
    };

    validateUser();
  }, [user]);

  if (authState.isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!authState.isAuthorized) return <Navigate to="/unauthorized" replace />;

  return children || <Outlet />;
};

export default ProtectedRoute;
