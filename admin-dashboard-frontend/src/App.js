import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import InvestorDashboard from './components/InvestorDashboard';
import ProjectDashboard from './components/ProjectDashboard';
import InvestmentDashboard from './components/InvestmentDashboard';
import Analytics from './components/Analytics'; // Import the Analytics component
import './App.css';
import logo from './logo.png'; // Import the logo image

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
                        {isNavbarOpen ? '◄' : '►'}
                    </button>
                    <ul>
                        <li><a href="/analytics">Home</a></li> {/* Analytics/Home Link */}
                        <li><a href="/admin">Admin Dashboard</a></li>
                        <li><a href="/investors">Investor Dashboard</a></li>
                        <li><a href="/projects">Project Dashboard</a></li>
                        <li><a href="/investments">Investment Dashboard</a></li>
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
