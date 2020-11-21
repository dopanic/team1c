const mongoose = require("mongoose");

const qusetionSchema = new mongoose.Schema({
    number: {
        type: Number
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    questionType: {
        type: String,
    },
    selections: [{
        title: {
            type: String
        }
    }],
    _surveyId: {
        type: String,
        required: true
    }
})

const Qusetion = mongoose.model('qusetion', qusetionSchema);

module.exports = Qusetion;