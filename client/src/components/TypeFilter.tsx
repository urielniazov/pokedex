import React from 'react';

interface TypeFilterProps {
  selectedType: string | undefined;
  types: string[];
  onTypeChange: (type: string | undefined) => void;
}

export const TypeFilter: React.FC<TypeFilterProps> = ({ 
  selectedType, 
  types, 
  onTypeChange 
}) => {
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