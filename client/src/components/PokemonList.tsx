import React, { useEffect, useState, useMemo } from 'react';
import { PokemonResponse, SortField, SortOrder, FilterOptions } from '../types';
import { PokemonAPI } from '../api';
import Pagination, { PageSizeSelector } from './Pagination';
import { useTheme } from '../ThemeContext';
import { SortingSelector } from './SortingSelector';
import { TypeFilter } from './TypeFilter';
import { SearchFilter } from './SearchFilter';
import { PokemonGrid } from './PokemonGrid';
import { useURLParams } from '../hooks/useURLParams';

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
    // Custom hook for handling URL parameters
    const {
        page, setPage,
        pageSize, setPageSize,
        sortBy, setSortBy,
        sortOrder, setSortOrder,
        selectedType, setSelectedType,
        searchQuery, setSearchQuery
    } = useURLParams();

    // State for Pokemon data
    const [pokemonData, setPokemonData] = useState<PokemonResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [pageLoading, setPageLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // State for filtering
    const [pokemonTypes, setPokemonTypes] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // Debounced search query
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(searchQuery);

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

    // Memoize filter options to prevent unnecessary rebuilds
    const filterOptions = useMemo<FilterOptions>(() => ({
        type: selectedType,
        searchQuery: debouncedSearchQuery
    }), [selectedType, debouncedSearchQuery]);

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
    }, [page, pageSize, sortBy, sortOrder, filterOptions]);

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
        // Always reset to page 1 when searching
        setPage(1);
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

    // Handler for toggling captured status
    const handleToggleCapture = async (name: string, captured: boolean) => {
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
    };

    // Render loading state
    if (loading && !pokemonData) {
        return <div className="loading">Loading Pokémon data...</div>;
    }

    // Render error state
    if (error) {
        return <div className="error">{error}</div>;
    }

    // Handler for clearing filters
    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedType(undefined);
    };

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
                            <p>Loading...</p>
                        </div>
                    ) : (
                        <div>
                            <PokemonGrid
                                pokemon={pokemonData.pokemon}
                                onToggleCapture={handleToggleCapture}
                                onClearFilters={handleClearFilters}
                            />
                            <Pagination
                                currentPage={page}
                                totalPages={pokemonData.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}


                </>
            )}
        </div>
    );
};

export default PokemonList;