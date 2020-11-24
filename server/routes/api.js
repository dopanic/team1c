const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// survey apis
const surveyController = require('../controllers/survey');
const responseController = require('../controllers/response');

// survey apis

// api: display all survey list
router.get('/survey/list', surveyController.displaySurveyList);

// api: add new survey
router.post('/survey/add', surveyController.createSurvey);

// api: display one survey
router.get('/survey/view/:id', surveyController.viewSurvey);

// api: update the edited survey
router.post('/survey/edit/:id', surveyController.editSurvey);

// api: delete a survey
router.get('/survey/del/:id', surveyController.deleteSurvey);

// response apis

// DEV ONLY!!!!!!! - api: display all responses
router.get('/response/all', responseController.displayAllResponse);

// api: display all responses of the specific survey
router.get('/response/list/:id', responseController.displayResponseList);

// api: add new response
router.post('/response/add', responseController.createResponse);

// api: display one response
router.get('/response/view/:sid/:rid', responseController.viewResponse);

// api: delete a response
router.get('/response/del/:id', responseController.deleteResponse);



module.exports = router;