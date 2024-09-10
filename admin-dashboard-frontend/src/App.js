import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import InvestorDashboard from './components/InvestorDashboard';
import ProjectDashboard from './components/ProjectDashboard';
import InvestmentDashboard from './components/InvestmentDashboard';
import Analytics from './components/Analytics';
import Login from './components/Login';
import './App.css';
import logo from './assets/logo.png';
import adminIcon from './assets/admin.svg';
import investmentIcon from './assets/investment.svg';
import investorIcon from './assets/investor.svg';
import projectIcon from './assets/project.svg';
import homeIcon from './assets/analytics.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // for the logout icon


function App() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <AppContent
        isLoggedIn={isLoggedIn}
        isNavbarOpen={isNavbarOpen}
        toggleNavbar={toggleNavbar}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
    </Router>
  );
}

function AppContent({ isLoggedIn, isNavbarOpen, toggleNavbar, handleLogin, handleLogout }) {
  const location = useLocation();

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`app-container ${isNavbarOpen ? 'navbar-open' : 'navbar-closed'}`}>
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="Logo" />
          <span>Ritter Dahait</span>
        </div>
        <button className="navbar-toggle" onClick={toggleNavbar}>
          <span className={`arrow ${isNavbarOpen ? 'arrow-open' : 'arrow-closed'}`}></span>
        </button>
        <ul>
          <li>
            <a href="/analytics">
              <img src={homeIcon} alt="Home" className="icon" /> Analytics Dashboard
            </a>
          </li>
          <li>
            <a href="/admin">
              <img src={adminIcon} alt="Admin" className="icon" /> Admin Dashboard
            </a>
          </li>
          <li>
            <a href="/investors">
              <img src={investorIcon} alt="Investors" className="icon" /> Investor Dashboard
            </a>
          </li>
          <li>
            <a href="/projects">
              <img src={projectIcon} alt="Projects" className="icon" /> Project Dashboard
            </a>
          </li>
          <li>
            <a href="/investments">
              <img src={investmentIcon} alt="Investments" className="icon" /> Investment Dashboard
            </a>
          </li>
          <li>
          <button className="logout-button" onClick={handleLogout}>
  <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '8px', transform: 'scaleX(-1)' }} />
  Logout
</button>

          </li>
        </ul>
      </nav>
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/analytics" replace />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/investors" element={<InvestorDashboard />} />
          <Route path="/projects" element={<ProjectDashboard />} />
          <Route path="/investments" element={<InvestmentDashboard />} />
          <Route path="*" element={<Navigate to="/analytics" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;