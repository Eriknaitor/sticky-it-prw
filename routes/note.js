const router = require('express').Router();
const note = require('../controllers/notes');
const { verifyToken, isOwnerOrAdmin, notOwner } = require('../middlewares/authentication');

/**
 * Rutas para administrar las notas
 */
router.get('/notes', verifyToken, note.index);
router.get('/note/:id', verifyToken, note.show);
router.get('/notes/saved/', verifyToken, note.saved);
router.post('/note/create', verifyToken, note.create);
router.put('/note/update/:id', [verifyToken, isOwnerOrAdmin], note.update);
router.delete('/note/delete/:id', [verifyToken, isOwnerOrAdmin], note.delete);
router.put('/note/like/:id', verifyToken, note.like);
router.put('/note/dislike/:id', verifyToken, note.dislike);

module.exports = router