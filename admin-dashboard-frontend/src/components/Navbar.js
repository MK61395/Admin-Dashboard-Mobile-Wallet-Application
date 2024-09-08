import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to="/admin">Admin</Link></li>
                <li><Link to="/investor">Investors</Link></li>
                <li><Link to="/project">Projects</Link></li>
                <li><Link to="/investment">Investments</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
