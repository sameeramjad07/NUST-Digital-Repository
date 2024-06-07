import React from 'react'
import nustLogo from '../assets/nustLogo.png'
import { FiSearch } from "react-icons/fi";
import { Link } from 'react-router-dom';
import TopNav from './TopNav';
import SecondNav from './SecondNav';

const Appbar = ({isMenuOpen}) => {


  return (
    <div className="shadow-md">
      {/* Top Navbar */}
      <TopNav />
      {/* Bottom Navbar */}
      <SecondNav />
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="bg-gray-800">
            <a href="/login" className="block py-2 px-4 text-white hover:bg-gray-700">Login</a>
          </div>
        </div>
      )}
    </div>
  )
}

export default Appbar