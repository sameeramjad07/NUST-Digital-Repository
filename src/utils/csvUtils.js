import { utils, writeFile } from 'xlsx';

export const generateExcel = (papers, searchQuery) => {
  const wsData = papers.map((paper, index) => {
    const authors = paper.author_ids || paper.findet_ids || [];
    const authorNames = authors.map(author => author.name || author.pc_applicant_name).join(', ');

    return {
      'S.No.': index + 1,
      'Title': paper.conference ? paper.title_of_paper : paper.title,
      'Abstract': paper.abstract || '',
      'Authors': authorNames,
      'Year': paper.publication_year_compute,
      'Journal/Conference': paper.conference || paper.journal_title,
      'Impact Factor': paper.impact_factor || '',
      'Citations': paper.citation_count_scopus || 0,
      'Document Type': paper.conference ? 'Conference Proceeding' : paper.type,
      'Start Date': paper.start_date || '',
      'End Date': paper.end_date || '',
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

  const searchQuerySheet = utils.aoa_to_sheet([['Search Query:', searchQuery]]);
  utils.book_append_sheet(wb, searchQuerySheet, 'Query Details');

  return wb;
};

export const downloadExcel = (wb) => {
  writeFile(wb, 'search_results.xlsx');
};
