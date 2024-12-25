import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  role: string; // Vai trò yêu cầu
  children: React.ReactNode; // Nội dung
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ role, children }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  if (!currentUser || !currentUser.role) {
    return <Navigate to="/login" />;
  }

  if (currentUser.role !== role) {
    alert("Bạn không có quyền truy cập.");
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
