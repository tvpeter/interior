const express = require('express');
const router = express.Router();

function aboutRouter(nav) {
return router.get('/', (req, res)=>{
    res.render('about', {
        nav,
        current: "About Us",
        title: "FMG Furniture | About Us",
        header: "About Us"
    });
});
}

module.exports = aboutRouter;