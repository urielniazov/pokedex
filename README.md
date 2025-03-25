# Pokédex Application

A comprehensive Pokédex web application that allows Pokémon trainers to browse, search, filter, and track their captured Pokémon.

## Features

- **Pokémon Visualization**: View a list of Pokémon with detailed information and sprites
- **Pagination**: Navigate through pages of Pokémon with customizable page sizes
- **Sorting**: Sort Pokémon by various attributes (number, name, stats, etc.)
- **Filtering**: Filter Pokémon by type
- **Search**: Search for Pokémon by name, number, or type
- **Capture Tracking**: Mark Pokémon as captured/released
- **Theming**: Toggle between light and dark mode

## Tech Stack

- **Frontend**: React with TypeScript
- **State Management**: React Hooks and Context API
- **Routing**: React Router v6
- **Styling**: Custom CSS with theme support
- **Backend**: Flask with Python
- **Data Storage**: In-memory with persistence

## Project Structure

```
.
├── README.md
├── app.py                        # Main Flask application
├── db.py                         # Database module
├── pokemon_db.json               # Pokemon data
├── requirements.txt              # Python dependencies
├── controllers
│   ├── __init__.py
│   └── pokemon_controller.py     # Pokemon endpoints
├── services
│   ├── __init__.py
│   └── pokemon_service.py        # Business logic
├── repositories
│   ├── __init__.py
│   └── pokemon_repository.py     # Data access layer
├── client                        # Frontend React application
│   ├── package.json
│   ├── tsconfig.json
│   ├── public                    # Static assets
│   │   ├── index.html
│   │   └── ...
│   └── src
│       ├── App.tsx               # Main app component
│       ├── App.css
│       ├── ThemeContext.tsx      # Theme management
│       ├── api.tsx               # API service
│       ├── types.tsx             # TypeScript types
│       ├── index.tsx             # Entry point
│       ├── components
│       │   ├── OptimizedImage.tsx    # Image loading optimization
│       │   ├── OptimizedImage.css
│       │   ├── Pagination.tsx        # Pagination controls
│       │   ├── PokemonCard.tsx       # Individual Pokémon card
│       │   ├── PokemonGrid.tsx       # Grid layout for Pokémon
│       │   ├── PokemonList.tsx       # Main list component
│       │   ├── SearchFilter.tsx      # Search input
│       │   ├── SortingSelector.tsx   # Sorting controls
│       │   └── TypeFilter.tsx        # Type filtering
│       └── hooks
│           └── useURLParams.ts       # URL parameter management
```

## Performance Optimizations

The application includes several performance optimizations:

- **Image Loading**: Optimized image loading with placeholders and error handling
- **Pagination**: Server-side pagination to minimize data transfer
- **Memoization**: React.memo and useMemo to prevent unnecessary re-renders
- **URL State**: State persistence through URL parameters for shareable links
- **Debounced Search**: Reduces API calls during typing
- **Conditional Rendering**: Only renders necessary components

## Setup and Installation

### Backend Setup

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Install Node.js dependencies:
   ```bash
   cd client
   npm install
   ```

2. Run the development server:
   ```bash
   npm start
   ```

## Usage

- Visit `http://localhost:3000/pokedex` to view the application
- Use the search bar to find specific Pokémon
- Filter by type using the dropdown menu
- Sort Pokémon by various attributes
- Change page size as needed
- Click the "Capture" button to mark Pokémon as captured

## API Endpoints

- `GET /api/pokemon` - Get Pokémon with pagination, sorting, and filtering
- `GET /api/pokemon/types` - Get all unique Pokémon types
- `POST /api/pokemon/capture/:name` - Mark a Pokémon as captured
- `POST /api/pokemon/release/:name` - Mark a Pokémon as released
- `GET /api/pokemon/captured` - Get all captured Pokémon
- `GET /icon` - Get the URL for a Pokémon sprite (requires query parameters: `name` and `generation`)

## Browser Support

The application is optimized for modern browsers (Chrome, Firefox, Safari, Edge).
