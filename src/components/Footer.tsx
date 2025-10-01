import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="px-4 sm:px-6 md:px-12 pb-10">
      <div className="container">
        <div className="glass-panel footer-glass border border-white/10">
          &copy; {new Date().getFullYear()} Chordia. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
