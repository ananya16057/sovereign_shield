'use client';
import React from 'react';

const Hero = () => {

  const scrollToArchitecture = () => {
    document
      .getElementById("architecture-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* FIRST HERO DESIGN */}
      <section className="hero-wrapper">
        
        {/* Top Navbar Area */}
        <div className="hero-top"></div>

        {/* Main Content Split */}
        <div className="hero-content">
          
          {/* Left Side: Text */}
          <div className="hero-text">
            <h1 className="hero-title">
              World's First Smart
              <span className="glow">Offline<br/>Cybersecurity</span>
            </h1>
            <p className="hero-desc" style={{ marginBottom: '1.5rem' }}>
              A sovereign digital immune system — fully offline, self-evolving.
            </p>
            <p className="hero-desc">
              A local LLM-powered agent that understands intent and adapts after every attack.
            </p>
            
            <button className="hero-btn" onClick={scrollToArchitecture}>
              Explore Architecture →
            </button>
          </div>

          {/* Right Side: Visual */}
          <div className="hero-visual">
            <div className="lock-ring">
              <div className="lock-dot"></div>
              <div className="lock-pct">100%</div>

              <svg className="lock-icon" viewBox="0 0 24 24">
                <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-9V6a6 6 0 1 0-12 0v2H5v14h14V8h-1zm-4 0H10V6a2 2 0 0 1 4 0v2z"/>
              </svg>

              <div className="lock-lbl">OFFLINE AI EXECUTION</div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Hero;