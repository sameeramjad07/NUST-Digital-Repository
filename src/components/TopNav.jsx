import React, { useState } from 'react';
import nustLogo from '../assets/nustLogo.png';
import { Link } from 'react-router-dom';

const TopNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full border-gray-200 bg-gray-900 py-6">
      <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
        <div className="flex items-center justify-between">
          <a className="inline-flex items-center space-x-3 rtl:space-x-reverse" href="/">
            <img src={nustLogo} className="h-12" alt="University Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white lg:block hidden">NUST Digital Research Repository</span>
          </a>
          <div className="sm:hidden">
            <button
              type="button"
              className="hs-collapse-toggle p-2 inline-flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white  shadow-sm  focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
              onClick={toggleMenu}
              aria-controls="navbar-default"
              aria-expanded={isMenuOpen ? "true" : "false"}
            >
              <svg className={`${isMenuOpen ? 'hidden' : 'block'} w-5 h-5`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" x2="21" y1="6" y2="6"/>
                <line x1="3" x2="21" y1="12" y2="12"/>
                <line x1="3" x2="21" y1="18" y2="18"/>
              </svg>
              <svg className={`${isMenuOpen ? 'block' : 'hidden'} w-5 h-5`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>
        </div>
        <div id="navbar-default" className={`transition-all duration-300 ${isMenuOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'} sm:max-h-full sm:overflow-visible sm:flex sm:items-center sm:justify-end`}>
          <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
            <Link to="/" className="font-medium text-white md:text-blue-500 block py-2 px-3 rounded md:p-0" aria-current="page">Home</Link>
            <Link to="/about" className="font-medium hover:text-gray-700 text-white md:hover:text-blue-500 block py-2 px-3 rounded md:p-0">About</Link>
            {/* <Link to="/help" className="font-medium text-gray-900 hover:text-gray-700 dark:text-white md:dark:hover:text-blue-500 block py-2 px-3 rounded md:p-0">Help</Link>
            <Link to="/categories" className="font-medium text-gray-900 hover:text-gray-700 dark:text-white md:dark:hover:text-blue-500 block py-2 px-3 rounded md:p-0">Categories</Link> */}
            <Link to="/contact" className="font-medium hover:text-gray-700 text-white md:hover:text-blue-500 block py-2 px-3 rounded md:p-0">Contact Us</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default TopNav;
