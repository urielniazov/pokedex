// Define Pokemon interface
export interface Pokemon {
    number: number;
    name: string;
    type_one: string;
    type_two: string | null;
    total: number;
    hit_points: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
    generation: number;
    legendary: boolean;
    captured?: boolean;
  }
  
  // Define API response interfaces
  export interface PokemonResponse {
    pokemon: Pokemon[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }
  
  // Define sorting options
  export type SortField = 'number' | 'name' | 'total' | 'hit_points' | 'attack' | 'defense' | 
    'special_attack' | 'special_defense' | 'speed' | 'generation';
  export type SortOrder = 'asc' | 'desc';
  
  // Define pagination options
  export interface PaginationOptions {
    page: number;
    pageSize: number;
  }
  
  // Define filter options
  export interface FilterOptions {
    type?: string;
    searchQuery?: string;
  }
  
  // Define sort options
  export interface SortOptions {
    sortBy: SortField;
    sortOrder: SortOrder;
  }
  
  // Theme types
  export type Theme = 'light' | 'dark';