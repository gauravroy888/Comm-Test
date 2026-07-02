import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code } from 'lucide-react';
import './Projects.css';

const projectsData = [
  {
    id: 1,
    title: 'Cognitive Landing',
    description: 'A futuristic edtech platform landing page with sleek animations and modern UI.',
    tags: ['UI/UX', 'React', 'Framer Motion'],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Neon E-Commerce',
    description: 'An experimental cyberpunk-themed e-commerce experience for digital goods.',
    tags: ['Web Design', 'Vue', 'Tailwind'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Data Vis Dashboard',
    description: 'Complex financial data visualized through a clean, glassmorphic dark interface.',
    tags: ['Dashboard', 'D3.js', 'React'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
  }
];

const Projects = () => {
  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <h2 className="section-title">Selected <span className="text-gradient">Works</span></h2>
          <p className="section-subtitle">A showcase of my recent design and development projects.</p>
        </motion.div>

        <div className="projects-grid">
          {projectsData.map((project, index) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="project-card glass-card"
            >
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className="project-overlay">
                  <a href="#" className="project-link"><ExternalLink size={20} /></a>
                  <a href="#" className="project-link"><Code size={20} /></a>
                </div>
              </div>
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map(tag => (
                    <span key={tag} className="tag glass">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
