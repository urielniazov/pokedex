import { PokemonResponse, SortOptions, PaginationOptions, FilterOptions } from './types';

const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to build URL with query parameters
const buildUrl = (
  endpoint: string, 
  pagination: PaginationOptions, 
  sort: SortOptions, 
  filter: FilterOptions
): string => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  // Add pagination params
  url.searchParams.append('page', pagination.page.toString());
  url.searchParams.append('pageSize', pagination.pageSize.toString());
  
  // Add sorting params
  url.searchParams.append('sortBy', sort.sortBy);
  url.searchParams.append('sortOrder', sort.sortOrder);
  
  // Add filtering params if present
  if (filter.type) {
    url.searchParams.append('type', filter.type);
  }

  if (filter.searchQuery) {
    url.searchParams.append('search', filter.searchQuery);
  }
  
  return url.toString();
};

// API methods
export const PokemonAPI = {
  // Get Pokemon list with pagination, sorting, and filtering
  getPokemon: async (
    pagination: PaginationOptions, 
    sort: SortOptions, 
    filter: FilterOptions
  ): Promise<PokemonResponse> => {
    try {
      const url = buildUrl('/pokemon', pagination, sort, filter);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
      throw error;
    }
  },
  
  // Get all Pokemon types
  getPokemonTypes: async (): Promise<string[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/pokemon/types`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching Pokemon types:', error);
      throw error;
    }
  },
  
  // Mark Pokemon as captured
  capturePokemon: async (name: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/pokemon/capture/${name}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error capturing Pokemon ${name}:`, error);
      throw error;
    }
  },
  
  // Mark Pokemon as released
  releasePokemon: async (name: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/pokemon/release/${name}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error releasing Pokemon ${name}:`, error);
      throw error;
    }
  },
  
  getPokemonIconUrl: async (name: string): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/icon/${name.toLowerCase()}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      // Get the text response which is the URL
      return await response.text();
    } catch (error) {
      console.error(`Error getting icon URL for ${name}:`, error);
      throw error;
    }
  },
};