require('./config/config');

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); //para el path de la carpeta public 

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//habilitar la carpeta publuc 
app.use(express.static(path.resolve(__dirname, '../public')));
//console.log(path.resolve(__dirname, '../public'));
//requerir rutas
app.use(require('./routes/index'));



mongoose.connect(process.env.URLDB, {

    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true

}, (err) => {
    if (err) throw err;

    console.log('DB online');
});

app.listen(process.env.PORT, () => {
    console.log(`escuchando el puerto ${process.env.PORT}`);
});