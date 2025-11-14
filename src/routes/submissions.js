const router = require('express').Router();
const { validate } = require('express-validation');

const authMiddleWare = require('../middleware/authentication');
const { submitForm, getFormSubmissions } = require('../controllers/submissions');
const { submitFormSchema } = require('../validations/submission');

router.post('/:formId', authMiddleWare([]), validate(submitFormSchema, { context: true }, { abortEarly: false, allowUnknown: false }), submitForm);
router.get('/:formId', authMiddleWare(['admin']), getFormSubmissions);

module.exports = router;