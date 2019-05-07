const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    title: {
        type: String,
        required: [true, 'El título de la nota es obligatorio'],
        trim: true,
        minlength: [12, 'El título es muy corto, mínimo necesitas 12 caracteres'],
        maxlength: [35, 'El título es demasiado largo, máximo son 35 caracteres']
    },
    content: {
        type: Object,
        trim: true,
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
        ref: 'User',
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    savedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});


const Note = mongoose.model('Notes', NoteSchema);
NoteSchema.set('autoIndex', false);

module.exports = Note;