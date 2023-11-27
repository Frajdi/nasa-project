const mongoose = require('mongoose');

require('dotenv').config()

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open',() => {
    console.log('MongoDb connection ready!');
})

mongoose.connection.on('error', (err) => {
    console.error(err);
})

const mongoConnect = async() => {
    mongoose.connect(MONGO_URL)
}

const mongoDisconnect = async() => {
    mongoose.disconnect()
}


module.exports = {
    mongoConnect,
    mongoDisconnect,
}