import React, { useEffect, useState } from 'react';
import { PokemonResponse, SortField, SortOrder, FilterOptions } from '../types';
import { PokemonAPI } from '../api';
import PokemonCard from './PokemonCard';
import Pagination, { PageSizeSelector } from './Pagination';
import { useTheme } from '../ThemeContext';
import { useSearchParams } from 'react-router-dom';

// SortingSelector component
const SortingSelector: React.FC<{
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}> = ({ sortBy, sortOrder, onSortChange }) => {
  const sortFields: { value: SortField; label: string }[] = [
    { value: 'number', label: 'Pokedex Number' },
    { value: 'name', label: 'Name' },
    { value: 'total', label: 'Total Stats' },
    { value: 'hit_points', label: 'HP' },
    { value: 'attack', label: 'Attack' },
    { value: 'defense', label: 'Defense' },
    { value: 'special_attack', label: 'Special Attack' },
    { value: 'special_defense', label: 'Special Defense' },
    { value: 'speed', label: 'Speed' },
    { value: 'generation', label: 'Generation' },
  ];
  
  return (
    <div className="sorting-controls">
      <div className="sort-field">
        <label htmlFor="sort-by">Sort by:</label>
        <select 
          id="sort-by" 
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortField, sortOrder)}
        >
          {sortFields.map(field => (
            <option key={field.value} value={field.value}>
              {field.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="sort-order">
        <label htmlFor="sort-order">Order:</label>
        <select 
          id="sort-order" 
          value={sortOrder}
          onChange={(e) => onSortChange(sortBy, e.target.value as SortOrder)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
};

// TypeFilter component
const TypeFilter: React.FC<{
  selectedType: string | undefined;
  types: string[];
  onTypeChange: (type: string | undefined) => void;
}> = ({ selectedType, types, onTypeChange }) => {
  return (
    <div className="type-filter">
      <label htmlFor="type-filter">Filter by type:</label>
      <select 
        id="type-filter" 
        value={selectedType || ''}
        onChange={(e) => {
          const value = e.target.value;
          onTypeChange(value === '' ? undefined : value);
        }}
      >
        <option value="">All Types</option>
        {types.map(type => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
};

// SearchFilter component
const SearchFilter: React.FC<{
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSearching: boolean;
}> = ({ searchQuery, onSearchChange, isSearching }) => {
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

// ThemeToggle component
const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
};

// Main PokemonList component
const PokemonList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State for Pokemon data
  const [pokemonData, setPokemonData] = useState<PokemonResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get state from URL parameters or defaults
  const getPage = (): number => {
    const page = searchParams.get('page');
    return page ? parseInt(page) : 1;
  };
  
  const getPageSize = (): number => {
    const pageSize = searchParams.get('pageSize');
    return pageSize ? parseInt(pageSize) : 10;
  };
  
  const getSortBy = (): SortField => {
    const sortBy = searchParams.get('sortBy') as SortField | null;
    return sortBy || 'number';
  };
  
  const getSortOrder = (): SortOrder => {
    const sortOrder = searchParams.get('sortOrder') as SortOrder | null;
    return sortOrder || 'asc';
  };
  
  const getSelectedType = (): string | undefined => {
    const type = searchParams.get('type');
    return type || undefined;
  };
  
  const getSearchQuery = (): string => {
    const search = searchParams.get('search');
    return search || '';
  };
  
  // State for pagination - Initialize only once from URL
  const [page, setPage] = useState<number>(() => getPage());
  const [pageSize, setPageSize] = useState<number>(() => getPageSize());
  
  // State for sorting - Initialize only once from URL
  const [sortBy, setSortBy] = useState<SortField>(() => getSortBy());
  const [sortOrder, setSortOrder] = useState<SortOrder>(() => getSortOrder());
  
  // State for filtering - Initialize only once from URL
  const [pokemonTypes, setPokemonTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string | undefined>(() => getSelectedType());
  const [searchQuery, setSearchQuery] = useState<string>(() => getSearchQuery());
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  // Debounced search query with useCallback
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(() => getSearchQuery());
  
  
  // Update component state from URL params when URL changes
  useEffect(() => {
    const newPage = getPage();
    const newPageSize = getPageSize();
    const newSortBy = getSortBy();
    const newSortOrder = getSortOrder();
    const newSelectedType = getSelectedType();
    const newSearchQuery = getSearchQuery();
    
    // Only update state if values are different to prevent infinite loops
    if (page !== newPage) setPage(newPage);
    if (pageSize !== newPageSize) setPageSize(newPageSize);
    if (sortBy !== newSortBy) setSortBy(newSortBy);
    if (sortOrder !== newSortOrder) setSortOrder(newSortOrder);
    if (selectedType !== newSelectedType) setSelectedType(newSelectedType);
    if (searchQuery !== newSearchQuery) {
      setSearchQuery(newSearchQuery);
      setDebouncedSearchQuery(newSearchQuery);
    }
  }, [searchParams]);
  
  // Add cache for previous URL params to prevent unnecessary updates
  const urlParamsRef = React.useRef<string>('');
  
  // Update URL parameters when state changes
  useEffect(() => {
    const params: Record<string, string> = {};
    
    // Only add parameters that differ from defaults
    if (page !== 1) params.page = page.toString();
    if (pageSize !== 10) params.pageSize = pageSize.toString();
    if (sortBy !== 'number') params.sortBy = sortBy;
    if (sortOrder !== 'asc') params.sortOrder = sortOrder;
    if (selectedType) params.type = selectedType;
    if (searchQuery) params.search = searchQuery;
    
    // Convert current params to a string for comparison
    const paramsString = JSON.stringify(params);
    
    // Only update URL if params have changed
    if (paramsString !== urlParamsRef.current) {
      urlParamsRef.current = paramsString;
      setSearchParams(params);
    }
  }, [page, pageSize, sortBy, sortOrder, selectedType, searchQuery, setSearchParams]);
  
  // Effect to fetch Pokemon types
  useEffect(() => {
    const fetchPokemonTypes = async () => {
      try {
        const types = await PokemonAPI.getPokemonTypes();
        setPokemonTypes(types);
      } catch (err) {
        console.error('Error fetching Pokemon types:', err);
      }
    };
    
    fetchPokemonTypes();
  }, []);
  
  // Improved debounce effect with proper cleanup
  useEffect(() => {
    // Set searching state immediately when the user types
    if (searchQuery !== debouncedSearchQuery) {
      setIsSearching(true);
    }
    
    // Use a longer debounce time for better UX
    const debounceTime = 700; // 700ms debounce
    
    // Create the debounce timer
    const timer = setTimeout(() => {
      // Only update if the search query has actually changed
      if (searchQuery !== debouncedSearchQuery) {
        setDebouncedSearchQuery(searchQuery);
      }
      setIsSearching(false);
    }, debounceTime);
    
    // Clear the timer on cleanup
    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearchQuery]);
  
  // Main effect to fetch Pokemon data
  useEffect(() => {
    // Prevent API request spamming with a guard flag
    let isMounted = true;
    
    const fetchPokemon = async () => {
      // Initial loading will use the main loading state
      // For page changes, we'll use pageLoading state
      if (pokemonData) {
        setPageLoading(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      try {
        // Create filter options
        const filterOptions: FilterOptions = {
          type: selectedType,
          searchQuery: debouncedSearchQuery
        };
        
        // Fetch data
        const data = await PokemonAPI.getPokemon(
          { page, pageSize },
          { sortBy, sortOrder },
          filterOptions
        );
        
        // Only update state if component is still mounted
        if (isMounted) {
          setPokemonData(data);
          setLoading(false);
          setPageLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching Pokemon:', err);
          setError('Failed to load Pokemon data. Please try again.');
          setLoading(false);
          setPageLoading(false);
        }
      }
    };
    
    fetchPokemon();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [page, pageSize, sortBy, sortOrder, selectedType, debouncedSearchQuery]);
  
  // Handler for page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  // Handle filter, sort, or search changes - explicitly reset to page 1
  const handleTypeChange = (type: string | undefined) => {
    setSelectedType(type);
    // Reset to page 1 when filter changes
    setPage(1);
  };
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Will reset to page 1 when debounced search query changes
  };
  
  const handleSortChange = (field: SortField, order: SortOrder) => {
    setSortBy(field);
    setSortOrder(order);
    // Reset to page 1 when sort changes
    setPage(1);
  };
  
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    // Reset to page 1 when page size changes
    setPage(1);
  };
  
  // Render loading state
  if (loading && !pokemonData) {
    return <div className="loading">Loading Pokémon data...</div>;
  }
  
  // Render error state
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="pokemon-container">
      <header className="app-header">
        <h1>Pokédex</h1>
        <ThemeToggle />
      </header>
      
      <div className="controls">
        <div className="filter-controls">
          <SearchFilter 
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            isSearching={isSearching}
          />
          
          <TypeFilter 
            selectedType={selectedType}
            types={pokemonTypes}
            onTypeChange={handleTypeChange}
          />
        </div>
        
        <SortingSelector 
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
        
        <PageSizeSelector 
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
      
      {pokemonData && (
        <>
          {pageLoading ? (
            <div className="page-loading-overlay">
              <div className="loading-spinner"></div>
              <p>Loading page {page}...</p>
            </div>
          ) : (
            <div className="pokemon-list">
              {pokemonData.pokemon.length > 0 ? (
                pokemonData.pokemon.map((pokemon) => (
                  <PokemonCard 
                    key={`${pokemon.number}-${pokemon.name}`}
                    pokemon={pokemon}
                    onToggleCapture={handleToggleCapture}
                  />
                ))
              ) : (
                <div className="no-results">
                  <p>No Pokémon found matching your search criteria.</p>
                  <button onClick={() => {
                    setSearchQuery('');
                    setSelectedType(undefined);
                  }}>Clear all filters</button>
                </div>
              )}
            </div>
          )}
          
          <Pagination 
            currentPage={page}
            totalPages={pokemonData.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
  
  // Handler for toggling captured status
  async function handleToggleCapture(name: string, captured: boolean) {
    try {
      if (captured) {
        await PokemonAPI.capturePokemon(name);
      } else {
        await PokemonAPI.releasePokemon(name);
      }
      
      // Update local state
      if (pokemonData) {
        setPokemonData({
          ...pokemonData,
          pokemon: pokemonData.pokemon.map(p => 
            p.name === name ? { ...p, captured } : p
          )
        });
      }
    } catch (error) {
      console.error('Error toggling capture status:', error);
    }
  }
};

export default PokemonList;