const Joi = require("joi");

/* ------------------ Joi Schema ------------------ */
const accidentSchema = Joi.object({
  phoneNumber: Joi.string()
    .trim()
    .pattern(/^[0-9+\-]{7,15}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number format is invalid",
    }),

  description: Joi.string()
    .trim()
    .min(3)
    .max(500)
    .required()
    .messages({
      "string.empty": "Description is required",
      "string.min": "Description must be at least 3 characters",
      "string.max": "Description must not exceed 500 characters",
    }),

  location: Joi.object({
    latitude: Joi.number()
      .min(-90)
      .max(90)
      .required()
      .messages({
        "number.base": "Latitude must be a number",
      }),

    longitude: Joi.number()
      .min(-180)
      .max(180)
      .required()
      .messages({
        "number.base": "Longitude must be a number",
      }),

    source: Joi.string()
      .valid("gps", "manual")
      .required(),

    address: Joi.string()
      .trim()
      .max(255)
      .optional(),
  }).required(),

  images: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().uri().required(),
        public_id: Joi.string().required(),
        format: Joi.string().optional(),
      })
    )
    .max(5)
    .default([]),
})
  .options({
    abortEarly: false,
    stripUnknown: true, // 🔐 removes unexpected fields
  });

/* ------------------ Middleware ------------------ */
const validateAccidentReport = (req, res, next) => {
  const { error, value } = accidentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      statusCode: 400,
      message: "Validation failed",
      errors: error.details.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // attach sanitized payload
  req.validatedBody = value;
  next();
};

module.exports = validateAccidentReport;
