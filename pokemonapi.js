import {require} from './utils.js'
import express from 'express'
import {pokedexRouter} from './routes/pokemons.js'
import {corsMiddleware} from './middlewares/cors.js'
import logger from 'morgan'
import {Server} from 'socket.io'
import {createServer} from 'node:http'
import cors from 'cors'


const app = express();
app.use(corsMiddleware())
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', methods: ["GET", "POST"] }
});

app.use(logger('dev'))
app.use(express.json())
app.use('/pokemons', pokedexRouter)

io.on('connection', (socket)=>{
	console.log("a user has conected!")

	socket.on('chat message', (msg)=>{
		io.emit('chat message', msg)
	})
	socket.on('attack', (msg)=>{
		io.emit('attack', msg)
	})
	socket.on('setpokemon', (msg)=>{
		io.emit('setpokemon', msg)
	})
})


app.get('/chat', (req,res)=>{
	//import {io} from 'https://cdn.socket.io/4.8.0/socket.io.esm.min.js'
	//res.sendFile(process.cwd() + '/client/index.html')
	res.send('<h1>done</h1>')

})
const PORT = process.env.PORT ?? 5050
server.listen(PORT, ()=>console.log(`Server listening on ${PORT}`))
