const launches = require('./launches.mongo')

const launchExists = async(launchId) => {
  return await launches.find({flightNumber: launchId});
};

const getAllLaunches = async() => {
  return await launches.find({});
};

const addNewLaunch = async(launch) => {
  const generatedFlightNumber = Date.now()
  try {
    return await launches.insertMany({...launch, flightNumber: generatedFlightNumber})
  } catch (error) {
    console.log(error);    
  }
};

const deleteLaunch = async(id) => {
  
  const updatedLaunch = await launches.updateOne(
    {flightNumber: id},
    {upcoming : false, success: false}
  )

  return updatedLaunch;
};

module.exports = {
  launchExists,
  getAllLaunches,
  addNewLaunch,
  deleteLaunch,
};
