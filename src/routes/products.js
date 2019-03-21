const express = require('express');
const router = express.Router();

let pageDetails = {
    current : "Products",
    title : "FMG Furniture | Products",
    header : "Our Products"
}


function productsRouter(nav){
    return router.get('/', (req, res)=> {
        res.render('products', {
            nav,
            pageDetails
        });
    });
}

module.exports = productsRouter;