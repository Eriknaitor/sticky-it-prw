const User = require('../models/User');
const bcrypt = require('bcrypt');
const otplib = require('otplib');
const _ = require('underscore');
const { signToken } = require('../middlewares/authentication');


module.exports = {
    /**
     *  Lista a todos los usuarios que no esten baneados
     *  Lo que tiene escribir las cosas y volver a revisar
     *  el cógido después de meses, index hace que saltes X número
     *  de posiciones respecto a la actual, es decir, si limitas (con el limit) a 5 el número
     *  de documentos que quieres ver y quieres ver los 5 siguientes tendrías que sumarle los restantes a index
     */
    index: (req, res) => {
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

    // Muestra un usuario según su ID
    show: (req, res) => {
        User.findById(req.params.id, (err, user) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json(user);
        });
    },

    // Crea un usuario
    create: (req, res) => {
        let body = req.body;

        let user = new User({
            email: body.email,
            username: body.username,
            password: bcrypt.hashSync(body.password, 10),
            secret2FA: otplib.authenticator.generateSecret()
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

    // Actualiza un usuario
    update: (req, res) => {
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

    // Realmente no lo destruye, si no que lo banea
    destroy: (req, res) => {
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
            });
        });
    },

    // Autentica al usuario
    auth: (req, res) => {
        User.findOne({ email: req.body.email }, (err, user) => {
            if (err) return res.status(400).json({
                ok: false,
                err
            });

            if (!user || !user.validPassword(req.body.password)) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'Credenciales inválidas'
                    }
                });
            } else if (user.isEnabled2FA) {
                /**
                 * Para la vaina esta hay que coger de la DB el token y hacerse una ruta /
                 * middleware para comparar si es válido el totp
                 */
            }

            res.json({
                ok: true,
                token: signToken(user)
            });
        });
    }
}