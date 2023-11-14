const {
  getAllLaunches,
  addNewLaunch,
  launchExists,
  deleteLaunch,
} = require("../../models/launches.model");

const httpGetAllLaunches = async(req, res) => {
  const launches = await getAllLaunches()
  return res.status(200).json(launches);
};

const httpPostNewLaunch = (req, res) => {
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

  addNewLaunch(launch);
  return res.status(201).json(launch);
};

const httpDeleteLaunch = async(req, res) => {
  const launchId = req.params.id;

  if (!launchExists(launchId)) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = await deleteLaunch(launchId);

  return res.status(200).json(aborted);
};

module.exports = {
  httpGetAllLaunches,
  httpPostNewLaunch,
  httpDeleteLaunch,
};
