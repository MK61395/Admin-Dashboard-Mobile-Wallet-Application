import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to="/">Admin</Link></li>
                <li><Link to="/investors">Investors</Link></li>
                <li><Link to="/projects">Projects</Link></li>
                <li><Link to="/investments">Investments</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
