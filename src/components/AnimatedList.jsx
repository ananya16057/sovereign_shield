'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AnimatedList = ({
  items = [],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  displayScrollbar = true,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listRef = useRef(null);

  // Keyboard Navigation Logic
  useEffect(() => {
    if (!enableArrowNavigation) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        if (onItemSelect) onItemSelect(items[selectedIndex], selectedIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableArrowNavigation, items, selectedIndex, onItemSelect]);

  // Auto-scroll to keep the selected item in view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const activeElement = listRef.current.children[selectedIndex];
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  return (
    <div className="animated-list-container">
      {/* Top Gradient Overlay */}
      {showGradients && <div className="animated-list-gradient-top" />}

      {/* Scrollable List with Staggered Framer Motion */}
      <motion.ul
        ref={listRef}
        className={`animated-list-scroll ${displayScrollbar ? 'show-scrollbar' : 'hide-scrollbar'}`}
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } },
          hidden: {},
        }}
      >
        {items.map((item, index) => {
          const isSelected = selectedIndex === index;
          return (
            <motion.li
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { type: 'spring', stiffness: 300, damping: 24 } 
                }
              }}
              onClick={() => {
                setSelectedIndex(index);
                if (onItemSelect) onItemSelect(item, index);
              }}
              className={`animated-list-item ${isSelected ? 'selected' : ''}`}
            >
              {item}
            </motion.li>
          );
        })}
      </motion.ul>

      {/* Bottom Gradient Overlay */}
      {showGradients && <div className="animated-list-gradient-bottom" />}
    </div>
  );
};

export default AnimatedList;