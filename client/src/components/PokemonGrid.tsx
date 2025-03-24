import React from 'react';
import { Pokemon } from '../types';
import PokemonCard from './PokemonCard';

interface PokemonGridProps {
  pokemon: Pokemon[];
  onToggleCapture: (name: string, captured: boolean) => void;
  onClearFilters: () => void;
}

export const PokemonGrid: React.FC<PokemonGridProps> = ({ 
  pokemon, 
  onToggleCapture,
  onClearFilters
}) => {
  if (pokemon.length === 0) {
    return (
      <div className="no-results">
        <p>No Pokémon found matching your search criteria.</p>
        <button onClick={onClearFilters}>Clear all filters</button>
      </div>
    );
  }

  return (
    <div className="pokemon-list">
      {pokemon.map((pokemon) => (
        <PokemonCard 
          key={`${pokemon.number}-${pokemon.name}`}
          pokemon={pokemon}
          onToggleCapture={onToggleCapture}
        />
      ))}
    </div>
  );
};