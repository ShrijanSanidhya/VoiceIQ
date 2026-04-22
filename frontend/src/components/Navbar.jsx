import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mic } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple to-brand-cyan flex items-center justify-center group-hover:glow transition-all">
            <Mic className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Voice<span className="gradient-text">IQ</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-gray">
          <Link to="/" className="hover:text-white transition-colors">How it Works</Link>
          <Link to="/" className="hover:text-white transition-colors">Features</Link>
          <Link to="/" className="hover:text-white transition-colors">Pricing</Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/upload">
            <Button variant="primary">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
