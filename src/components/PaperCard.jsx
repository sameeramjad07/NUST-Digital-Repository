import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const apiName = '/odoocms_api';
const qalamAuthorAlias = import.meta.env.VITE_QALAM_ALIAS_AUTHOR;
const qalamAuthorAuth = import.meta.env.VITE_QALAM_AUTH_AUTHOR;

const fetchAuthorCode = async (name) => {
  try {
    const response = await axios.get(apiName, {
      params: {
        alias: qalamAuthorAlias,
        auth: qalamAuthorAuth,
        rows: 1000,
        name: name
      }
    });

    const data = response.data.ric_expert_portal_faculty_cards_json_data;
    if (data.length > 0) {
      return data[0].code;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching author code:', error);
    return null;
  }
};

const PaperCard = ({ paper }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [authorLinks, setAuthorLinks] = useState([]);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchAuthorLinks = async () => {
      const links = await Promise.all(
        paper.author_ids.map(async (author) => {
          if (author.affiliation.toLowerCase() === 'nust') {
            const code = await fetchAuthorCode(author.name);
            if (code) {
              return (
                <a
                  key={author.id}
                  target="_blank"
                  href={`https://collaborate.nust.edu.pk/profile/${author.name.replace(' ', '%20')}/${code}`}
                  className="text-blue-700 hover:underline"
                >
                  {author.name}
                </a>
              );
            }
          }
          return author.name;
        })
      );
      setAuthorLinks(links);
    };

    fetchAuthorLinks();
  }, [paper.author_ids]);

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-200">
      <h3 className="text-xl font-bold">{paper.g_r_count} - {paper.title}</h3>
      <h3 className="mt-2 text-lg font-semibold">Abstract:</h3>
      <div className="flex items-center">
        <p className="mr-2 mb-4 text-gray-800 text-justify">
          {isExpanded ? paper.abstract : `${paper.abstract.slice(0, 200)}...`}{"   "}
          <button
            onClick={handleExpandClick}
            className="text-blue-600 inline hover:underline"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </p>
      </div>
      <p className="text-gray-500 mb-1"><strong>Journal Name: </strong>{paper.journal_title}</p>
      <p className="text-gray-500 mb-1">
        <strong>Authors: </strong>
        {authorLinks.length > 0 ? authorLinks.reduce((prev, curr) => [prev, ', ', curr]) : 'No authors available'}
      </p>
      <p className="text-gray-500 mb-1"><strong>Year: </strong>{paper.publication_year_compute}</p>
      <div className="flex items-center justify-between mt-4">
        <div>
          {paper.impact_factor && <p className="text-gray-500 mb-1"><strong>Impact Factor: </strong>{paper.impact_factor}</p>}
          {paper.citation_count_scopus && <p className="text-gray-500 mb-1"><strong>Citations: </strong>{paper.citation_count_scopus || 0}</p>}
          <p className="text-gray-500"><strong>Document Type: </strong>{paper.type}</p>
        </div>
        <div>
          <Link
            to={`/publication/${encodeURIComponent(paper.title)}`}
            target="_blank"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-lg px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Visit Document
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaperCard;
