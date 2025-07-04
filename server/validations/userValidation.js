const Joi = require('joi');

// Register Validation Schema
const registerSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please include a valid email',
        'string.empty': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be 6 or more characters',
        'string.empty': 'Password is required',
    }),
    phone: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .required()
        .messages({
            'string.pattern.base': 'Please enter a valid Indian phone number',
            'string.empty': 'Phone is required',
        }),
});

// Login Validation Schema
const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please include a valid email',
        'string.empty': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
    }),
});

module.exports = {
    registerSchema,
    loginSchema,
};