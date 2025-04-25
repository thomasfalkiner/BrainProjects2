import './css/App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Search from './pages/Search';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Upload from './pages/Upload';
import Home from './pages/Home';
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar /> {/* This will appear on every page */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/search" element={<ProtectedRoute element={<Search />} />} />
          <Route path="/upload" element={<ProtectedRoute element={<Upload />} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
