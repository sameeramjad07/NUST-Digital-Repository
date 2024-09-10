import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav';
import SearchBar from '../components/Searchbar';
import Footer from '../components/Footer';
import PaperCard from '../components/PaperCard';
import Pagination from '../components/Pagination';
import Charts from '../components/Charts'; 
import ndrrLogo from '../assets/NDRR_logo_home.jpg';
import { generateExcel, downloadExcel } from '../utils/csvUtils';
import axios from 'axios';

const Home = () => {
  const [papers, setPapers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [papersPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [docTypeCounts, setDocTypeCounts] = useState({});
  const [uniqueYears, setUniqueYears] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [chartsData, setChartsData] = useState([]);

  useEffect(() => {
    fetchChartsData();
  }, []);

  useEffect(() => {
    // Reset filters whenever searchQuery changes
    setSelectedDocType('');
    setSelectedYear('');
  }, [searchQuery]);

  const fetchChartsData = async () => {
    try {
      const response = await axios.get('https://ndrr-charts-api.vercel.app/api/charts');
      setChartsData(response.data);
    } catch (error) {
      console.error('Failed to fetch charts data:', error);
    }
  };

  const handleResults = (results, query) => {
    console.log('Search Results:', results);
    setPapers(results);
    setSearchQuery(query);
    extractUniqueFilters(results);
  };

  const extractUniqueFilters = (results) => {
    const docTypes = {};
    const years = new Set();

    results.forEach(paper => {
      const docType = paper.type || (paper.doc_type ? (paper.doc_type.trim() === '' || paper.doc_type === 'Article (AAR Marks)' ? 'Conference Proceedings' : paper.doc_type) : 'Conference Proceedings');
      if (!docTypes[docType]) {
        docTypes[docType] = 0;
      }
      docTypes[docType]++;
      if (paper.publication_year_compute) {
        years.add(paper.publication_year_compute);
      }
    });

    setDocTypeCounts(docTypes);
    setUniqueYears([...years]);
  };

  const filteredPapers = papers.filter(paper => {
    const docType = paper.type || (paper.doc_type ? (paper.doc_type.trim() === '' || paper.doc_type === 'Article (AAR Marks)' ? 'Conference Proceedings' : paper.doc_type) : 'Conference Proceedings');
    return (
      (selectedDocType === '' || docType === selectedDocType) &&
      (selectedYear === '' || paper.publication_year_compute === selectedYear)
    );
  });

  const indexOfLastPaper = currentPage * papersPerPage;
  const indexOfFirstPaper = indexOfLastPaper - papersPerPage;
  const currentPapers = filteredPapers.slice(indexOfFirstPaper, indexOfLastPaper);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDownload = () => {
    const filteredResults = papers.filter(paper => {
      const docType = paper.type || (paper.doc_type ? (paper.doc_type.trim() === '' || paper.doc_type === 'Article (AAR Marks)' ? 'Conference Proceedings' : paper.doc_type) : 'Conference Proceedings');
      
      if (selectedDocType === 'Oral') {
        return docType === 'Oral' &&
          (selectedYear === '' || paper.publication_year_compute === selectedYear);
      } else if (selectedDocType === 'Conference Proceedings') {
        return (docType === 'Conference Proceedings' || docType === 'Article (AAR Marks)') &&
          (selectedYear === '' || paper.publication_year_compute === selectedYear);
      } else {
        return (selectedDocType === '' || docType === selectedDocType) &&
          (selectedYear === '' || paper.publication_year_compute === selectedYear);
      }
    });
  
    const wb = generateExcel(filteredResults, searchQuery);
    downloadExcel(wb);
  };


  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <div className="mt-6 flex flex-col items-center flex-grow">
        <img src={ndrrLogo} className='w-80' alt="NDRR Logo" />
        {/* <h3 className='text-center mt-6 text-xl leading-none tracking-tight text-gray-600 md:text-2xl lg:text-3xl'>Welcome to the</h3> */}
        <h1 className="text-center mt-2 mb-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-5xl lg:text-6xl">
          NUST{' '}
          <span className='underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600 sm:ml-4'>Digital <span className="block sm:hidden"> </span> Research Repository</span>
        </h1>
        <p className="text-center mt-2 w-11/12 sm:w-2/3 md:w-full lg:w-full mb-8 text-base sm:text-lg md:text-lg lg:text-xl font-normal text-slate-500 px-4 sm:px-8 md:px-16 lg:px-24 ">
        This platform is the go-to resource for research papers and scholarly articles from NUST University's distinguished professors and researchers. Whether you're looking for groundbreaking studies or innovative insights, you'll find a diverse range of disciplines represented here
        </p>
        <SearchBar onResults={handleResults} />
      </div>
      <div className="mt-0 sm:mt-6 flex flex-col items-center lg:flex-row lg:justify-between">
        {papers.length > 0 ? (
          <>
            <Link
              to={`/latestpublications`}
              target="_blank"
              className="sm:ml-4 ml-0 mt-6 lg:mt-0 text-blue-500 bg-slate-100 hover:bg-slate-200 border border-blue-400 transition focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-md px-4 py-2"
            >
              View Latest Publications
            </Link>
            <div className="mt-6 flex space-x-2 justify-center lg:mt-0 lg:flex lg:justify-center">
              <select
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value)}
                className="p-3 border border-blue-400 rounded-lg bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200 ease-in-out"
              >
                <option value="">Document Type</option>
                {Object.keys(docTypeCounts).map((docType, index) => (
                  <option key={index} value={docType}>
                    {`${docType} (${docTypeCounts[docType]})`}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="p-3 border border-blue-400 rounded-lg bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200 ease-in-out"
              >
                <option value="">Publication Year</option>
                {uniqueYears.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleDownload}
              className="mr-0 sm:mr-4 mt-4 lg:mt-0 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-lg px-4 py-2"
            >
              Download Results
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center lg:flex-row lg:justify-center lg:w-full mt-6">
            <Link
              to={`/latestpublications`}
              target="_blank"
              className="text-blue-500 bg-slate-100 hover:bg-slate-200 border border-blue-400 transition focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-md px-4 py-2"
            >
              View Latest Publications
            </Link>
          </div>
        )}
      </div>
      <div className="space-y-6 p-4 mt-8 flex-grow">
        {currentPapers.map((paper, index) => (
          <PaperCard 
            key={paper.id} 
            paper={paper} 
            index={(currentPage - 1) * papersPerPage + index + 1} 
          />
        ))}
      </div>
      {papers.length == 0 && 
      <div className='flex flex-col'>
        <h1 className="underline underline-offset-2 decoration-4 decoration-blue-400 text-center mb-2 mt-4 text-2xl font-sans font-bold leading-7 sm:tracking-tight text-slate-700 sm:text-2xl md:text-4xl lg:text-4xl">
          NUST Statistics
        </h1>
        <Charts chartsData={chartsData} />
      </div>}
      {filteredPapers.length > 0 && (
        <Pagination
          papersPerPage={papersPerPage}
          totalPapers={filteredPapers.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      )}
      <Footer />
    </div>
  );
};

export default Home;
