import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/nustLogo.png'; // Make sure to add a logo if you have one

const Signup = () => {
  const [cmsId, setCmsId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cmsId || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (!/^\d{11}$/.test(cmsId)) {
      setError('CMS ID must be 11 digits long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5173/api/v1/fetchData?cmsId=${cmsId}`);
      const jsonData = await response.json();
      const facultyDataArray = jsonData.ric_expert_portal_faculty_json_data;
      const faculty = facultyDataArray[0];
      const fetchedName = faculty.name;
      if (!fetchedName) {
        setError('Failed to fetch user details');
        return;
      }
      setName(fetchedName);
      setShowPopup(true);
    } catch (error) {
      console.error(error);
      setError('Fetch Error');
    }
  };

  const confirmSignup = async () => {
    try {
      const response = await fetch('http://localhost:5173/api/v1/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cmsId, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setShowPopup(false);
        navigate('/login');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error(error);
      setError('Signup Error');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-green-500 to-teal-600">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-12" />
        </div>
        <h2 className="text-3xl font-semibold mb-4 text-center text-gray-800">Create your Publisher Account</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="cmsId" className="block text-sm font-medium text-gray-700">CMS ID (11 digits):</label>
            <input type="text" id="cmsId" name="cmsId" value={cmsId} onChange={(e) => setCmsId(e.target.value)} className="mt-1 p-3 border border-gray-300 rounded-md w-full" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 p-3 border border-gray-300 rounded-md w-full" />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password:</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 p-3 border border-gray-300 rounded-md w-full" />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-300 ease-in-out font-bold">Sign Up</button>
          </div>
        </form>
        <div className="mt-6 text-center text-gray-700">
          Already have an account? <Link to="/login" className="text-green-500 hover:underline">Login</Link>
        </div>
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Dear {name},</h2>
            <p className="text-gray-700">Is this your account?</p>
            <div className="flex space-x-4 mt-4">
              <button onClick={confirmSignup} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out">Yes</button>
              <button onClick={() => setShowPopup(false)} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ease-in-out">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
