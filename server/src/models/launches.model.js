const launches = require("./launches.mongo");
const planets = require("./planets.mongo");
const axios = require("axios");

const DEFAULT_FLIGHT_NUMBER = 100;

const LAUNCHES_SPACEX_API = "https://api.spacexdata.com/v4/launches/query";

const populateLaunches = async () => {
  console.log("Loading Launches...");
  const response = await axios.post(LAUNCHES_SPACEX_API, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if(response.status !== 200){
    throw new Error('Failed to load launches...')
  }

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const customers = launchDoc.payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      launchDate: launchDoc["date_local"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      success: launchDoc["success"],
      upcoming: launchDoc["upcoming"],
      customers,
    };

    console.log('-----------',launch);

    await saveLaunch(launch);

    // console.log(`${launch.flightNumber} ${launch.mission}`);
  }
};

const loadLaunches = async () => {
  const loadedLaunch = await findLaunch({
    launchDate: "2006-03-24T22:30:00.000+00:00",
    mission: "FalconSat",
    rocket: "Falcon 1",
  });

  if (loadedLaunch) {
    console.log("Launches already loaded.");
    return;
  } else {
    await populateLaunches();
  }
};

const findLaunch = async (filter) => {
  return await launches.findOne(filter);
}; 

const launchExists = async (launchId) => {
  return await findLaunch({ flightNumber: launchId });
};

const getLatestFlightNumber = async () => {
  const latestLaunch = await launches.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber + 1;
};

const getAllLaunches = async () => {
  return await launches.find({}, { _id: 0, __v: 0 });
};

const saveLaunch = async (launch) => {
  return await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
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
  });

  await saveLaunch(newLaunch);
};

const deleteLaunch = async (id) => {
  const updatedLaunch = await launches.updateOne(
    { flightNumber: id },
    { upcoming: false, success: false }
  );

  return updatedLaunch.modifiedCount === 1;
};

module.exports = {
  loadLaunches,
  launchExists,
  getAllLaunches,
  addNewLaunch,
  deleteLaunch,
};
