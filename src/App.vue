<template>
  <poke_navbar></poke_navbar>
  <poke_list></poke_list>
</template>

<script setup>
  import poke_navbar from './components/pokemon/poke-navbar.vue';
  import poke_list from './components/pokemon/poke-list.vue';
</script>

<style>
@import "tailwindcss";

@plugin "daisyui" {
    themes: light --default;
}
</style>
