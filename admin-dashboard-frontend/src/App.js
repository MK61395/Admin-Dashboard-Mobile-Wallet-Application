import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import InvestorDashboard from './components/InvestorDashboard';
import ProjectDashboard from './components/ProjectDashboard';
import InvestmentDashboard from './components/InvestmentDashboard';
import Analytics from './components/Analytics'; // Import the Analytics component
import './App.css';
import logo from './assets/logo.png'; // Import the logo image
import adminIcon from './assets/admin.svg'; // Import the icons
import investmentIcon from './assets/investment.svg';
import investorIcon from './assets/investor.svg';
import projectIcon from './assets/project.svg';
import homeIcon from './assets/analytics.svg'; // Assuming you add a home icon as well

function App() {
    const [isNavbarOpen, setIsNavbarOpen] = useState(true);

    const toggleNavbar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    return (
        <Router>
            <div className={`app-container ${isNavbarOpen ? 'navbar-open' : 'navbar-closed'}`}>
  <div className="navbar">
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
                    </ul>
                </div>
                <div className="content">
                    <Routes>
                        <Route path="/analytics" element={<Analytics />} /> {/* Default route for Analytics */}
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/investors" element={<InvestorDashboard />} />
                        <Route path="/projects" element={<ProjectDashboard />} />
                        <Route path="/investments" element={<InvestmentDashboard />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
