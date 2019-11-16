const express = require('express');
const app = express();

const fileUpload = require('express-fileupload');

// default options
app.use(fileUpload({ useTempFiles: true }));


const uploads = {


    //=======================================================================
    // Subir archivos                                                                      
    //=======================================================================

    loadFile: function(req, res) {


        if (!req.files) {
            return res.status(400).send({
                ok: false,
                error: {
                    messaage: "no se ha seleccionado ningún archivo."
                }
            });
        }

        let archivo = req.files.archivo; //el segundo es el nombre de como se manda en postam o name de html

        archivo.mv('uploads/archivo.png', function(err) {

            if (err) {
                return res.status(500).send({
                    ok: false,
                    error: err
                });
            }

        })
    }

}

module.exports = {
    app,
    uploads
}