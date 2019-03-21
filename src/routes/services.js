const express = require('express');
const router = express.Router();

let pageDetails = {
    current : "Services",
    title : "FMG Furniture | Services",
    header : "Our Services"
}

function servicesRouter(nav){
return router.get('/', (req, res)=> {
    res.render('services', {
        nav,
        pageDetails
    });
});
}

module.exports = servicesRouter;