import Joi from "joi";

export const registerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  dob: Joi.date().iso().less("now").required().messages({
    "date.format": "Date of birth must be in YYYY-MM-DD format",
    "date.less": "Date of birth must be in the past",
    "date.base": "Date of birth must be a valid date",
  }),
  role: Joi.string().valid("user", "admin"),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  isBlocked: Joi.boolean().default(false),
  blockedUntil: Joi.date().allow(null).optional().max(15),
  incorrectLoginAttempts: Joi.number().min(0).default(0),
});

export const ratingSchema = Joi.object({
  toUserId: Joi.string().required(),
  score: Joi.number().min(1).max(10).required(),
});
