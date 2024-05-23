import Joi from "joi";

export const registerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  dob: Joi.date().iso().required(),
  role: Joi.string().valid("user", "admin"),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  isBlocked: Joi.boolean().default(false),
  blockedUntil: Joi.date().allow(null).optional(),
  incorrectLoginAttempts: Joi.number().min(0).default(0)
  
});

export const ratingSchema = Joi.object({
  toUserId: Joi.string().required(),
  score: Joi.number().min(1).max(10).required(),
});
