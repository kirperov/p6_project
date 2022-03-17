const expess = require('express');
const router = expess.Router();
const password = require('../middleware/password')
const userCtrl = require('../controllers/user');

router.post('/signup', password, userCtrl.signup);
router.post('/login', userCtrl.login);
module.exports = router;