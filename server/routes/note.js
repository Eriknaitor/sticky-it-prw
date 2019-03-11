const Note = require('../models/notes');
const _ = require('underscore');


/**
 * Rutas para administrar las notas
 */

module.exports = {
    getNotes: (req, res) => {
        let index = req.query.index || 0;
        index = Number(index);

        let limit = req.query.limit || 10;
        limit = Number(limit);

        Note.find({ createdBy: req.userInfo._id })
            .skip(index)
            .limit(limit)
            .exec((err, notes) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Note.count({ createdBy: req.userInfo._id }, (err, count) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        notes,
                        count
                    });
                });
            });
    },

    postNote: (req, res) => {
        let body = req.body;

        let note = new Note({
            title: body.title,
            content: body.content,
            createdAt: Date.now(),
            createdBy: req.userInfo._id
        });

        note.save((err, note) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                note,
            });
        });
    },

    updateNote: (req, res) => {
        let body = _.pick(req.body, ['hidden', 'title', 'content', 'rememberDate']);

        Note.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true }, (err, note) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!note) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Esa nota no existe'
                    }
                });
            }

            res.json({
                ok: true,
                note
            });
        });
    },

    deleteNote: (req, res) => {
        Note.findByIdAndDelete(req.params.id, (err, note) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!note) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Esa nota no existe'
                    }
                });
            }

            res.json({
                ok: true,
                note
            });
        });
    },

    saveNote: (req, res) => {
        Note.findByIdAndUpdate(req.params.id, { new: true, runValidators: true, $push: { savedBy: req.userInfo._id } }, (err, note) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!note) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Esa nota no existe'
                    }
                });
            }

            res.json({
                ok: true,
                note
            })
        })
    }
}