import React from 'react'
import { Link } from 'react-router-dom';

const SecondNav = () => {
  return (
    <div className="bg-gray-700 p-6">
      <div className="container mx-auto py-4 flex justify-between items-center">
        {/* Preprint Server Name */}
        <span className="text-white font-semibold text-2xl">NUST Digital Research Repository</span>
        {/* Login and Signup Buttons */}
        {/* <div className="hidden md:flex items-center space-x-4"> */}
          {/* Login Button */}
          {/* <Link to="/login" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-lg px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Login
          </Link> */}
          {/* Signup Button */}
          {/* <Link to="/signup" className="bg-green-500 hover:bg-green-600 text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-lg px-4 py-2 text-center">
            Sign Up
          </Link> */}
        </div> 
    </div>
  );
}

export default SecondNav