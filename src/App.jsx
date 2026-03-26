// src/App.jsx
import React from 'react';
import './styles/globals.css'; 

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Architecture from './components/Architecture'; 
import Terminal from './components/Terminal'; 
import Contact from './components/Contact'; // <-- Added
import Footer from './components/Footer';   // <-- Added

function App() {
  return (
    <>
      <div className="cyber-grid-bg"></div>
      <div className="cyber-glow-bg"></div>
      
      <Navbar />
      
      <main>
        <Hero />
        <Architecture /> 
        <Terminal /> 
        <Contact /> {/* <-- Added */}
      </main>
      
      <Footer /> {/* <-- Added */}
    </>
  );
}

export default App;