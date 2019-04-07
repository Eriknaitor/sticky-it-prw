const jwt = require('jsonwebtoken');
const Note = require('../models/Note');
const User = require('../models/User');

// Firma un token
module.exports.signToken = (user) => {
    const userData = user.toObject();
    delete userData.password;
    delete userData.secret2FA;
    return jwt.sign(userData, process.env.SECRET_JWT);
}

// Verifica un token
module.exports.verifyToken = (req, res, next) => {
    const token = req.get('token') || req.body.token || req.query.token;

    if (!token) return res.json({ ok: false, message: "No existe ningún token" });

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

// Verifica si es un admin
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

// Comprueba si es un admin o el dueño
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

// Comprueba si no es el dueño de la nota
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