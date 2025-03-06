import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-sm ${
          scrolled 
            ? 'bg-white/90 dark:bg-gray-900/90 shadow-md py-2' 
            : 'bg-white dark:bg-gray-900 py-3 lg:py-4'
        }`}
      >
        <div className="container-fluid max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white hidden sm:inline">
                One Time Home Care Exclusions Check
              </span>
              <span className="text-xl font-bold text-gray-900 dark:text-white sm:hidden">OTHCEC</span>
            </motion.div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <ul className="flex space-x-1">
                <li>
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-lg transition-colors ${
                        isActive 
                          ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/50 font-medium' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-800/70'
                      }`
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/about" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-lg transition-colors ${
                        isActive 
                          ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/50 font-medium' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-800/70'
                      }`
                    }
                  >
                    About
                  </NavLink>
                </li>
              </ul>
              
              {/* Theme Toggle */}
              <ThemeToggle />
            </nav>
            
            {/* Mobile Menu & Theme Toggle */}
            <div className="flex items-center space-x-2 md:hidden">
              <ThemeToggle />
              
              <button 
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden mt-2 overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg"
              >
                <nav className="py-2">
                  <ul className="flex flex-col">
                    <li>
                      <NavLink 
                        to="/" 
                        className={({ isActive }) => 
                          `block py-3 px-4 ${
                            isActive 
                              ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 font-medium' 
                              : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`
                        }
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Home
                      </NavLink>
                    </li>
                    <li>
                      <NavLink 
                        to="/about" 
                        className={({ isActive }) => 
                          `block py-3 px-4 ${
                            isActive 
                              ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 font-medium' 
                              : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`
                        }
                        onClick={() => setIsMenuOpen(false)}
                      >
                        About
                      </NavLink>
                    </li>
                  </ul>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      
      <main className="flex-grow container-fluid max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
        <Outlet />
      </main>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="container-fluid max-w-7xl mx-auto py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">One Time Home Care Exclusions Check</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} One Time Home Care Exclusions Check. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
