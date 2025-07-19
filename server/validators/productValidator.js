const Joi = require('joi');

// Reusable Joi schema for colors and features
const colorSchema = Joi.object({
    name: Joi.string().required(),
    hexCode: Joi.string().pattern(/^#([0-9A-F]{3}){1,2}$/i).required(),
    inStock: Joi.boolean().default(true)
});

const productValidator = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    images: Joi.array().items(Joi.string().uri()).min(1).required(),
    description: Joi.string().min(10).required(),
    phoneModel: Joi.string().required(),
    brand: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().min(0).required(),
    discountPrice: Joi.number().min(0).optional(),
    gstRate: Joi.number().min(0).max(100).required(),
    countInStock: Joi.number().min(0).required(),
    colors: Joi.array().items(colorSchema).optional(),
    material: Joi.string().optional(),
    features: Joi.array().items(Joi.string()).optional(),
    isFeatured: Joi.boolean().optional()
});

module.exports = { productValidator };
        