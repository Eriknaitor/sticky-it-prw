const User = require('../models/User');
const bcrypt = require('bcrypt');
const otplib = require('otplib');
const QRCode = require('qrcode');
const _ = require('underscore');
const { signToken } = require('../middlewares/authentication');

otplib.authenticator.options = {
    window: 1,
    step: 30
}

module.exports = {
    /**
     *  Lista a todos los usuarios que no esten baneados
     *  Lo que tiene escribir las cosas y volver a revisar
     *  el cógido después de semanas, index hace que saltes X número
     *  de posiciones respecto a la actual, es decir, si limitas (con el limit) a 5 el número
     *  de documentos que quieres ver y quieres ver los 5 siguientes tendrías que sumarle los restantes a index
     */
    index: (req, res) => {
        let index = req.query.index || 0;
        index = Number(index);

        let limit = req.query.limit || 10;
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

            res.json({
                ok: true,
                user
            });
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
        let body = _.pick(req.body, ['email', 'username', 'isEnabled2FA']);

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

    changePass: (req, res) => {
        const newPass = bcrypt.hashSync(req.body.password, 10);
        User.findByIdAndUpdate(req.params.id, { $set: { password: newPass } }, { new: true, runValidators: true }, (err, user) => {
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
                return res.status(400).json({
                    ok: false,
                    err: 'Credenciales inválidas'
                });
            } else {
                if (user.banned) {
                    return res.status(403).json({
                        ok: false,
                        err: 'Usuario baneado'
                    });
                }

                if (!user.isEnabled2FA) {
                    res.json({
                        ok: true,
                        token: signToken(user)
                    });
                } else {
                    if (!req.headers['x-otp']) {
                        return res.status(206).json({
                            ok: false,
                            err: { message: 'Introduce el código para continuar' }
                        });
                    }

                    const verified = otplib.authenticator.checkDelta(req.headers['x-otp'], user.secret2FA);
                    if (Number.isInteger(verified)) {
                        res.json({
                            ok: true,
                            token: signToken(user)
                        });
                    } else {
                        return res.status(400).json({
                            ok: false,
                            err: 'Código inválido'
                        });
                    }
                }
            }
        });
    },

    // Devuelve el código QR del usuario
    userQR: (req, res) => {
        User.findById(req.params.id, (err, user) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            const secret = otplib.authenticator.keyuri(user.id, 'RemindMe', user.secret2FA);
            QRCode.toDataURL(secret, (err, data_url) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                return res.json({
                    ok: true,
                    message: 'Verify OTP',
                    tmpSecret: user.secret2FA,
                    dataURL: data_url,
                    otpURL: secret
                });
            });
        });
    }
}
