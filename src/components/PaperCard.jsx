import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PaperCard = ({ paper }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-200">
      <h3 className="text-xl font-bold">{paper.g_r_count} - {paper.title}</h3>
      <h3 className='mt-2 text-lg font-semibold'>Abstract:</h3>
      <div className="flex items-center">
        <p className="mr-2 text-gray-800">
          {isExpanded ? paper.abstract : `${paper.abstract.slice(0, 100)}...`}
        </p>
        <button
          onClick={handleExpandClick}
          className="text-blue-600 hover:underline"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
          <p className="text-gray-500"><strong>Journal Name: </strong>{paper.journal_title}</p>
          <p className="text-gray-500"><strong>Authors: </strong>{paper.all_author_compute}</p>
          <p className="text-gray-500"><strong>Year: </strong>{paper.publication_year_compute}</p>
      <div className='flex items-center justify-between mt-4'>
        <div>
          {paper.impact_factor ? <p className="text-gray-500"><strong>Impact Factor: </strong>{paper.impact_factor}</p> : null }
          <p className="text-gray-500"><strong>Citations: </strong>{paper.citation_count_scopus || 0}</p>
        </div>
        <div>
          <Link to={`/publication/${paper.title}`} target='_blank' className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-lg px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Visit Document
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaperCard;
