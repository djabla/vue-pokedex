export async function getPokeList(offset = 0) {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=50${offset ? `&offset=${offset}` : ''}`;
    return await fetch(url)
        .then(response => response.json())
        .catch(err => console.log(err));
}

export async function getIndividualPokemon(url) {
    return await fetch(url)
        .then(response => response.json())
        .catch(err => console.log(err));
}

export async function getPokemonByName(name) {
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    return await fetch(url)
        .then(response => response.json())
        .catch(err => console.log(err));
}

export async function getCacheList() {
    try {
        const response = await fetch("http://localhost:3000/api/myPokemons");
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        console.log("Pokemons:", data);
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}

export async function storeToCache(data) {
    return await fetch('http://localhost:3000/api/myPokemons', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => console.log("inserted data:", data))
        .catch(err => console.log(err));
}