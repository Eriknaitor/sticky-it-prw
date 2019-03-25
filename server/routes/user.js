const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/User');

/**
 * Rutas para administrar usuarios
 */
module.exports = {
    getUser: (req, res) => {
        let index = req.query.index || 0;
        index = Number(index);

        let limit = req.query.limit || 5;
        limit = Number(limit);

        User.find({ banned: false })
            .skip(index)
            .limit(limit)
            .exec((err, users) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                User.count({ banned: false }, (err, count) => {
                    res.json({
                        ok: true,
                        users,
                        count
                    });
                });
            });
    },

    postUser: (req, res) => {
        let body = req.body;

        let user = new User({
            email: body.email,
            username: body.username,
            password: bcrypt.hashSync(body.password, 10)
        });

        user.save((err, user) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                user
            });
        });
    },

    updateUser: (req, res) => {
        let body = _.pick(req.body, ['email', 'username']);

        User.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true }, (err, user) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!user) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                user
            });
        });
    },

    deleteUser: (req, res) => {
        User.findByIdAndUpdate(req.params.id, { banned: true }, { new: true }, (err, user) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            if (!user) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                user
            })
        });
    }
}