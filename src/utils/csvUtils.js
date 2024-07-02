import { utils, writeFile } from 'xlsx';

// Helper function to sanitize strings for XML
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[\u0000-\u001F\u007F-\u009F\uD800-\uDFFF]/g, '');
};

export const generateExcel = (papers, searchQuery) => {
  const wsData = papers.map((paper, index) => {
    const authors = paper.author_ids || paper.findet_ids || [];
    const authorNames = authors.map(author => sanitizeString(author.name || author.pc_applicant_name || '')).join(', ');

    return {
      'S.No.': index + 1,
      'Title': sanitizeString(paper.conference ? paper.title_of_paper || '' : paper.title || ''),
      'Abstract': sanitizeString(paper.abstract || ''),
      'Authors': authorNames,
      'Year': sanitizeString(paper.publication_year_compute || ''),
      'Journal/Conference': sanitizeString(paper.conference || paper.journal_title || ''),
      'Impact Factor': sanitizeString(paper.impact_factor || ''),
      'Citations': sanitizeString(paper.citation_count_scopus || ''),
      'Document Type': sanitizeString(paper.conference ? 'Conference Proceeding' : paper.type || ''),
      'Start Date': sanitizeString(paper.start_date || ''),
      'End Date': sanitizeString(paper.end_date || ''),
    };
  });

  const ws = utils.json_to_sheet(wsData);

  // Set column widths
  const wscols = [
    { wch: 5 },  // 'S.No.'
    { wch: 100 }, // 'Title'
    { wch: 80 }, // 'Abstract'
    { wch: 30 }, // 'Authors'
    { wch: 10 }, // 'Year'
    { wch: 30 }, // 'Journal/Conference'
    { wch: 15 }, // 'Impact Factor'
    { wch: 10 }, // 'Citations'
    { wch: 25 }, // 'Document Type'
    { wch: 15 }, // 'Start Date'
    { wch: 15 }  // 'End Date'
  ];

  ws['!cols'] = wscols;

  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Search Results');

  const queryData = [['Search Query:', sanitizeString(searchQuery)]];
  const searchQuerySheet = utils.aoa_to_sheet(queryData);

  utils.book_append_sheet(wb, searchQuerySheet, 'Query Details');

  return wb;
};

export const downloadExcel = (wb) => {
  try {
    writeFile(wb, 'search_results.xlsx');
  } catch (error) {
    console.error('Error writing Excel file:', error);
  }
};
