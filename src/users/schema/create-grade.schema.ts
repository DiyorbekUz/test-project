import * as Joi from 'joi';

export const createGradeSchema = Joi.object({
    grade: Joi.number().required(),
    subject_id: Joi.number().required(),
});
