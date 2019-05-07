const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    task: {
        type: String,
        unique: true,
        required: true
    },
    solved: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})


const Task = mongoose.model('Tasks', TaskSchema);
TaskSchema.set('autoIndex', false);

module.exports = Task;