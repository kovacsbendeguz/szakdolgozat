const { removeRoom } = require('./imdbRequest')

const users = []
const usedCodes = {}
const codesInUse = []
const movieListOfCodes = {}
const preferencesOfCodes = {}

const addUser = ({ id, code }) => {

    if(code){
        const existingCode = users.find((user) => {
            return user.code === code
        })
    
        if (!existingCode) {
            return {
                error: 'Cannot find code!'
            }
        }
    }

    if (!code) {
        code = Math.floor(Math.random() * (9999 - 1000) + 1000)
        const existingUser = users.find((user) => {
            return user.code === code
        })
        while(existingUser){
            code = Math.floor(Math.random() * (9999 - 1000) + 1000)
        }
    }


    code = code.toString()
    const user = { id, code }
    console.log(user)
    users.push(user)

    const existingCode = usedCodes.hasOwnProperty(code)
    if(existingCode){
        usedCodes[code] = usedCodes[code] + 1
    }
    else{
        const count = 1
        usedCodes[code] = count
    }

    return { user }
}

const removeUser = (id_) => {
    const result = users.find( ({ id }) => id === id_ );

    if(result !== undefined){
        if(usedCodes.hasOwnProperty(result.code)){
        usedCodes[result.code] = usedCodes[result.code] - 1 
        if(usedCodes[result.code] === 0){
            removeRoom(result.code)
            delete usedCodes[result.code]
            delete movieListOfCodes[result.code]
        }
    }
    }
    

    const index = users.findIndex((user) => user.id === id_)
    
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }

}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (code) => {
    code = code.trim()
    return users.filter((user) => user.code === code)
}

const getAllUsers = () => {
    return users
}

const getCodeCount = () => {
    return usedCodes
}

var rightSwipeOfIDs = []
var leftSwipeOfIDs = []

const swipeRight = (id, movieID) => {
    const code = getUser(id).code

    const existingIDAndMovie = rightSwipeOfIDs.find((swipe) => {
        return (swipe.id === id && swipe.movieID === movieID) 
    })
    const existingMovie = rightSwipeOfIDs.find((swipe) => {
        return (getUser(swipe.id).code == code && swipe.movieID === movieID) 
    })

    if (!existingIDAndMovie) {
        const swipe = {id, movieID}
        rightSwipeOfIDs.push(swipe)
    
        if (existingMovie) {
            const matchMakingPref = preferencesOfCodes[code]['matchMaking']
            const allWithCode = users.filter(u => u.code === code).length
            const numberOfRightSwipe = rightSwipeOfIDs.filter((swipe) => {
                return (getUser(swipe.id).code == code && swipe.movieID === movieID) 
            }).length
            
            switch(matchMakingPref) {
                case 'two':
                    if(numberOfRightSwipe > 1){
                        return true
                    }
                  break;
                case 'half':
                    if(numberOfRightSwipe > (allWithCode/2) ){
                        return true
                    }
                  break;
                default:
                    if(allWithCode == numberOfRightSwipe){
                        return true
                    }
              }
            
        }
   }

}

const swipeLeft = (id, movieID) => {
    const existingIDandMovie = leftSwipeOfIDs.find((swipe) => {
        return (swipe.id === id && swipe.movieID === movieID) 
    })

    if (!existingIDandMovie) {
        const swipe = {id, movieID}
        leftSwipeOfIDs.push(swipe)
    }
}

const getLeftSwipes = () => {
    return leftSwipeOfIDs
}

const getRightSwipes = () => {
    return rightSwipeOfIDs
}

const clearSwipes = (id_) => {
    rightSwipeOfIDs = rightSwipeOfIDs.filter(swipe => swipe.id !== id_);
    leftSwipeOfIDs = leftSwipeOfIDs.filter(swipe => swipe.id !== id_);
}

const setMovieListOfCode = (list, code) => {
    movieListOfCodes[code] = list
}

const getMovieListOfCode = (code) => {
        return movieListOfCodes[code]
}

const setPreferencesOfCode = (pref, code) => {
    preferencesOfCodes[code] = pref
}

const getPreferencesOfCode = (code) => {
    return preferencesOfCodes[code]
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getAllUsers,
    getCodeCount,
    swipeRight,
    swipeLeft,
    getRightSwipes,
    getLeftSwipes,
    clearSwipes,
    setMovieListOfCode,
    getMovieListOfCode,
    setPreferencesOfCode,
    getPreferencesOfCode
}