import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
        &copy; {currentYear} Budget Smart Tracker. All rights reserved. 
        <span className="block mt-1">Được xây dựng với React, React Query & Tailwind CSS.</span>
      </div>
    </footer>
  );
};

export default Footer;