const Joi = require("joi");

/* ------------------ Joi Schema ------------------ */
const accidentSchema = Joi.object({
  phoneNumber: Joi.string()
    .trim()
    .pattern(/^[0-9+\-]{7,15}$/)
    .required(),

  description: Joi.string()
    .trim()
    .min(3)
    .max(500)
    .required(),

  location: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    source: Joi.string().valid("gps", "manual").required(),
    address: Joi.string().trim().max(255).optional(),
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
    .optional(),
}).options({
  abortEarly: false,
  allowUnknown: false,
});

/* ------------------ Middleware ------------------ */
const validateAccidentReport = (req, res, next) => {
  const { error, value } = accidentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      statusCode: 400,
      message: "Validation error",
      data: error.details.map((err) => err.message),
    });
  }

  // attach validated data
  req.validatedBody = value;
  next();
};

module.exports = validateAccidentReport;
