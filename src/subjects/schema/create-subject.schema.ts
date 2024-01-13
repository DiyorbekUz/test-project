import * as Joi from 'joi';

export const createSubjectSchema = Joi.object({
    name: Joi.string().min(3).required(),
    active: Joi.boolean().required(),
});