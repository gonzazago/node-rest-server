const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: 'El rol {VALUE}  es erroneo, introduzca uno valido'
};

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "El correo es nesecario"]
    },
    password: {
        type: String,
        required: [true, "Debe ingresar una contraseña"]
    },
    img: {
        type: String,
        require: false
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

//metodo para evitar que mande el campo password
// en la respuesta
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject
}
usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser unico'
})
module.exports = mongoose.model('usuario', usuarioSchema);