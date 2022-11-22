// Importing required libraries
const express = require("express")
const app = express()
const port = 4000

const cors = require("cors")
const axios = require("axios")

const getPokemon = require('./util/getPokemon.js')

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
        res.send(await getPokemon.call(id));
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
        res.send(await getPokemon.call(name));
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
        // Wonky Promise Code to do Parallel Programming for fetching Pokemon faster
        let asyncCalls = []
        for (let id = pokeGenRanges[generation - 1]; id < pokeGenRanges[generation]; id++) {
            asyncCalls.push(new Promise(async (resolve, reject) => {
                resolve(genPokemon.push((await getPokemon.call(id)).data))
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