import React, { useState } from 'react';

const Pagination = ({ papersPerPage, totalPapers, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPapers / papersPerPage); i++) {
    pageNumbers.push(i);
  }

  const [jumpPage, setJumpPage] = useState('');
  const maxPagesToShow = 5;
  const totalPageCount = pageNumbers.length;
  const isStartEllipsisShown = currentPage > 3;
  const isEndEllipsisShown = currentPage < totalPageCount - 2;
  let visiblePageNumbers = [];

  if (totalPageCount <= maxPagesToShow) {
    visiblePageNumbers = pageNumbers;
  } else {
    if (currentPage <= 3) {
      visiblePageNumbers = pageNumbers.slice(0, maxPagesToShow - 1).concat([totalPageCount]);
    } else if (currentPage >= totalPageCount - 2) {
      visiblePageNumbers = [1].concat(pageNumbers.slice(totalPageCount - (maxPagesToShow - 1)));
    } else {
      visiblePageNumbers = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPageCount];
    }
  }

  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPageCount) {
      paginate(pageNumber);
      setJumpPage('');
    }
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPageCount}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{(currentPage - 1) * papersPerPage + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * papersPerPage, totalPapers)}</span> of{' '}
            <span className="font-medium">{totalPapers}</span> results
          </p>
        </div>
        <div className='flex flex-col items-center'>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {visiblePageNumbers.map((number, index) => (
              <button
                key={index}
                onClick={() => number !== '...' && paginate(number)}
                aria-current={currentPage === number ? 'page' : undefined}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  currentPage === number
                    ? 'bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                }`}
                disabled={number === '...'}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPageCount}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
          <div className="mt-4 flex items-center">
            <label htmlFor="jump-page" className="mr-2 text-sm text-gray-700">
              Jump to page:
            </label>
            <input
              type="number"
              id="jump-page"
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              className="w-16 rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700"
            />
            <button
              onClick={handleJumpToPage}
              className="ml-2 rounded-md bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
