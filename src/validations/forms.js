const { Joi } = require('express-validation');
const { errorMessage } = require('../utils/errorMessages');

exports.formSchema = {
  body: Joi.object({
    title: Joi.string().trim().max(255).required().messages(errorMessage('Title', null, 255)),
    description: Joi.string().trim().max(255).required().messages(errorMessage('Description', null, 255)),
  }).required().unknown(false).empty('')
};

exports.getByIdSchema = {
  params: Joi.object({
    id: Joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/).required().messages(errorMessage('Id'))
  }).required().unknown(false).empty('')
};

exports.updateFormSchema = {
  params: Joi.object({
    id: Joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/).required().messages(errorMessage('Id'))
  }).required().unknown(false).empty(''),
  body: Joi.object({
    title: Joi.string().trim().max(255).optional().messages(errorMessage('Title', null, 255)),
    description: Joi.string().trim().max(255).optional().messages(errorMessage('Description', null, 255)),
  }).required().unknown(false).empty('')
};