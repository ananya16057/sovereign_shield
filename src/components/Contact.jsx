import React from 'react';

const contactMethods = [
  {
    id: 1,
    title: "Software Warehouse",
    desc: "Request credentials, API keys, or direct access to our secure software vault and repositories.",
    themeColor: "#00ccff", // Cyan
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
        <line x1="6" y1="6" x2="6.01" y2="6"></line>
        <line x1="6" y1="18" x2="6.01" y2="18"></line>
      </svg>
    )
  },
  {
    id: 2,
    title: "Safe Delivery & Deployment",
    desc: "Coordinate encrypted handoffs, zero-trust deployments, and secure enterprise integration.",
    themeColor: "#00fa9a", // Neon Green
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    )
  },
  {
    id: 3,
    title: "Threat Response Team",
    desc: "Experiencing an anomaly? Connect directly with our live defense engineers for rapid mitigation.",
    themeColor: "#ff4444", // Red
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    )
  }
];

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-header">
        <h2 className="contact-title">Direct Operations</h2>
        <p className="contact-sub">
          Bypass the standard forms. Connect directly with the specific division you need for secure handling and deployment.
        </p>
      </div>

      <div className="contact-grid">
        {contactMethods.map((method) => (
          <div 
            key={method.id} 
            className="contact-card" 
            style={{ '--theme-color': method.themeColor }}
          >
            <div className="contact-icon-wrap">
              {method.icon}
            </div>
            <h3 className="contact-card-title">{method.title}</h3>
            {/* I removed the min-height requirement here since there are no buttons to align anymore */}
            <p className="contact-card-desc" style={{ marginBottom: 0 }}>{method.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Contact;