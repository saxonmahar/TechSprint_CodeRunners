const Joi = require("joi");

const registerValidation = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        "string.min": "Full name must be at least 2 characters",
        "any.required": "Full name is required",
      }),

    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.email": "Invalid email address",
        "any.required": "Email is required",
      }),

    phone: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required()
      .messages({
        "string.pattern.base": "Phone number must be 10–15 digits",
        "any.required": "Phone number is required",
      }),

    password: Joi.string()
      .min(6)
      .required()
      .messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
      }),

    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
        "any.required": "Confirm password is required",
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      statusCode: 400,
      message: "Validation error",
      data: error.details.map(err => err.message),
    });
  }

  next();
};

module.exports = registerValidation;
