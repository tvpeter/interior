const mongoose = require('mongoose');
const Joi = require('joi');

const contactSchema = new mongoose.Schema({
    address:  { type: String, minlength: 10, required:true},
    phone: {type: Array, maxlength: 16, minlength: 11, required: true, trim: true},
    email: { type: String, required: true, trim: true}
});

const Contact = mongoose.model('Contact', contactSchema);


// function validateContact (contact) {

// }