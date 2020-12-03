const mongoose = require("mongoose");


const surveySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    questionsArr: {
        type: Array,
        required: true
    }
},
{
    collection: "surveys3"
});

const Survey = mongoose.model('survey', surveySchema);

module.exports = Survey;