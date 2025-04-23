import React from "react";
import { Navigate } from "react-router-dom";

// A protected route that checks if the user is logged in
function ProtectedRoute({ element: Component, ...rest }) {
  const isLoggedIn = !!sessionStorage.getItem("accessToken");

  return isLoggedIn ? (
    Component // Render the component if the user is logged in
  ) : (
    <div className="login-warning">
      <h2>Please log in to access this page</h2>
      <button onClick={() => window.location.href = "/login"}>Go to Login</button>
    </div>
  );
}

export default ProtectedRoute;