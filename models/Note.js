const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    title: {
        type: String,
        required: [true, 'El título de la nota es obligatorio'],
        trim: true,
        minlength: [10, 'El título es muy corto, mínimo necesitas 12'],
        maxlength: [35, 'El título es demasiado largo, máximo son 35 caracteres']
    },
    content: {
        type: String,
        trim: true,
        minlength: 1,
        maxlength: [500, 'El contenido es demasiado grande, máximo 500 caracteres']
    },
    hidden: {
        type: Boolean,
        required: true,
        default: false
    },
    rememberDate: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    savedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }]
});


const Note = mongoose.model('Notes', NoteSchema);
NoteSchema.set('autoIndex', false);

module.exports = Note;