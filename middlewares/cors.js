import cors from 'cors'

const ACCEPTED_ORIGINS = [
			'PostmanRuntime/7.42.0',
			'http://localhost:8080',
			'http//localhost:5050',
			'http://localhost:5174',
			'http://localhost:5173',
			'https://pokemonreact.onrender.com',
			'null'
			]

export const corsMiddleware = ({acceptedOrigins = ACCEPTED_ORIGINS} = {}) => cors({
	origin:(origin, callback) => {
		
	
	if(ACCEPTED_ORIGINS.includes(origin)){
		return callback(null, true)
	}
	if(!origin){
		return callback(null, true)
	}
	if(origin == null){
		return callback(null, true)
	}

	return callback(new Error('Not allowed by CORS'))
	}
})