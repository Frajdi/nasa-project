const launches = require('./launches.mongo')
// const launches = new Map();


let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer ISN",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["Frajdi", "NASA"],
  upcoming: true,
  success: true,
};

// launches.(launch.flightNumber, launch);

const launchExists = async(launchId) => {
  return await launches.find({flightNumber: flightNumber}, {flightNumber: launchId});
};

const getAllLaunches = async() => {
  return  await launches.find({});
};

const addNewLaunch = async() => {
  try {
    await launches.create(launch)
  } catch (error) {
    console.log(error);    
  }
};

// const deleteLaunch = (id) => {
//   const aborted = launches.get(id);
//   aborted.upcoming = false;
//   aborted.success = false;

//   return aborted;
// };

module.exports = {
  launchExists,
  getAllLaunches,
  addNewLaunch,
  // deleteLaunch,
};
