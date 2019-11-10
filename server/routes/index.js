const express = require('express');

const app = express();


app.use(require('./loginRoutes'));
app.use(require('./usuarioRoutes'));


module.exports = app;