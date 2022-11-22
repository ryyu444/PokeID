const axios = require("axios")

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
        const evoTree = [];
        // Finds Evolutions of Requested Pokemon - Finds species --> Finds Evolution Chain --> Grabs Names from Evolution Chain
        const fetchEvos = async () => {
            // Gets pokemon species data from given pokemon to get evolution chain data
            await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${data.id}`)
            .then(async response => {
                const evoChainURL = response.data.evolution_chain.url
                // Gets evolution data from evolution chain endpoint
                const fetchEvoNames = async (url) => {
                    await axios.get(url)
                    .then(async response => {
                        const data = response.data
                        let evoData = data.chain;
                        
                        // Grabs evolutions of an entire Pokemon Species
                        do {
                            let numOfEvos = evoData.evolves_to.length;
                            // Pushes name of base form
                            evoTree.push(evoData.species.name)
                            
                            // Checks if there are more evolutions - Pushes names of evolutions
                            if (numOfEvos > 1) {
                                for (let i = 1; i < numOfEvos; i++) {
                                    evoTree.push(evoData.evolves_to[i].species.name)
                                }    
                            }
                            // Moves evoData object onto the nested object
                            evoData = evoData.evolves_to[0]
                        } while (!!evoData && evoData.hasOwnProperty('evolves_to'))
                    })
                }
                await fetchEvoNames(evoChainURL)
            })
        }
        await fetchEvos()
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