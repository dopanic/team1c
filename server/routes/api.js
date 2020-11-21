const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authenticate = require('../middleware/authMiddleware');

// survey apis
const surveyController = require('../controllers/survey');

/**Survey making routes*/

// api: display a list of surveys of a user
router.get('/survey/list', authenticate, surveyController.displayOneSurveyList);

// api: add new survey
router.post('/survey/add', authenticate, surveyController.createSurvey);

// api: update a survey
router.patch('/survey/edit/:id', authenticate, surveyController.updateSurvey);

// api: delete a survey
router.delete('/survey/del/:id', authenticate, surveyController.deleteSurvey);

//Display a question in a specific survey
router.get('/survey/:surveyId/questions/:questionId', authenticate, surveyController.displayOneQuestion);

//Display all questions in a specific survey
router.get('/survey/:surveyId/questions', authenticate, surveyController.displayQuestions);

//Create a question
router.post('/survey/:surveyId/questions', authenticate, surveyController.createQuestion);

//Update a question
router.patch('/survey/:surveyId/questions/:questionId', authenticate, surveyController.updateQuestion);

//Delete a question
router.delete('/survey/:surveyId/questions/:questionId', authenticate, surveyController.deleteQuestion);


/**User routes */

//Login
router.post('/users/login', surveyController.login);

//Signup
router.post('/users/signup', surveyController.signup);


/**Survey taking routes */

router.get('/survey/taking/lists', surveyController.displayAllSurveyList);


module.exports = router;