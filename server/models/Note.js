const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    title: {
        type: String,
        required: [true, 'El título de la nota es obligatorio'],
        trim: true,
    },
    content: {
        type: String,
        trim: true,
    },
    hidden: {
        type: Boolean,
        required: true,
        default: false
    },
    rememberDate: {
        type: Date,
        default: Date.now() - 1 * 60 * 60 * 1000
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
    visitors: {
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