import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? <Navigate to="/interview" replace /> : children;
};

export default PublicRoute;