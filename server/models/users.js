const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let validRoles = {
    values: ['admin', 'user'],
    message: '{VALUE} no es un rol válido'
};

const UsersSchema = new Schema({
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        trim: true,
        unique: true
    },
    username: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    banned: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user',
        enum: validRoles
    }
    // Algún día meteré los putos avatares como binarios Soon TM
});

UsersSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

const Users = mongoose.model('Users', UsersSchema);
UsersSchema.set('autoIndex', false);
UsersSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });


module.exports = Users;