// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        
        <div className="footer-logo">
          AEGIS<span>_BHARAT</span> 
        </div>

        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} India Innovates Hackathon. All systems operational.
        </div>

        <div className="footer-links">
          <a href="#hero">System Config</a>
          <a href="#architecture">Documentation</a>
          <a href="#contact">Support</a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;