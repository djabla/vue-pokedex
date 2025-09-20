<template>
  <pokecache></pokecache>
  <pokelist></pokelist>
</template>

<script setup>
  import pokecache from './components/pokecachepage.vue';
  import pokelist from './components/pokelistpage.vue';
  import pokemondetailspage from './components/pokemondetailspage.vue';
</script>

<style>
@import "tailwindcss";

@plugin "daisyui" {
    themes: light --default;
}
</style>
