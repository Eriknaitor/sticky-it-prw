const jwt = require('jsonwebtoken');
const Note = require('../models/notes');


module.exports.verifyToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SECRET_JWT, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.userInfo = decoded.user;

        next();
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