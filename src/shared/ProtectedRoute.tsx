import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const loggedIn = localStorage.getItem("mekyasLoggedIn") === "true";
  const location = useLocation();
  // Debug:
  // console.log("ProtectedRoute loggedIn =", loggedIn);
  return loggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/mekyas" replace state={{ from: location }} />
  );
}
