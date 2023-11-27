const {
  getAllLaunches,
  addNewLaunch,
  launchExists,
  deleteLaunch,
} = require("../../models/launches.model");

const { getPagination } = require('../../services/query')

const httpGetAllLaunches = async(req, res) => {
  const {limit, skip} = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
};

const httpPostNewLaunch = async(req, res) => {
  const launch = req.body;

  if (
    !launch.launchDate ||
    !launch.mission ||
    !launch.rocket ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid type date.",
    });
  }


  try{
    await addNewLaunch(launch)
    return res.status(201).json(launch);
  }catch(error){
    return res.status(400).json({
      error: error.message
    });
  }

};

const httpDeleteLaunch = async(req, res) => {
  const launchId = req.params.id;

  if (!await launchExists(launchId)) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = await deleteLaunch(launchId);

  if(!aborted){
    return res.status(400).json({
      error: 'Launch not aborted!'
    })
  }

  return res.status(200).json({ok: true});
};

module.exports = {
  httpGetAllLaunches,
  httpPostNewLaunch,
  httpDeleteLaunch,
};
