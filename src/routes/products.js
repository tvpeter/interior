const express = require('express');
const router = express.Router();

function productsRouter(nav){
    return router.get('/', (req, res)=> {
        res.render('products', {
            nav,
            current: "Products",
            title : "FMG Furniture | Products",
            header: "Our Products"
        });
    });
}

module.exports = productsRouter;