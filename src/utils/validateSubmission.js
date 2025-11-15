function validateSubmission(fields, answers) {
  const errors = {};

  const fieldsMap = {};
  fields.forEach(f => {
    fieldsMap[f._id.toString()] = f;
  });

  const answersMap = {};
  answers.forEach(a => {
    answersMap[a.name] = a.value;
  });

  for (const field of fields) {
    const { name, type, required, validation, parentFieldId, parentOptionValue, label, options } = field;
    const value = answersMap[name];

    if (parentFieldId) {
      const parentField = fieldsMap[parentFieldId];
      if (parentField) {
        const parentValue = answersMap[parentField.name];
        if (parentValue !== parentOptionValue) {
          continue;
        }
      }
    }

    if (required) {
      if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
        errors[name] = `${label} is required`;
        continue;
      }
    }

    if (value === undefined || value === null || value === "") continue;

    switch (type) {
      case "number":
        if (isNaN(value)) errors[name] = `${label} must be a number`;
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) errors[name] = `${label} must be a valid email`;
        break;

      case "date":
        if (isNaN(Date.parse(value))) errors[name] = `${label} must be a valid date`;
        break;

      case "checkbox":
        if (!Array.isArray(value)) errors[name] = `${label} must be an array`;
        else if (!value.every(v => options.includes(v))) errors[name] = `${label} contains invalid option(s)`;
        break;

      case "radio":
      case "select":
        if (!options.includes(value)) errors[name] = `${label} contains invalid option`;
        break;

      default:
        break;
    }

    if (validation) {
      if (validation.min !== undefined) {
        if (type === "number" && Number(value) < validation.min) errors[name] = `${label} must be >= ${validation.min}`;
        if ((type === "text" || type === "textarea") && value.length < validation.min) errors[name] = `${label} length must be >= ${validation.min}`;
      }

      if (validation.max !== undefined) {
        if (type === "number" && Number(value) > validation.max) errors[name] = `${label} must be <= ${validation.max}`;
        if ((type === "text" || type === "textarea") && value.length > validation.max) errors[name] = `${label} length must be <= ${validation.max}`;
      }

      if (validation.regex) {
        const regex = new RegExp(validation.regex);
        if (!regex.test(value)) errors[name] = `${label} is invalid format`;
      }
    }
  }

  return errors;
}

module.exports = validateSubmission;
