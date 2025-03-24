import React, { useState, useEffect } from 'react';
import { Pokemon } from '../types';
import { PokemonAPI } from '../api';
import { useTheme } from '../ThemeContext';

interface PokemonCardProps {
  pokemon: Pokemon;
  onToggleCapture: (name: string, captured: boolean) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onToggleCapture }) => {
  const { theme } = useTheme();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  
  // Fetch the image URL when component mounts or pokemon changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchImageUrl = async () => {
      setIsImageLoading(true);
      try {
        const url = await PokemonAPI.getPokemonIconUrl(pokemon.name);
        if (isMounted) {
          setImageUrl(url);
        }
      } catch (error) {
        console.error(`Failed to load image for ${pokemon.name}:`, error);
        if (isMounted) {
          // Set to fallback on error
          setImageUrl('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png');
        }
      } finally {
        if (isMounted) {
          setIsImageLoading(false);
        }
      }
    };
    
    fetchImageUrl();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [pokemon.name]);
  
  return (
    <div className={`pokemon-card ${theme}-theme`}>
      <div className="pokemon-header">
        <span className="pokemon-number">#{pokemon.number}</span>
        <h3 className="pokemon-name" title={pokemon.name}>{pokemon.name}</h3>
        <button 
          className={`capture-button ${pokemon.captured ? 'captured' : ''}`}
          onClick={() => onToggleCapture(pokemon.name, !pokemon.captured)}
        >
          {pokemon.captured ? 'Release' : 'Capture'}
        </button>
      </div>
      
      <div className="pokemon-image">
        {isImageLoading ? (
          <div className="image-loading-spinner"></div>
        ) : (
          <img 
            src={imageUrl} 
            alt={pokemon.name} 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
            }}
          />
        )}
      </div>
      
      <div className="pokemon-types">
        <span className={`type ${pokemon.type_one.toLowerCase()}`}>
          {pokemon.type_one}
        </span>
        {pokemon.type_two && (
          <span className={`type ${pokemon.type_two.toLowerCase()}`}>
            {pokemon.type_two}
          </span>
        )}
      </div>
      
      <div className="pokemon-stats">
        <div className="stat">
          <span className="stat-label">HP:</span>
          <span className="stat-value">{pokemon.hit_points}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Attack:</span>
          <span className="stat-value">{pokemon.attack}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Defense:</span>
          <span className="stat-value">{pokemon.defense}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Sp. Atk:</span>
          <span className="stat-value">{pokemon.special_attack}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Sp. Def:</span>
          <span className="stat-value">{pokemon.special_defense}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Speed:</span>
          <span className="stat-value">{pokemon.speed}</span>
        </div>
      </div>
      
      {pokemon.legendary && (
        <div className="legendary-badge">Legendary</div>
      )}
    </div>
  );
};

export default PokemonCard;