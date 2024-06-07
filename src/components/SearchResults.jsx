import React, { useState } from 'react';

const SearchResults = ({ results }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedResults = results.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <ul className="space-y-4">
        {paginatedResults.map((result) => (
          <li key={result.id} className="p-4 border rounded-lg shadow-lg bg-white">
            <h3 className="text-lg font-semibold">{result.title}</h3>
            <p className="text-sm text-gray-600">{result.author}</p>
            <p className="mt-2 text-gray-800">
              {expandedId === result.id ? result.abstract : `${result.abstract.slice(0, 100)}...`}
            </p>
            <button
              onClick={() => handleExpandClick(result.id)}
              className="mt-2 text-blue-600 hover:underline"
            >
              {expandedId === result.id ? 'Show less' : 'Read more'}
            </button>
          </li>
        ))}
      </ul>
      <Pagination
        totalResults={results.length}
        resultsPerPage={resultsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

const Pagination = ({ totalResults, resultsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <nav className="mt-4">
      <ul className="inline-flex -space-x-px text-sm">
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Previous
          </button>
        </li>
        {[...Array(totalPages)].map((_, index) => (
          <li key={index}>
            <button
              onClick={() => onPageChange(index + 1)}
              className={`flex items-center justify-center px-3 h-8 leading-tight border ${
                currentPage === index + 1
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              {index + 1}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default SearchResults;
