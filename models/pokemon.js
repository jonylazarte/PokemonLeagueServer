import {require} from '../utils.js'
import fs from 'node:fs'


const usersDB = require('././data/users.json')
const reducedPokemon = require('././data/index.json')
const growthRates = []
for(let i = 1; i < 7; i++){
		let growthrates = require(`././data/growth-rate/${i}/index.json`)
		growthRates.push(growthrates)
	}


export class pokemonModel{

		static async getAll({type}){
			if(type){
				return await reducedPokemon.filter(poke => poke.types.some(t => t.type.name.toLowerCase() === type.toLowerCase()));
			}	
			return reducedPokemon.results
		}

		static async searchByKeys({keys}){
			const pokemonFiltered = await reducedPokemon.filter(poke => poke.name.toLowerCase().startsWith(keys));
			return pokemonFiltered
		}

		static async getSpecies(){
			var species = []
     		 	for(let i = 1; i < 400; i++){
					let pokemon = require(`././data/pokemon-species/${i}/index.json`)
					species.push(pokemon)
				}
			return species
		}

		static async getMoves(movesIndexes){
			var moves = []
			movesIndexes.map(index=>{
				let move = require(`././data/move/${index}/index.json`)
				//move.effect_entries = ""
				move.flavor_text_entries = ""
				move.learned_by_pokemon = ""
				move.names = ""
				move != undefined && moves.push(move)
			})
     		 	/*for(let i = 1; i < 900; i++){
					let move = require(`././data/move/${i}/index.json`)
					move != undefined && moves.push(move)}*/
			return moves
		}

		static async getTypes(){
			var types = []
     		 	for(let i = 1; i < 20; i++){
					let type = require(`././data/type/${i}/index.json`)
					types.push(type)
				}
			return types
		}

}
export class usersModel{

		static async registerUser({body}){
			var oldData = usersDB
			oldData.push(body)
			fs.writeFileSync('././data/users.json', JSON.stringify(oldData), (err)=>{console.log(err)})

			return oldData
		}

		static async loginUser({body}){

			const foundUser = usersDB.find(user => user.userName == body.userName && user.password == body.password)
			return foundUser
		}

		static async getAllOwned({id}){
				id = "198b73c5-50b6-4fbc-a7dc-d93a6c2ec1d6"
				const foundUser = await usersDB.find(user => user.id == id)
				var pokemonOwneds = foundUser.pokemon
				
				
				return pokemonOwneds				
		}
		static async addToPokedex({userID, pokemonID}){
			
				var   lastData = usersDB
				const inputPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`).then(response=>response.json())//pokeconst[pokemonId -1]
				const actualExp = 40
				const growthRate = growthRates.find(gr => gr.pokemon_species.some(pe => pe.name == inputPokemon.name))
				const userIndex = usersDB.findIndex(user => user.id === userID)
				const pokemonLevels = growthRate.levels.filter(level => level.experience <= actualExp)
				const pokemonLevel = pokemonLevels[pokemonLevels.length -1].level
				const ownMoves = inputPokemon.moves.filter(move => move.version_group_details[0].level_learned_at < pokemonLevel && move.version_group_details[0].move_learn_method.name == "level-up")
				const randomMoves = []
				for(let i = 0; i < 4; i++){
					let randomIndex = Math.floor(Math.random() * ownMoves.length)
					randomMoves.push(ownMoves.splice(randomIndex, 1)[0]);
					if(ownMoves.length == 0){break;}
				}
				const detailedMoves = []
				const movesIndexes = randomMoves.map(move => {return move.move.url.split("/")[6]})
				movesIndexes.map(index=>{
				var move = require(`././data/move/${index}/index.json`)
				move = {
				...move,
				flavor_text_entries : "",
				learned_by_pokemon : "",
				names : "",
				pp_state : move.pp
					}
				move != undefined && detailedMoves.push(move)
				})

				const IVs = {
					hp : Math.floor(Math.random() * 32 ) + 1,
					attack : Math.floor(Math.random() * 32 ) + 1,
					defense : Math.floor(Math.random() * 32 ) + 1,
					special_attack : Math.floor(Math.random() * 32 ) + 1,
					special_defense : Math.floor(Math.random() * 32 ) + 1,
					speed : Math.floor(Math.random() * 32 ) + 1
				}
				const EVs = {
					hp : inputPokemon.stats[0].effort,
					attack : inputPokemon.stats[1].effort,
					defense : inputPokemon.stats[2].effort,
					special_attack : inputPokemon.stats[3].effort,
					special_defense : inputPokemon.stats[4].effort,
					speed : inputPokemon.stats[5].effort
				}
				const hp = Math.floor( ((2 * inputPokemon.stats[0].base_stat  + IVs.hp + EVs.hp / 4) * pokemonLevel) / 100 + pokemonLevel + 10 );
				const attack = Math.floor( ((2 * inputPokemon.stats[1].base_stat  + IVs.attack + EVs.attack / 4) * pokemonLevel) / 100 +  5 );
				const defense = Math.floor( ((2 * inputPokemon.stats[2].base_stat  + IVs.defense + EVs.defense / 4) * pokemonLevel) / 100 + 5 );
				const special_attack = Math.floor( ((2 * inputPokemon.stats[3].base_stat  + IVs.special_attack + EVs.special_attack / 4) * pokemonLevel) / 100 + 5 );
				const special_defense = Math.floor( ((2 * inputPokemon.stats[4].base_stat  + IVs.special_defense + EVs.special_defense / 4) * pokemonLevel) / 100 + 5 );
				const speed = Math.floor( ((2 * inputPokemon.stats[5].base_stat  + IVs.speed + EVs.speed / 4) * pokemonLevel) / 100 + 5 );

				const finalPokemon = {
					...inputPokemon,
					index : lastData[userIndex].pokemon.length,
					level : pokemonLevel,
					moves : detailedMoves,
					actual_exp : actualExp,
					hp_state: hp,
					IVs,
					EVs,
					stats : [
            {...inputPokemon.stats[0], actual_stat : hp},
            {...inputPokemon.stats[1], actual_stat : attack},
            {...inputPokemon.stats[2], actual_stat : defense},
            {...inputPokemon.stats[3], actual_stat : special_attack},
            {...inputPokemon.stats[4], actual_stat : special_defense},
            {...inputPokemon.stats[5], actual_stat : speed}
            		]

				}
				const newData = await lastData[userIndex].pokemon.push(finalPokemon)
				fs.writeFileSync('././data/users.json', JSON.stringify(lastData), 'utf-8', (err)=>{console.log(err)})

				return finalPokemon
		}
		static async updateLevel({userId, pokemonId, pokemonExp}){
				var   lastData = usersDB
				const userIndex = usersDB.findIndex(user => user.id === userId)
				var   inputPokemon = usersDB[userIndex].pokemon[pokemonId]
				pokemonExp += inputPokemon.actual_exp
				const growthRate = growthRates.find(gr => gr.pokemon_species.some(pe => pe.name == inputPokemon.name))
				const pokemonLevels = growthRate.levels.filter(level => level.experience <= pokemonExp)
				const pokemonLevel = pokemonLevels[pokemonLevels.length -1].level
				const EVs = {
					hp : inputPokemon.stats[0].effort,
					attack : inputPokemon.stats[1].effort,
					defense : inputPokemon.stats[2].effort,
					special_attack : inputPokemon.stats[3].effort,
					special_defense : inputPokemon.stats[4].effort,
					speed : inputPokemon.stats[5].effort
				}

				const hp = Math.floor( ((2 * inputPokemon.stats[0].base_stat  + inputPokemon.IVs.hp + EVs.hp / 4) * pokemonLevel) / 100 + pokemonLevel + 10 );
				const attack = Math.floor( ((2 * inputPokemon.stats[1].base_stat  + inputPokemon.IVs.attack + EVs.attack / 4) * pokemonLevel) / 100 +  5 );
				const defense = Math.floor( ((2 * inputPokemon.stats[2].base_stat  + inputPokemon.IVs.defense + EVs.defense / 4) * pokemonLevel) / 100 + 5 );
				const special_attack = Math.floor( ((2 * inputPokemon.stats[3].base_stat  + inputPokemon.IVs.special_attack + EVs.special_attack / 4) * pokemonLevel) / 100 + 5 );
				const special_defense = Math.floor( ((2 * inputPokemon.stats[4].base_stat  + inputPokemon.IVs.special_defense + EVs.special_defense / 4) * pokemonLevel) / 100 + 5 );
				const speed = Math.floor( ((2 * inputPokemon.stats[5].base_stat  + inputPokemon.IVs.speed + EVs.speed / 4) * pokemonLevel) / 100 + 5 );

				lastData[userIndex].pokemon[pokemonId] = {
					...lastData[userIndex].pokemon[pokemonId],
					level : pokemonLevel,
					actual_exp : pokemonExp,
					stats : [
            {...inputPokemon.stats[0], actual_stat : hp},
            {...inputPokemon.stats[1], actual_stat : attack},
            {...inputPokemon.stats[2], actual_stat : defense},
            {...inputPokemon.stats[3], actual_stat : special_attack},
            {...inputPokemon.stats[4], actual_stat : special_defense},
            {...inputPokemon.stats[5], actual_stat : speed}
            		]

				}
				fs.writeFileSync('././data/users.json', JSON.stringify(lastData), 'utf-8', (err)=>{console.log(err)})

				return lastData[userIndex].pokemon[pokemonId]
		}

}
