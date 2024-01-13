import * as Joi from 'joi';

export const createUserSchema = Joi.object({
  username: Joi.string().required().min(3),
  full_name: Joi.string().required(),
  password: Joi.string().min(6).required(),
  group_id: Joi.number().required(),
  role: Joi.string().valid("student", "director", "teacher").required(),
});
