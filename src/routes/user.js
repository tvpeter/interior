const express = require('express');
const router = express.Router();
const {User} = require('../models/user');

function userRouter (nav){
return router.get('/', (req, res)=>{
    res.render('register', {
        nav, 
        current: "Register",
        title: "Register User",
        header: "Register User"
    });
});
}

module.exports = userRouter;