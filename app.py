from flask import Flask
from flask_cors import CORS
from controllers.pokemon_controller import pokemon_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(pokemon_bp)

@app.route('/')
def hello():
    return "Pokédex API is running!"

if __name__ == '__main__':
    app.run(port=8080)
