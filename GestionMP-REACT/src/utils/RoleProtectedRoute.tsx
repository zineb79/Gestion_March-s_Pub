import { Navigate, Outlet } from "react-router-dom";

const allowedRoles = ["CHEF_DE_SERVICE", "SECRETAIRE"];
const RoleProtectedRoute: React.FC<{ allowedRoles: string[] }> = ({ allowedRoles }) => {
  const token = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("role")?.toUpperCase().trim(); // Récupérer le rôle de l'utilisateur
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />; // Page d'erreur d'accès refusé
  }
  return <Outlet />;
};

export default RoleProtectedRoute;
