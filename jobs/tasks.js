const Task = require('../models/Task');

module.exports = {
    create: async (taskName, date, createdBy) => {
        if (typeof taskName === 'undefined') return false;
        if (typeof date === 'undefined') return false;
        if (typeof createdBy === 'undefined') return false;

        let task = new Task({
            task: taskName,
            date: date,
            createdBy: createdBy
        })

        await task.save((err) => {
            if (err) return false;

            return true;
        })
    },

    solve: async (taskName) => {
        await Task.findOneAndUpdate({ task: taskName }, { solved: true }, (err, task) => {
            if (err) return false;

            if (!task) return false;

            return true;
        })
    },

    unsolved: async () => {
        await Task.find({ solved: false }, (err, tasks) => {
            if (err) {
                console.log('Ha habido un error:', err);
            }

            tasks.forEach((t) => {

            })
        });
    }
}