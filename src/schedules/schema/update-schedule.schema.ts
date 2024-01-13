import * as Joi from 'joi';

export const updateScheduleSchema = Joi.object({
    start_date: Joi.date(),
    end_date: Joi.date(),
    subject_id: Joi.number(),
    group_id: Joi.number(),
    teacher_id: Joi.number(),
    active: Joi.boolean(),
});