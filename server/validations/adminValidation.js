// validation/adminValidation.js
const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().required(),
    brand: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().required(),
    countInStock: Joi.number().required(),
    description: Joi.string().required(),
});

module.exports = { productSchema };