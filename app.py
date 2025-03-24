from flask import Flask, jsonify, request
import db
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory storage for captured Pokémon
captured_pokemon = set()

@app.route('/api/icon/<name>')
def get_icon_url(name: str):
    return f"https://img.pokemondb.net/sprites/silver/normal/{name}.png"

@app.route('/api/pokemon')
def get_pokemon():
    # Get query parameters
    page = request.args.get('page', default=1, type=int)
    page_size = request.args.get('pageSize', default=10, type=int)
    sort_by = request.args.get('sortBy', default='number', type=str)
    sort_order = request.args.get('sortOrder', default='asc', type=str)
    filter_type = request.args.get('type', default=None, type=str)
    search_query = request.args.get('search', default=None, type=str)
    
    # Get all Pokémon data
    all_data = db.get()
    
    # Apply filtering if type is specified
    if filter_type:
        filtered_data = [p for p in all_data if p['type_one'] == filter_type or p['type_two'] == filter_type]
    else:
        filtered_data = all_data
    
    if search_query and search_query.strip():
        search_query = search_query.lower().strip()
        search_filtered = []
        for pokemon in filtered_data:
            # Search in multiple fields
            if (search_query in pokemon['name'].lower() or
                search_query in str(pokemon['number']) or
                (pokemon['type_one'] and search_query in pokemon['type_one'].lower()) or
                (pokemon['type_two'] and search_query in pokemon['type_two'].lower())):
                search_filtered.append(pokemon)
        filtered_data = search_filtered

    # Apply sorting
    reverse_order = sort_order.lower() == 'desc'
    sorted_data = sorted(filtered_data, key=lambda x: x[sort_by], reverse=reverse_order)
    
    # Apply pagination
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paginated_data = sorted_data[start_idx:end_idx]
    
    # Add captured status to each Pokémon
    for pokemon in paginated_data:
        pokemon['captured'] = pokemon['name'] in captured_pokemon
    
    # Return data with pagination metadata
    response = {
        'pokemon': paginated_data,
        'total': len(filtered_data),
        'page': page,
        'pageSize': page_size,
        'totalPages': (len(filtered_data) + page_size - 1) // page_size
    }
    
    return jsonify(response)

@app.route('/api/pokemon/types')
def get_pokemon_types():
    all_data = db.get()
    
    # Extract unique types
    types = set()
    for pokemon in all_data:
        types.add(pokemon['type_one'])
        if pokemon['type_two']:
            types.add(pokemon['type_two'])
    
    return jsonify(list(types))

@app.route('/api/pokemon/capture/<name>', methods=['POST'])
def capture_pokemon(name):
    captured_pokemon.add(name)
    return jsonify({'status': 'success', 'captured': True})

@app.route('/api/pokemon/release/<name>', methods=['POST'])
def release_pokemon(name):
    if name in captured_pokemon:
        captured_pokemon.remove(name)
    return jsonify({'status': 'success', 'captured': False})

@app.route('/api/pokemon/captured')
def get_captured_pokemon():
    return jsonify(list(captured_pokemon))

@app.route('/')
def hello():
    return "Pokédex API is running!"

if __name__ == '__main__':
    app.run(port=8080)