const Ambulance = require("../model/ambulanceModel");
const Hospital = require("../model/hospitalModel");
const PoliceStation = require("../model/policeStationsModel");

const MAX_DISTANCE = 20000; // 5 km

const getNearbyEntities = async (longitude, latitude) => {
  const geoQuery = {
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: MAX_DISTANCE,
      },
    },
  };

  const [ambulances, hospitals, policeStations] = await Promise.all([
    Ambulance.find({ ...geoQuery, status: "AVAILABLE" }).limit(3),
    Hospital.find(geoQuery).limit(3),
    PoliceStation.find(geoQuery).limit(3),
  ]);

  return {
    ambulances,
    hospitals,
    policeStations,
  };
};

module.exports = { getNearbyEntities };