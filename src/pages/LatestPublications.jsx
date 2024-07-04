import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';
import PaperCard from '../components/PaperCard';
import { TailSpin } from 'react-loader-spinner';

const apiName = '/odoocms_api';
const qalamLatestAlias = import.meta.env.VITE_QALAM_ALIAS_LATEST;
const qalamAuth = import.meta.env.VITE_QALAM_AUTH;

const LatestPublications = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const today = new Date();
        const publicationsToFetch = 10;
        const fetchedPublications = [];

        // Start fetching publications from 12 months ahead of the current month and year
        for (let i = 12; i >= 0; i--) {
          const fetchDate = new Date(today.getFullYear(), today.getMonth() + i);
          const year = fetchDate.getFullYear();
          const month = fetchDate.getMonth() + 1; // Month is zero-indexed, so we add 1

          const response = await axios.get(apiName, {
            params: {
              alias: qalamLatestAlias,
              auth: qalamAuth,
              rows: 1000,
              publication_date: `${year}-${month.toString().padStart(2, '0')}`,
            },
          });

          const fetchedData = response.data.ric_expert_portal_journal_pub_five_json_data || [];

          // Filter and add unique publications
          fetchedData.forEach(publication => {
            if (!fetchedPublications.some(pub => pub.id === publication.id)) {
              fetchedPublications.push(publication);
            }
          });

          // Break the loop if we have enough publications
          if (fetchedPublications.length >= publicationsToFetch) {
            break;
          }
        }

        // Sort publications by publication_date in descending order
        const sortedPublications = fetchedPublications.sort((a, b) => new Date(b.publication_date) - new Date(a.publication_date));

        // Get the top 10 publications
        const topPublications = sortedPublications.slice(0, publicationsToFetch);

        setPublications(topPublications);
      } catch (error) {
        console.error('Error fetching publications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <div className="mt-6 flex flex-col items-center flex-grow">
        <h1 className="text-center text-4xl font-extrabold leading-tight tracking-tight text-gray-900 mb-4 mt-2 sm:text-5xl md:text-5xl lg:text-6xl">
          Latest Publications
        </h1>
        <p className="text-justify w-11/12 sm:w-2/3 md:w-full lg:w-full mb-6 text-base sm:text-lg md:text-lg lg:text-xl font-normal text-gray-500 px-4 sm:px-8 md:px-16 lg:px-24 dark:text-gray-400">
          Our Latest Research Publications from the current year. Stay up-to-date with the latest research and discoveries from NUST University's esteemed professors and researchers.
        </p>
        {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
                <TailSpin color="#00BFFF" height={50} width={50} />
            </div>
        ) : (
          <div className="space-y-6 p-4 mt-8 mx-auto flex-grow">
            {publications.map((paper, index) => (
              <PaperCard key={paper.id} paper={paper} index={index + 1} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LatestPublications;
