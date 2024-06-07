// PaperSubmissionForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const PaperSubmissionForm = () => {
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [authors, setAuthors] = useState([{ name: '', affiliation: '' }]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAddAuthor = () => {
    setAuthors([...authors, { name: '', affiliation: '' }]);
  };

  const handleAuthorChange = (index, field, value) => {
    const newAuthors = [...authors];
    newAuthors[index][field] = value;
    setAuthors(newAuthors);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !abstract || !keywords || !file || authors.some(author => !author.name || !author.affiliation)) {
      setError('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('abstract', abstract);
    formData.append('keywords', keywords);
    formData.append('file', file);
    authors.forEach((author, index) => {
      formData.append(`authors[${index}][name]`, author.name);
      formData.append(`authors[${index}][affiliation]`, author.affiliation);
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/papers/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Paper submitted successfully');
        navigate('/dashboard')
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError('Submission error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-2xl font-semibold mb-4">Submit a Paper</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title:</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
      </div>
      <div className="mb-4">
        <label htmlFor="abstract" className="block text-sm font-medium text-gray-700">Abstract:</label>
        <textarea id="abstract" value={abstract} onChange={(e) => setAbstract(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded-md w-full" rows="4"></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">Keywords:</label>
        <input type="text" id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Authors:</label>
        {authors.map((author, index) => (
          <div key={index} className="flex space-x-4 mb-2">
            <input type="text" placeholder="Author Name" value={author.name} onChange={(e) => handleAuthorChange(index, 'name', e.target.value)} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
            <input type="text" placeholder="Affiliation" value={author.affiliation} onChange={(e) => handleAuthorChange(index, 'affiliation', e.target.value)} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
          </div>
        ))}
        <button type="button" onClick={handleAddAuthor} className="flex items-center text-blue-500 hover:underline">
          <PlusCircle className="w-5 h-5 mr-1" />
          Add Author
        </button>
      </div>
      <div className="mb-4">
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">Upload Paper:</label>
        <input type="file" id="file" onChange={handleFileChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out">Submit</button>
    </form>
  );
};

export default PaperSubmissionForm;
