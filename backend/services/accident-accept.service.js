const { getNearbyEntities } = require("./geo.service");
const {
  sendWhatsAppMessage,
  buildAccidentMessage,
} = require("./whatsapp.service");

const logDivider = (title) => {
  console.log("\n");
  console.log(
    "-------------------------------------------- " +
      title +
      " --------------------------------------------"
  );
};

const notifyGroup = async (groupName, entities, message) => {
  logDivider(`WhatsApp Sent to ${groupName}`);

  if (!entities.length) {
    console.log(`No nearby ${groupName.toLowerCase()} found`);
    return;
  }

  for (const entity of entities) {
    await sendWhatsAppMessage({
      to: entity.phone,
      message,
    });
  }
};

const handleAccidentAccepted = async (accident) => {
  const { latitude, longitude } = accident.location;

  const { ambulances, policeStations, hospitals } =
    await getNearbyEntities(longitude, latitude);

  const message = buildAccidentMessage(accident);

  // 1️⃣ Ambulances first
  await notifyGroup("Ambulances", ambulances, message);

  // 2️⃣ Police stations
  await notifyGroup("Police Stations", policeStations, message);

  // 3️⃣ Hospitals
  await notifyGroup("Hospitals", hospitals, message);
};

module.exports = { handleAccidentAccepted };
