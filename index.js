const express = require('express');
const path = require('path');

const app = express();

app.set('views', './src/views/');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public/')));

const port = process.env.PORT || 3000;

app.get('/', (req, res)=> {
    res.render('index');
});
app.get('/about', (req, res)=>{
    res.render('about');
});

app.listen(port, ()=>{ console.log(`Listening on port ${port}`)})

