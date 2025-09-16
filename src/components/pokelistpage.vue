<template>
    <div>
        <h1>Hello</h1>
        <button class="btn btn-primary" v-on:click="getCache();">
            Get Cache
        </button>

        <div v-if="pokeData" class="pokemon-list">
            <div v-for="pokemon in pokeData" :key="pokemon.name" class="card card-border bg-base-40 w-96 shadow-lg">
                <figure style="background-color: beige;">
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
                    <button class="btn btn-primary btn-sm mt-2 place-self-center" style="max-width: max-content;" v-on:click="addToCache(pokemon)">
                        Add To Cache
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PokeApi from '@/data/pokeApi';
import { capitalizeFirstLetter } from '@/utils/stringFormatters';

export default {
    name: "pokelist",
    data: function () {
        return {
            count: 0,
            pokeData: [],
            pokeMetaData: [],
            offset: 0,
            lastLoad: null,
            cache: [],
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
                    temp.img = data.sprites.front_default;
                    temp.types = data.types.map(type => capitalizeFirstLetter(type.type.name));
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
            let temp = {};
            temp.name = pokemon.name;
            temp.img = pokemon.img;
            temp.pokeId = pokemon.name;
            temp._id = this.cache.length + 1;

            PokeApi.storeToCache(temp)
        },
        /**
         * Retrieves the list of pokemon that are currently in the cache.
         * This function uses the PokeAPI to fetch the list of pokemon in the cache.
         * It then logs the list to the console.
         */
        getCache() {
            PokeApi.getCacheList().then(data => {
                console.log(data);
            })
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
}
</script>

<style>
@import "tailwindcss";

@plugin "daisyui" {
    themes: light --default;
}

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