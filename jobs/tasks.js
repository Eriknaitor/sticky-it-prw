const Task = require('../models/Task');
const email = require('./email');

const solve = async (taskName) => {
    await Task.findOneAndUpdate({ task: taskName }, { solved: true }, (err, task) => {
        if (err) return false;

        if (!task) return false;

        return true;
    })
}

module.exports = {
    create: async (taskName, date, createdBy, title, content) => {
        if (typeof taskName === 'undefined') return false;
        if (typeof date === 'undefined') return false;
        if (typeof createdBy === 'undefined') return false;

        let task = new Task({
            task: taskName,
            date: date,
            createdBy: createdBy,
            title: title,
            content: content
        })

        await task.save((err) => {
            if (err) return false;

            return true;
        })
    },

    unsolved: async () => {
        await Task.find({ solved: false, date: { $lte: new Date() } }, (err, tasks) => {
            if (err) {
                console.log('Ha habido un error:', err);
            }

            tasks.forEach((t) => {
                console.log(`Resolviendo tarea: ${t.task}`);
                email.reminder({ email: t.createdBy }, { text: t.content, html: t.content, subject: t.title });
                solve(t.task);
            })
        });
    }
}