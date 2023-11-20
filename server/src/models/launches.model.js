const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

const launchExists = async (launchId) => {
  return await launches.findOne({ flightNumber: launchId });
};

const getLatestFlightNumber = async() => {
  const latestLaunch = await launches
    .findOne()
    .sort('-flightNumber');

  if(!latestLaunch){
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber + 1;
}

const getAllLaunches = async () => {
  return await launches.find({}, { _id: 0, __v: 0 });
};

const addNewLaunch = async (launch) => {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet){
      throw new Error('No matching planet found!')
  }

  const newFlightNumber = await getLatestFlightNumber();

  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ["Frajdi", "Beni"],
    success: true,
    upcoming: true,
  })

  return await launches.findOneAndUpdate(
      {
        flightNumber: newFlightNumber,
      },
      newLaunch,
      {
        upsert: true,
      }
    );
};

const deleteLaunch = async (id) => {
  const updatedLaunch = await launches.updateOne(
    { flightNumber: id },
    { upcoming: false, success: false }
  );

  return updatedLaunch.modifiedCount === 1;
};

module.exports = {
  launchExists,
  getAllLaunches,
  addNewLaunch,
  deleteLaunch,
};
