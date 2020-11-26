const jwt = require('jsonwebtoken');

require('dotenv').config();

const authenticate = (req, res, next) => {
    const token = req.header('x-access-token');

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            //jwt is invalid
            res.status(401).send(err);
        } else {
            req.user_id = decoded._id;
            next();
        }
    })
}

module.exports = authenticate;