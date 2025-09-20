<template>
    <div v-on:logged-in="getCache()" v-on:signed-out="cache = []; pokeData.forEach(p => p.isCaught = false);">
        <div v-if="pokeData" class="pokemon-list">
            <div v-for="pokemon in pokeData" :key="pokemon.name" class="card w-96" style="background: #e0e0e0; box-shadow: 15px 15px 30px #bebebe,
             -15px -15px 30px #ffffff; border-radius: 30px;">
                <figure class="mt-6">
                    <img style="height: 10em;" v-bind:src="pokemon.img" alt="Shoes" />
                </figure>
                <div class="card-body">
                    <h2 class="card-title">
                        {{ pokemon.name }}
                    </h2>
                    <div class="card-actions justify-end">
                        <div v-bind:class="`type-${type.toLowerCase()}`" class="badge badge-outline"
                            v-for="type in pokemon.types" :key="type">{{ type }}</div>
                    </div>
                    <div class="place-self-center" style="max-width: max-content;" v-if="isLoggedIn()">
                        <button v-if="!pokemon.isCaught" class="btn btn-primary btn-sm mt-2 place-self-center" style="max-width: max-content; min-width: 65.28px;" v-on:click="addToCache(pokemon)">
                            Catch
                        </button>
                        <button v-else class="btn btn-secondary btn-sm mt-2 place-self-center" style="max-width: max-content;">
                            Caught
                        </button>
                    </div>
                    <button class="btn btn-info btn-sm mt-2 place-self-center" style="max-width: max-content;" onclick="my_modal_2.showModal()" v-on:click="selectedPokemon = pokemon; console.log(selectedPokemon);">
                        Details
                    </button>
                </div>
            </div>
            <dialog id="my_modal_2" class="modal">
                <div class="modal-box">
                    <h3 class="font-bold text-lg mb-4">My List</h3>
                    <div class="overflow-x-auto" style="height: 65vh;">
                        <pokemonDetails v-if="selectedPokemon" :name="selectedPokemon.name.toLowerCase()"></pokemonDetails>
                    </div>
                    <div class="modal-action">
                        <form method="dialog">
                            <button class="btn" v-on:click="selectedPokemon = null">Close</button>
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
import poke_details from './poke-details.vue';

export default {
    name: "poke_list",
    components: {
        pokemonDetails: poke_details
    },
    data: function () {
        return {
            count: 0,
            pokeData: [],
            pokeMetaData: [],
            offset: 0,
            lastLoad: null,
            cache: [],
            selectedPokemon: null
        }
    },
    methods: {
        addCount: function () {
            this.count++;
        },
        /**
         * Get the basic information of a pokemon such as name, img and types.
         * This function takes a list of pokemon and fetches the individual data of each pokemon.
         * It then formats the data into a structure that can be easily used by the frontend.
         * @param {Array} res - A list of pokemon objects.
         */
        getPokemonBasicData(res) {
            const self = this;
            res?.forEach(pokemon => {
                PokeApi.getIndividualPokemon(pokemon.url).then(data => {
                    self.pokeMetaData.push(data);
                    let temp = {};
                    temp.name = capitalizeFirstLetter(data.name);
                    temp.img = data.sprites.other['official-artwork'].front_default;
                    temp.types = data.types.map(type => capitalizeFirstLetter(type.type.name));
                    temp.isCaught = self.isInCache(temp.name);
                    self.pokeData.push(temp);
                });
            });
        },
        /**
         * Loads more pokemon data when the user scrolls to the bottom of the page.
         * This function increments the offset by 50 and then fetches the next 50 pokemon from the PokeAPI.
         * It then formats the data into a structure that can be easily used by the frontend.
         */
        loadMorePokemonOnScroll() {
            const self = this;
            self.offset += 50;
            PokeApi.getPokeList(self.offset).then(data => {
                self.getPokemonBasicData(data.results);
            })
        },
        /**
         * Adds a pokemon to the cache.
         * This function takes a pokemon object and formats its data into a structure that can be easily used by the PokeAPI.
         * It then stores the data in the cache.
         * @param {Object} pokemon - A pokemon object.
         */
        addToCache(pokemon) {
            const self = this;
            let temp = {};
            temp.name = pokemon.name;
            temp.img = pokemon.img;
            temp.pokeId = pokemon.name;
            
            if (this.isInCache(pokemon.name)) {
                return;
            }
            
            PokeApi.storeToCache(temp).then(data => {
                pokemon.isCaught = true;
                self.getCache();
            })
        },
        isInCache(pokemonName) {
            return this.cache.findIndex(p => p.name === pokemonName) !== -1;
        },
        /**
         * Retrieves the list of pokemon that are currently in the cache.
         * This function uses the PokeAPI to fetch the list of pokemon in the cache.
         * It then logs the list to the console.
         */
        getCache() {
            this.cache = [];
            const self = this;
            PokeApi.getCacheList().then(res => {
                res.data.forEach(pokemon => {
                    self.cache.push(pokemon);
                })
            })
        },
        /**
         * Updates the cache with the latest data from the PokeAPI.
         * This function fetches the list of pokemon in the cache and then updates the cache.
         * It then updates the isCaught property of the pokemon data with the latest data from the cache.
         */
        updateCache() {
            this.cache = [];
            const self = this;
            PokeApi.getCacheList().then(data => {
                data.forEach(pokemon => {
                    self.cache.push(pokemon);
                    self.getPokeData().map(p => {
                        if (p.name === capitalizeFirstLetter(pokemon.name)) {
                            p.isCaught = true;
                        }
                    });
                })
            })
        },
        isLoggedIn() {
            return !!localStorage.getItem("token");
        }
    },
    mounted() {
        const self = this;

        PokeApi.getPokeList().then(data => {
            self.getPokemonBasicData(data.results);
        });

        window.onscroll = function (event) {
            if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight - 100) {
                if (event.timeStamp - self.lastLoad < 400) {
                    return
                }
                self.lastLoad = event.timeStamp;
                console.log("bottom of page");
                self.loadMorePokemonOnScroll();
            }
        };
    },
    beforeMount() {
        if (this.isLoggedIn()) {
            this.getCache();
        }
    },
    
}
</script>

<style>

.pokemon-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 2em;
}

.pokemon-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    padding: 10px;
    margin: 10px;
    border-radius: 10px;
    width: 20%;
    max-width: 315px;
}

.pokemon-card img {
    width: 100px;
    height: 100px;
}

.pokemon-types {
    display: flex;
    flex-direction: row;
}

.pokemon-types p {
    margin: 5px;
    padding: 0.2em;
    border: 1px solid black;
    border-radius: 5px;
}

.type-fire {
    background-color: #EE8130;
}

.type-water {
    background-color: #6390F0;
}

.type-electric {
    background-color: #F7D02C;
}

.type-grass {
    background-color: #7AC74C;
}

.type-ice {
    background-color: #96D9D6;
}

.type-fighting {
    background-color: #C22E28;
}

.type-poison {
    background-color: #A33EA1;
}

.type-ground {
    background-color: #E2BF65;
}

.type-flying {
    background-color: #A98FF3;
}

.type-psychic {
    background-color: #F95587;
}

.type-bug {
    background-color: #A6B91A;
}

.type-rock {
    background-color: #B6A136;
}

.type-ghost {
    background-color: #735797;
}

.type-dragon {
    background-color: #6F35FC;
}

.type-dark {
    background-color: #705746;
}

.type-steel {
    background-color: #B7B7CE;
}

.type-fairy {
    background-color: #D685AD;
}

.type-normal {
    background-color: #A8A77A;
}
</style>