import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Appbar from '../components/Appbar';
import Footer from '../components/Footer';
import axios from 'axios';

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
        console.log('Fetching publication details for:', publicationId);
        const response = await axios.get(`/odoocms_api`, {
          params: {
            alias: 'ric_expert_portal_journal_pub',
            auth: 'fc22151322bfdd2c3f0626798c9198bc',
            rows: 1000,
            title: publicationId // Using publicationId as title for the search
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

  const handleCopyCitation = () => {
    const citationText = `${publication.all_author_compute}. ${publication.title}. ${publication.journal_title}. (${publication.publication_year_compute}). ${publication.journal_info}`;
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

  const authors = publication.all_author_compute
    ? publication.all_author_compute.split(', ').join(', ')
    : 'N/A';

  return (
    <>
      <Appbar />
      <div className="container mx-auto px-4 py-8">
        {publication.online_publication_date ? <i className='text-gray-500'>[Published on {publication.online_publication_date}]</i> : null }
        <h1 className="text-3xl font-bold mb-4">{publication.title}</h1>
        <p className="text-gray-600 mb-4">
          By: {authors} - {publication.publication_year_compute || 'N/A'}
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
                    <img src={`/sdgs/sdg-${sdg.id}.png`} alt={sdg.name} className="w-full h-full" />
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
              <p className="mb-4">{`${publication.all_author_compute}. ${publication.title}. ${publication.journal_title}. (${publication.publication_year_compute}). ${publication.journal_info}`}</p>
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
