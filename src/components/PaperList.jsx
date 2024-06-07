import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

const PapersList = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPapers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/papers/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setPapers(response.data);
        setLoading(false);
      } else {
        throw new Error('Failed to fetch papers');
      }
    } catch (error) {
      console.error('Error fetching papers:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const handleViewPdf = (filePath) => {
    const baseUrl = 'https://drive.google.com/file/d/1rG7FWpqUq_jYBtcMdoAhTaY60lC5vU_E/view?usp=drive_link';
    window.open(`${baseUrl}`, '_blank');
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading papers...</p>
        ) : (
          <ul className="space-y-6">
            {papers.map((paper) => (
              <li key={paper.paperId} className="bg-white shadow-lg rounded-lg p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{paper.title}</h3>
                    <p className="text-sm text-gray-600">Published on: {new Date(paper.published_date).toLocaleDateString()}</p>
                  </div>
                  <button
                    className="mt-4 sm:mt-0 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                    onClick={() => handleViewPdf(paper.file_path)}
                  >
                    View PDF
                  </button>
                </div>
                <div className="mb-4">
                  <h4 className="text-md font-medium text-gray-700">Abstract:</h4>
                  <p className="text-sm text-gray-600">{paper.abstract}</p>
                </div>
                <div>
                  <h4 className="text-md font-medium text-gray-700">Authors:</h4>
                  <ul className="text-sm text-gray-600">
                    {paper.authors.map((author, index) => (
                      <li key={index}>{author.name} ({author.affiliation})</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PapersList;
