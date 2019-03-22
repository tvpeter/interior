const express = require('express');
const router = express.Router();
const {Contact, validate} = require('../models/contact');

let pageDetails = {
    current : "Contact",
    title : "FMG Furniture | Contact",
    header : "Contact Us"
}


function contactRouter(nav){

    const contactIndex = router.get('/', async (req, res)=> {
        res.render('contact/contact', { nav, pageDetails });
    });

    const contactForm = router.get('/create', (req, res)=> {
        res.render('contact/create', {nav, pageDetails});
    });

    const createContact = router.post('/create', async (req, res)=>{
        // validate that the details are complete
        const {error} = validate(req.body)
        if(error) {
            pageDetails.error = error.details[0].message;
            return res.status(400).render('contact/create', { nav, pageDetails });
        }

        //check that it's not in the db
        const contact = await Contact.findOne({'address': req.body.address});
        
        // if(contact) {
        //     pageDetails.error = "contact already created";
        //     return res.status(400).render('contact/create', { nav, pageDetails })
        // }

        //const phone = await Contact.find({'phone': {req.body.phone, req.body.secondline}});

        const email = await Contact.findOne({'email': req.body.email});
        if(contact || email) {
            pageDetails.error = "contact already created";
            return res.status(400).render('contact/create', { nav, pageDetails })
        }

        
        // create and save the contact
        const newContact = new Contact ({
            address: req.body.address,
            phone: [req.body.phone, req.body.secondline],
            email: req.body.email
        })

        try {
            await newContact.save();
            return res.status(200).render('contact/create', { nav, pageDetails });
        } catch (error) {
            pageDetails.error = error;
            return res.status(500).render('contact/create', { nav, pageDetails});
        }

    });

    return [ contactIndex, contactForm, createContact];
}

module.exports = contactRouter;