require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());



app.get('/usuario', (req, res) => {
    res.send('hola desde node');
});

app.post('/usuario', (req, res) => {
    let param = req.body;
    return res.send(param);
});


app.listen(process.env.PORT, () => {
    console.log(`escuchando el puerto ${process.env.PORT}`);
});