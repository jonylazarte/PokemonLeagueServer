import {Router} from 'express'
import {pokemonModel} from '../models/pokemon.js'
import {pokemonController, usersController} from '../controllers/pokemon.js'



export const pokedexRouter = Router()




pokedexRouter.get('/', pokemonController.getAll)

pokedexRouter.get('/:keys', pokemonController.searchByKeys)

pokedexRouter.get('/data/species', pokemonController.getSpecies)

pokedexRouter.post('/data/moves', pokemonController.getMoves)

pokedexRouter.get('/data/types', pokemonController.getTypes)

pokedexRouter.get('/users/pokemon', usersController.getAllOwned)

pokedexRouter.post('/users/addpokemon', usersController.addToPokedex)

pokedexRouter.post('/users/updatelevel', usersController.updateLevel)

pokedexRouter.get('/users/register', usersController.registerUser)

pokedexRouter.get('/users/login', usersController.loginUser)
