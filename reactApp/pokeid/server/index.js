// Importing required libraries
const express = require("express")
const app = express()
const port = 4000

const cors = require("cors")
const axios = require("axios")

const pokeGenRanges = [1, 152, 252, 387, 494, 650, 722, 810, 906] // array of when each generation ends by id

app.use(cors({
    origin: "*"
}))

// Middleware: Converts request & response into json object before passing it to other calls
app.use(express.json())

// Custom Endpoint 1: Get by ID
app.get('/pokemon_by_id', async (req, res) => {
    const id = req.query.id
    // ID not provided
    if (!id) {
        res.send({
            success: false,
            error: "No Pokémon ID provided"
        })
    } else {
        // Axios GET Request w/ given ID
        axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
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
                res.send({
                    success: true,
                    data: {
                        id: data.id,
                        name: data.name,
                        type: simpleTypes,
                        stats: basicStats,
                        weight: data.weight,
                        height: data.height,
                        evoTree: evoTree,
                        sprites: data.sprites.front_default,
                    }
                });
            })
            // Error in GET --> Send json object signaling the error
            .catch(err => {
                res.send({
                    success: false,
                    error: {
                        status: err.response.status,
                        statusText: err.response.statusText
                    }
                });
            })
    }
})

// Custom Endpoint 2: Get pokemon by name
app.get('/pokemon_by_name', async (req, res) => {
    let name = req.query.name
    // No name query param input
    if (!name) {
        res.send({
            success: false,
            error: "No Pokémon Name provided"
        })
    // GET Request using Axios
    } else {
        name = name.toLowerCase()
        await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
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
                const attComparisons = [];
                const fetchPairings = async () => {
                    for (let i = 0; i < simpleTypes.length; i++) {
                        await axios.get(`https://pokeapi.co/api/v2/type/${simpleTypes[i]}`)
                        .then(async (response) => {
                            const damageRelations = response.data.damage_relations
                            attComparisons.push({"type": simpleTypes[i], "damage_relations": damageRelations})
                            // for (const relation in damageRelations) {
                            //     attComparisons.push(relation);
                            // }
                        })
                    }
                }
                await fetchPairings()
                attComparisons.forEach(type => {console.log(type)})

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
                res.send({
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
            // Catch error & send a response w/ json object of failed success + error
            .catch(err => {
                res.send({
                    success: false,
                    error: {
                        status: err.response.status,
                        statusText: err.response.statusText
                    }
                });
            })
    }
})

// Custom Endpoint 3: Get all pokemon within a generation
app.get('/pokemon_by_gen', async (req, res) => {
    const generation = req.query.generation
    let genPokemon = [];
    // Generation Query Param is empty
    if (!generation) {
        res.send({
            success: false,
            error: "No Pokémon Generation provided"
        })
    // Generation Query Param is beyond existing generations
    } else if(!(generation >= 1 && generation <= 8)) {
        res.send({
            success: false,
            error: "Generation out of range"
        })
    // Axios GET Request to fetch data for Pokémon in a specific id range correlating to generation
    } else {
        // Does the fetching of Pokémon Data
        const getPokemonData = async (id) => {
            await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
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
                genPokemon.push({
                    id: data.id,
                    name: data.name,
                    type: simpleTypes,
                    stats: basicStats,
                    weight: data.weight,
                    height: data.height,
                    evoTree: evoTree,
                    sprites: data.sprites.front_default,
                })
            })
            .catch(err => {
                res.send({
                    success: false,
                    error: {
                        status: err.response.status,
                        statusText: err.response.statusText
                    }
                });
            })
        }
        
        // Wonky Promise Code to do Parallel Programming for fetching Pokemon faster
        let asyncCalls = []
        for (let id = pokeGenRanges[generation - 1]; id < pokeGenRanges[generation]; id++) {
            asyncCalls.push(new Promise(async (resolve, reject) => {
                resolve(await getPokemonData(id))
            }))
        }
        
        // Waits for all Promises to be resolved/rejected & then sorts the Pokémon by ID before sending a json object response w/ our data
        await Promise.allSettled(asyncCalls).then(() => {
            genPokemon.sort((a, b) => {
                return a.id - b.id
            })
            res.send({
                success: true,
                data: genPokemon
            })
        })

    }
})

app.listen(port, () => {
    console.log(`listening on port ${port}.`)
})