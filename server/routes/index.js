var express = require('express');
var router = express.Router();

let indexController = require('../controllers/index');

/* GET home page. */
router.get('/', indexController.renderIndexPage);
router.post('/login', indexController.processLoginPage);
router.post('/register', indexController.processRegisterPage);
// router.get('/logout', indexController.performLogout);

module.exports = router;
