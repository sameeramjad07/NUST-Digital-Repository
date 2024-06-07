import React, { useState, useEffect } from 'react';
import TopNav from '../components/TopNav';
import PaperList from '../components/PaperList';
import PaperSubmissionForm from '../components/PaperSubmissionForm';
import SubmissionAgreementModal from '../components/SubmissionAgreementModel';
import axios from 'axios';
import { Smile } from 'lucide-react';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [papers, setPapers] = useState([]);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAgree = () => {
    // Add any actions you want to perform when the user agrees to the submission agreement
    console.log('User agreed to the Submission Agreement');
    setShowSubmissionForm(true); // Show the submission form after the agreement is accepted
    setIsModalOpen(false); // Close the modal
  };

  const handleToggleSubmissionForm = () => {
    setShowSubmissionForm(!showSubmissionForm);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userResponse = await axios.get('http://localhost:5173/api/v1/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUser(userResponse.data);

        const papersResponse = await axios.get(`http://localhost:5173/api/v1/papers/user/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPapers(papersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <TopNav />
      <div className="bg-gray-700 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center p-6">
          <h1 className="text-white text-2xl">NUST Preprint Server</h1>
          <div className="flex items-center">
            <p className="text-white text-lg">{`Welcome, ${user ? user.name : 'User'}`}</p>
            <div className="mr-4 ml-4">
            {user && user.image_url ? (
                <img src={`data:image/jpeg;base64,${user.image_url}`} alt="User Avatar" className="h-12 w-12 rounded-full" />
              ) : (
                <Smile />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-semibold text-center mb-8">User Dashboard</h1>
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Paper Submission</h2>
            <p className="text-gray-700 mb-4">
              Submit your research papers to the NUST Preprint Server. Ensure all fields are filled correctly.
            </p>
            {showSubmissionForm ? (
              <button onClick={handleToggleSubmissionForm} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ease-in-out">
                Hide Submission Form
              </button>
            ) : (
              <button onClick={handleOpenModal} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out">
                Submit a Paper
              </button>
            )}
            <SubmissionAgreementModal isOpen={isModalOpen} onClose={handleCloseModal} onAgree={handleAgree} />
            {showSubmissionForm && <PaperSubmissionForm />}
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4">Your Submitted Papers</h2>
        <PaperList papers={papers} />
      </div>
    </div>
  );
}

export default Dashboard;
