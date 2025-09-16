import axios from "axios";

export default class PokeApi {
    constructor() {}

    static async fetchURL(url) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    static async getPokeList(offset = 0) {
        return await this.fetchURL(`https://pokeapi.co/api/v2/pokemon?limit=50${offset ? `&offset=${offset}` : ''}`);
    }
    
    static async getIndividualPokemon(url) {
        return await this.fetchURL(url);
    }

    static async getPokemonByName(name) {
        return await this.fetchURL(`https://pokeapi.co/api/v2/pokemon/${name}`);
    }

    static async getCacheList() {
        return await this.fetchURL('http://localhost:3000/api/myPokemons');
    }

    static async storeToCache(data) {
        return await fetch('http://localhost:3000/api/myPokemons', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .catch(error => console.log(error));
    }
}