import React from 'react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-2">
      <div>
        © {new Date().getFullYear()} <span className="font-semibold text-slate-400">FinTrack 360</span>. Built for Salaried Professionals.
      </div>
      <div className="flex items-center space-x-4">
        <span>React + Vite</span>
        <span>•</span>
        <span>Express + Node.js</span>
        <span>•</span>
        <span>MongoDB + Mongoose</span>
      </div>
    </footer>
  );
};

export default Footer;
