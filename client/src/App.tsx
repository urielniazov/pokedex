import React from 'react';
import { ThemeProvider } from './ThemeContext';
import PokemonList from './components/PokemonList';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <div className="app">
          <Routes>
            <Route path="/pokedex" element={<PokemonList />} />
            <Route path="/" element={<Navigate to="/pokedex" replace />} />
          </Routes>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default App;