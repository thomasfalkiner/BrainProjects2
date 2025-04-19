import './App.css';
import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom"
import Home from './pages/Home'
import Search from './pages/Search'

function App() {
  return <div className = "App">
    <Router>
      <Link to="/posts">Posts</Link>
      <Link to="/search">Search</Link>
      <Routes>
        <Route path="/posts" element ={<Home/>} />
        <Route path="/search" element = {<Search/>} />
      </Routes>
    </Router>
  </div>
}

export default App;
