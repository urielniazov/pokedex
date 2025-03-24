import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    // Always show current page, and pages around it
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    // Generate the page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };
  
  return (
    <div className="pagination">
      <button 
        className="pagination-button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
      >
        ⟪ First
      </button>
      
      <button 
        className="pagination-button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ⟨ Previous
      </button>
      
      <div className="pagination-numbers">
        {getPageNumbers().map(pageNum => (
          <button
            key={pageNum}
            className={`page-number ${pageNum === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(pageNum)}
            aria-current={pageNum === currentPage ? "page" : undefined}
          >
            {pageNum}
          </button>
        ))}
      </div>
      
      <button 
        className="pagination-button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next ⟩
      </button>
      
      <button 
        className="pagination-button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        Last ⟫
      </button>
    </div>
  );
};

// PageSizeSelector component
export const PageSizeSelector: React.FC<{
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}> = ({ pageSize, onPageSizeChange }) => {
  return (
    <div className="page-size-selector">
      <label htmlFor="page-size">Pokemon per page:</label>
      <select 
        id="page-size" 
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>
    </div>
  );
};

export default Pagination;