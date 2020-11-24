const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    surveyId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    answersArr: {
        type: Array,
        required: true
    }
},
{
    collection: "response2"
});

module.exports = mongoose.model('response', responseSchema);