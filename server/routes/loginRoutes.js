const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
    OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        igm: payload.picture,
        google: true
    }

}



app.post('/google', async(req, res) => {

    //obtener el token que se manda desde el index con ese nombre
    let token = req.body.idtoken;

    //llamar a la funcion verify y pasarle el token y almacenar respuesta en googleUser
    let googleUser = await verify(token).catch(e => {
        //validar error
        return res.json({
            ok: false,
            err: e
        });
    });

    //sino hubo error

    Usuario.findOne({
        email: googleUser.email
    }, (err, usuarioDb) => {

        if (err) {
            return res.status(500).send({
                ok: false,
                err
            });
        }

        if (usuarioDb) {

            //en caso de que se quiera registrar con google pero ya tiene una cuenta normal, con ese correo
            if (usuarioDb.google === false) {
                return res.status(400).send({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticación nomal'
                    }
                });
            } else { //en caso de que ya se ha registrado anteriormente con gmail

                //generar el token de nuestro sistema
                let token = jwt.sign({
                    usuario: usuarioDb
                }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                });

                return res.json({
                    ok: true,
                    usuario: usuarioDb,
                    token
                });

            }
        } else { //si el usuario no existe en nustra bd 

            //crear nuevo usuario con lo que trae el googleUser
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            //guardar usuario 
            usuario.save((err, usuarioDb) => {
                if (err) {
                    return res.status(500).send({
                        ok: false,
                        err
                    });
                }


                //generar el token de nuestro sistema
                let token = jwt.sign({
                    usuario: usuarioDb
                }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                });

                return res.json({
                    ok: true,
                    usuario: usuarioDb,
                    token
                });
            });

        }

    })

});



module.exports = app;