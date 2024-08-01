// src/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Ensure this file contains the necessary styles

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('authToken');
  const isLoggedIn2 = !!localStorage.getItem('adminToken');

  const handleLogout = (e) => {
    e.preventDefault();
    // Clear user authentication data (e.g., tokens, session data)
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminToken');
    // Redirect to login page
    navigate('/');
  };

  
  return (
    <nav className="navbar">
      <div className="container">
        <h1 className="logo">CakeShop</h1>
        <ul className="nav-links">
          {(!isLoggedIn && !isLoggedIn2) && (
            <li><Link to="/">Home</Link></li>
          )}
        {isLoggedIn2 && (
            <>
              <li><Link to="/admindashboard">Home</Link></li>
              <li><Link to="/pastryform">Pastry Form</Link></li>
            </>
          )}
          {(!isLoggedIn2) && (
            <>
              <li><Link to="/cakes">Cakes</Link></li>
              </>
          )}
          {isLoggedIn || isLoggedIn2 ? (
            <li><Link to="/" onClick={handleLogout} className="logout-link">Logout</Link></li>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
