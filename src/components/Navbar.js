import React, { useState } from 'react';
import { Link } from "react-router-dom";
import '../styles/components/navbar.css';
import '../styles/components/darkModeToggle.css';

function Navbar() {
  const [isActive, setIsActive] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  const closeMenu = () => {
    setIsActive(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div className="navbar">
      <div className={`nav ${isActive ? 'active' : ''}`}>
        <div className="nav-logo">Futebol Amigos</div>
        <div className="dark-mode-container">
          <label className="dark-mode-toggle">
            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <button className="hamburger" onClick={toggleMenu}></button>
        <ul className="nav-list">
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/teams" onClick={closeMenu}>Times</Link></li>
          <li><Link to="/members" onClick={closeMenu}>Membros</Link></li>
          <li><Link to="/schedule" onClick={closeMenu}>Agenda</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
