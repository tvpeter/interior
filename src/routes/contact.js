const express = require('express');
const router = express.Router();


function contactRouter(nav){
    return router.get('/', (req, res)=> {
        res.render('contact', {
            nav,
            current : "Contact",
            title : "FMG Furniture | Contact",
            header: "Contact Us"
        });
    });
}

module.exports = contactRouter;