import React, { useState } from 'react';
import Appbar from '../components/Appbar';
import SearchBar from '../components/Searchbar';
import Footer from '../components/Footer';
import PaperCard from '../components/PaperCard';
import Pagination from '../components/Pagination';

const Home = () => {
  const [papers, setPapers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [papersPerPage] = useState(10);

  const handleResults = (results) => {
    console.log('Search Results:', results);
    setPapers(results);
  };

  const indexOfLastPaper = currentPage * papersPerPage;
  const indexOfFirstPaper = indexOfLastPaper - papersPerPage;
  const currentPapers = papers.slice(indexOfFirstPaper, indexOfLastPaper);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Appbar />
      <div className='mt-6 flex flex-col items-center'>
        <h3 className='text-center mt-6 text-xl leading-none tracking-tight text-gray-600 md:text-2xl lg:text-3xl'>Welcome to the</h3>
        <h1 className="text-center mt-2 mb-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-5xl lg:text-6xl">
          NUST{' '}
          <span className='underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600 sm:ml-4'>Digital <span className="block sm:hidden"> </span> Research Repository</span>
        </h1>
        <p className="text-center w-11/12 sm:w-2/3 md:w-full lg:w-full mb-6 text-base sm:text-lg md:text-lg lg:text-xl font-normal text-gray-500 px-4 sm:px-8 md:px-16 lg:px-24 dark:text-gray-400">
          Discover the wealth of academic knowledge hosted on the NUST Digital Research Repository. As the primary repository for research papers and scholarly articles from NUST University's esteemed professors and researchers, our platform offers unprecedented access to cutting-edge discoveries and insights. From groundbreaking studies to innovative findings, explore a diverse array of disciplines and contribute to the advancement of knowledge in your field. Join us in fostering collaboration and sharing ideas as we collectively push the boundaries of academic exploration.
        </p>
      </div>
      <SearchBar onResults={handleResults} />
      <div className="space-y-6 p-4 mt-8 mx-10">
        {currentPapers.map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>
      <Pagination
        papersPerPage={papersPerPage}
        totalPapers={papers.length}
        paginate={paginate}
        currentPage={currentPage}
      />
      <Footer />
    </>
  );
};

export default Home;
