// src/components/Hero.jsx
import React from "react";

const Hero = () => {
  const scrollToArchitecture = () => {
    document
      .getElementById("architecture-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="hero-section">
      <div className="hero-container">

        {/* LEFT CONTENT */}
        <div className="hero-left">
          <p className="hero-eyebrow">
            CYBER DEFENSE SYSTEM
          </p>

          <h1 className="hero-title">
            World’s First Smart <br />
            <span>Offline Cybersecurity</span>
          </h1>

          <p className="hero-desc">
            A sovereign digital immune system — fully offline, self-evolving.
          </p>

          <p className="hero-desc muted">
            A local LLM-powered agent that understands intent and adapts after every attack.
          </p>

          <button className="hero-btn" onClick={scrollToArchitecture}>
            Explore Architecture →
          </button>
        </div>

        {/* RIGHT VISUAL */}
        <div className="hero-right">
          <div className="visual-wrapper">

            <div className="main-card">

              {/* Glow Background */}
              <div className="card-glow"></div>

              {/* Rotating Rings */}
              <div className="ring"></div>

              {/* Pulse Dot */}
              <div className="pulse-dot"></div>

              {/* Lock Icon */}
              <svg className="lock-icon" viewBox="0 0 24 24">
                <path d="M17 10.5V7a5 5 0 0 0-10 0v3.5H5v10h14v-10h-2zm-5 6.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3-6.5H9V7a3 3 0 0 1 6 0v3.5z"/>
              </svg>

              {/* Main Content */}
              <div className="card-content">
                <h3>100%</h3>
                <p>Offline AI Execution</p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;