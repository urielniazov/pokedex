from repositories.pokemon_repository import get_all_pokemon

captured_pokemon = set()

def get_pokemon(page, page_size, sort_by, sort_order, filter_type, search_query):
    all_data = get_all_pokemon()
    
    # Apply filtering if type is specified
    if filter_type:
        filtered_data = [p for p in all_data if p['type_one'] == filter_type or p['type_two'] == filter_type]
    else:
        filtered_data = all_data
    
    if search_query and search_query.strip():
        search_query = search_query.lower().strip()
        search_filtered = [
            p for p in filtered_data
            if search_query in p['name'].lower()
            or search_query in str(p['number'])
            or (p['type_one'] and search_query in p['type_one'].lower())
            or (p['type_two'] and search_query in p['type_two'].lower())
        ]
        filtered_data = search_filtered
    
    reverse_order = sort_order.lower() == 'desc'
    sorted_data = sorted(filtered_data, key=lambda x: x[sort_by], reverse=reverse_order)
    
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paginated_data = sorted_data[start_idx:end_idx]
    
    for pokemon in paginated_data:
        pokemon['captured'] = pokemon['name'] in captured_pokemon
    
    return {
        'pokemon': paginated_data,
        'total': len(filtered_data),
        'page': page,
        'pageSize': page_size,
        'totalPages': (len(filtered_data) + page_size - 1) // page_size
    }

def get_pokemon_types():
    all_data = get_all_pokemon()
    types = {p['type_one'] for p in all_data} | {p['type_two'] for p in all_data if p['type_two']}
    return list(types)

def capture_pokemon(name):
    captured_pokemon.add(name)
    return {'status': 'success', 'captured': True}

def release_pokemon(name):
    captured_pokemon.discard(name)
    return {'status': 'success', 'captured': False}

def get_captured_pokemon():
    return list(captured_pokemon)
