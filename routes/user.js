const router = require('express').Router();
const users = require('../controllers/users');

const { verifyToken, verifyAdmin } = require('../middlewares/authentication');

/**
 * Rutas para administrar los usuarios
 */
router.get('/users', users.index);
router.get('/user/:id', users.show);
router.post('/user/create', users.create);
router.put('/user/update/:id', verifyToken, users.update);
router.delete('/user/delete/:id', [verifyToken, verifyAdmin], users.destroy);
router.post('/authenticate', users.auth);
router.get('/user/qr/:id', verifyToken, users.userQR);

module.exports = router