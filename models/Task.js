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
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true
    }
})


const Task = mongoose.model('Tasks', TaskSchema);
TaskSchema.set('autoIndex', false);

module.exports = Task;