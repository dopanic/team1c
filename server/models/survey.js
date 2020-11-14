const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    question1: {
        type: String,
        required: true
    },
    question2: {
        type: String
    },
    question3: {
        type: String
    }
},
{
    collection: "surveys"
});

module.exports = mongoose.model('survey', surveySchema);