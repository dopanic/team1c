const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Response = require('../models/response');

// DEV ONLY!!!!!!! - api: display all responses
module.exports.displayAllResponse = (req, res, next)=>{
    Response.find((err, data) =>{
        if(err) {
            return console.error(err);
        } else {
            res.json(data);
        }
    });
}

// api: return the count for responses of a specific survey
module.exports.displayResponseList = (req, res, next)=>{
    Response.find({ surveyId: req.params.id}, (err, data) => {
        if(err) {
            return console.error(err);
        } else {
            res.json(data);
        }
    })
}

// api: add new response
module.exports.createResponse = (req, res, next)=>{
    Response.create(req.body, (err, data) =>{
        if(err) {
            return console.error(err);
        } else {
            res.json(data);
        }
    });
}

// api: display one response
module.exports.viewResponse = (req, res, next)=>{
    Response.findById(req.params.id, (err, data) => {
        if(err) {
            return console.error(err);
        } else {
            res.json(data);
        }
    })
}

// api: delete a response
module.exports.deleteResponse = (req, res, next)=>{
    Response.findByIdAndUpdate(req.params.id,{
        $set: req.body
    }, (err, data) => {
        if (err) {
            return console.log(err);
        } else {
            res.json(data);
            console.log('The edited survey updated successfully');
        }
    })
}

// api: delete a survey
module.exports.deleteSurvey = (req, res, next)=>{
    Response.findByIdAndRemove(req.params.id, (err, data) => {
        if (err) {
            return console.log(err);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
}