import React from "react";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  if (token) {
    return children;
  } else {
    // Redirect to login or display a message (optional)
    return <Text>You are not authorized to access this route.</Text>;
  }
};

export default ProtectedRoute;
