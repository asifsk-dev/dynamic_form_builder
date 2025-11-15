const { Joi } = require("express-validation");
const { errorMessage } = require("../utils/errorMessages");

exports.getAllSubmissionSchema = {
  params: Joi.object({
    formId: Joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/).required().messages(errorMessage("Form ID"))
  }),
  query: Joi.object({
    page: Joi.number().optional().messages(errorMessage("Page")),
    limit: Joi.number().optional().messages(errorMessage("Limit")),
    filter: Joi.object().pattern(
      Joi.string().trim().max(255),
      Joi.alternatives().try(
        Joi.string().trim().max(1000),
        Joi.number(),
        Joi.boolean()
      )
    ).optional().messages(errorMessage("Filter"))
  }).required().unknown(false).empty("")
};

exports.submitFormSchema = {
  params: Joi.object({
    formId: Joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/).required().messages(errorMessage("Form ID"))
  }),
  body: Joi.object({
    answers: Joi.array().items(
      Joi.object({
        fieldId: Joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/).required().messages(errorMessage("Field ID")),
        name: Joi.string().trim().max(255).required().messages(errorMessage("Field Name", null, 255)),
        value: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean(), Joi.array()).required().messages(errorMessage("Value")),
        parentFieldId: Joi.string().trim().allow(null, "").pattern(/^[0-9a-fA-F]{24}$/).messages(errorMessage("Parent Field ID")),
        parentOptionValue: Joi.string().trim().allow(null, "").messages(errorMessage("Parent Option Value"))
      })
    ).min(1).required().messages(errorMessage("Answers")),
    ip: Joi.string().trim().optional().messages(errorMessage("IP"))
  })
};

exports.exportSubmissionSchema = {
  params: Joi.object({
    formId: Joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/).required().messages(errorMessage("Form ID"))
  })
}
