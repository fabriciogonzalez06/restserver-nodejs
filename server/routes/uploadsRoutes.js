//require('../controller/uploadsController').app;
const express = require('express');
const app = express();

//modelo usuarios
let Usuario = require('../models/usuarioModel');
//modelo productos
let Producto = require('../models/productoModel');


//para el borrado de imagenes repetidas cuando se actualiza
const fs = require('fs');
const path = require('path');


//const UploadsController = require('../controller/uploadsController').uploads;
//app.put("/upload", UploadsController.loadFile);

// default options

const fileUpload = require('express-fileupload');
app.use(fileUpload({ useTempFiles: true }));

app.put("/upload/:tipo/:id", function(req, res) {
    console.log(req.files);

    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files) {
        return res.status(400).send({
            ok: false,
            error: {
                messaage: "no se ha seleccionado ningún archivo."
            }
        });
    }


    //validar los tipos, que seria las carpetas de destino para almacenar las imagenes 
    let tipoValidos = ["productos", "usuarios"];

    if (tipoValidos.indexOf(tipo) < 0) {

        return res.status(400).send({
            ok: false,
            error: {
                message: "los tipos permitidos son " + tipoValidos.join(','),
                tipoMandado: tipo
            }
        });
    }


    let archivo = req.files.archivo; //el segundo es el nombre de como se manda en postam o name de html

    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1]
    console.log(extension);


    //extenciones permitidas
    let extencionesValidas = ["png", "jpg", "gif", "jpeg"];


    //buscar la extension a ver si tiene un indice en el array de extensiones permitidas
    if (extencionesValidas.indexOf(extension) < 0) {
        //mensaje de la extensión no permitida

        return res.status(400).send({
            ok: false,
            error: {
                message: "Las extensiones validas son " + extencionesValidas.join(','),
                ext: extension
            }
        });

    }

    //cambiar nombre archivo

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    //aquí es la ruta donde lo guardará
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {

        if (err) {
            return res.status(500).send({
                ok: false,
                error: err
            });
        } else {

            //Aquí la imagen ya esta cargada hay que actualizar los registros del usuario o productos
            //llamar función que hace ese trabajo
            if (tipo === 'usuarios') {

                imagenUsuario(id, res, nombreArchivo);
            } else if (tipo === 'productos') {

                imagenProducto(id, res, nombreArchivo);
            }
        }

    })
});



//=======================================================================
//funcion verificar usuario
//este res se pasa por referencia de donde es llamado                                                                    
//=======================================================================

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            //borrar imagen que se subio
            borrarImagen(nombreArchivo, 'usuarios');
            return res.status(500).send({
                ok: false,
                error: err
            });
        }

        if (!usuarioDB) {
            //borrar imagen que se subio
            borrarImagen(nombreArchivo, 'usuarios');
            return res.status(400).send({
                ok: false,
                error: {
                    message: "no se encontro el usuario"
                }
            });
        }

        //Aquí hay que borrar la imagen anterior en caso de haber  
        borrarImagen(usuarioDB.img, 'usuarios');

        //actualizar el campo img de el usuario encontrado
        usuarioDB.img = nombreArchivo;


        usuarioDB.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(500).send({
                    ok: false,
                    err
                });
            } else {

                return res.send({
                    ok: true,
                    usuario: usuarioGuardado,
                    img: nombreArchivo
                });
            }
        });


    });

}


//=======================================================================
// Función que se encarga de actualizar la imagen al producto                                                                      
//=======================================================================
function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {


        if (err) {
            //borrar la imagen subida 
            borrarImagen(nombreArchivo, 'productos');
            return res.status(500).send({
                ok: false,
                error: err
            });

        } else {

            if (!productoDB) {
                //borrar la imagen subida 
                borrarImagen(nombreArchivo, 'productos');
                return res.status(400).send({
                    ok: false,
                    error: {
                        message: "no se encontró el producto"
                    }
                });
            } else {
                //borrar imagen anterior en caso de que exista
                borrarImagen(productoDB.img, 'productos');

                //actualizar producto
                productoDB.img = nombreArchivo;


                //guardar el nuevo producto con su imagen
                productoDB.save((err, productoGuardado) => {

                    if (err) {
                        return res.status(500).send({
                            ok: false,
                            error: err
                        });
                    }


                    return res.send({
                        ok: true,
                        producto: productoGuardado,
                        img: nombreArchivo
                    });


                });



            }


        }


    });

}


//=======================================================================
// Funcion generica que borra una imagen depende de donde es llamada                                                                      
//=======================================================================
function borrarImagen(nombreImagen, tipo) {
    //antes de asignar la nueva imagen ver si existe una anterior y borrarla
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    //usar funcion de file system para ver si existe ese path
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}


module.exports = app;