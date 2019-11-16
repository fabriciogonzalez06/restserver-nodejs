const express = require('express');
let {
    verificaToken,
    verificaAdmin_role
} = require('../middlewares/auth.js');

let categoriaController = require('../controller/categoriaController');

const app = express();


//=================================================
//Mostrar todas las cateogorías.
//================================================
app.get('/categorias', verificaToken, categoriaController.getCategories);


//=================================================
//Mostrar una categoría por id.
//================================================
app.get('/categoria/:id', verificaToken, categoriaController.getCategory);

//=================================================
//Crear una nueva categoría.
//================================================
app.post('/categoria', verificaToken, categoriaController.newCategory);


//=================================================
//Editar una categoría.
//================================================

app.put('/categoria/:id', verificaToken, categoriaController.updateCategory);

//=================================================
//Borrar una categoría por id.
//================================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_role], categoriaController.deleteCategory);


module.exports = app;