import React, {useEffect, useState} from "react";
import axios from "axios"
import { Navigate } from "react-router-dom";

// A protected route that checks if the user is logged in
function ProtectedRoute({ element: Component}) {
  const [isLoggedIn, setLoggedIn] = useState(null)
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken")

    if (!token) {

      setLoggedIn(false);
      return;
    }
    
    axios.get("http://localhost:3001/users/check", {
      headers: {accessToken: token}
    }).then((response) => {
      if (response.data.valid === true) {
        setLoggedIn(true);
      }
    }).catch((error) => {
      console.error("Permission denied")
      setLoggedIn(false)
    })
  }, [])


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