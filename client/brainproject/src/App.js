import './css/App.css';
import {BrowserRouter as Router, Route, Routes, NavLink} from "react-router-dom"
import Search from './pages/Search'
import Login from './pages/Login'
import Registration from './pages/Registration'

function App() {
  return <div className = "App">
    <Router>
      <NavLink to="/search" className = "nav-button">Search</NavLink>
      <NavLink to="/login" className = "nav-button">Log in</NavLink>
      <NavLink to="/registration" className = "nav-button">Register</NavLink>
      <Routes>
        <Route path="/search" element = {<Search/>} />
        <Route path="/login" element = {<Login/>} />
        <Route path="/registration" element = {<Registration/>} />
      </Routes>
    </Router>
  </div>
}

export default App;
