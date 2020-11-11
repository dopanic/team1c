const express = require('express');
const router = express.Router();
let mongoose = require('mongoose');

// Survey model
const Survey = require('../models/survey');

// api: read to get a full list
module.exports.apiGetList = (req, res, next) => {
  Survey.find((error, surveyList) => {
      if (error) {
        return next(error)
      } else {
        res.json(surveyList)
      }
    })
}

// api: create to add a new survey
module.exports.apiAddSurvey = (req, res, next) => {
  Survey.create(req.body, (error, newSurvey) => {
    if (error) {
      return next(error)
    } else {
      res.json(newSurvey)
    }
  })
}

// JUST FOR A TEST: MUST BE REMOVED BEFORE DEPLOYMENT
module.exports.testAddSurvey = (req, res, next) => {
  let newSurvey = Survey({
      "question": "Test.Q1",
      "answer": "Test.A1"
  });

  Survey.create(newSurvey, (err, Survey) => {
      if(err)
      {
          console.log(err);
          res.end(err);
      }
      else
      {
          // refresh the list
          console.log('DONE');
          res.redirect('/survey');
      }
  });
}