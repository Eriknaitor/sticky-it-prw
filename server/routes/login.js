const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');


module.exports = {
    postLogin: (req, res) => {

        let body = req.body;
        User.findOne({ email: body.email }, (err, user) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!user || !bcrypt.compareSync(body.password, user.password)) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario o contraseña inválidos'
                    }
                });
            }

            let token = jwt.sign({
                user
            }, process.env.SECRET_JWT, { expiresIn: process.env.EXPIRE_JWT });

            res.json({
                ok: true,
                user,
                token
            });
        });

    }
}