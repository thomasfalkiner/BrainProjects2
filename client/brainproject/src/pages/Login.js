import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const login = () => {
    const data = { username, password };

    axios.post("http://localhost:3001/users/login", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        sessionStorage.setItem("accessToken", response.data);
        nav("/");
      }
    });
  };

  return (
    <div className="login-wrapper">
      <div className="login2">
        <label>Username:</label>
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}

export default Login;
