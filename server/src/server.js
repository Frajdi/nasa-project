const http = require('http');

require('dotenv').config();

const app = require('./app');
const {mongoConnect} = require('./services/mongo')
const {loadPlanetsData} = require('./models/planets.model');
const {loadLaunches} = require('./models/launches.model');

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

const startServer = (async() => {
 
    await mongoConnect();

    await loadLaunches();

    await loadPlanetsData();
    
    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    });
});

startServer();



 