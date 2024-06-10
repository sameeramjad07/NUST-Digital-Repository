import ricLogo from '../assets/ric_emblem.jpeg';
import nustLogo from '../assets/nustLogo.png';

const Footer = () => {
    return (
      <footer className="mt-4 bg-gray-900 text-gray-300 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row justify-between">
          <div className="mb-6 lg:mb-0">
            <a href="#" className="flex items-center">
              <img src={nustLogo} className="h-8 me-3" alt="RIC Logo" />
              <span className="sm:text-2xl text-xl font-semibold whitespace-nowrap">NUST Digital Research Repository</span>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase">Resources</h2>
              <ul className="text-gray-500 font-medium">
                <li className="mb-3">
                  <a href="#" className="hover:text-gray-400">About Us</a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-400">Papers</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase">Follow Us</h2>
              <ul className="text-gray-500 font-medium">
                <li className="mb-3">
                  <a href="https://www.facebook.com/ResearchNUST" className="hover:text-gray-400">Facebook</a>
                </li>
                <li className="mb-3">
                  <a href="https://twitter.com/Research_NUST" className="hover:text-gray-400">Twitter</a>
                </li>
                <li className="mb-3">
                  <a href="https://www.linkedin.com/company/research-nust/" className="hover:text-gray-400">LinkedIn</a>
                </li>
                <li className="mb-3">
                  <a href="https://www.youtube.com/@Research_NUST" className="hover:text-gray-400">Youtube</a>
                </li>  
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase">Legal</h2>
              <ul className="text-gray-500 font-medium">
                <li className="mb-3">
                  <a href="#" className="hover:text-gray-400">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-400">Terms & Conditions</a>
                </li>
              </ul>
            </div>
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
  