const express = require("express")
const app = express()
const port = 4000

const cors = require("cors")
const axios = require("axios")

const pokeGenRanges = [1, 152, 252, 387, 494, 650, 722, 810, 906] //array of when each generation ends by id

app.use(cors({
    origin: "*"
}))

app.use(express.json())

// custom endpoints
app.get('/pokemon_by_id', async (req, res) => {
    const id = req.query.id
    if (!id) {
        res.send({
            success: false,
            error: "No pokemon id provided"
        })
    } else {
        axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(async response => {
                const data = response.data
                const simpleTypes = data.types.map((type) => {
                    return type.type.name
                })
                res.send({
                    success: true,
                    data: {
                        id: id,
                        name: data.name,
                        type: simpleTypes,
                        weight: data.weight,
                        sprites: data.sprites.front_default,
                    }
                });
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
})

// Grab pokemon by gen & stores the json object into an array
app.get('/pokemon_by_gen', async (req, res) => {
    const generation = req.query.generation
    let genPokemon = [];
    if (!generation) {
        res.send({
            success: false,
            error: "No pokemon generation provided"
        })
    } else if(!(generation >= 1 && generation <= 8)) {
        res.send({
            success: false,
            error: "Generation out of range"
        })
    } else {
        const getPokemonData = async (id) => {
            await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(async response => {
                const data = response.data
                const simpleTypes = data.types.map((type) => {
                    return type.type.name
                })
                genPokemon.push({
                    id: id,
                    name: data.name,
                    type: simpleTypes,
                    weight: data.weight,
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

        let asyncCalls = []
        for (let id = pokeGenRanges[generation - 1]; id < pokeGenRanges[generation]; id++) {
<<<<<<< HEAD
            asyncCalls.push(new Promise(async (resolve) => {
                resolve(genPokemon.push((await getPokemon.call(id)).data))
=======
            asyncCalls.push(new Promise(async (resolve, reject) => {
                resolve(await getPokemonData(id))
>>>>>>> parent of c773c0e1 (Merge branch 'frontend-sauvikesh' into frontend-matt)
            }))
        }

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