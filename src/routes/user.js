const express = require('express');
const router = express.Router();
const {User, validate} = require('../models/user');

let pageDetails = {
        current : "Register",
        title : "Register User",
        header : "Register User"
}

function userRouter (nav){
const getUsers = router.get('/', (req, res)=>{
    res.render('register', {
        nav, 
        pageDetails
    });
});

const postUsers = router.post('/', async (req, res)=>{

    //return if request does not contain all params
    const { error } = validate(req.body);
    if(error) { 
    pageDetails.error = error.details[0].message;
    return res.render('register', { nav, pageDetails }); }

    //return if password and confirmation does not match
    if(req.body.password !== req.body.password_confirmation) {
        pageDetails.error = "Password confirmation does not match";
        return res.render('register', {nav, pageDetails});
    }

    //return if user name or email or phone exists
    const userName = await User.findOne({'name': req.body.name});
    if(userName){
        pageDetails.error = "User already registered";
        return res.render('register', { nav, pageDetails});
    }

    const userMail = await User.findOne({'email' :req.body.email});
    if(userMail) {
        pageDetails.error = "User already exist with given mail";
        return res.render('register', { nav, pageDetails }); }

    const userPhone = await User.findOne({'phone':req.body.phone});
    if(userPhone) {
        pageDetails.error = "User already exist with given phone number";
        return res.render('register', { nav,  pageDetails });  }

    //create a new user
    const newUser = new User({
        name: req.body.name,
        email : req.body.email,
        phone : req.body.phone,
        password: req.body.password
    });
    try {
        await newUser.save();
        
    } catch (error) {
        pageDetails.error = "Oops something went wrong, try again";
        return res.render('register', {nav, pageDetails});
    }

    //need to redirect with a message
    res.redirect('/');
});

return [getUsers, postUsers];

}

module.exports = userRouter;