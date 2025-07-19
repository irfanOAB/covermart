// validation/orderValidation.js
const Joi = require('joi');

const calculateTaxSchema = Joi.object({
    items: Joi.array()
        .items(
            Joi.object({
                price: Joi.number().required(),
                quantity: Joi.number().required(),
            })
        )
        .required()
        .messages({
            'array.base': 'Items should be an array of objects with price and quantity',
        }),
    state: Joi.string().required().messages({
        'string.empty': 'State is required to calculate tax',
    }),
});

const createOrderSchema = Joi.object({
    orderItems: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        qty: Joi.number().required(),
        image: Joi.string().required(),
        price: Joi.number().required(),
        product: Joi.string().required()
    })).required(),

    shippingAddress: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pincode: Joi.string().required()
    }).required(),

    paymentMethod: Joi.string().required(),
    itemsPrice: Joi.number().required(),
    taxPrice: Joi.number().required(),
    shippingPrice: Joi.number().required(),
    totalPrice: Joi.number().required(),
});

module.exports = {
    calculateTaxSchema,
    createOrderSchema,
};