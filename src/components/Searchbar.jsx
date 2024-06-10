import React, { useState } from 'react';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';

const apiName = '/api/proxy/odoocms_api';
const qalamAlias = import.meta.env.VITE_QALAM_ALIAS;
const qalamAuth = import.meta.env.VITE_QALAM_AUTH;

const SearchBar = ({ onResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('title');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.get(apiName, {
        params: {
          alias: qalamAlias,
          auth: qalamAuth,
          rows: 1000,
          [selectedCategory]: searchQuery,
        },
      });
      if (response && response.data) {
        onResults(response.data.ric_expert_portal_journal_pub_json_data);
      } else {
        console.error('Empty response or missing data:', response);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryButtonClick = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <form className="relative mx-auto w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl" onSubmit={handleSearch}>
      <div className="flex items-center">
        <div className="relative flex-grow flex">
          <input
            type="search"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full py-3 px-4 text-base text-gray-900 bg-gray-100 border border-gray-300 rounded-l focus:outline-none focus:bg-white focus:border-gray-500"
            placeholder="Search for papers, articles, etc."
            required
          />
          <button
            onClick={handleCategoryButtonClick}
            className="flex items-center justify-center px-2 py-1 w-auto bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
          >
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
            <svg
              className={`w-4 h-4 transition-transform duration-300 transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 12.586l-3.293-3.293-1.414 1.414L10 15.414l4.707-4.707-1.414-1.414L10 12.586z"
              />
            </svg>
          </button>
        </div>
        <button
          type="submit"
          className="flex-shrink-0 font-bold text-lg px-4 py-2 ml-2 text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
        >
          Search
        </button>
      </div>

      {isDropdownOpen && (
        <div className="absolute top-full right-0 w-full sm:w-1/3 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
          {['keyword', 'title', 'author', 'abstract'].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategorySelect(category)}
              className="block w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <TailSpin color="#00BFFF" height={50} width={50} />
        </div>
      )}
    </form>
  );
};

export default SearchBar;
