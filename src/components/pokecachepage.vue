<template>
    <div class="navbar bg-base-200 shadow-sm sticky top-0 z-100">
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
            <button class="btn" onclick="my_modal_1.showModal()" v-on:click="getCache()">open modal</button>
            <dialog id="my_modal_1" class="modal">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">My List</h3>
                    <div class="overflow-x-auto" style="max-height: 70vh;">
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
                                        <button class="btn btn-warning btn-xs">Remove</button>
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
            <button v-on:click="getCache()" class="btn btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                    stroke="currentColor" class="size-[1.2em]">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
import PokeApi from '@/data/pokeApi';
import { capitalizeFirstLetter } from '@/utils/stringFormatters';

const MODAL_ANIMATION_DURATION = 300;

export default {
    name: "pokecache",
    data: function () {
        return {
            pokeList: []
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
            let pokeData = [];
            PokeApi.getCacheList().then(data => {
                data.forEach(pokemon => {
                    PokeApi.getPokemonByName(pokemon.name.toLowerCase()).then(data => {
                        let temp = {};
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
        }

    },
    mounted: function () {
        this.getCache();
    }
}
</script>

<style scoped></style>