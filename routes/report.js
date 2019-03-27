const router = require('express').Router();
const reports = require('../controllers/reports');
const { verifyToken, verifyAdmin } = require('../middlewares/authentication');

/**
 * Rutas para administrar los reportes
 */
router.get('/reports', [verifyToken, verifyAdmin], reports.index);
router.get('/report/:id', [verifyToken, verifyAdmin], reports.show);
router.post('/report/create', verifyToken, reports.create);
router.put('/report/update/:id', [verifyToken, verifyAdmin], reports.update);

module.exports = router;