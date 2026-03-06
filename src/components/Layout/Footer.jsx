import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-white shadow-md p-4 text-center">
      <p className="text-gray-800">&copy; 2026 Finance Tracker. All rights reserved.</p>
    </footer>
  );
};

export default Footer;