// src/components/Terminal.jsx
import React, { useState, useEffect } from 'react';

const Terminal = () => {
  const [visibleLines, setVisibleLines] = useState(0);

  // Simulated AI Pipeline Logs to prove the 3-Tier Architecture
  const logs = [
    { time: '03:14:02.102', type: 'info', text: 'SYSCALL: Process explorer.exe -> WriteFile (Whitelisted)' },
    { time: '03:15:44.891', type: 'info', text: "USB_MOUNT: Device 'KINGSTON' detected on Port 2." },
    { time: '03:15:45.001', type: 'warn', text: "WARNING: Unknown executable 'mutated_worm_v9.exe' initiated." },
    { time: '03:15:45.005', type: 'crit', text: 'ALERT: Synchronous API Hook triggered. Thread frozen.' },
    { time: '03:15:45.210', type: 'info', text: 'SLM_QUERY: Analyzing frozen intent. Matches T1055 (Process Injection).' },
    { time: '03:15:45.215', type: 'succ', text: 'RESOLVED: Malicious thread terminated. Grid remains secure.' },
  ];

  // Timing array for staggered rendering (in milliseconds)
  useEffect(() => {
    const delays = [500, 1500, 2500, 3000, 4800, 5200];
    
    delays.forEach((delay, index) => {
      setTimeout(() => {
        setVisibleLines((prev) => Math.max(prev, index + 1));
      }, delay);
    });
  }, []);

  return (
    <section id="terminal" className="terminal-section">
      
      <div className="terminal-header-text">
        <h2>Live Threat Interception</h2>
        <p>Watch our 3-Tier Pipeline in action. Aegis-Bharat freezes zero-day malware at the OS level, giving the offline SLM time to analyze intent without sacrificing CPU performance.</p>
      </div>

      <div className="terminal-wrapper">
        <div className="terminal-window">
          
          {/* Top Bar */}
          <div className="terminal-top-bar">
            <span className="terminal-title">admin@aegis-node-01: /scada/monitor</span>
            <span className="terminal-status">
              <span className="nav-pulse"></span>
              Active Shield
            </span>
          </div>

          {/* Terminal Output */}
          <div className="terminal-body">
            {logs.slice(0, visibleLines).map((log, index) => (
              <div key={index} className="log-line">
                <span className="log-time">[{log.time}]</span>
                <span className={`log-${log.type}`}>{log.text}</span>
              </div>
            ))}
            
            {/* Blinking Cursor at the end of the active line */}
            {visibleLines > 0 && <span className="cursor"></span>}
          </div>

        </div>
      </div>
      
    </section>
  );
};

export default Terminal;