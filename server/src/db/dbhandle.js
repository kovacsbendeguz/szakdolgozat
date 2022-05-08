require('./mongodb')
const User = require('./user')

const registerUser = async (data) => {
    var a = {
        "name":data.name,
        "age":data.age,
        "email":data.email,
        "password":data.password,
        "loggedin":true
    }
    if(data.password !== data.passwordAgain){
        return "Passwords must be the same"
    }
    var user = new User(a)
    try{
        await user.save()
        return 'Succes'
    }
    catch(e){
        if(e.message.includes("duplicate key error")){
            return "Email is already used"
        }
        else if(e.message.includes("Age must be a positive number")){
            return "Age must be a positive number"
        }
        else if(e.message.includes("is shorter than the minimum")){
            return "Password is too short (min. 7 char)"
        }
        
        return e.name

    }
    
}

const loginUser = async (data) => {
    try {
        const user = await User.findByCredentials(data.email, data.password)
        const token = await user.generateAuthToken()
        user.loggedin = true
        await user.save()
        return 'Succes'
    } catch (e) {
        return e.name
    }
    
}

const logoutUser = async (data) => {
    try {
        const user = await User.findByEmail(data)
        user.loggedin = false
        user.tokens = []
        await user.save()
        return 'Succes'

    } catch (e) {
        console.log(e)

        return "Unable to logout"
    }
    
}

const updateUser = async (email, type, data) => {
    try {
        const user = await User.findByEmail(email)

        if(type === "movies") {
            user.movies = data
        }
        if(type === "genres") {
            user.genres = data
        }
        //console.log(user)
        await user.save()
        return 'Succes'

    } catch (e) {
        console.log(e)

        return "Unable to update user"
    }
    
}

const getUserData = async (email) => {
    try {
        const user = await User.findByEmail(email)
        return user

    } catch (e) {
        console.log(e)

        return "Unable to get user"
    }
    
}

module.exports = {
    loginUser,
    registerUser,
    logoutUser,
    updateUser,
    getUserData,
}