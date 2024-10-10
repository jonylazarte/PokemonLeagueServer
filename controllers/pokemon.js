import {pokemonModel, usersModel} from '../models/pokemon.js'



export class pokemonController{

	static async getAll (req, res){
	const {type} = req.query
	const allpokemon = await pokemonModel.getAll({type})
     res.status(200).json(allpokemon)
	}

	static async searchByKeys (req, res){
	const keys = req.params.keys.toString().toLowerCase()
	const foundPokemon = await pokemonModel.searchByKeys({keys})
     res.status(200).json(foundPokemon)
	}

	static async getSpecies (req, res){
	const species = await pokemonModel.getSpecies()
     res.status(200).json(species)
	}

	static async getMoves (req, res){
	console.log(req.body)
	const {movesIndexes} = req.body
	const moves = await pokemonModel.getMoves(movesIndexes)
     res.status(200).json(moves)
	}

	static async getTypes (req, res){
	const types = await pokemonModel.getTypes()
     res.status(200).json(types)
	}


}

export class usersController{

	static async registerUser(req, res){
	const body = req.body
	const result = await usersModel.registerUser({body})
	res.status(200).json(result)
	}

	static async loginUser(req, res){
	const body = req.body
	const result = await usersModel.loginUser({body})
	res.status(200).json(result)
	}

	static async getAllOwned(req, res){
		const {id} = req.body
		const pokemonOwned = await usersModel.getAllOwned({id})
		res.status(200).json(pokemonOwned)
	}

	static async addToPokedex(req, res){
		const {userID, pokemonID} = req.body
		const result	 = await usersModel.addToPokedex({userID, pokemonID})

		res.status(200).json(result)				
	}

	static async updateLevel(req, res){
		const {userId, pokemonId, pokemonExp } = req.body
		const result	 = await usersModel.updateLevel({userId, pokemonId, pokemonExp})

		res.status(200).json(result)				
	}
}