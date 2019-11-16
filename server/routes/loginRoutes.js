const express = require('express');

//controlador login
const LoginController = require('../controller/loginController').loginController;

const app = express();



app.post('/login', LoginController.login);
app.post('/google', LoginController.google);



module.exports = app;