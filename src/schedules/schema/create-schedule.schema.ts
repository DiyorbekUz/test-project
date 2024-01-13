import * as Joi from 'joi';

export const createScheduleSchema = Joi.object({
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    subject_id: Joi.number().required(),
    group_id: Joi.number().required(),
    teacher_id: Joi.number().required(),
    active: Joi.boolean(),
});