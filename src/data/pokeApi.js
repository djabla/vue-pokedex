import axios from "axios";
import { createClient } from "redis";

export default class PokeApi {
    redisClient;

    constructor() {
        // this.init();
    }

    async init() {
        this.redisClient = createClient();
        this.redisClient.on('error', err => console.log('Redis Client Error', err));
        await this.redisClient.connect();
    }

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