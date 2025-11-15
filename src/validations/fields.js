const { Joi } = require('express-validation');
const { errorMessage } = require('../utils/errorMessages');

exports.fieldSchema = {
  params: Joi.object({
    id: Joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/).required().messages(errorMessage('Id'))
  }),
  body: Joi.array().items(
    Joi.object({
      label: Joi.string().trim().max(255).required().messages(errorMessage("Label", null, 255)),
      name: Joi.string().trim().max(255).required().messages(errorMessage("Name", null, 255)),
      type: Joi.string().valid("text", "textarea", "number", "email", "date", "checkbox", "radio", "select").required().messages(errorMessage("Type")),
      required: Joi.boolean().default(false).messages(errorMessage("Required")),
      options: Joi.alternatives().conditional("type", {
        is: Joi.valid("radio", "select"),
        then: Joi.array().items(Joi.string().trim().max(255)).min(1).required().messages(errorMessage("Options")),
        otherwise: Joi.array().items(Joi.string().trim().max(255)).default([]).messages(errorMessage("Options"))
      }),
      validation: Joi.object({
        min: Joi.number().optional().messages(errorMessage("Min")),
        max: Joi.number().optional().messages(errorMessage("Max")),
        regex: Joi.string().trim().optional().messages(errorMessage("Regex"))
      }).optional().messages(errorMessage("Validation")),
      parentFieldId: Joi.string().trim().allow(null, "").messages(errorMessage("Parent Field ID")),
      parentOptionValue: Joi.string().trim().allow(null, "").messages(errorMessage("Parent Option Value"))
    })
  )
};

exports.updateFieldSchema = {
  params: Joi.object({
    id: Joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/).required().messages(errorMessage('Id')),
    fieldId: Joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/).required().messages(errorMessage('Field Id'))
  }),

  body: Joi.object({
    label: Joi.string().trim().max(255).optional().messages(errorMessage("Label", null, 255)),
    name: Joi.string().trim().max(255).optional().messages(errorMessage("Name", null, 255)),
    type: Joi.string().valid("text", "textarea", "number", "email", "date", "checkbox", "radio", "select").optional().messages(errorMessage("Type")),
    required: Joi.boolean().optional().messages(errorMessage("Required")),
    options: Joi.alternatives().conditional("type", {
      is: Joi.valid("radio", "select"),
      then: Joi.array().items(Joi.string().trim().max(255)).min(1).required().messages(errorMessage("Options")),
      otherwise: Joi.array().items(Joi.string().trim().max(255)).optional().messages(errorMessage("Options"))
    }),
    validation: Joi.object({
      min: Joi.number().optional().messages(errorMessage("Min")),
      max: Joi.number().optional().messages(errorMessage("Max")),
      regex: Joi.string().trim().optional().messages(errorMessage("Regex"))
    }).optional().messages(errorMessage("Validation")),
    order: Joi.number().optional().messages(errorMessage("Order")),
    parentFieldId: Joi.string().trim().allow(null, "").optional().messages(errorMessage("Parent Field ID")),
    parentOptionValue: Joi.string().trim().allow(null, "").optional().messages(errorMessage("Parent Option Value"))
  })
};

exports.deleteFieldSchema = {
  params: Joi.object({
    id: Joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/).required().messages(errorMessage('Id')),
    fieldId: Joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/).required().messages(errorMessage('Field Id'))
  })
};

exports.reorderFieldsSchema = {
  params: Joi.object({
    id: Joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/).required().messages(errorMessage('Id')),
  }),

  body: Joi.object({
    order: Joi.array()
      .items(Joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/))
      .min(1)
      .required()
      .messages(errorMessage("Order"))
  })
};