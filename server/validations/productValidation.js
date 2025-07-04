// validation/productValidation.js
const Joi = require('joi');

const reviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required().messages({
        'number.base': 'Rating must be a number',
        'number.min': 'Rating must be at least 1',
        'number.max': 'Rating cannot exceed 5',
    }),
    comment: Joi.string().required().messages({
        'string.empty': 'Comment is required',
    }),
});

module.exports = { reviewSchema };