const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { nextTick } = require('process');
const { resolve } = require('path');

require('dotenv').config();

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true

    },
    name: {
        type: String
    },
    number: {
        type: String
    }
});

UserSchema.methods.generateAuthToken = function () {
    const user = this;
    return new Promise((resolve, reject) => {
        //Create jwt and return it
        jwt.sign({ _id: user._id.toHexString() }, process.env.TOKEN_SECRET, { expiresIn: '100d' }, (err, token) => {
            if (!err) {
                resolve(token);
            } else {
                reject();
            }
        });
    })
}


/**static methods */

/**
 * find user by email and password
 */
UserSchema.statics.findByCredentials = function (email, password) {
    const User = this;
    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject;
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            })
        })
    })
}


/**middlewares */

/**
 * Hash and salt the password before save.
 * This function will only apply when password first initialized or just changed.
 */
UserSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(8, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})

const User = mongoose.model('user', UserSchema);

module.exports = User;