const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');
const {loadPlanetsData} = require('./models/planets.model');

const PORT = process.env.PORT || 4000;

const MONGO_URL = 'mongodb+srv://nasa-project:ThW9J29A9H8Luqul@cluster0.qsllge2.mongodb.net/nasa?retryWrites=true&w=majority';

const server = http.createServer(app);

mongoose.connection.once('open',() => {
    console.log('MongoDb connection ready!');
})

mongoose.connection.on('error', (err) => {
    console.error(err);
})

const startServer = (async() => {
 
    await mongoose.connect(MONGO_URL)

    await loadPlanetsData();
    
    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    });
});

startServer();



 