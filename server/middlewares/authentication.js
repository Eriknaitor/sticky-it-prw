const jwt = require('jsonwebtoken');
const Note = require('../models/Note');
const USer = require('../models/User');

module.exports.signToken = (user) => {
    const userData = user.toObject();
    delete userData.password
    return jwt.sign(userData, process.env.SECRET_JWT);
}

module.exports.verifyToken = (req, res, next) => {
    let token = req.get('token') || req.body.token || req.query.token;

    jwt.verify(token, process.env.SECRET_JWT, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        User.findById(decoded._id, (err, user) => {
            if (!user) return res.json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });

            req.userInfo = user;
            next();
        })
    });
}

module.exports.verifyAdmin = (req, res, next) => {
    let tokenInfo = req.userInfo;

    if (tokenInfo.role === 'admin') {
        next()
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
}

module.exports.isOwnerOrAdmin = (req, res, next) => {
    let tokenInfo = req.userInfo;

    Note.findById(req.params.id, (err, note) => {
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

        if (note.createdBy == tokenInfo._id) {
            next();
        } else if (tokenInfo.role === 'admin') {
            next();
        } else {
            return res.status(403).json({
                ok: false,
                err: {
                    message: 'No estas autorizado a manipular notas de otros usuarios'
                }
            });
        }
    });
}

module.exports.notOwner = (req, res, next) => {
    let tokenInfo = req.userInfo;

    Note.findById(req.params.id, (err, note) => {
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

        if (note.createdBy != tokenInfo._id) {
            next();
        } else {
            return res.status(403).json({
                ok: false,
                err: {
                    message: 'No puedes guardar tu propia nota'
                }
            });
        }
    });
}