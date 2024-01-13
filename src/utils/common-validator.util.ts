import * as Joi from 'joi';

const integer = Joi.number().integer().min(1)
const array = Joi.array()

export const path = array.items(integer)