const axios = require("axios")

let types = {
    normal: 1,
    fire: 1,
    water: 1,
    electric: 1,
    grass: 1,
    ice: 1,
    fighting: 1,
    poison: 1,
    ground: 1,
    flying: 1,
    psychic: 1,
    bug: 1,
    rock: 1,
    ghost: 1,
    dragon: 1,
    dark: 1,
    steel: 1,
    fairy: 1
}

async function call(id) {
    // Axios GET Request w/ given ID
    const output = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
    // Successful GET --> Parse response & send back a json object w/ desired contents
    .then(async response => {
        const data = response.data
        const simpleTypes = data.types.map((type) => {
            return type.type.name
        })
        const basicStats = data.stats.map((stat) => {
            return {
                    statName: stat.stat.name, 
                    statValue: stat.base_stat
                    }
        })
        // Finds Evolutions of Requested Pokemon - Finds species --> Finds Evolution Chain --> Grabs Names from Evolution Chain
        const evoChainURL = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${data.id}`)
        .then(async response => response.data.evolution_chain.url)

        const evoTree = await axios.get(evoChainURL)
        .then(response => {
            const dfs = (pokemon) => {
                return {
                    name: pokemon.species.name,
                    evolves_to: pokemon.evolves_to.map((evo) => dfs(evo))
                }
            }
            return dfs(response.data.chain)
        })

        let damageFrom = JSON.parse(JSON.stringify(types))
        let damageTo = JSON.parse(JSON.stringify(types))
        await Promise.all(simpleTypes.map(async (type) => {
            await axios.get(`https://pokeapi.co/api/v2/type/${type}`)
            .then(res => {
                const data = res.data.damage_relations
                const doubleFrom = data.double_damage_from
                const halfFrom = data.half_damage_from
                const noFrom = data.no_damage_from
                const doubleTo = data.double_damage_to
                const halfTo = data.half_damage_to
                const noTo = data.no_damage_to
                doubleFrom.forEach((dmgType) => damageFrom[dmgType.name] *= 2);
                halfFrom.forEach((dmgType) => damageFrom[dmgType.name] /= 2);
                noFrom.forEach((dmgType) => damageFrom[dmgType.name] = 0);
                doubleTo.forEach((dmgType) => damageTo[dmgType.name] *= 2);
                halfTo.forEach((dmgType) => damageTo[dmgType.name] /= 2);
                noTo.forEach((dmgType) => damageTo[dmgType.name] = 0);
            })
        }))

        let damageFromArr = []
        for (const [key, value] of Object.entries(damageFrom)) {
            damageFromArr.push({type: key, multiplier: value})
        }

        let damageToArr = []
        for (const [key, value] of Object.entries(damageTo)) {
            damageToArr.push({type: key, multiplier: value})
        }

        damageFromArr.sort((a, b) => {
            return a.multiplier - b.multiplier
        })

        damageToArr.sort((a, b) => {
            return a.multiplier - b.multiplier
        })

        return ({
            success: true,
            data: {
                id: data.id,
                name: data.name,
                type: simpleTypes,
                stats: basicStats,
                weight: data.weight,
                height: data.height,
                evoTree: evoTree,
                damageFrom: damageFromArr,
                damageTo: damageToArr,
                sprites: data.sprites.front_default
            }
        });
    })
    .catch((err) => {
        return ({
            success: false,
            error: {
                status: err.response.status,
                statusText: err.response.statusText
            }
        })
    })
    return output
}

module.exports = { call };