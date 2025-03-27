import React from 'react';
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--background-darker)] py-10  ">
      <div className=" border-white/10   text-center text-[var(--text-secondary)] text-sm">
        &copy; {new Date().getFullYear()} Chordia. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;