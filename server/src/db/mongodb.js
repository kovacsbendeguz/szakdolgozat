const { MongoClient } = require('mongodb');

const url = "mongodb+srv://moviet:vu00CeBTHWhQ3fIV@cluster0.cnymu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const mongoose = require('mongoose')

mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})