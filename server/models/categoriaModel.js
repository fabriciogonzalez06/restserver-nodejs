const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es requerida']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});


//añadir mensaje personalizado a unique de el correo
categoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser único.'
});

module.exports = mongoose.model('Categoria', categoriaSchema);