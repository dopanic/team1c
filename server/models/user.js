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
        unique: true
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

//Check if user exists in the db
UserSchema.methods.checkUserExist = async function () {
    user = this;
    ExistedUser = await User.findOne({ email: this.email });
    if (ExistedUser) {
        throw new Error("User exsits in the system.");
    }
}


/**static methods */

/**
 * find user by email and password
 */
UserSchema.statics.findByCredentials = async function (email, password) {

    user = await User.findOne({ email });
    if (!user) {
        throw new Error("Uable to login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Uable to login");
    } else {
        return user;
    }

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