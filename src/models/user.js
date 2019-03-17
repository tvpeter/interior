const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    phone: {type: String, required: true},
    password:{type: String, required: true}
});

const User = mongoose.model('User', userSchema);

function validateUser(user){
    const schema = {
        name: Joi.string().min(4).max(45).required(),
        email:Joi.string().email({minDomainAtoms:2}).required(),
        phone:Joi.string().min(11).max(14).required(),
        password:Joi.string().min(5).max(26).required()
    }
}

exports.User = User;
exports.validate = validateUser;
