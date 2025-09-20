import axios from "axios";

const NODE_API_URL = 'http://localhost:3000/api';
const POKE_API_URL = 'https://pokeapi.co/api/v2/pokemon';

export default class PokeApi {

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
     * Creates a new user with the given username and password.
     * If the username already exists, throws an error.
     * @param {string} username - The username to create.
     * @param {string} password - The password to create.
     * @returns {Promise<object>} - The response data.
     * @throws {Error} - If the username already exists.
     */
    static async signup(username, password) {
        const isTaken = await this.checkUsernameExists(username);
        if (isTaken.data) {
            throw new Error("Username already taken");
        }
        return axios.post(`${NODE_API_URL}/signup`, { username, password });
    }

    /**
     * Logs in a user with the given username and password.
     * If the request is successful, stores the JWT in local storage.
     * @param {string} username - The username to log in with.
     * @param {string} password - The password to log in with.
     * @returns {Promise<object>} - The response data from the Node API.
     */
    static async login(username, password) {
        const res = await axios.post(`${NODE_API_URL}/login`, { username, password });
        localStorage.setItem("token", res.data.token); // store JWT
        return res.data;
    }
    
    /**
     * Checks if a username already exists in the database.
     * @param {string} username - The username to check.
     * @returns {Promise<object>} - The response data from the Node API.
     * @property {boolean} data - True if the username exists, false otherwise.
     */
    static async checkUsernameExists(username) {
        return axios.get(`${NODE_API_URL}/check-username`, { params: { username } });
    }

    /**
     * Fetches a list of Pokemon from the PokeAPI with the given offset.
     * The offset is used to paginate the results. If no offset is provided, the first 50 Pokemon are returned.
     * @param {number} [offset=0] - The offset to use when fetching the Pokemon list.
     * @returns {Promise<object>} - The response data from the PokeAPI.
     */
    static async getPokeList(offset = 0) {
        return await this.fetchURL(`${POKE_API_URL}?limit=50${offset ? `&offset=${offset}` : ''}`);
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
        return await this.fetchURL(`${POKE_API_URL}/${name}`);
    }

    /**
     * Fetches the list of Pokemon stored in the local cache.
     * @returns {Promise<object[]>} - The list of Pokemon stored in the local cache.
     */
    static async getCacheList() {
        const token = localStorage.getItem("token");
        return axios.get(`${NODE_API_URL}/myPokemons`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    /**
     * Stores the given Pokemon data to the local cache.
     * @param {object} data - The Pokemon data to store in the local cache.
     * @returns {Promise<object>} - The response data from the server.
     */
    static async storeToCache(data) {
        const token = localStorage.getItem("token");
        return axios.post(
            `${NODE_API_URL}/myPokemons`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
        );
    }

    /**
     * Removes a Pokemon from the local cache by ID.
     * @param {string} id - The ID of the Pokemon to remove from the cache.
     * @returns {Promise<object>} - The response data from the server.
     */
    static async removePokemonFromCache(id) {
        const token = localStorage.getItem("token");
        return axios.delete(`${NODE_API_URL}/myPokemons/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }
}