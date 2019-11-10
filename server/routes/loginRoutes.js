const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuarioModel');

const app = express();



app.post('/login', (req, res) => {


    let body = req.body;


    Usuario.findOne({
        email: body.email
    }, (err, usuarioDb) => {

        if (err) {
            return res.status(500).send({
                ok: false,
                err
            });
        }


        if (!usuarioDb) {
            return res.send({
                ok: false,
                err: {
                    message: '(usuario) o contraseña incorrecta'
                }
            });
        }

        //comparar usuario mandado con el usuario de la base de datos
        if (!bcrypt.compareSync(body.password, usuarioDb.password)) {
            return res.send({
                ok: false,
                err: {
                    message: 'usuario o (contraseña) incorrecta'
                }
            });
        }


        //generar token
        let token = jwt.sign({
            usuario: usuarioDb
        }, process.env.SEED, {
            expiresIn: process.env.CADUCIDAD_TOKEN
        });



        return res.send({
            ok: true,
            usuario: usuarioDb,
            token
        });


    });



});



module.exports = app;