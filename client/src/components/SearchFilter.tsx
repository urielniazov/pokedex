import React from 'react';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSearching: boolean;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ 
  searchQuery, 
  onSearchChange, 
  isSearching 
}) => {
  return (
    <div className="search-filter">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search Pokémon"
        />
        {isSearching && <div className="search-spinner"></div>}
        {searchQuery && !isSearching && (
          <button 
            className="clear-search" 
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      {searchQuery && (
        <div className="search-info">
          Searching for: <span className="search-term">{searchQuery}</span>
        </div>
      )}
    </div>
  );
};