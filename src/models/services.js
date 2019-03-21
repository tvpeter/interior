const mongoose = require('mongoose');
const Joi = require('joi');

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, minlength: 6, maxlength: 35, unique: true },
    description: { type: String, required:true, minlength: 100}
});

const Service = mongoose.model('Service', serviceSchema);

function validateService(service){
    const schema = {
        title: Joi.string().min(6).max(35).required(),
        description: Joi.string().min(100).required()
    }
    return Joi.validate(service, schema);
}

exports.Service = Service;
exports.validate = validateService;