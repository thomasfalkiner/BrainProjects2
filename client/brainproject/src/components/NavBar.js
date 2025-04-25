import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/NavBar.css"; 

function NavBar() {
  const isLoggedIn = !!sessionStorage.getItem("accessToken");
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-logo">BIDS Storage</h1>

      <div className="navbar-links">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="nav-button">Login</Link>

          </>
        ) : (
          <>
            <Link to = "/" className = "nav-button">Home</Link>
            <Link to="/search" className="nav-button">Search</Link>
            <Link to="/registration" className="nav-button">Register</Link>
            <Link to="/upload" className="nav-button">Upload</Link>
            <button onClick={handleLogout} className="nav-button logout-button">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;