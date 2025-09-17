<template>
    <div v-if="pokeData" class="card card-compact w-full bg-base-100 shadow-xl">
        <figure><img v-if="pokeData" :src="pokeData.sprites.other['official-artwork'].front_default" :alt="pokeData.name" /></figure>
        <div class="card-body">
            <h2 class="card-title">{{ pokeData.name }}</h2>
            <p>Height: {{ pokeData.height }}</p>
            <p>Weight: {{ pokeData.weight }}</p>
            <p>Abilities:</p>
            <ul>
                <li v-for="ability in pokeData.abilities" :key="ability.ability.name">{{ ability.ability.name }}</li>
            </ul>
        </div>

    </div>
</template>

<script>
import PokeApi from '@/data/pokeApi';

let pokemonName = null;

export default {
    name: "pokemondetailspage",
    data: function () {
        return {
            _name: null,
            pokeData: null
        }
    },
    props: ['name'],
    methods: {
        getPokemonDetail() {
            console.log("fetching details for " + this._name);
            PokeApi.getPokemonByName(this._name).then(data => {
                this.pokeData = data;
                console.log(data);
                
            });
        }
    },
    mounted() {
        this._name = pokemonName;
        this.getPokemonDetail();
    },
    setup(props) {
        console.log(props.name);
        pokemonName = props.name;
    },
    unmounted() {
    }
}

</script>

<style lang="scss" scoped>

</style>