const express = require('express');
const router = express.Router();

function servicesRouter(nav){
return router.get('/', (req, res)=> {
    res.render('services', {
        nav,
        current: "Services",
        title : "FMG Furniture | Services",
        header: "Our Services"
    });
});
}

module.exports = servicesRouter;