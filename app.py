from flask import Flask
from flask_cors import CORS
from controllers.pokemon_controller import pokemon_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(pokemon_bp)

@app.route('/api/icon')
def get_icon_url():
    name = request.args.get('name', default=None, type=str)
    generation = request.args.get('generation', default=1, type=int)
    if generation < 5:
        return f"https://img.pokemondb.net/sprites/silver/normal/{name}.png"
    return f"https://img.pokemondb.net/sprites/x-y/normal/{name}.png"

@app.route('/')
def hello():
    return "Pokédex API is running!"

if __name__ == '__main__':
    app.run(port=8080)
