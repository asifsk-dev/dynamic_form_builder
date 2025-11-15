const router = require('express').Router();
const { validate } = require('express-validation');

const authMiddleWare = require('../middleware/authentication');
const { submitForm, getFormSubmissions, exportSubmissions } = require('../controllers/submissions');
const { submitFormSchema, getAllSubmissionSchema, exportSubmissionSchema } = require('../validations/submission');

router.post('/:formId', authMiddleWare([]), validate(submitFormSchema, { context: true }, { abortEarly: false, allowUnknown: false }), submitForm);
router.get('/:formId', authMiddleWare(['admin']), validate(getAllSubmissionSchema, { context: true }, { abortEarly: false, allowUnknown: false }), getFormSubmissions);
router.get('/:formId/export', authMiddleWare(['admin']), validate(exportSubmissionSchema, { context: true }, { abortEarly: false, allowUnknown: false }), exportSubmissions);

module.exports = router;