import React, { useState } from 'react';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';
import ndrrLogo from '../assets/NDRR_logo_home.jpg';

const faqs = [
  { question: 'What is NUST Digital Research Repository?', answer: 'NUST Digital Research Repository is a collection of academic papers and scholarly articles from NUST University.' },
  { question: 'How can I access the research papers?', answer: 'You can access the research papers by browsing through our website and using the search functionalities.' },
  { question: 'How do I search for specific papers?', answer: 'You can use the search bar on our homepage to search for specific papers using keywords or authors.' },
  { question: 'Can I download the papers?', answer: 'Yes, you can download the papers in PDF format if the authors have made them available.' },
  { question: 'How can I contribute to the repository?', answer: 'To contribute, please contact us through the provided email and submit your papers for review.' },
  { question: 'Is there a fee to access the papers?', answer: 'No, access to the research papers is completely free.' },
  { question: 'How do I create an account?', answer: 'You do not need an account to access the papers. However, you can create an account to save your search preferences.' },
  { question: 'Who can I contact for support?', answer: 'For support, you can reach out to our help desk through the contact form on our website.' },
  { question: 'What types of papers are included?', answer: 'The repository includes conference papers, journal articles, and technical reports from various disciplines.' },
  { question: 'Can I submit my own research?', answer: 'Yes, you can submit your research by following the submission guidelines on our website.' },
  { question: 'How often is the repository updated?', answer: 'The repository is updated regularly as new research is published and submitted.' },
  { question: 'What if I find a broken link?', answer: 'Please report any broken links through our contact form so we can fix them as soon as possible.' },
  { question: 'How can I get involved with NUST Digital Research Repository?', answer: 'You can get involved by participating in our community, contributing research, or providing feedback.' },
  { question: 'Where can I find more information about the research topics?', answer: 'More information about research topics can be found on our website under each research paper’s description.' },
  { question: 'Are there any guidelines for using the research?', answer: 'Yes, please follow the citation guidelines provided with each paper to use the research appropriately.' },
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
