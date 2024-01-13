import * as Joi from 'joi';

export const createGradeSchema = Joi.object().keys({
    grade: Joi.number().required().min(2).max(5),
    user_id: Joi.number().required(),
    subject_id: Joi.number().required(),
});