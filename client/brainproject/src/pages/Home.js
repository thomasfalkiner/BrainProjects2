import React from 'react'
import Login from './Login'
import {useNavigate} from "react-router-dom"
import '../css/Home.css'


function Home() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const isLoggedIn = !!sessionStorage.getItem("accessToken");

  return (
    <div className="home">
      <div className="home-content">
        <h1>Welcome to BIDS Storage</h1>
        <p>Manage, upload, and search your BIDS datasets with ease.</p>
        {!isLoggedIn ? (
          <>
            <p>Please login or register to continue.</p>
            <button className="login-btn" onClick={() => navigate('/login')}>
              Login
            </button>
          </>
        ) : (
          <>
            <p>You are logged in. Choose an action below:</p>
            <div className="home-buttons">
              <button onClick={() => navigate('/search')}>Search</button>
              <button onClick={() => navigate('/upload')}>Upload</button>
              <button onClick={() => navigate('/registration')}>Register User</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;