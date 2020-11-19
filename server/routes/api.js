const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// survey apis
const surveyController = require('../controllers/survey');

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

module.exports = router;