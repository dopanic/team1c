const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const { Survey, Question, User } = require('../models/index');


// Display a survey list under of user
module.exports.displayOneSurveyList = async (req, res, next) => {
    try {
        const surveys = await Survey.find({
            _userId: req.user_id
        });
        res.status(200).send(surveys);
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
}

// Create new survey
module.exports.createSurvey = async (req, res, next) => {
    //Create a new survey and return the new survey back to the user
    try {
        const title = await req.body.title;
        const newsurvey = await new Survey({
            title,
            _userId: req.user_id
        });
        await newsurvey.save();
        res.status(200).send(newsurvey);
    } catch (e) {
        res.status(500).send(e);
    }
}


// Update survey
module.exports.updateSurvey = async (req, res, next) => {
    try {
        const survey = await Survey.findOneAndUpdate({
            _id: req.params.id, _userId: req.user_id
        }, {
            $set: req.body
        });
        res.status(200).send({ 'message': 'Updated' });
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
}

// api: delete a survey
module.exports.deleteSurvey = async (req, res, next) => {
    try {
        //Delete a survey
        console.log(req.params.id);
        const survey = await Survey.findByIdAndRemove({
            _id: req.params.id,
            _userId: req.user_id
        });

        //Delete questions under this survey
        deleteQuestionsFromSurvey(req.params.id);

        res.status(200).send({ 'message': 'Deleted' });
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}


/**Questions controllers */

/**
 * Get all questonss in a survey
 **/
module.exports.displayQuestions = async (req, res) => {
    try {
        const questions = await Question.find({
            _surveyId: req.params.surveyId
        });
        res.status(200).send(questions);
    } catch (e) {
        res.status(500);
    }

}

/**
 * Get one questonss in a survey
 **/

module.exports.displayOneQuestion = async (req, res) => {
    const question = await Question.findOne({
        _id: req.params.questionId,
        _surveyId: req.params.surveyId
    });
    if (!question) {
        res.status(404).send("The question does not exist.");
    } else {
        res.status(200).send(question);
    }

}


/**
 * create a new question in a specific survey
 **/
module.exports.createQuestion = async (req, res) => {
    try {
        const survey = await Survey.findOne({
            _id: req.params.surveyId,
            _userId: req.user_id
        });
        if (!survey) {
            res.staus(404).send("survey not found.");
        }
        const newQuestion = await new Question({
            number: req.body.number,
            title: req.body.title,
            questionType: req.body.questionType,
            selections: req.body.selections,
            _surveyId: req.params.surveyId
        });
        await newQuestion.save();
        res.status(200).send(newQuestion);
    } catch (e) {
        res.status(500);
    }
}


/**
 * update question in a specifc survey
 **/

module.exports.updateQuestion = async (req, res) => {
    try {
        //Find the survey
        const survey = await Survey.findOne({
            _id: req.params.surveyId,
            _userId: req.user_id
        })
        if (!survey) {
            res.status(404).send("Can find the survey.");
        }
        //Find the question
        const question = await Question.findOneAndUpdate({
            _id: req.params.questionId,
            _surveyId: req.params.surveyId
        }, {
            $set: req.body
        });
        if (!question) {
            res.status(404).send("Can not update question not existing.");
        } else {
            res.status(200).send(question);
        }
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
}


/**
 * Purpose: Delete a question
 */
module.exports.deleteQuestion = async (req, res) => {
    try {
        const survey = await Survey.findOne({
            _id: req.params.surveyId,
            _userId: req.user_id
        })
        if (!survey) {
            res.status(404);
        }

        const question = await Question.findByIdAndRemove({
            _id: req.params.questionId,
            _surveyId: req.params.surveyId
        });
        if (!question) {
            res.status(404).send("Can not delete question not existing.");
        } else {
            res.status(200).send({ "message": "Question deleted" });
        }
    } catch (e) {
        res.status(500).send(e);
    }
}


/**Survey taker related controllers */

//Display all surveys to the survey taker
module.exports.displayAllSurveyList = async (req, res, next) => {
    try {
        const surveys = await Survey.find({});
        res.status(200).send(surveys);

    } catch (e) {
        res.status(500).send(e);
    }
}


// Display one survey with questions to the survey takers
module.exports.displaySurvey = async (req, res, next) => {
    try {
        const survey = Survey.findById(req.params.surveyId);
        const questions = Question.find({ _surveyId: req.params.surveyId });
        survey = survey.merge(questions);
        res.status(200).send(survey);
    } catch (e) {
        res.status(500).send(e);
    }
}

/**User controllers */


module.exports.login = async (req, res, next) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        console.log(user);
        const accessToken = await user.generateAuthToken();

        res
            .header('x-access-token', accessToken)
            .status(200).send(user);
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}

module.exports.signup = async (req, res, next) => {
    const newUser = User(req.body);
    try {
        const accessToken = await newUser.generateAuthToken();
        // return { accessToken, refreshToken };
        await newUser.save();
        res
            .header('x-access-token', accessToken)
            .status(200).send(newUser);

    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
}
module.exports.signout = (req, res, next) => {
    res.json({success: true, msg: 'User Successfully Logged out!'});
}

/**Helpers*/

/** 
 * Delete questions in a specific survey
*/
const deleteQuestionsFromSurvey = (_surveyId) => {
    Question.deleteMany({
        _surveyId
    }).then(() => {
        console.log(`Tasks from ${_surveyId} were deleted.`);
    });
}