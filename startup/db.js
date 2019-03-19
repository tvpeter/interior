const mongoose = require('mongoose');

module.exports = function () {
mongoose.connect('mongodb://localhost/interior', {useNewUrlParser:true, useCreateIndex: true})
.then(()=>{console.log(`Connected to mongodb`)})
.catch(err => console.log(`Failed to connect to mongodb`));

}