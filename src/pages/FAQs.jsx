import React, { useState } from 'react';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';
import ndrrLogo from '../assets/NDRR_logo_home.jpg';

const faqs = [
  { question: 'What is NUST Digital Research Repository?', answer: 'NUST Digital Research Repository is a collection of academic papers and scholarly articles from NUST University.' },
  { question: 'How can I access the research papers?', answer: 'You can access the research papers by browsing through our website and using the search functionalities.' },
  { question: 'How do I search for specific papers?', answer: 'You can use the search bar on our homepage to search for specific papers using keywords or authors.' },
  { question: 'Can I download the papers?', answer: 'Yes, you can download the papers in PDF format if the authors have made them available in the weblink of the publication.' },
  { question: 'Is there a fee to access the papers?', answer: 'No, there is no fee to access the research papers details.' },
  { question: 'Who can I contact for support?', answer: 'For support, you can reach out to our help desk through the contact form on our website.' },
  { question: 'What types of papers are included?', answer: 'The repository includes conference papers, journal articles, and technical reports from various disciplines.' },
  { question: 'How often is the repository updated?', answer: 'The repository is updated regularly as new research is published and submitted.' },
  { question: 'What if I find a broken link?', answer: 'Please report any broken links through our contact form so we can fix them as soon as possible.' },
  { question: 'Where can I find more information about the research publication?', answer: 'More information about research publication can be found by visiting the document page on our website.' },
  { question: 'Are there any guidelines for using the research?', answer: 'Yes, please follow the citation guidelines provided with each paper to use the research appropriately.' },
  { question: 'Is NUST Digital Research Repository free to use?', answer: 'Yes, it is free to use.' },
  { question: 'Can we download the results of our search of papers?', answer: 'Yes, you can download the results of your search.' },
  { question: 'How can we cite the paper?', answer: 'You can cite by clicking on the "Create Citation" button on any paper that you want to cite.' },
  { question: 'How to visit the soft copy of the paper?', answer: 'The soft copy can be visited by following the weblink provided on the paper page.' }
];


const Accordion = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-4 px-6 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="text-lg font-semibold">{question}</span>
        <span className="float-right text-gray-600">
          {isOpen ? '-' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="py-4 px-6 bg-white">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQs = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <div className="mt-6 flex flex-col items-center flex-grow">
        <img src={ndrrLogo} className='w-52' alt="NDRR Logo" />
        <h1 className="text-center mt-4 mb-8 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
          Frequently Asked Questions
        </h1>
      </div>
      <div className="flex flex-col items-center flex-grow p-4">
        <div className="w-full max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <Accordion key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQs;
