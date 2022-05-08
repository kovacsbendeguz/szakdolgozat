const mongodb = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//TODO secret
const secret_token = "dekog27FJdw8j2s"

const userSchema = new mongodb.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 18,
        validate(value) {
            if (value <= 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    loggedin: {
        type: Boolean,
        default: false,
    },

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

    movies: [{
        name: {
            type: String,
            required: true
        },
        imdbID: {
            type: String,
            required: true
        },
        dateOfSave: {
            type: Date,
            required: true
        }

    }],

    genres: [{
        type: String,
        required: true
    }]
    
}, {
    timestamps: true
})


userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.loggedin
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, secret_token)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByEmail = async (email) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('findByEmail error')
    }

    return user
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    next()
})

const User = mongodb.model('User', userSchema)

module.exports = User