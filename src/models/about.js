const mongoose = require('mongoose');
const Joi = require('joi');

const qualitySchema = new mongoose.Schema({
    title: { type: String, required:true, minlength:5, maxlength:60, trim: true },
    description: { type: String, required:true, minlength:100}
});

const Quality = mongoose.model('Quality', qualitySchema);

function validateQuality(quality){
    const schema = {
        title: Joi.string().min(5).max(60).trim().required(),
        description: Joi.string().min(100).required()
    }
    return Joi.validate(quality, schema);
}

exports.Quality = Quality;
exports.validate = validateQuality;
