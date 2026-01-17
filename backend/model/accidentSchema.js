const mongoose = require("mongoose");

const accidentSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 500,
    },

    location: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },
      source: {
        type: String,
        enum: ["gps", "manual"],
        required: true,
      },
      address: {
        type: String,
        trim: true,
        maxlength: 255,
      },
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
        format: String,
      },
    ],

    status: {
      type: String,
      enum: ["reported", "verified", "rejected"],
      default: "reported",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Accident", accidentSchema);
