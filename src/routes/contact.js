const express = require('express');
const router = express.Router();

let pageDetails = {
    current : "Contact",
    title : "FMG Furniture | Contact",
    header : "Contact Us"
}


function contactRouter(nav){
    return router.get('/', (req, res)=> {
        res.render('contact', {
            nav,
            pageDetails
        });
    });
}

module.exports = contactRouter;