const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido.'
}


let usuarioSchema = new Schema({
    nombre: {
        required: [true, 'el nombre es requeriod.'],
        type: String
    },
    email: {
        required: [true, 'El email es requerido.'],
        unique: true,
        type: String
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida.']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

//eliminar la constraseña de la respuesta json

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

//añadir mensaje personalizado a unique de el correo
usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser único.'
});

module.exports = mongoose.model('Usuario', usuarioSchema);