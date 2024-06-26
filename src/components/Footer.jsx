import ricLogo from '../assets/ric_emblem.jpeg';
import nustLogo from '../assets/nustLogo.png';
import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
      <footer className="w-full b-0 bg-gray-900 text-gray-300 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row lg:justify-between justify-center md:items-start items-center ">
          <div className="mb-6 lg:mb-0">
            <a href="#" className="flex items-center">
              <img src={nustLogo} className="h-8 me-3" alt="RIC Logo" />
              <span className="text-xl md:text-2xl font-semibold whitespace-nowrap text-white">NUST Digital Research Repository</span>
            </a>
          </div>
          <div className="flex flex-col">
            {/* <div>
              <h2 className="mb-4 text-sm font-semibold uppercase">Resources</h2>
              <ul className="text-gray-500 font-medium">
                <li className="mb-3">
                  <a href="#" className="hover:text-gray-400">About Us</a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-400">Papers</a>
                </li>
              </ul>
            </div> */}
            <div className='flex flex-col md:items-start items-center'>
            <h2 className="mb-4 text-sm font-semibold uppercase">Follow Us</h2>
            <ul className="text-gray-500 font-medium flex space-x-4">
              <li className="mb-3">
                <a href="https://www.facebook.com/ResearchNUST" className="hover:text-gray-400">
                  <FaFacebook size={24} />
                </a>
              </li>
              <li className="mb-3">
                <a href="https://twitter.com/Research_NUST" className="hover:text-gray-400">
                  <FaTwitter size={24} />
                </a>
              </li>
              <li className="mb-3">
                <a href="https://www.linkedin.com/company/research-nust/" className="hover:text-gray-400">
                  <FaLinkedin size={24} />
                </a>
              </li>
              <li className="mb-3">
                <a href="https://www.youtube.com/@Research_NUST" className="hover:text-gray-400">
                  <FaYoutube size={24} />
                </a>
              </li>
            </ul>
          </div>
            {/* <div>
              <h2 className="mb-4 text-sm font-semibold uppercase">Legal</h2>
              <ul className="text-gray-500 font-medium">
                <li className="mb-3">
                  <a href="#" className="hover:text-gray-400">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-400">Terms & Conditions</a>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
        <hr className="my-6 border-gray-600 sm:mx-auto" />
        <div className="text-sm text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} NUST Research Dte. All rights reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  