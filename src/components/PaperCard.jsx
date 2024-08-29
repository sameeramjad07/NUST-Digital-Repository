import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PaperCard = ({ paper, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [authorLinks, setAuthorLinks] = useState([]);
  const [showCitation, setShowCitation] = useState(false);
  const [isCitationCopied, setIsCitationCopied] = useState(false);
  const [isBibTeXCopied, setIsBibTeXCopied] = useState(false); // For BibTeX citation

  const isConference = paper.conference !== null && paper.conference !== undefined;

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchAuthorLinks = () => {
      const authors = paper.author_ids || paper.findet_ids;
      const links = authors.map((author) => {
        const name = author.name || author.pc_applicant_name;
        if (author.affiliation && author.affiliation.toLowerCase() === 'nust' || author.designation) {
          if (author.faculty_student_author_compute) {
            const parts = author.faculty_student_author_compute.split(' - ');
            if (parts.length > 1) {
              const code = parts[0];
              return (
                <a
                  key={author.id}
                  target="_blank"
                  href={`https://collaborate.nust.edu.pk/profile/${name.replace(' ', '%20')}/${code}`}
                  className="text-blue-700 hover:underline"
                >
                  {name}
                </a>
              );
            }
          }
          if (author.fin_faculy_staff_id) {
            const parts = author.fin_faculy_staff_id.split(' - ');
            if (parts.length > 1) {
              const code = parts[1];
              return (
                <a
                  key={author.id}
                  target="_blank"
                  href={`https://collaborate.nust.edu.pk/profile/${name.replace(' ', '%20')}/${code}`}
                  className="text-blue-700 hover:underline"
                >
                  {name}
                </a>
              );
            }
          }
        }
        return name;
      });
      setAuthorLinks(links);
    };

    fetchAuthorLinks();
  }, [paper.author_ids, paper.findet_ids]);

  const formatAuthorName = (authorName) => {
    const nameParts = authorName.trim().split(' ');
    const lastName = nameParts.pop();
    const initials = nameParts.map(name => name.charAt(0).toUpperCase()).join('. ');
    return `${lastName}, ${initials}${initials ? '.' : ''}`;
  };

  const getAuthors = (paper) => {
    const authors = paper.author_ids || paper.findet_ids || [];
    if (authors.length > 0) {
      return authors.map(author => formatAuthorName(author.name || author.pc_applicant_name)).join(', ').replace(/, ([^,]*)$/, ' $1');
    } else if (paper.all_author_compute) {
      return paper.all_author_compute.split(',').map(author => formatAuthorName(author.trim())).join(', ').replace(/, ([^,]*)$/, ' $1');
    }
    return '';
  };

  const getAuthorsBibTeX = (paper) => {
    const authors = paper.author_ids || paper.findet_ids || [];
    if (authors.length > 0) {
      return authors.map(author => formatAuthorName(author.name || author.pc_applicant_name)).join(' and ');
    } else if (paper.all_author_compute) {
      return paper.all_author_compute.split(',').map(author => formatAuthorName(author.trim())).join(' and ');
    }
    return '';
  };

  const formattedAuthors = getAuthors(paper);

  const handleCopyCitation = () => {
    const citationText = isConference
      ? `${formattedAuthors} ${paper.title_of_paper}, ${paper.discipline} (${paper.publication_year_compute}), ${paper.conference}`
      : `${formattedAuthors} ${paper.title}, ${paper.journal_title} (${paper.publication_year_compute}), ${paper.journal_info}`;
    navigator.clipboard.writeText(citationText)
      .then(() => {
        setIsCitationCopied(true);
        setTimeout(() => setIsCitationCopied(false), 2000); // Reset after 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy citation: ', err);
      });
  };

  const handleCopyBibTeX = () => {
    const leadAuthor = getAuthors(paper);
    let leadAuthorLastName = "";
    if (leadAuthor) {
      const nameParts = leadAuthor.split(', ');
      if (nameParts.length > 0) {
        leadAuthorLastName = nameParts[0].split(' ').pop().toLowerCase();
      }
    }
  
    const authors = getAuthorsBibTeX(paper);
    const title = isConference ? paper.title_of_paper : paper.title
    const publicationYear = paper.publication_year_compute;
    const firstWordOfTitle = !isConference ? paper.title.split(' ')[0] : paper.title_of_paper.split(' ')[0];
    const citationKey = `${leadAuthorLastName}${publicationYear}${firstWordOfTitle}`;
    const journalInfo = !isConference ? paper.journal_info || '' : null;
  
    // Build the BibTeX entry
    let bibtexCitation = `@article{${citationKey},\n`;
    
    if (title) {
      bibtexCitation += `  title = {${title}},\n`;
    }
    if (authors) {
      bibtexCitation += `  author = {${authors}},\n`;
    }
    if (!isConference && paper.journal_title && paper.journal_title.trim() !== '-' && paper.journal_title.trim() !== '') {
      bibtexCitation += `  journal = {${paper.journal_title}},\n`;
    }
    if (isConference && paper.conference && paper.conference.trim() !== '-' && paper.conference.trim() !== '') {
      bibtexCitation += `  conference = {${paper.conference}},\n`;
    }
    if (!isConference && journalInfo && journalInfo.trim() !== '-' && journalInfo.trim() !== '') {
      bibtexCitation += `  journal info = {${journalInfo}},\n`;
    }
    if (publicationYear) {
      bibtexCitation += `  year = {${publicationYear}},\n`;
    }
    if (!isConference && paper.publisher_name && paper.publisher_name.trim() !== '-' && paper.publisher_name.trim() !== '') {
      bibtexCitation += `  publisher = {${paper.publisher_name}},\n`;
    }
    
    bibtexCitation += '}';
  
    // Copy to clipboard
    navigator.clipboard.writeText(bibtexCitation)
      .then(() => {
        setIsBibTeXCopied(true);
        setTimeout(() => setIsBibTeXCopied(false), 2000); // Reset after 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy BibTeX citation: ', err);
      });
  };  

  return (
    <div className="p-4 sm:p-6 border-2 border-slate-400 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-200 sm:mx-4">
      <h3 className="text-lg sm:text-xl font-bold mb-2">{index} - {isConference ? paper.title_of_paper : paper.title}</h3>
      {paper.abstract && <div>
        <h3 className="mt-2 text-md sm:text-lg font-semibold">Abstract:</h3>
        <div className="flex items-center">
          <p className="mr-2 mb-4 text-gray-800 text-sm sm:text-base text-justify">
            {isExpanded ? paper.abstract : `${paper.abstract.slice(0, 200)}...`}{" "}
            <button
              onClick={handleExpandClick}
              className="text-blue-600 inline hover:underline"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          </p>
        </div>
      </div>}
      {isConference ? <p className="text-gray-500 mb-1"><strong>Conference Name: </strong>{paper.conference}</p> : <p className="text-gray-500 mb-1"><strong>Journal Name: </strong>{paper.journal_title}</p>}
      <p className="text-gray-500 mb-1">
        <strong>Authors: </strong>
        {authorLinks.length > 0 ? authorLinks.reduce((prev, curr) => [prev, ', ', curr]) : 'No authors available'}
      </p>
      <p className="text-gray-500 mb-1"><strong>Year: </strong>{paper.publication_year_compute}</p>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2">
        <div className="mb-4 sm:mb-0 flex flex-col items-start">
          {!isConference && paper.impact_factor && <p className="text-gray-500 mb-1"><strong>Impact Factor: </strong>{paper.impact_factor}</p>}
          {paper.citation_count_scopus != 0 ? <p className="text-gray-500 mb-1"><strong>Citations: </strong>{paper.citation_count_scopus || 0}</p> : null }
          {isConference ? <p className="text-gray-500 mb-1"><strong>Document Type: </strong>Conference Proceeding</p> : <p className="text-gray-500"><strong>Document Type: </strong>{paper.type}</p>}
          {isConference && <p className="text-gray-500 mb-1"><strong>Start Date: </strong>{paper.start_date}</p>}
          {isConference && <p className="text-gray-500"><strong>End Date: </strong>{paper.end_date}</p>}
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-4 w-full sm:w-auto">
          <button
            onClick={() => setShowCitation(true)}
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-lg px-4 py-2 mb-2 sm:mb-0 sm:w-auto w-full"
          >
            Create Citation
          </button>
          {isConference ? 
            <Link
              to={`/conference/${encodeURIComponent(paper.title_of_paper)}`}
              target="_blank"
              className="text-white text-center bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-lg px-4 py-2 sm:w-auto w-full"
            >
              Visit Document
            </Link> 
          : 
            <Link
              to={`/publication/${encodeURIComponent(paper.title)}`}
              target="_blank"
              className="text-white text-center bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-lg px-4 py-2 sm:w-auto w-full"
            >
              Visit Document
            </Link>
          }
        </div>
      </div>

      {showCitation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setShowCitation(false)}
              className="absolute top-0 right-0 mt-4 mr-4 text-gray-600 hover:text-gray-800 text-xl"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">Citation Details</h3>
            <p className="mb-4">
              {isConference
                ? `${formattedAuthors} ${paper.title_of_paper}, ${paper.discipline} (${paper.publication_year_compute}), ${paper.conference}`
                : `${formattedAuthors} ${paper.title}, ${paper.journal_title} (${paper.publication_year_compute}), ${paper.journal_info}`}
            </p>
            <button
              onClick={handleCopyCitation}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 mr-2"
            >
              {isCitationCopied ? 'Copied!' : 'Copy Citation'}
            </button>
            <button
              onClick={handleCopyBibTeX}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {isBibTeXCopied ? 'Copied!' : 'Copy BibTeX'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperCard;
