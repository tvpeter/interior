const express = require('express');
const path = require('path');
const mongoose = require('mongoose');


const app = express();

app.set('views', './src/views/');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public/')));
app.use('/css', express.static(path.join(__dirname, 'public/css/')));
app.use('/js', express.static(path.join(__dirname, 'public/js/')));
app.use('/images', express.static(path.join(__dirname, 'public/images/')));
const port = process.env.PORT || 3000;

require('./startup/db')();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const nav = [ 
    { link : '/', title : 'Home'},
    { link : '/about', title: 'About Us'},
    { link : '/services', title: 'Services'},
    { link : '/products', title: 'Products'},
    { link : '/contact', title: 'Contact'},
];
let pageDetails = {
    current: "",
    title: "",
    header: "",
    error: ""
}

const users = require('./src/routes/user')(nav);
const about = require('./src/routes/about')(nav);
const services = require('./src/routes/services')(nav);
const contact = require('./src/routes/contact')(nav);
const products = require('./src/routes/products')(nav);

app.use('/users', users);
app.use('/about', about);
app.use('/services', services);
app.use('/contact', contact);
app.use('/products', products);

app.get('/', (req, res)=> {
    pageDetails.current = "Home";
    pageDetails.title = "FMG Furniture | Homepage";
    res.render('index', {nav, pageDetails});
});

app.get('/products/details', (req, res)=>{
    res.render('details', {
        nav,
        current: "Products",
        title : "FMG Furniture | Products",
        header: "Product Details"
    });
});


const server = app.listen(port, ()=>{ console.log(`Listening on port ${port}`)})

module.exports = server;