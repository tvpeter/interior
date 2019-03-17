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

mongoose.connect('mongodb://localhost/interior')
.then(()=>{console.log(`Connected to mongodb`)})
.catch(err => console.log(`Failed to connect to mongodb`));

app.use(express.json());

const nav = [ 
    { link : '/', title : 'Home'},
    { link : '/about', title: 'About Us'},
    { link : '/services', title: 'Services'},
    { link : '/products', title: 'Products'},
    { link : '/contact', title: 'Contact'},
];
const users = require('./src/routes/user')(nav);
const about = require('./src/routes/about')(nav);
const services = require('./src/routes/services')(nav);
const contact = require('./src/routes/contact')(nav);

app.use('/users', users);
app.use('/about', about);
app.use('/services', services);
app.use('/contact', contact);

app.get('/', (req, res)=> {
    res.render('index', {nav, current: "Home", title: "FMG Furniture | Homepage"});
});



app.get('/products', (req, res)=> {
    res.render('products', {
        nav,
        current: "Products",
        title : "FMG Furniture | Products",
        header: "Our Products"
    });
});
app.get('/products/details', (req, res)=>{
    res.render('details', {
        nav,
        current: "Products",
        title : "FMG Furniture | Products",
        header: "Product Details"
    });
});


app.listen(port, ()=>{ console.log(`Listening on port ${port}`)})

