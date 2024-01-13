import * as Joi from 'joi';

export const updateGradeSchema = Joi.object({
    grade: Joi.number().min(2).max(5),
    user_id: Joi.number(),
    subject_id: Joi.number(),
});