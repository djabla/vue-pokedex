import axios from "axios";

export default class PokeApi {
    redisClient;

    constructor() {}
    
    /**
     * Fetches data from the given URL and returns the response data.
     * If the request fails, logs the error to the console.
     * @param {string} url - The URL to fetch data from.
     * @returns {Promise<object>} - The response data.
     */
    static async fetchURL(url) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Fetches a list of Pokemon from the PokeAPI with the given offset.
     * The offset is used to paginate the results. If no offset is provided, the first 50 Pokemon are returned.
     * @param {number} [offset=0] - The offset to use when fetching the Pokemon list.
     * @returns {Promise<object>} - The response data from the PokeAPI.
     */
    static async getPokeList(offset = 0) {
        return await this.fetchURL(`https://pokeapi.co/api/v2/pokemon?limit=50${offset ? `&offset=${offset}` : ''}`);
    }
    
    /**
     * Fetches individual Pokemon data from the provided URL.
     * The URL should point to a specific Pokemon resource in the PokeAPI.
     * If the request fails, logs the error to the console.
     * @param {string} url - The URL to fetch the individual Pokemon data from.
     * @returns {Promise<object>} - The individual Pokemon data from the PokeAPI.
     */
    static async getIndividualPokemon(url) {
        return await this.fetchURL(url);
    }

    /**
     * Fetches a Pokemon's data from the PokeAPI by name.
     * @param {string} name - The name of the Pokemon to fetch.
     * @returns {Promise<object>} - The response data from the PokeAPI.
     */
    static async getPokemonByName(name) {
        return await this.fetchURL(`https://pokeapi.co/api/v2/pokemon/${name}`);
    }

    /**
     * Fetches the list of Pokemon stored in the local cache.
     * @returns {Promise<object[]>} - The list of Pokemon stored in the local cache.
     */
    static async getCacheList() {
        return await this.fetchURL('http://localhost:3000/api/myPokemons');
    }

    /**
     * Stores the given Pokemon data to the local cache.
     * @param {object} data - The Pokemon data to store in the local cache.
     * @returns {Promise<object>} - The response data from the server.
     */
    static async storeToCache(data) {
        try {
            const res = await axios.post('http://localhost:3000/api/myPokemons', data);
            if (res.status === 201) {
                return res.data;
            } else {
                throw new Error(`Failed to store: ${res.status}`);
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    /**
     * Removes a Pokemon from the local cache by ID.
     * @param {string} id - The ID of the Pokemon to remove from the cache.
     * @returns {Promise<object>} - The response data from the server.
     */
    static async removePokemonFromCache(id) {
        try {
            const res = await axios.delete(`http://localhost:3000/api/myPokemons/${id}`);
            if (res.status === 200) {
                return res.data;
            } else {
                throw new Error(`Failed to delete: ${res.status}`);
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}