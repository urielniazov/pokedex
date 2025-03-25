from flask import Blueprint, jsonify, request
from services.pokemon_service import (
    get_pokemon, get_pokemon_types, capture_pokemon, release_pokemon, get_captured_pokemon
)

pokemon_bp = Blueprint('pokemon', __name__)

@pokemon_bp.route('/api/pokemon')
def fetch_pokemon():
    page = request.args.get('page', default=1, type=int)
    page_size = request.args.get('pageSize', default=10, type=int)
    sort_by = request.args.get('sortBy', default='number', type=str)
    sort_order = request.args.get('sortOrder', default='asc', type=str)
    filter_type = request.args.get('type', default=None, type=str)
    search_query = request.args.get('search', default=None, type=str)
    
    return jsonify(get_pokemon(page, page_size, sort_by, sort_order, filter_type, search_query))

@pokemon_bp.route('/api/pokemon/types')
def fetch_pokemon_types():
    return jsonify(get_pokemon_types())

@pokemon_bp.route('/api/pokemon/capture/<name>', methods=['POST'])
def capture(name):
    return jsonify(capture_pokemon(name))

@pokemon_bp.route('/api/pokemon/release/<name>', methods=['POST'])
def release(name):
    return jsonify(release_pokemon(name))

@pokemon_bp.route('/api/pokemon/captured')
def fetch_captured():
    return jsonify(get_captured_pokemon())

@pokemon_bp.route('/api/icon')
def get_icon():
    name = request.args.get('name', default=None, type=str)
    generation = request.args.get('generation', default=1, type=int)
    if generation < 5:
        return f"https://img.pokemondb.net/sprites/silver/normal/{name}.png"
    return f"https://img.pokemondb.net/sprites/x-y/normal/{name}.png"
