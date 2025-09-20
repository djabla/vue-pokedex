<template>
    <div class="navbar bg-base-300 shadow-lg sticky top-0 z-100 mb-8">
        <div class="flex-1">
            <button class="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    class="inline-block h-5 w-5 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16">
                    </path>
                </svg>
            </button>
        </div>
        <div class="flex gap-2">
            <input type="text" placeholder="Search" class="input input-bordered w-24 md:w-auto" />
            <span v-if="isLogged">Hi {{ getUserName() }}</span>
            <button v-if="isLogged" class="btn" onclick="cache_modal.showModal()" v-on:click="getCache()">My Pokemons</button>
            <button v-else class="btn" onclick="signin_modal.showModal()" v-on:click="signingIn = true">Sign In</button>
            <button v-if="isLogged" class="btn" v-on:click="signOut()">Log Out</button>
            <dialog id="cache_modal" class="modal">
                <div class="modal-box">
                    <h3 class="font-bold text-lg mb-4">My List</h3>
                    <div class="overflow-x-auto" style="height: 65vh;">
                        <table class="table table-xs table-pin-rows">
                            <!-- head -->
                            <thead>
                                <tr>
                                    <th>
                                        <label>
                                            <input type="checkbox" class="checkbox" />
                                        </label>
                                    </th>
                                    <th>Pokemon Name</th>
                                    <th>Type</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- row 1 -->
                                <tr v-for="pokemon in pokeList">
                                    <th>
                                        <label>
                                            <input type="checkbox" class="checkbox" />
                                        </label>
                                    </th>
                                    <td>
                                        <div class="flex items-center gap-3">
                                            <div class="avatar">
                                                <div class="mask mask-squircle h-12 w-12">
                                                    <img v-bind:src="pokemon.img"
                                                        alt="Avatar Tailwind CSS Component" />
                                                </div>
                                            </div>
                                            <div>
                                                <div class="font-bold">{{ pokemon.name }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div v-bind:class="`type-${type.toLowerCase()}`" class="badge badge-outline mr-1 text-xs"
                                            v-for="type in pokemon.types" :key="type">{{ type }}</div>
                                    </td>
                                    <th>
                                        <button class="btn btn-warning btn-xs" v-on:click="removeFromCache(pokemon.id)">Remove</button>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>



                    <div class="modal-action">
                        <form method="dialog">
                            <button class="btn" v-on:click="clearCache()">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>

            <dialog class="modal" id="signin_modal" v-if="signingIn">
                <div class="modal-box">
                    <user_signin v-on:logged-in="isLogged = true; signingIn = false; getCache()" />

                    <div class="modal-action">
                        <form method="dialog">
                            <button class="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    </div>
</template>

<script>
import PokeApi from '@/data/pokeApi';
import { capitalizeFirstLetter } from '@/utils/stringFormatters';
import user_signin from '../users/user-signin.vue';

const MODAL_ANIMATION_DURATION = 300;

export default {
    name: "poke_navbar",
    components: {
        user_signin
    },
    data: function () {
        return {
            pokeList: [],
            isLogged: false,
            signingIn: true
        }
    },
    methods: {
        /**
         * Retrieves the list of pokemon that are currently in the cache.
         * This function uses the PokeAPI to fetch the list of pokemon in the cache.
         * It then logs the list to the console.
         */
        getCache() {
            const self = this;
            PokeApi.getCacheList().then(res => {
                res.data.forEach(pokemon => {
                    const id = pokemon.id;
                    PokeApi.getPokemonByName(pokemon.name.toLowerCase()).then(data => {
                        let temp = {};
                        temp.id = id;
                        temp.name = capitalizeFirstLetter(data.name);
                        temp.img = data.sprites.front_default;
                        temp.types = data.types.map(type => capitalizeFirstLetter(type.type.name));
                        self.pokeList.push(temp);
                    });
                })
            })
        },
        /**
         * Retrieves the individual details of a pokemon from the PokeAPI.
         * @param {string} name - The name of the pokemon to fetch.
         * @returns {Promise<object|null>} - The response data from the PokeAPI, or null if no data is found.
         */
        getIndividualDetail(name) {
            const self = this;
            let pokeData = null;
            PokeApi.getPokemonByName(name.toLowerCase()).then(data => {
                console.log(data);
                pokeData = data;
            })
            return pokeData
        },
        /**
         * Clears the cache by setting the pokeList to an empty array.
         */
        clearCache() {
            setTimeout(() => {
                this.pokeList = [];
            }, MODAL_ANIMATION_DURATION);
        },
        /**
         * Removes a pokemon from the cache by its id.
         * It calls PokeApi.removeFromCache to remove the pokemon from the local cache.
         * @param {number} id - The id of the pokemon to remove from the cache.
         */
        removeFromCache(id) {
            PokeApi.removePokemonFromCache(id)
                .then(() => {
                    this.pokeList = this.pokeList.filter(pokemon => pokemon.id !== id);
                    console.log(`Removed pokemon with id ${id} from cache.`);
                })
                .catch(() => {
                    console.warn(`Could not remove pokemon with id ${id}.`);
                });
        },
        isLoggedIn() {
            return !!localStorage.getItem("token");
        },
        signOut() {
            localStorage.removeItem("token");
            this.isLogged = false;
            this.pokeList = [];
            this.signingIn = true;
            this.$emit("signed-out"); // notify parent to clear pokemons
            window.location.reload();
        },
        getUserName() {
            return localStorage.getItem("username");
        }
    },
    mounted: function () {
        this.isLogged = this.isLoggedIn();
        this.signingIn = !this.isLogged;
    }
}
</script>

<style scoped></style>