const twilio = require("twilio");
require('dotenv').config("../.env")

console.log("Twilio SID:", process.env.TWILIO_ACCOUNT_SID ? "LOADED" : "MISSING");
console.log(
  "Twilio TOKEN:",
  process.env.TWILIO_AUTH_TOKEN ? "LOADED" : "MISSING"
);
console.log("Twilio FROM:", process.env.TWILIO_WHATSAPP_FROM);

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ✅ Check if Nepal mobile number (WhatsApp-capable)
const isMobileNumber = (phone) => {
  if (!phone) return false;

  const cleaned = phone.replace(/[^0-9]/g, "");
  return cleaned.length === 10 && /^(97|98)/.test(cleaned);
};

// ✅ Normalize to E.164 format (+977XXXXXXXXXX)
const normalizePhoneNumber = (phone) => {
  const cleaned = phone.replace(/[^0-9]/g, "");
  return `+977${cleaned}`;
};

const sendWhatsAppMessage = async ({ to, message }) => {
  try {
    if (!isMobileNumber(to)) {
      console.log("⚠️ Skipped WhatsApp (not a mobile number):", to);
      return;
    }

    const formattedTo = normalizePhoneNumber(to);

    const messageInstance = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM, // whatsapp:+14155238886
      to: `whatsapp:${formattedTo}`,
      body: message,
    });

    console.log(
      "📨 Twilio Message SID:",
      messageInstance.sid,
      "| Status:",
      messageInstance.status
    );

    console.log("📲 WhatsApp sent via Twilio →", formattedTo);
  } catch (error) {
    console.error("❌ Twilio WhatsApp Error:", error.message);
  }
};

const buildAccidentMessage = (accident) => {
  const { latitude, longitude, address } = accident.location;

  return `
🚨 Accident Alert

📍 Location:
${address || `Lat ${latitude}, Lng ${longitude}`}

🗺 Google Maps:
https://www.google.com/maps?q=${latitude},${longitude}

📝 Description:
${accident.description}

⏰ Reported at:
${new Date(accident.createdAt).toLocaleString()}
`;
};

module.exports = {
  sendWhatsAppMessage,
  buildAccidentMessage,
};