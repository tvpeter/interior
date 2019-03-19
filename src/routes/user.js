const express = require('express');
const router = express.Router();
const {User, validate} = require('../models/user');

let pageDetails = {
        current: "Register",
        title: "Register User",
        header: "Register User",
        error: ""
}

function userRouter (nav){
const getUsers = router.get('/', (req, res)=>{
    res.render('register', {
        nav, 
        pageDetails
    });
});

const postUsers = router.post('/', async (req, res)=>{
    //if request is not valid, return 400

    const { error } = validate(req.body);
    pageDetails.error = error.details[0].message;
    if(error) { 
    return res.render('register', {
        nav, 
        pageDetails
    });
    }
    //if user exist, return 400
    const userMail = await User.findOne({'email' :req.body.email});

    if(userMail) {
        pageDetails.error = "User already exist with given mail";
        return res.render('register', {
        nav, 
        pageDetails
        });
    }

    const userPhone = await User.findOne({'phone':req.body.phone});

    if(userPhone) {
        pageDetails.error = "User already exist with given phone number";
        return res.render('register', {
        nav, 
        pageDetails 
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