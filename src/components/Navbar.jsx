// src/components/Navbar.jsx
import React from 'react';

const Navbar = () => {
  return (
    <nav className="nav-wrapper">
      <div className="nav-container">
        
        {/* Logo Section */}
        <div className="nav-logo">
          Sovereign<span>_Shield
          </span>
        </div>

    
        {/* Status Indicator */}
        <div className="nav-badge">
          <span className="nav-pulse"></span>
          System Online
        </div>

      </div>
    </nav>
  );
};

export default Navbar;