const express = require('express');
const path = require('path');

const app = express();

app.set('views', './src/views/');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public/')));
app.use('/css', express.static(path.join(__dirname, 'public/css/')));
app.use('/js', express.static(path.join(__dirname, 'public/js/')));
app.use('/images', express.static(path.join(__dirname, 'public/images/')));
const port = process.env.PORT || 3000;

app.get('/', (req, res)=> {
    res.render('index', {title: "FMG Furniture | Homepage"});
});
app.get('/about', (req, res)=>{
    res.render('about', {
        title: "FMG Furniture | About Us",
        header: "About Us"
    });
});
app.get('/services', (req, res)=> {
    res.render('services', {
        title : "FMG Furniture | Services",
        header: "Our Services"
    });
});
app.get('/contact', (req, res)=> {
    res.render('contact', {
        title : "FMG Furniture | Contact",
        header: "Contact Us"
    });
});
app.get('/products', (req, res)=> {
    res.render('products', {
        title : "FMG Furniture | Products",
        header: "Our Products"
    });
});
app.get('/products/details', (req, res)=>{
    res.render('details', {
        title : "FMG Furniture | Products",
        header: "Product Details"
    });
});


app.listen(port, ()=>{ console.log(`Listening on port ${port}`)})

