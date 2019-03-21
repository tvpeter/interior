const express = require('express');
const router = express.Router();

let pageDetails = {
    current : "About Us",
    title : "FMG Furniture | About Us",
    header : "About Us"
}


function aboutRouter(nav) {
return router.get('/', (req, res)=>{
    res.render('about', {
        nav,
        pageDetails
    });
});
}

module.exports = aboutRouter;