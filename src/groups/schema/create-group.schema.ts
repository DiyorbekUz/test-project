import * as Joi from 'joi';

export const createGroupSchema = Joi.object({
    name: Joi.string().required(),
    active: Joi.boolean(),
});