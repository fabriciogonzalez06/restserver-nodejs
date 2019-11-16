const express = require('express');

const { verificaTokenImg } = require('../middlewares/auth');

const ImagenesController = require('../controller/imagenesController');


const app = express();


app.get('/imagen/:tipo/:img', verificaTokenImg, ImagenesController.getImagenes);






module.exports = app;