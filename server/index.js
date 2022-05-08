const express = require("express")
const path = require('path')
const app = express()
const http = require("http")
const socketio = require('socket.io')
const cors = require("cors")
const { Server } = require("socket.io")
const {loginUser, registerUser, logoutUser, updateUser, getUserData} = require('./src/db/dbhandle')
const { generateMessage, generateLocationMessage } = require('./src/utils/messages')
const {getMovieDataList, getMatchDetails } = require('./src/utils/imdbRequest')
const { addUser, removeUser, getUser, getUsersInRoom, getAllUsers, getCodeCount,
    swipeRight,swipeLeft,getRightSwipes,getLeftSwipes, clearSwipes, 
    setMovieListOfCode, getMovieListOfCode, setPreferencesOfCode, getPreferencesOfCode} = require('./src/utils/users')

const publicDirectoryPath = path.join(__dirname, '../client/public/build')
app.use(express.static(publicDirectoryPath))
//app.use(cors())
// "start": "concurrently \"npm run server\" \"npm run client\""
const server = http.createServer(app)

const port = process.env.PORT || 3001

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

//TODO Solve errors caused by updated mongodb package

io.on("connection", async (socket) => {
    var list = {}
    var email = ""

    socket.on('join', async (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })
        
        if (error) {
            return callback(error, null)
        }
        else {
            callback(null, user.code)
        }

        socket.join(user.code)

        if(options.code === ""){
            socket.emit('genreVisible')
        }

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.emit('message', generateMessage('Admin', `Your code is: ${user.code}`))
        
        if(getCodeCount()[user.code] > 1){
            io.to(user.code).emit('messageL', generateMessage('Admin', 'Connected. Loading..'))
            list = getMovieListOfCode(user.code)
            if(list === undefined) {
                const pref = getPreferencesOfCode(user.code)
                list = await getMovieDataList(10, user.code, pref)
                setMovieListOfCode(list, user.code)
            }
            if(list.length === 0){
                socket.emit('askForNewPref')
            }
            else {
                io.to(user.code).emit('start', list)
            }
            
        }

        callback()
    })

    socket.on('preferenciesContinue', async (values) => {
        const user = getUser(socket.id)
        if(user) {
            setPreferencesOfCode(values, user.code)
            const listNew = await getMovieDataList(10, user.code, values)
            const listOld = getMovieListOfCode(user.code)
            const listToSave = listOld.concat(listNew)
            setMovieListOfCode(listToSave, user.code)
            if(listNew.length === 0){
                socket.emit('askForNewPref')
            }
            else{
                io.to(user.code).emit('listaRefresh', listNew)
            }
        }
    })

    socket.on('preferenciesNew', async (values) => {
        const user = getUser(socket.id)
        if(user) {
            setPreferencesOfCode(values, user.code)
            list = await getMovieDataList(10, user.code, values)
            setMovieListOfCode(list, user.code)
            if(list.length === 0 ){
                console.log("ennek kene", values)
                socket.emit('askForNewPref')
            }
            else{
                if(getCodeCount()[user.code] > 1){
                    io.to(user.code).emit('start', list)
                }
            }
        }
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.code).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('everybodyBackToMain', () => {
        const user = getUser(socket.id)
        if(user){
            io.to(user.code).emit('backToMain')
        }
    })

    socket.on('everybodyContinue', () => {
        const user = getUser(socket.id)
        if(user){
            io.to(user.code).emit('continue')
        }
    })

    socket.on('loginDataFromForm', async (data) => {
        const token = await loginUser(data)
        email = data.email ?? "" 
        const userData = await getUserData(email)
        
        socket.emit('afterLogin', {token, userData, email})
        
    })

    socket.on('registerDataFromForm', async (data) => {
        const token = await registerUser(data)
        email = data.email ?? "" 
        const userData = await getUserData(email)
        socket.emit('afterRegister', {token, userData, email})
    })

    socket.on('logoutFromForm', async (email) => {
        const token = await logoutUser(email)
        email = "" 
        socket.emit('afterLogout', token)
    })

    socket.on('endOfFilms', async () => {
        const user = getUser(socket.id)

        if(user){
            const pref = getPreferencesOfCode(user.code)
            const listNew = await getMovieDataList(10, user.code, pref)
            const listOld = getMovieListOfCode(user.code)
            const listToSave = listOld.concat(listNew)
            setMovieListOfCode(listToSave, user.code)
            if(listNew.length === 0){
                socket.emit('askForNewPref')
            }
            else{
                io.to(user.code).emit('listaRefresh', listNew)
            }
        }
    })

    socket.on('messageFrom', (message) => {
        const user = getUser(socket.id)
        if(user){
            const date = new Date
            const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
            const messageBack = {text: message, from: user.id, time: time}
            io.to(user.code).emit('message', messageBack)
        }
    })

    socket.on('swipeLeft', (movieID, callback) => {
        swipeLeft(socket.id, movieID)
        callback()
    })

    socket.on('swipeRight', async (movieID, email, callback) => {
        const movieDetails = await getMatchDetails(movieID)          

        if(email !== ""){
            const userData = await getUserData(email)
            var concatMovie = userData.movies
            concatMovie.push({
                    name:movieDetails.title,
                    imdbID: movieDetails.imdb_id,
                    dateOfSave: new Date()
            })
            const movieData = concatMovie.filter((item, pos) => concatMovie.indexOf(item) === pos)
            
            await updateUser(email, "movies", data=movieData)

            const dataNew = movieDetails.gen.map((e) => {return e.genre})
            const concatGenre = (userData.genres).concat(dataNew)
            const genreData = concatGenre.filter((item, pos) => concatGenre.indexOf(item) === pos)
        
            await updateUser(email, "genres", data=genreData)

        }

        const isMatch = swipeRight(socket.id, movieID)
        if(isMatch){
            const user = getUser(socket.id)

            io.to(user.code).emit('foundAMatch', movieDetails)
        }
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        clearSwipes(socket.id)
        if (user) {
            io.to(user.code).emit('message', generateMessage('Admin', 'The other party has left!'))
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})