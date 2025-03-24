import React, { useMemo } from 'react';
import { SortField, SortOrder } from '../types';

interface SortingSelectorProps {
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

export const SortingSelector: React.FC<SortingSelectorProps> = ({ 
  sortBy, 
  sortOrder, 
  onSortChange 
}) => {
  // Memoize sort fields to prevent recreating this array on every render
  const sortFields = useMemo(() => [
    { value: 'number' as SortField, label: 'Pokedex Number' },
    { value: 'name' as SortField, label: 'Name' },
    { value: 'total' as SortField, label: 'Total Stats' },
    { value: 'hit_points' as SortField, label: 'HP' },
    { value: 'attack' as SortField, label: 'Attack' },
    { value: 'defense' as SortField, label: 'Defense' },
    { value: 'special_attack' as SortField, label: 'Special Attack' },
    { value: 'special_defense' as SortField, label: 'Special Defense' },
    { value: 'speed' as SortField, label: 'Speed' },
    { value: 'generation' as SortField, label: 'Generation' },
  ], []);
  
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