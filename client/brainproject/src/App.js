import './css/App.css';
import {BrowserRouter as Router, Route, Routes, NavLink} from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import {useState} from 'react'
import Search from './pages/Search'
import Login from './pages/Login'
import Registration from './pages/Registration'
import ProtectedRoute from "./components/ProtectedRoute"

import NavBar from "./components/NavBar"; // adjust path if needed

function App() {
  return (
    <Router>
      <div className="App">

        <NavBar />
         <Routes>

            <Route path="/login" element = {<Login/>} />
            <Route path="/registration" element = {<Registration/>} />
            <Route path="/search" element={<ProtectedRoute element={<Search />} />}
              />
          </Routes>

     </div>
    </Router>
  );
}





export default App;
