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
        res.status(200).json(surveys);
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
}

// api: add new survey
module.exports.createSurvey = (req, res, next)=>{
    Survey.create(req.body, (err, newSurvey) =>{
        if(err) {
            return console.error(err);
        } else {
            res.json(newSurvey);
        }
    });
}


// Update survey
module.exports.updateSurvey = (req, res, next)=>{
    Survey.findByIdAndUpdate(req.params.id,{
        $set: req.body
    }, (err, editedSurvey) => {
        if (err) {
            return console.log(err);
        } else {
            res.json(editedSurvey);
            console.log('The edited survey updated successfully');
        }
    })
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

        res.status(200).json({
            msg: survey
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

// api: display one survey
module.exports.viewSurvey = (req, res, next)=>{
    Survey.findById(req.params.id, (err, targetSurvey) => {
        if(err) {
            return console.error(err);
        } else {
            res.json(targetSurvey);
        }
    })
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
        console.log(e);
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
        console.log(e);
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
        console.log(e);
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
        console.log(e);
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
        console.log(e);
        res.status(500).send(e);
    }
}

/**User controllers */


module.exports.login = async (req, res, next) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const accessToken = await user.generateAuthToken();
        return res.json({
            success: true, msg: 'User Logged in Successfully!', user: {
                id: user._id,
                name: user.name,
                email: user.email
            }, token: accessToken
        });

    }
    catch (e) {
        console.log(e);
        return res.json({ success: false })
    }
}

module.exports.signup = async (req, res, next) => {
    const user = await User(req.body);
    try {
        await user.checkUserExist();

        const accessToken = await user.generateAuthToken();
        await user.save();

        return res.json({
            success: true, msg: 'User created Successfully!', user: {
                id: user._id,
                name: user.name,
                email: user.email
            }, token: accessToken
        });

    } catch (e) {

        return res.json({ success: false })
    }
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
