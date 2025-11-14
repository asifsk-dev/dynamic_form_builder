const { Joi } = require('express-validation');
const { errorMessage } = require('../utils/errorMessages');

// Schema for user login
exports.loginSchema = {
  body: Joi.object({
    email: Joi.string().trim().email().required().messages(errorMessage('Email')),
    password: Joi.string().trim().min(6).required().messages(errorMessage('Password', 6)),
  }).required().unknown(false).empty('')
};

exports.registerSchema= {
  body: Joi.object({
    email: Joi.string().trim().email().required().messages(errorMessage('Email')),
    password: Joi.string().trim().min(6).required().messages(errorMessage('Password', 6)),
    role: Joi.string().trim().valid('user', 'admin').required().messages(errorMessage('Password')),
  }).required().unknown(false).empty('')
};