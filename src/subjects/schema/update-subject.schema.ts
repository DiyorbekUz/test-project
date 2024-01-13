import * as Joi from 'joi';

export const updateSubjectSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    active: Joi.boolean(),
});