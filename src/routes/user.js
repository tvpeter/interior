const express = require('express');
const router = express.Router();
const {User, validate} = require('../models/user');

function userRouter (nav){
const getUsers = router.get('/', (req, res)=>{
    res.render('register', {
        nav, 
        current: "Register",
        title: "Register User",
        header: "Register User",
        error: ""
    });
});

const postUsers = router.post('/', async (req, res)=>{
    //if request is not valid, return 400

    const { error } = validate(req.body);

    if(error) { 
    return res.render('register', {
        nav, 
        current: "Register",
        title: "Register User",
        header: "Register User",
        error : error.details[0].message
    });
    }
    //if user exist, return 400
    const userMail = await User.findOne({'email' :req.body.email});

    if(userMail) {
        return res.render('register', {
        nav, 
        current: "Register",
        title: "Register User",
        header: "Register User",
        error : "User already exist with given mail"
        });
    }

    const userPhone = await User.findOne({'phone':req.body.phone});

    if(userPhone) {
        return res.render('register', {
        nav, 
        current: "Register",
        title: "Register User",
        header: "Register User",
        error : "User already exist with given mail" 
        })
    }
    //create a new user

    const newUser = new User({
        name: req.body.name,
        email : req.body.email,
        phone : req.body.phone,
        password: req.body.password
    });
    
    const result = await newUser.save();

    res.redirect('/');
});

return [getUsers, postUsers];

}

module.exports = userRouter;