const express = require('express');
const router = express.Router();

const surveyController = require('../controllers/survey');

// read: get the full list
router.get('/', surveyController.apiGetList);
// create: create a survey
router.post('/add', surveyController.apiAddSurvey);


// JUST FOR A TEST: MUST BE REMOVED BEFORE DEPLOYMENT
router.get('/test', surveyController.testAddSurvey);

module.exports = router;