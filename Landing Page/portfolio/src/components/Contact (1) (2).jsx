import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <h2 className="section-title">Let's <span className="text-gradient">Connect</span></h2>
          <p className="section-subtitle">Have a project in mind? Let's build something amazing together.</p>
        </motion.div>

        <div className="contact-grid">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="contact-info"
          >
            <div className="info-item glass-card">
              <div className="icon-wrapper">
                <Mail size={24} className="text-cyan" />
              </div>
              <div>
                <h4>Email</h4>
                <p>hello@gauravroy.com</p>
              </div>
            </div>
            
            <div className="info-item glass-card">
              <div className="icon-wrapper">
                <Phone size={24} className="text-purple" />
              </div>
              <div>
                <h4>Phone</h4>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="info-item glass-card">
              <div className="icon-wrapper">
                <MapPin size={24} className="text-blue" />
              </div>
              <div>
                <h4>Location</h4>
                <p>Global / Remote</p>
              </div>
            </div>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="contact-form glass"
          >
            <div className="form-group">
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <textarea placeholder="Your Message" rows="5" required></textarea>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-submit" 
              type="submit"
            >
              Send Message
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
