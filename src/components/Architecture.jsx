'use client';
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

// ─────────────────────────────────────────────────────────────
// DATA - UPDATED FOR ALTERNATING COLORS & HEX FIX ON CARD 9
// ─────────────────────────────────────────────────────────────

const tiers = [
  {
    id: 1, number: "1", subtitle: "ATTACK ENTRY", title: "Computer A: Attack Initiation",
    desc: "A zero-day attack is introduced into an unprotected system through external media or insider access.",
    color: "#ff4444", fluidColor: { r: 0.12, g: 0.01, b: 0.01 },
    badgeIcon: <span className="anim-pulse-red">⚠</span>
  },
  {
    id: 2, number: "2", subtitle: "SYSTEM FAILURE", title: "File Corruption Begins",
    desc: "The malicious code alters critical files, disrupting operations and damaging data integrity.",
    color: "#00ccff", fluidColor: { r: 0.0, g: 0.08, b: 0.15 },
    badgeIcon: <span className="anim-pulse-blue">⚙</span>
  },
  {
    id: 3, number: "3", subtitle: "FULL BREACH", title: "Unauthorized Access & Takeover",
    desc: "The attacker gains full system access, leading to complete compromise and loss of control.",
    color: "#b829ff", fluidColor: { r: 0.07, g: 0.01, b: 0.13 },
    badgeIcon: <span className="anim-pulse-purple">☠</span>
  },
  {
    id: 4, number: "4", subtitle: "ATTACK ATTEMPT", title: "Computer B: Attack Hits Protected System",
    desc: "The same attack targets a system equipped with an Offline AI Security Layer.",
    color: "#ff4444", fluidColor: { r: 0.12, g: 0.01, b: 0.01 },
    badgeIcon: <span>🎯</span>
  },
  {
    id: 5, number: "5", subtitle: "SENSORY LAYER", title: "Real-Time Monitoring Activated",
    desc: "The sensory layer continuously scans system activity, detecting anomalies instantly.",
    color: "#00ccff", fluidColor: { r: 0.0, g: 0.08, b: 0.15 },
    badgeIcon: <span>👁</span>
  },
  {
    id: 6, number: "6", subtitle: "PROCESSING LAYER", title: "Threat Analysis & Neutralization",
    desc: "The processing layer analyzes behavior using a local AI model and blocks the threat before execution.",
    color: "#b829ff", fluidColor: { r: 0.07, g: 0.01, b: 0.13 },
    badgeIcon: <span>🔒</span>
  },
  {
    id: 7, number: "7", subtitle: "ATTACK EVOLUTION", title: "Modified Attack Deployed",
    desc: "The attacker creates a mutated version of the attack to bypass traditional defenses.",
    color: "#ff4444", fluidColor: { r: 0.12, g: 0.01, b: 0.01 },
    badgeIcon: <span>🧬</span>
  },
  {
    id: 8, number: "8", subtitle: "AI LEARNING", title: "Adaptive Intelligence Engaged",
    desc: "The system leverages past attack data to recognize patterns and predict malicious intent.",
    color: "#00ccff", fluidColor: { r: 0.0, g: 0.08, b: 0.15 },
    badgeIcon: <span>🧠</span>
  },
  {
    id: 9, number: "9", subtitle: "FINAL DEFENSE", title: "Threat Blocked Faster",
    desc: "The evolved system neutralizes the new attack instantly, demonstrating a self-learning, resilient defense.",
    color: "#00fa9a", // FIX: Changed var(--neon) to real Hex code so alpha appending works 
    fluidColor: { r: 0.0, g: 0.15, b: 0.08 },
    badgeIcon: <span>🛡</span>
  }
];

// ─────────────────────────────────────────────────────────────
// FLUID SIMULATION — (Your original WebGL code remains exactly the same here)
// Just ensure it accepts `activeColor` as a prop and syncs it.
// ─────────────────────────────────────────────────────────────
const FluidBackground = ({ activeColor }) => {
  const activeColorRef = useRef(activeColor);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  // Keep color ref in sync without restarting the simulation
  useEffect(() => {
    activeColorRef.current = activeColor;
  }, [activeColor]);

  // ... (PASTE YOUR ORIGINAL WEBGL INIT & RENDER LOOP HERE) ...
  // It is perfectly fine as you had it.

  return <canvas ref={canvasRef} className="arch-fluid-canvas" />;
};

// ─────────────────────────────────────────────────────────────
// INDIVIDUAL CARD (Fixed for WAAPI Limits)
// ─────────────────────────────────────────────────────────────
const Card = ({ tier, index, total, scrollYProgress }) => {
  // Calculate the "center point" for this specific card (from 0 to 1)
  const centerPoint = index / (total - 1);
  const windowSize = 0.15; // How quickly it shrinks when leaving center

  // FUNCTION-BASED TRANSFORMS:
  // These calculate the distance from the center and bypass the WAAPI crash
  
  const scale = useTransform(scrollYProgress, (pos) => {
    const distance = Math.abs(pos - centerPoint);
    if (distance >= windowSize) return 0.8;
    return 1.05 - (0.25 * (distance / windowSize)); // Maps 1.05 down to 0.8
  });

  const opacity = useTransform(scrollYProgress, (pos) => {
    const distance = Math.abs(pos - centerPoint);
    if (distance >= windowSize) return 0.3;
    return 1 - (0.7 * (distance / windowSize)); // Maps 1 down to 0.3
  });

  const iconY = useTransform(scrollYProgress, (pos) => {
    const distance = Math.abs(pos - centerPoint);
    if (distance >= windowSize) return 20;
    return -35 + (55 * (distance / windowSize)); // Maps -35 down to 20
  });

  const iconScale = useTransform(scrollYProgress, (pos) => {
    const distance = Math.abs(pos - centerPoint);
    if (distance >= windowSize) return 0.8;
    return 1.3 - (0.5 * (distance / windowSize)); // Maps 1.3 down to 0.8
  });

  return (
    <motion.div
      className="arch-card"
      style={{
        scale,
        opacity,
        '--card-color': tier.color,
        borderTop: `3px solid ${tier.color}`,
      }}
    >
      <div className="arch-card-glow" />
      <div className="arch-card-inner">
        <div className="arch-card-text">
          <div className="arch-step-badge" style={{ color: tier.color }}>
            <span className="arch-step-number">0{tier.number}</span>
            <span className="arch-step-subtitle">{tier.subtitle}</span>
          </div>
          <h3 className="arch-card-title">{tier.title}</h3>
          <p className="arch-card-desc">{tier.desc}</p>
        </div>
        
        <div className="arch-card-visual" style={{ backgroundColor: `${tier.color}12`, borderLeft: `1px solid ${tier.color}30` }}>
          {/* This is the element that "Pops Out" like the Nintendo video */}
          <motion.div 
            className="arch-badge-wrap"
            style={{ y: iconY, scale: iconScale }}
          >
            {tier.badgeIcon}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
// ─────────────────────────────────────────────────────────────
// MAIN ARCHITECTURE COMPONENT
// ─────────────────────────────────────────────────────────────
const Architecture = () => {
  const [activeFluidColor, setActiveFluidColor] = useState(tiers[0].fluidColor);
  const containerRef = useRef(null);

  // Track the scroll of the entire tall section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Translate the track horizontally as the user scrolls down
  // Moves from 0% (start) to a negative percentage (end)
  const trackX = useTransform(scrollYProgress, [0, 1], ["0%", `-${100 - (100 / tiers.length)}%`]);

  // Determine which card is currently active to update the fluid background
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Math to find the closest card index based on current progress
    const closestIndex = Math.round(latest * (tiers.length - 1));
    const newColor = tiers[closestIndex]?.fluidColor;
    
    if (newColor && (newColor.r !== activeFluidColor.r || newColor.g !== activeFluidColor.g || newColor.b !== activeFluidColor.b)) {
      setActiveFluidColor(newColor);
    }
  });

  return (
    // The wrapper needs to be tall to allow for scrolling
    <section ref={containerRef} id="architecture-section" className="arch-horizontal-wrapper">
      
      {/* Absolute wrapper for the background to keep it fixed */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
         <FluidBackground activeColor={activeFluidColor} />
      </div>

      {/* The sticky container that stays on screen while scrolling */}
      <div className="arch-horizontal-sticky">
        
        {/* Absolute header so it stays put while the cards slide */}
        <div className="arch-header" style={{ position: 'absolute', top: 0, width: '100%', zIndex: 10 }}>
          <h2 className="arch-section-title">Live Demonstration Flow</h2>
          <p className="arch-section-sub">
            Scroll to walk through each stage of the attack &amp; defense cycle
          </p>
        </div>

        {/* The horizontally moving track */}
        <motion.div 
          className="arch-card-track"
          style={{ x: trackX }}
        >
          {tiers.map((tier, index) => (
            <Card
              key={tier.id}
              tier={tier}
              index={index}
              total={tiers.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </motion.div>
        
      </div>
    </section>
  );
};

export default Architecture;