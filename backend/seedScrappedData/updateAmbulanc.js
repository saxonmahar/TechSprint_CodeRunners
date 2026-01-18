const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Ambulance = require("./../model/ambulanceModel");
require("dotenv").config({ path: "../.env" });

function baseUsername(name) {
  return name
    .toLowerCase()
    .split(" ")
    .slice(0, 2)
    .join("")
    .replace(/[^a-z]/g, "");
}

async function generateUniqueEmail(base) {
  let email = `${base}@gmail.com`;
  let counter = 1;

  while (await Ambulance.exists({ email })) {
    email = `${base}${counter}@gmail.com`;
    counter++;
  }

  return email;
}

async function updateAmbulances() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const ambulances = await Ambulance.find({});
  console.log("Ambulances to update:", ambulances.length);

  for (const amb of ambulances) {
    const base = baseUsername(amb.name);
    const email = await generateUniqueEmail(base);

    const plainPassword = crypto.randomBytes(5).toString("hex");
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    amb.email = email;
    amb.password = hashedPassword;

    await amb.save();

    console.log("Updated:", amb.name);
    console.log("Username:", email);
    console.log("Password (plain):", plainPassword);
    console.log("----------------------------------");
  }

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

updateAmbulances().catch(console.error);
