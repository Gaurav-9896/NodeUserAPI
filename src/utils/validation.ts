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
});

export const ratingSchema = Joi.object({
  toUserId: Joi.string().required(),
  score: Joi.number().integer().min(1).max(10).required(),
});
