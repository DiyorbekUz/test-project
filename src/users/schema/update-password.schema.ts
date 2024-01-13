import * as Joi from 'joi';

export const updatePasswordSchema = Joi.object({
    password: Joi.string().min(6).required(),
});
