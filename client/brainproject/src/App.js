import './App.css';
import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom"
import Home from './pages/Home'
import Search from './pages/Search'
import Login from './pages/Login'
import Registration from './pages/Registration'

function App() {
  return <div className = "App">
    <Router>
      <Link to="/posts">Posts</Link>
      <Link to="/search">Search</Link>
      <Link to="/login">Log in</Link>
      <Link to="/registration">Register</Link>
      <Routes>
        <Route path="/posts" element ={<Home/>} />
        <Route path="/search" element = {<Search/>} />
        <Route path="/login" element = {<Login/>} />
        <Route path="/registration" element = {<Registration/>} />
      </Routes>
    </Router>
  </div>
}

export default App;
