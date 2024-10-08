import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';
import axios from 'axios';

const header = import.meta.env.VITE_QALAM_BASE_URL;
const endpoint = import.meta.env.VITE_QALAM_API_NAME;
const apiName = `${header}${endpoint}`;
const qalamConferenceAlias = import.meta.env.VITE_QALAM_ALIAS_CONFERENCE_IND;
const qalamConferenceAuth = import.meta.env.VITE_QALAM_AUTH_CONFERENCE;

const fetchConferenceDetails = async (conferenceId) => {
  try {
    const decodedConferenceId = decodeURIComponent(conferenceId);
    console.log('Fetching conference details for:', decodedConferenceId);
    const response = await axios.get(apiName, {
      params: {
        alias: qalamConferenceAlias,
        auth: qalamConferenceAuth,
        rows: 1000,
        title_of_paper: decodedConferenceId // Using ConferenceId as title for the search
      }
    });

    console.log('API response:', response.data.ric_expert_portal_conference_pub_three_json_data);
    
    // Extract the publications array from the response
    const conferenceArray = response.data.ric_expert_portal_conference_pub_three_json_data;

    // Find the specific publication by exact title match
    const conferenceData = conferenceArray.find(pub => pub.title_of_paper === conferenceId);
    if (conferenceData) {
      console.log('Conference found:', conferenceData);
      return conferenceData;
    } else {
      console.error('Conference not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching Conference details:', error);
    return null;
  }
};

const Conferences = () => {
  const [conference, setConference] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCitation, setShowCitation] = useState(false);
  const [isCitationCopied, setIsCitationCopied] = useState(false);
  const [isBibTeXCopied, setIsBibTeXCopied] = useState(false); // For BibTeX citation
  const { conferenceId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const conferenceData = await fetchConferenceDetails(conferenceId);
        if (conferenceData) {
          // Map author codes from faculty_student_author_compute if available
          const authorCodes = conferenceData.author_ids.map(author => {
            if (author.faculty_student_author_compute) {
              const code = author.faculty_student_author_compute.split(' - ')[0];
              return { ...author, code: code };
            }
            return author;
          });
          setConference({ ...conferenceData, author_ids: authorCodes });
        } else {
          console.error('Conference details not found');
        }
      } catch (error) {
        console.error('Error fetching conference details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (conferenceId) {
      fetchData();
    } else {
      navigate('/'); // Redirect to home if no publication ID is provided
    }
  }, [conferenceId, navigate]);

  const formatAuthorName = (authorName) => {
    const nameParts = authorName.trim().split(' ');
    const lastName = nameParts.pop();
    const initials = nameParts.map(name => name.charAt(0).toUpperCase()).join('. ');
    return `${lastName}, ${initials}${initials ? '.' : ''}`;
  };

  const getAuthors = () => {
    if (!conference) {
      return '';
    }
    
    const authors = conference.author_ids || conference.findet_ids || [];
    if (authors.length > 0) {
      return authors
        .map(author => formatAuthorName(author.name || author.pc_applicant_name))
        .join(', ')
        .replace(/, ([^,]*)$/, ' $1');
    } else if (conference.all_author_compute) {
      return conference.all_author_compute
        .split(',')
        .map(author => formatAuthorName(author.trim()))
        .join(', ')
        .replace(/, ([^,]*)$/, ' $1');
    }
    return '';
  };

  const formattedAuthors = getAuthors();

  const getAuthorsBibTeX = () => {
    const authors = conference.author_ids || conference.findet_ids || [];
    if (authors.length > 0) {
      return authors.map(author => formatAuthorName(author.name || author.pc_applicant_name)).join(' and ');
    } else if (conference.all_author_compute) {
      return conference.all_author_compute.split(',').map(author => formatAuthorName(author.trim())).join(' and ');
    }
    return '';
  };

  const handleCopyCitation = () => {
    const citationText = `${formattedAuthors} ${conference.title_of_paper}, ${conference.discipline} (${conference.publication_year_compute}), ${conference.conference}`;
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
    const leadAuthor = getAuthors();
    let leadAuthorLastName = "";
    if (leadAuthor) {
      const nameParts = leadAuthor.split(', ');
      if (nameParts.length > 0) {
        leadAuthorLastName = nameParts[0].split(' ').pop().toLowerCase();
      }
    }
  
    const authors = getAuthorsBibTeX();
    const title = conference.title_of_paper;
    const publicationYear = conference.publication_year_compute;
    const firstWordOfTitle = conference.title_of_paper.split(' ')[0];
    const citationKey = `${leadAuthorLastName}${publicationYear}${firstWordOfTitle}`;
  
    // Build the BibTeX entry
    let bibtexCitation = `@article{${citationKey},\n`;
    
    if (title) {
      bibtexCitation += `  title = {${title}},\n`;
    }
    if (authors) {
      bibtexCitation += `  author = {${authors}},\n`;
    }
    if (conference.conference && conference.conference.trim() !== '-' && conference.conference.trim() !== '') {
      bibtexCitation += `  conference = {${conference.conference}},\n`;
    }
    if (publicationYear) {
      bibtexCitation += `  year = {${publicationYear}},\n`;
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

  if (isLoading) {
    return (
      <>
        <TopNav />
        <div className="flex justify-center items-center h-screen">
          <p>Loading conference details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!conference) {
    return (
      <>
        <TopNav />
        <div className="flex justify-center items-center h-screen">
          <p>Conference not found!</p>
        </div>
        <Footer />
      </>
    );
  }

  const renderAuthors = () => {
    return conference.author_ids?.length > 0 
      ? conference.author_ids.map(author => {
          if (author.affiliation.toLowerCase() === 'nust' && author.code) {
            return (
              <a
                key={author.id}
                target="_blank"
                href={`https://collaborate.nust.edu.pk/profile/${author.name.replace(' ', '%20')}/${author.code}`}
                className="text-blue-700 hover:underline"
              >
                {author.name}
              </a>
            );
          } else {
            return author.name;
          }
        }).reduce((prev, curr) => [prev, ', ', curr], [])
      : null;
  };

  return (
    <>
      <TopNav />
      <div className="container mx-auto px-4 py-8">
        {conference.publication_year_compute ? <i className='text-gray-500'>[Published on {conference.publication_year_compute}]</i> : null }
        <h1 className="text-3xl font-bold mb-4">{conference.title_of_paper}</h1>
        { renderAuthors() !== null && <p className="text-gray-600 mb-4">
          {renderAuthors()} - {conference.publication_year_compute || 'N/A'}
        </p>}
        {conference.abstract && <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Abstract</h2>
          <p className="text-gray-700 text-justify">{conference.abstract || 'No abstract available.'}</p>
        </div>}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-4">Details</h2>
          <p className="text-gray-700 mb-1"><strong>Document type:</strong> Conference Proceeding</p>
          <p className="text-gray-700 mb-1"><strong>Conference Name: </strong> {conference.conference}</p>
          <p className="text-gray-700 mb-1"><strong>Country of Event: </strong>{conference.country_of_event}</p>
          {conference.discipline && <p className="text-gray-700 mb-1"><strong>Discipline: </strong>{conference.discipline}</p>}
          {conference.publication_year_compute ? <p className="text-gray-700 mb-1"><strong>Publication date: </strong>{conference.publication_year_compute}</p> : null }
          {conference.citation_count_scopus != 0 && <p className="text-gray-700 mb-1"><strong>Citations (scopus): </strong> {conference.citation_count_scopus || 0}</p>}
          <p className="text-gray-700 mb-1"><strong>Start Date: </strong> {conference.start_date}</p>
          <p className="text-gray-700 mb-1"><strong>End Date: </strong> {conference.end_date}</p>
          {conference.doi_info && conference.doi_info !== 'N/A' && (
            <p className="text-gray-700 mb-4"><strong>Web Link:</strong> (
              <a href={`https://doi.org/${conference.doi_info}`} className="text-blue-600 hover:underline">{conference.doi_info}</a>
            )</p>
          )}
        </div>

        <button
          onClick={() => setShowCitation(true)}
          className="mt-4 px-4 py-2 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Create Citation
        </button>

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
            <p className="mb-4">{`${formattedAuthors} ${conference.title_of_paper}. ${conference.discipline} (${conference.publication_year_compute}). ${conference.conference}`}</p>
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
      <Footer />
    </>
  );
};

export default Conferences;
