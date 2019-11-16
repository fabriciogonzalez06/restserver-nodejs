const express = require('express');

const productoController = require('../controller/productoController');

const {
    verificaAdmin_role,
    verificaToken
} = require('../middlewares/auth');

const app = express();


/* Traer productos*/
app.get('/productos', verificaToken, productoController.getProducts);
/*Traer un producto por su id */
app.get('/producto/:id', verificaToken, productoController.getProduct);
/*Nuevo producto*/
app.post('/producto', verificaToken, verificaToken, productoController.newProduct);
/*Actualizar producto*/
app.put('/producto/:id', verificaToken, productoController.updateProduct);
/*Desactivar producto*/

app.delete('/producto/:id', verificaToken, productoController.disabledProduct);
/*Buscar producto por nombre*/

app.get("/productos/buscar/:termino", verificaToken, productoController.searchProducts);






module.exports = app;