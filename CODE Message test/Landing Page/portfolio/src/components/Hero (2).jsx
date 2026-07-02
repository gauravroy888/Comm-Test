import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <motion.div 
          className="glow-sphere cyan"
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="glow-sphere purple"
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container hero-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-text-wrapper"
        >
          <span className="subtitle">Welcome to the future of design</span>
          <h1 className="hero-title">
            I'm <span className="text-gradient">Gaurav Roy</span>
          </h1>
          <h2 className="hero-role">UI/UX Designer & Developer</h2>
          <p className="hero-desc">
            Crafting immersive digital experiences through minimal aesthetics and futuristic technology.
          </p>
          
          <div className="hero-actions">
            <motion.a 
              href="#projects" 
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View My Work
            </motion.a>
            <motion.a 
              href="#contact" 
              className="btn-secondary glass"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.a>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown size={24} color="var(--text-secondary)" />
      </motion.div>
    </section>
  );
};

export default Hero;
