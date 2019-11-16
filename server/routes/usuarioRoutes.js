const express = require("express");
const app = express();

//middlawares
const {
    verificaToken,
    verificaAdmin_role
} = require("../middlewares/auth");

//controlador
const usuarioController = require('../controller/usuarioController');

//modelo
const Usuario = require("../models/usuarioModel");

//traer todos los usuario según los parámetros dados
app.get("/usuarios", verificaToken, usuarioController.getUsuarios);

//nuevo usuario
app.post("/usuario", [verificaToken, verificaAdmin_role], usuarioController.newUser);

//actualizar un usuario
app.put("/usuario/:id", [verificaToken, verificaAdmin_role], usuarioController.updateUser);

//metodo para borrar usuario
app.delete("/usuario/:id", [verificaToken, verificaAdmin_role], usuarioController.deleteUser);

//ruta para desactivar usuario
app.put("/usuario/desactivar/:id", verificaToken, usuarioController.disabledUser);

module.exports = app;