const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuarioModel');


let Usuarios = {

    //=========================================================================================
    //Obtener los usuarios según los parámetros especificados
    //=========================================================================================
    getUsuarios: function(req, res) {

        //obtener desde donde quiere obtener los registros
        //cuando son opcionales se reciben en query
        let desde = req.query.desde || 0;
        desde = Number(desde);

        let limite = req.query.limite || 5;
        limite = Number(limite);

        Usuario.find({
                estado: true
            }, "nombre email estado google img role")
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios) => {
                if (err) {
                    return res.estatus(400).send({
                        ok: false,
                        err
                    });
                }

                //contar los registros
                Usuario.countDocuments({
                    estado: true
                }, (err, conteo) => {
                    return res.send({
                        ok: true,
                        usuarios,
                        cuantos: conteo
                    });
                });
            });

    },
    //=========================================================================================
    //Crear un nuevo usuario
    //=========================================================================================
    newUser: function(req, res) {

        let param = req.body;

        let usuario = new Usuario({
            nombre: param.nombre,
            email: param.email,
            password: bcrypt.hashSync(param.password, 10),
            role: param.role
        });

        usuario.save((err, usuarioDB) => {
            if (err) {
                return res.status(400).send({
                    ok: false,
                    err
                });
            }

            //usuario.password = null;

            return res.send({
                ok: true,
                usuario: usuarioDB
            });
        });
    },
    //=========================================================================================
    //Actualizar un usaurio según su id
    //=========================================================================================
    updateUser: function(req, res) {

        let id = req.params.id;
        //recordar que no queremos actualizar algunos campos de esa manera
        //funcion pick del underscore de las propiedades que si se pueden actualizar
        // let body = _.pick(req.body, ["nombre", "img", "role", "estado", "email"]);

        //buscar y actulalizar usuario
        Usuario.findByIdAndUpdate(
            id,
            body, {
                new: true,
                runValidators: true
            },
            (err, usuarioDB) => {
                if (err) {
                    return res.status(400).send({
                        ok: false,
                        err
                    });
                }

                return res.send({
                    ok: true,
                    usuario: usuarioDB
                });
            }
        );

    },
    //=========================================================================================
    //Borrar un usuario según su id
    //=========================================================================================
    deleteUser: function() {

        let id = req.params.id;

        Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {


            if (err) {
                return res.status(400).send({
                    ok: false,
                    err
                });
            }

            if (!usuarioBorrado) {
                return res.send({
                    ok: false,
                    err: {
                        message: 'No se encontro el usuario'
                    }
                });

            }


            return res.send({
                ok: true,
                usuarioBorrado
            });


        });

    },
    //=========================================================================================
    //Desactivar un usario según su id
    //=========================================================================================
    disabledUser: function() {
        let id = req.params.id;

        let actualizaEstado = {
            estado: false
        }


        Usuario.findByIdAndUpdate(id, actualizaEstado, {
            new: true,
            runValidators: true
        }, (err, usuarioDesactivado) => {


            if (err) {
                return res.status(400).send({
                    ok: false,
                    err
                });
            }


            if (!usuarioDesactivado) {

                return res.send({
                    ok: false,
                    err: {
                        message: 'no se encontro el usuario'
                    }
                });
            }

            return res.send({
                ok: true,
                usuarioDesactivado
            });



        });
    }
}





module.exports = Usuarios;