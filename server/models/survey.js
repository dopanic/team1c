const mongoose = require("mongoose");


const surveySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})

const Survey = mongoose.model('survey', surveySchema);

module.exports = Survey;