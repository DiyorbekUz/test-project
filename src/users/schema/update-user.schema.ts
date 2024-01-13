import * as Joi from 'joi';

export const updateUserSchema = Joi.object({
    full_name: Joi.string(),
    username: Joi.string(),
    role: Joi.string().valid("student", "director", "teacher"),
    group_id: Joi.number(),
    activ: Joi.boolean(),
});
