const Producto = require('../models/productoModel');

const _ = require('underscore');




const producto = {

    //======================================================================
    //Funcion para traer todos los productos
    //======================================================================
    getProducts: function(req, res) {


        let desde = req.query.desde || 0;
        desde = Number(desde);


        let limite = req.query.limite || 5;
        limite = Number(limite);


        Producto.find({ disponible: true }).populate("usuario", "nombre email")
            .skip(desde)
            .limit(limite)
            .populate("categoria").exec((err, productosDb) => {


                if (err) {
                    return res.status(500).send({
                        ok: false,
                        error: err
                    });
                }


                Producto.countDocuments((err, conteo) => {

                    if (err) {
                        return res.status(500).send({
                            ok: false,
                            error: err
                        });
                    }

                    return res.send({
                        ok: true,
                        cuantos: conteo,
                        productos: productosDb
                    });

                });

            });

        //traer todos los productos
        //populate usuario categoria
        //paginado

    },


    //=======================================================================
    // Buscar productos                                                                      
    //=======================================================================


    searchProducts: function(req, res) {


        let termino = req.params.termino;

        //crear expresion regular y mandarla 
        let regex = new RegExp(termino, 'i'); //la i es para que sea insencible a las mayusculas y minunsculas.


        Producto.find({ nombre: regex }).populate("categoria").exec((err, productos) => {


            if (err) {
                return res.status(500).send({
                    ok: false,
                    error: err
                });
            }



            if (!productos || productos.length === 0) {
                return res.status(400).send({

                    ok: false,
                    error: {
                        message: "No se encontraron productos"
                    }
                });
            } else {

                return res.send({
                    ok: true,
                    producto: productos
                });
            }


        });



    }

    ,
    //======================================================================
    //Traer un producto por su id
    //======================================================================
    getProduct: function(req, res) {
        //populate usuario categoria
        let idProducto = req.params.id;

        Producto.findById(idProducto, (err, productoDB) => {

            if (err) {
                return res.status(500).send({
                    ok: false,
                    error: err
                });
            }


            if (!productoDB) {
                return res.status(400).send({
                    ok: false,
                    error: {
                        message: "No se encontro el producto"
                    }
                });
            } else {


                return res.send({
                    ok: true,
                    producto: productoDB
                });
            }

        });

    },
    //======================================================================
    //Nuevo producto
    //======================================================================
    newProduct: function(req, res) {
        //ingrear categoria 
        //usuario 
        console.log(req.body);
        let idUsuario = req.usuario._id;

        let params = req.body;

        let producto = new Producto({
            nombre: params.nombre,
            descripcion: params.descripcion,
            precioUni: params.precioUnitario,
            categoria: params.categoria,
            usuario: idUsuario
        });


        producto.save((err, productoDB) => {

            if (err) {
                return res.status(500).send({
                    ok: false,
                    err
                });
            }


            if (!productoDB) {
                return res.status(400).send({
                    ok: false,
                    error: {
                        message: "Ocurrio un error al crear el producto"
                    }
                });
            } else {
                return res.send({
                    ok: true,
                    producto: productoDB
                });
            }

        });
    },
    //======================================================================
    //Actualizar producto
    //======================================================================
    updateProduct: function(req, res) {


        let idProducto = req.params.id;



        // let params = _.pick(req.body, ["nombre", "precioUnitario", "descripcion"]);

        Producto.findByIdAndUpdate(idProducto, req.body, {
            new: true,
            runValidators: true
        }, (err, productoDB) => {


            if (err) {
                return res.status(500).send({
                    ok: false,
                    error: err
                });
            }


            if (!productoDB) {

                return res.status(400).send({
                    ok: false,
                    error: {
                        message: "No se encontró el producto"
                    }
                });
            } else {
                return res.send({
                    ok: true,
                    producto: productoDB
                });
            }




        });






    },
    //======================================================================
    //Desactivar producto
    //======================================================================
    disabledProduct: function(req, res) {

        let id = req.params.id;

        let desabilitar = {
            disponible: false
        }

        Producto.findByIdAndUpdate(id, desabilitar, (err, productoDesactivado) => {


            if (err) {
                return res.status(500).send({
                    ok: false,
                    error: err
                });
            } else {


                if (!productoDesactivado) {
                    return res.status(400).send({
                        ok: false,
                        error: {
                            message: "no se encontro el producto."
                        }
                    });
                } else {

                    return res.send({
                        ok: true,
                        productoDesactivado
                    });

                }


            }





        });

    }



}


module.exports = producto;