exports.errorMessage = (param, min = null, max = null) => {
  return {
    // Common
    "any.required": `${param} is required.`,
    "any.only": `${param} must be one of the allowed values.`,
    "any.invalid": `${param} contains invalid value.`,
    "any.default": `${param} has an invalid default value.`,
    "any.unknown": `${param} is not allowed.`,
    "any.empty": `${param} cannot be empty.`,

    // String validations
    "string.base": `${param} must be a string.`,
    "string.empty": `${param} cannot be empty.`,
    "string.min": `${param} must be at least ${min} characters long.`,
    "string.max": `${param} must be at most ${max} characters long.`,
    "string.length": `${param} must be exactly ${min} characters long.`,
    "string.pattern.base": `${param} format is invalid.`,
    "string.email": `${param} must be a valid email address.`,
    "string.uri": `${param} must be a valid URL.`,

    // Number validations
    "number.base": `${param} must be a number.`,
    "number.min": `${param} must be greater than or equal to ${min}.`,
    "number.max": `${param} must be less than or equal to ${max}.`,

    // Boolean
    "boolean.base": `${param} must be a boolean value.`,

    // Object
    "object.base": `${param} must be an object.`,
  };
};
