import React from 'react';
import './NavBar.css'; // We'll create this CSS file

const NavBar = ({ onNavigate }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="navbar-menu">
          <li><button onClick={() => onNavigate('home')}>Home</button></li>
          <li><button onClick={() => onNavigate('login')}>Login</button></li>
          <li><button onClick={() => onNavigate('register')}>Register</button></li>
          <li><button onClick={() => onNavigate('about')}>About Us</button></li>
        </ul>
        <h1 className="navbar-logo">Kipta</h1>
      </div>
    </nav>
  );
};

export default NavBar;