const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a user name'],
        unique: true

    },
    phoneNum:{
        type:String,
        required:[true,'Please enter a phone number']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter an valid email.']
    },
    password: {
        type: String,
        required: [true, 'Please enter an password.'],
        minlength: [6, 'Minium password length is 6.']
    },
    surveys:{
        type:Array,
        items:{
            type:String
        }
    }
})

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.TOKEN_SECRET, {
        expiresIn: '24h'
    });


    return token;
}

userSchema.statics.login = async function (email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User does not exist');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        return user;
    }
    throw new Error('Incorrect Password ');

}

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 8);

    next();
})

const User = mongoose.model('user', userSchema);

module.exports = User;