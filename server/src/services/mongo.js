const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://nasa-project:ThW9J29A9H8Luqul@cluster0.qsllge2.mongodb.net/nasa?retryWrites=true&w=majority';

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