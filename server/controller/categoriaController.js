const Categoria = require("../models/categoriaModel");
const _ = require("underscore");

let categoria = {
    //====================================================
    //Método traer todas las categorias
    //====================================================
    getCategories: function(req, res) {
        //populate busca los id type de esa coleccion
        Categoria.find({})
            .sort("descripcion") //ordenar por
            .populate("usuario", "nombre email")
            .exec((err, categoriesDB) => {
                if (err) {
                    return res.status(400).send({
                        ok: false,
                        err
                    });
                }

                //contar categorias
                Categoria.countDocuments((err, conteo) => {
                    if (err) {
                        return res.status(400).send({
                            ok: false,
                            err
                        });
                    }

                    //mandar categorias
                    return res.send({
                        ok: true,
                        categorias: categoriesDB,
                        cuantas: conteo
                    });
                });
            });
    },

    //====================================================
    //traer categoria por id
    //====================================================

    getCategory: function(req, res) {
        let id = req.params.id;

        Categoria.findById(id, (err, categoriaDB) => {
            if (err) {
                return res.status(500).send({
                    ok: false,
                    err
                });
            }

            if (!categoriaDB) {
                return res.status(400).send({
                    ok: false,
                    error: "No se encontró la categoria"
                });
            }

            return res.send({
                ok: true,
                categoria: categoriaDB
            });
        });
    },

    //====================================================
    //Método nueva categoría
    //====================================================
    newCategory: function(req, res) {
        let param = req.body;

        //definir data a guardar
        let categoria = new Categoria({
            descripcion: param.descripcion,
            usuario: req.usuario._id
        });

        categoria.save((err, categoria) => {
            if (err) {
                return res.status(400).send({
                    ok: false,
                    err
                });
            }

            if (!categoria) {
                return res.status(400).send({
                    ok: false,
                    err
                });
            }

            return res.send({
                ok: true,
                categoria
            });
        });
    },
    //====================================================
    //Actualizar categoria
    //====================================================
    updateCategory: function(req, res) {
        //obtener el id de la categoria
        let id = req.params.id;
        console.log(id);
        //obtener solo lo que quiero actualizar
        let body = req.body.descripcion;

        console.log(body);

        let actualizar = {
            descripcion: body
        };

        //validar que no venga vacio los datos
        if (!req.body.descripcion) {
            return res.status(400).send({
                ok: false,
                error: {
                    message: "Hacen faltan parametros"
                }
            });
        }

        //buscar y actualizar Categoria
        Categoria.findOneAndUpdate(
            id,
            actualizar,
            (err, categoriaDB, CategoriaActualizada) => {
                if (err) {
                    return res.status(400).send({
                        ok: false,
                        err
                    });
                }

                if (!categoriaDB) {
                    return res.status(400).send({
                        ok: false,
                        error: "No se encontro la categoria."
                    });
                } else {
                    return res.send({
                        ok: true,
                        categoriaAnterior: categoriaDB
                    });
                }
            }
        );
    },

    //====================================================
    //borrar categoria
    //====================================================
    deleteCategory: function(req, res) {
        let id = req.params.id;

        Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
            if (err) {
                return res.status(400).send({
                    ok: false,
                    err
                });
            }

            if (!categoriaBorrada) {
                return res.status(400).send({
                    ok: false,
                    error: {
                        message: "No se encontro la categoría."
                    }
                });
            }

            return res.send({
                ok: true,
                Eliminada: categoriaBorrada
            });
        });
    }
};

module.exports = categoria;