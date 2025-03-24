import React from 'react';
import { ThemeProvider } from './ThemeContext';
import PokemonList from './components/PokemonList';
import './App.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="app">
        <PokemonList />
      </div>
    </ThemeProvider>
  );
};

export default App;