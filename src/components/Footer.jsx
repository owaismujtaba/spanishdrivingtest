import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer mt-8">
      <div className="container footer-container">
        <p>&copy; {new Date().getFullYear()} Permiso B Study Portal. All rights reserved.</p>
        <p className="footer-subtext">Designed for English speakers studying for the Spanish Driving License.</p>
      </div>
    </footer>
  );
};

export default Footer;
