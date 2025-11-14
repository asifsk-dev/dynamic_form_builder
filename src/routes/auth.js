const router = require('express').Router();
const { validate } = require('express-validation')

const { login, register } = require('../controllers/auth');
const { loginSchema, registerSchema } = require('../validations/auth');


router.post('/login', validate(loginSchema, { context: true }, { abortEarly: false, allowUnknown: false }), login);
router.post('/register', validate(registerSchema, { context: true }, { abortEarly: false, allowUnknown: false }), register);


module.exports = router;