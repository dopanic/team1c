const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const passport = require('passport');

//Load in mongoose models
const { Survey, Question, User } = require('./models/index');

//Link to mongeDB
require('./db/mongoose');

//Load middleware
app.use(bodyParser.json());
const authenticate = require('./middleware/authMiddleware');
const { serializeUser, use } = require('passport');

//cors handler
app.use(function (req, res, next) {
    //Enabling CORS

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization, x-access-token, x-refresh-token, _id");
    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );
    res.header(
        "Access-Control-Allow-Credentials", "true"
    );
    next();
});

/** Routes */

/**
 * GET/survey
 s
 * Purpose: Get all survey
 s
 */
app.get('/surveys', authenticate, async (req, res) => {
    //Return an array of all the surveys in the db.
    try {
        const surveys = await Survey.find({
            _userId: req.user_id
        });
        res.status(200).send(surveys);
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }


})

/**
 * POST/survey
 s
 * Purpose:Create a survey
 */
app.post('/surveys', authenticate, async (req, res) => {
    //Create a new survey and return the new survey back to the user
    try {
        const title = await req.body.title;
        const newsurvey = await new Survey({
            title,
            _userId: req.user_id
        });
        await newsurvey.save();
        res.status(200).send(newsurvey);
    } catch (e) {
        res.status(500).send(e);
    }
})

/**
 * PATCH/surveys/:id
 * Purpose: Update a specific survey
 */
app.patch('/surveys/:id', authenticate, async (req, res) => {
    //Update a specific survey
    try {
        const survey = await Survey.findOneAndUpdate({
            _id: req.params.id, _userId: req.user_id
        }, {
            $set: req.body
        });
        res.status(200).send({ 'message': 'Updated' });
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
})

/**
 * DELETE/surveys/:id
 * Purpose: Delete a survey
 */
app.delete('/surveys/:id', authenticate, async (req, res) => {
    try {
        //Delete a survey
        console.log(req.params.id);
        const survey = await Survey.findByIdAndRemove({
            _id: req.params.id,
            _userId: req.user_id
        });

        //Delete questions under this survey
        deleteQuestionsFromSurvey(req.params.id);

        res.status(200).send({ 'message': 'Deleted' });
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
})

/**End of survey routes */


/**user routes */

/**
 * Get all questonss in a survey
 **/
app.get('/surveys/:surveyId/questions', authenticate, async (req, res) => {
    try {
        const questions = await Question.find({
            _surveyId: req.params.surveyId
        });
        res.status(200).send(questions);
    } catch (e) {
        res.status(500);
    }

})

/**
 * Get one questonss in a survey
 **/

app.get('/surveys/:surveId/questions/:questionId', async (req, res) => {
    const question = await Question.findOne({
        _id: req.params.questionId,
        _surveyId: req.params.surveyId
    });
    if (!question) {
        res.status(404).send("The question does not exist.");
    } else {
        res.status(200).send(question);
    }

})

/**
 * create a new question in a specific survey
 **/
app.post('/surveys/:surveyId/questions', authenticate, async (req, res) => {
    try {
        const survey = await Survey.findOne({
            _id: req.params.surveyId,
            _userId: req.user_id
        });
        if (!survey) {
            res.staus(404);
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
        res.status(500);
    }

})

/**
 * update task in a specifc survey
 **/

app.patch('/surveys/:surveyId/questions/:questionId', authenticate, async (req, res) => {
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
})

/**
 * Purpose: Delete a question
 */
app.delete('/surveys/:surveyId/questions/:questionId', authenticate, async (req, res) => {
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
        res.status(500).send(e);
    }
})

/**End of question routes */


/**User routes */

/**
 * Purpose: Sign up
 */

app.post('/users/signup', async (req, res) => {
    const newUser = User(req.body);
    try {
        const accessToken = await newUser.generateAuthToken();
        // return { accessToken, refreshToken };
        await newUser.save();
        res
            .header('x-access-token', accessToken)
            .status(200).send(newUser);

    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
})

/**
 * Purpose: Login
 */

app.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const accessToken = await user.generateAuthToken();
        res
            .header('x-access-token', accessToken)
            .status(200).send(user);

    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }

})

/**End of user routes */


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


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running`);
})