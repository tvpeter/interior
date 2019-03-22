const mongoose = require('mongoose');
const Joi = require('joi');

const contactSchema = new mongoose.Schema({
    address:  { type: String, minlength: 10, required:true},
    phone: {type: Array, maxlength: 15, minlength: 11, required: true, trim: true},
    email: { type: String, required: true, trim: true}
});

const Contact = mongoose.model('Contact', contactSchema);


function validateContact (contact) {

    const schema = {
        address: Joi.string().min(10).required(),
        phone: Joi.number().min(11).max(15).required(),
        email: Joi.string().email({minDomainAtoms: 2}).required()
    }
    return Joi.validate(contact, schema);
}

exports.Contact = Contact;
exports.validate = validateContact;