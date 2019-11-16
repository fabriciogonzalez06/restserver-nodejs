const moongose = require('mongoose');
const Schema = moongose.Schema;

const uniqueValidator = require('mongoose-unique-validator');


const ProductoSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
        unique: true
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio unitario es necesario']
    },
    descripcion: {
        type: String,
        required: false
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },
    img: {
        type: String
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }

});

//añadir mensaje personalizado a unique de el correo
//error al actualizar
/* ProductoSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser único.'
}); */

module.exports = moongose.model('Producto', ProductoSchema);