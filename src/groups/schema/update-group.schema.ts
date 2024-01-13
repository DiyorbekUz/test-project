import * as Joi from 'joi';

export const updateGroupSchema = Joi.object({
    name: Joi.string().required(),
    active: Joi.boolean(),
});