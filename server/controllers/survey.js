const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Survey = require('../models/survey');

// api: display all survey list
module.exports.displaySurveyList = (req, res, next)=>{
    Survey.find((err, surveyList) =>{
        if(err) {
            return console.error(err);
        } else {
            res.json(surveyList);
        }
    });
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

// api: update the edited survey
module.exports.editSurvey = (req, res, next)=>{
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
module.exports.deleteSurvey = (req, res, next)=>{
    Survey.findByIdAndRemove(req.params.id, (err, deletedSurvey) => {
        if (err) {
            return console.log(err);
        } else {
            res.status(200).json({
                msg: deletedSurvey
            })
        }
    })
}