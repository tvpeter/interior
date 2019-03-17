const express = require('express');
const router = express.Router();
const {User, validate} = require('../models/user');

async function userRouter (nav){
const getUsers = router.get('/', (req, res)=>{
    res.render('register', {
        nav, 
        current: "Register",
        title: "Register User",
        header: "Register User"
    });
});

const postUsers = router.post('/', (req, res)=>{
    //if request is not valid, return 400
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //if user exist, return 400
    const userMail = await User.findOne(req.body.email);

    if(userMail) return res.status(400).send('User already exists');

    const userPhone = await User.findOne(req.body.phone);

    if(userPhone) return res.status(400).send('User already exists');
    //create a new user

    const newUser = new User({
        //user details here
    });
    //return new user


});

return [getUsers, postUsers];

}

module.exports = userRouter;