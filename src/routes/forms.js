const router = require('express').Router();
const { validate } = require('express-validation');

const authMiddleWare = require('../middleware/authentication');
const { getAllForms, createForm, getById, updateForm, deleteForm } = require('../controllers/forms');
const { formSchema, getByIdSchema, updateFormSchema } = require('../validations/forms');

// Field Management
const { addField, updateField, removeField, reorderFields } = require('../controllers/fields');
const { fieldSchema, updateFieldSchema, deleteFieldSchema, reorderFieldsSchema } = require('../validations/fields');


router.get('/', authMiddleWare(['admin', 'user']), getAllForms);
router.get('/:id', authMiddleWare(['admin', 'user']), validate(getByIdSchema, { context: true }, { abortEarly: false, allowUnknown: false }), getById);
router.post('/', authMiddleWare(['admin']), validate(formSchema, { context: true }, { abortEarly: false, allowUnknown: false }), createForm);
router.put('/:id', authMiddleWare(['admin']), validate(updateFormSchema, { context: true }, { abortEarly: false, allowUnknown: false }), updateForm);
router.delete('/:id', authMiddleWare(['admin']), validate(getByIdSchema, { context: true }, { abortEarly: false, allowUnknown: false }), deleteForm);

// Field Management
router.post('/:id/fields', authMiddleWare(['admin']), validate(fieldSchema, { context: true }, { abortEarly: false, allowUnknown: false }), addField);
router.put('/:id/fields/reorder', authMiddleWare(['admin']), validate(reorderFieldsSchema, { context: true }, { abortEarly: false, allowUnknown: false }), reorderFields);
router.put('/:id/fields/:fieldId', authMiddleWare(['admin']), validate(updateFieldSchema, { context: true }, { abortEarly: false, allowUnknown: false }), updateField);
router.delete('/:id/fields/:fieldId', authMiddleWare(['admin']), validate(deleteFieldSchema, { context: true }, { abortEarly: false, allowUnknown: false }), removeField);

module.exports = router;