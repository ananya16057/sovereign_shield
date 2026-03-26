import React from 'react';

const contactMethods = [
  {
    id: 1,
    title: "Software Warehouse",
    desc: "Request credentials, API keys, or direct access to our secure software vault and repositories.",
    actionText: "Request Access",
    actionLink: "mailto:warehouse@indiainnovates.com?subject=Warehouse%20Access%20Request",
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
    actionText: "Schedule Delivery",
    actionLink: "mailto:deployment@indiainnovates.com?subject=Safe%20Delivery%20Inquiry",
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
    actionText: "Open Secure Channel",
    actionLink: "tel:+910000000000", // Replace with a real phone number or Discord link
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
            <p className="contact-card-desc">{method.desc}</p>
            
            <a href={method.actionLink} className="contact-action">
              {method.actionText}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Contact;