const multer= require('multer');
const path = require('path');

const upload = multer({
    dest: path.join(__dirname, '/public/images/')
});


module.exports = upload;