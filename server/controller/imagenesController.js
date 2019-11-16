const fs = require('fs');
const path = require('path');

let imagenes = {


    getImagenes: function(req, res) {

        let tipo = req.params.tipo;
        let img = req.params.img;



        if (tipo === "productos" || tipo === "usuarios") {


            //path de imagen a buscar 
            let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

            //ver si existe ese path
            if (fs.existsSync(pathImg)) {

                return res.sendFile(pathImg);
            } else {
                //path de la imagen por defecto cuando no se encuentre la imagen buscada 
                let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');

                res.sendFile(noImagePath);
            }
        } else {
            return res.status(400).send({
                ok: false,
                error: {
                    message: "Operación de carga de imagen no válida, path incorrecto"
                }
            });
        }






    }


}



module.exports = imagenes;