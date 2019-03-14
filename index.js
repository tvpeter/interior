const express = require('express');

const app = express();

app.set('views', './src/views/');
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;

app.get('/', (req, res)=> {
    res.render('index');
});

app.listen(port, ()=>{ console.log(`Listening on port ${port}`)})

