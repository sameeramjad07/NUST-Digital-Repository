import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Appbar from '../components/Appbar';
import Footer from '../components/Footer';
import axios from 'axios';

const sdgImages = import.meta.glob('/src/assets/sdgs/*.png', { eager: true });

const apiName = '/odoocms_api';
const qalamAuthorAlias = import.meta.env.VITE_QALAM_ALIAS_AUTHOR;
const qalamAuthorAuth = import.meta.env.VITE_QALAM_AUTH_AUTHOR;
const qalamAlias = import.meta.env.VITE_QALAM_ALIAS;
const qalamAuth = import.meta.env.VITE_QALAM_AUTH;

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

const Publications = () => {
  const [publication, setPublication] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCitation, setShowCitation] = useState(false);
  const [isCitationCopied, setIsCitationCopied] = useState(false);
  const { publicationId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicationDetails = async () => {
      setIsLoading(true);
      try {
        const decodedPublicationId = decodeURIComponent(publicationId);
        console.log('Fetching publication details for:', decodedPublicationId);
        const response = await axios.get(apiName, {
          params: {
            alias: qalamAlias,
            auth: qalamAuth,
            rows: 1000,
            title: decodedPublicationId // Using publicationId as title for the search
          }
        });

        console.log('API response:', response.data.ric_expert_portal_journal_pub_json_data);
        
        // Extract the publications array from the response
        const publicationsArray = response.data.ric_expert_portal_journal_pub_json_data;

        // Find the specific publication by exact title match
        const publicationData = publicationsArray.find(pub => pub.title === publicationId);
        if (publicationData) {
          console.log('Publication found:', publicationData);
          setPublication(publicationData);

          // Fetch author codes for NUST authors
          const authorCodes = await Promise.all(
            publicationData.author_ids.map(async author => {
              if (author.affiliation.toLowerCase() === 'nust') {
                const code = await fetchAuthorCode(author.name);
                return { ...author, code: code };
              }
              return author;
            })
          );
          setPublication({ ...publicationData, author_ids: authorCodes });
        
        } else {
          console.error('Publication not found');
        }
      } catch (error) {
        console.error('Error fetching publication details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (publicationId) {
      fetchPublicationDetails();
    } else {
      navigate('/'); // Redirect to home if no publication ID is provided
    }
  }, [publicationId, navigate]);

  const formatAuthorName = (authorName) => {
    const nameParts = authorName.trim().split(' ');
    const lastName = nameParts.pop();
    const initials = nameParts.map(name => name.charAt(0).toUpperCase()).join('. ');
    return `${lastName}, ${initials}${initials ? '.' : ''}`;
  };

  const formattedAuthors = publication?.all_author_compute
    .split(',')
    .map(author => formatAuthorName(author.trim()))
    .join(', ');

  const handleCopyCitation = () => {
    const citationText = `${formattedAuthors}. ${publication.title}. ${publication.journal_title}. (${publication.publication_year_compute}). ${publication.journal_info}`;
    navigator.clipboard.writeText(citationText)
      .then(() => {
        setIsCitationCopied(true);
        setTimeout(() => setIsCitationCopied(false), 2000); // Reset after 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy citation: ', err);
      });
  };

  if (isLoading) {
    return (
      <>
        <Appbar />
        <div className="flex justify-center items-center h-screen">
          <p>Loading publication details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!publication) {
    return (
      <>
        <Appbar />
        <div className="flex justify-center items-center h-screen">
          <p>Publication not found!</p>
        </div>
        <Footer />
      </>
    );
  }

  const renderAuthors = () => {
    return publication.author_ids.map(author => {
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
    }).reduce((prev, curr) => [prev, ', ', curr]);
  };

  return (
    <>
      <Appbar />
      <div className="container mx-auto px-4 py-8">
        {publication.online_publication_date ? <i className='text-gray-500'>[Published on {publication.online_publication_date}]</i> : null }
        <h1 className="text-3xl font-bold mb-4">{publication.title}</h1>
        <p className="text-gray-600 mb-4">
          {renderAuthors()} - {publication.publication_year_compute || 'N/A'}
        </p>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Abstract</h2>
          <p className="text-gray-700">{publication.abstract || 'No abstract available.'}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">Details</h2>
          <p className="text-gray-700"><strong>Journal Title:</strong> {publication.journal_title}</p>
          <p className="text-gray-700"><strong>Journal Information:</strong>{publication.journal_info}</p>
          {publication.online_publication_date ? <p className="text-gray-700"><strong>Online publication date:</strong>{publication.online_publication_date}</p>  : null }
          {publication.publication_date ? <p className="text-gray-700"><strong>Publication date:</strong>{publication.publication_date}</p> : null }
          <p className="text-gray-700"><strong>Impact Factor:</strong> {publication.impact_factor}</p>
          <p className="text-gray-700"><strong>WoS Quartile:</strong> {publication.int_quartiles}</p>
          <p className="text-gray-700"><strong>Citations (Scopus):</strong> {publication.citation_count_scopus || 0}</p>
          <p className="text-gray-700"><strong>Web Link:</strong> {publication.doi_info ? (
            <a href={`https://doi.org/${publication.doi_info}`} className="text-blue-600 hover:underline">{publication.doi_info}</a>
          ) : 'N/A'}</p>
          {publication.sdgs.length == 0 ? <div/> : <div className="mt-2 mb-8">
            <h2 className="text-2xl font-semibold mb-2">SDGs</h2>
            {publication.sdgs.length > 0 ? (
              <div className="flex flex-wrap">
                {publication.sdgs.map(sdg => (
                  <div key={sdg.id} className="w-32 h-32 m-2">
                    <img src={sdgImages[`/src/assets/sdgs/sdg-${sdg.id}.png`].default} alt={sdg.name} className="w-full h-full" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-700">No SDG is mapped to this publication.</p>
            )}
          </div> }
        </div>

        <button
          onClick={() => setShowCitation(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Create Citation
        </button>

        {showCitation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Citation Details</h2>
              <p className="mb-4">{`${formattedAuthors}. ${publication.title}. ${publication.journal_title}. (${publication.publication_year_compute}). ${publication.journal_info}`}</p>
              <button
                onClick={handleCopyCitation}
                className={`mr-2 px-4 py-2 rounded-lg transition-colors duration-200 mb-4 ${isCitationCopied ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {isCitationCopied ? 'Citation Copied' : 'Copy Citation'}
              </button>
              <button
                onClick={() => setShowCitation(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Publications;
