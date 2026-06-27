import React from 'react';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  return (
    <div className="app">
      <Hero />
      <Projects />
      <Contact />
      
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        color: 'var(--text-secondary)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        backgroundColor: 'var(--bg-darker)'
      }}>
        <p>© {new Date().getFullYear()} Gaurav Roy. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
