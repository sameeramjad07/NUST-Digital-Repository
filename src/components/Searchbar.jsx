import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';
import debounce from 'lodash.debounce';

const apiName = '/odoocms_api';
const qalamAlias = import.meta.env.VITE_QALAM_ALIAS;
const qalamAuth = import.meta.env.VITE_QALAM_AUTH;
const qalamAuthorAlias = import.meta.env.VITE_QALAM_ALIAS_AUTHOR;
const qalamAuthorAuth = import.meta.env.VITE_QALAM_AUTH_AUTHOR;
const qalamConferenceAlias = import.meta.env.VITE_QALAM_ALIAS_CONFERENCE;
const qalamConferenceAliasInd = import.meta.env.VITE_QALAM_ALIAS_CONFERENCE_IND;
const qalamConferenceAuth = import.meta.env.VITE_QALAM_AUTH_CONFERENCE;
const qalamConferenceAbs = import.meta.env.VITE_QALAM_ALIAS_CONFERENCE_ABS
const qalamJournalAbs = import.meta.env.VITE_QALAM_ALIAS_JOURNAL_ABS

const additionalApis = [
  {
    alias: qalamConferenceAliasInd,
    auth: qalamConferenceAuth,
    param: 'title_of_paper',
    resultArray: 'ric_expert_portal_conference_pub_three_json_data'
  },
  {
    alias: qalamConferenceAbs,
    auth: qalamConferenceAuth,
    param: 'abstract',
    resultArray: 'ric_expert_portal_conference_pub_four_json_data'
  },
  {
    alias: qalamJournalAbs,
    auth: qalamAuth,
    param: 'abstract',
    resultArray: 'ric_expert_portal_journal_pub_three_json_data'
  }
];

const SearchBar = ({ onResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('title');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authorSuggestions, setAuthorSuggestions] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  useEffect(() => {
    if (selectedCategory === 'author' && searchQuery.length > 2) {
      fetchAuthorSuggestions(searchQuery);
    }
  }, [searchQuery]);

  const fetchAuthorSuggestions = debounce(async (query) => {
    try {
      const response = await axios.get(apiName, {
        params: {
          alias: qalamAuthorAlias,
          auth: qalamAuthorAuth,
          rows: 1000,
          name: query,
        },
      });
      if (response && response.data) {
        setAuthorSuggestions(response.data.ric_expert_portal_faculty_cards_json_data.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching author suggestions:', error);
    }
  }, 300);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let results = [];
      if (selectedCategory === 'title') {
        const mainResponse = await axios.get(apiName, {
          params: {
            alias: qalamAlias,
            auth: qalamAuth,
            rows: 1000,
            title: searchQuery,
          },
        });

        if (mainResponse && mainResponse.data) {
          results = mainResponse.data.ric_expert_portal_journal_pub_json_data || [];
        }

        const additionalResponses = await Promise.all(
          additionalApis.map(api =>
            axios.get(apiName, {
              params: {
                alias: api.alias,
                auth: api.auth,
                rows: 1000,
                [api.param]: searchQuery,
              },
            })
          )
        );

        additionalResponses.forEach((response, index) => {
          if (response && response.data) {
            const api = additionalApis[index];
            results = results.concat(response.data[api.resultArray] || []);
          }
        });

      } else if (selectedCategory === 'author' && selectedAuthor) {
        const [pubResponse, confResponse] = await Promise.all([
          axios.get(apiName, {
            params: {
              alias: qalamAlias,
              auth: qalamAuth,
              rows: 1000,
              author_cmsid: selectedAuthor.code,
            },
          }),
          axios.get(apiName, {
            params: {
              alias: qalamConferenceAlias,
              auth: qalamConferenceAuth,
              rows: 250,
              author_cmsid: selectedAuthor.code,
            },
          }),
        ]);

        const publications = pubResponse.data.ric_expert_portal_journal_pub_json_data || [];
        const conferences = confResponse.data.ric_expert_portal_conference_pub_json_data || [];
        results = shuffleArray([...publications, ...conferences]);
        setSelectedAuthor(null);
      }

      onResults(results, searchQuery);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleAuthorSelect = (author) => {
    setSelectedAuthor(author);
    setSearchQuery(author.name);
    setAuthorSuggestions([]);
  };

  const handleCategoryButtonClick = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <form className="relative mx-auto w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl" onSubmit={handleSearch}>
      <div className="flex items-center">
        <div className="relative flex-grow flex">
          <input
            type="search"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full py-3 px-4 text-base text-gray-900 bg-gray-100 border border-gray-300 rounded-l focus:outline-none focus:bg-white focus:border-gray-500"
            placeholder={selectedCategory === 'title' ? "Search for papers, articles, etc." : "Search by author name"}
            required
          />
          <button
            onClick={handleCategoryButtonClick}
            className="flex items-center justify-center px-2 py-1 w-auto bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
          >
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
            <svg
              className={`w-4 h-4 transition-transform duration-300 transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 12.586l-3.293-3.293-1.414 1.414L10 15.414l4.707-4.707-1.414-1.414L10 12.586z"
              />
            </svg>
          </button>
        </div>
        <button
          type="submit"
          className="flex-shrink-0 font-bold text-lg px-4 py-2 ml-2 text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
        >
          Search
        </button>
      </div>

      {isDropdownOpen && (
        <div className="absolute top-full right-0 w-full sm:w-1/3 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
          {['title', 'author'].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategorySelect(category)}
              className="block w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      )}

      {selectedCategory === 'author' && authorSuggestions.length > 0 && selectedAuthor == null && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {authorSuggestions.map((author) => (
            <div
              key={author.code}
              onClick={() => handleAuthorSelect(author)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {author.name}
            </div>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <TailSpin color="#00BFFF" height={50} width={50} />
        </div>
      )}
    </form>
  );
};

export default SearchBar;
