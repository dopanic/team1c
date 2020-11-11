const mongoose = require('mongoose');

const surveyModel = mongoose.Schema({
    question: String,
    answer: String
},
{
    collection: "survey"
});

const Survey= mongoose.model('survey', surveyModel);

// const surveySchema = new mongoose.Schema({

//     title: {
//         type: String,
//         required: true
//     },
//     questions: [{
//         question: [{
//             type: {
//                 typeCode: {
//                     type: Int16Array,
//                     required: true
//                 },
//                 typeName: {
//                     type: String
//                 }
//             },
//             questionBody: {
//                 type: String,
//                 required: true
//             },
//             answers: [{
//                 answer: [{
//                     num: {
//                         type: Int16Array,
//                         required: true
//                     },
//                     body: {
//                         type: String,
//                         required: true
//                     }
//                 }]
//             }],
//             selections: [{
//                 selection: {
//                     type: Int16Array,
//                     required: true
//                 }
//             }]
//         }]
//     }]
// })

// surveySchema.methods.getSurveyResult = async () => {

// }

// const Survey= mongoose.model('survey', surveySchema);

module.exports = Survey;
