const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");
const planets = require('./planets.mongo');

const isHabbittable = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.35 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

const loadPlanetsData = () =>
  new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "keplerData.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      ) 
      .on("data", (data) => {
        if (isHabbittable(data)) {
          savePlanet(data)
        }
      })
      .on("error", (err) => {
        console.log("XXXXX", err, "XXXXXX");
        reject(err);
      })
      .on("end", async() => {
        const habitablePlanetsCount = (await getAllPlanets()).length
        console.log(`${habitablePlanetsCount} habbitable planets found !`);
        resolve();
      });
  });

const getAllPlanets = async() => {
  return await planets.find({}, 
    {'_id': 0, '__v': 0});
};

const savePlanet = async(planet) => {
  try{
    await planets.updateOne({
      keplerName: planet.kepler_name
    },
    {
      keplerName: planet.kepler_name
    },
    {
      upsert: true
    })
  }catch(err){
    console.error(`Planet could not be saved || ${err}`);
  }
};

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
