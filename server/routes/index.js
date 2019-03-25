const express = require('express');
const router = express.Router();
const UserRoutes = require('./user');
const NoteRoutes = require('./note');
const LoginRoutes = require('./login');
const ReportRoutes = require('./report');
const { verifyToken, verifyAdmin, isOwnerOrAdmin, notOwner } = require('../middlewares/authentication');


router.route('/user').get([verifyToken, verifyAdmin], UserRoutes.getUser);
router.route('/user').post(UserRoutes.postUser);
router.route('/user/:id').put(verifyToken, UserRoutes.updateUser);
router.route('/user/:id').delete([verifyToken, verifyAdmin], UserRoutes.deleteUser);

router.route('/note').get(verifyToken, NoteRoutes.getNotes);
router.route('/note').post(verifyToken, NoteRoutes.postNote);
router.route('/note/:id').put([verifyToken, isOwnerOrAdmin], NoteRoutes.updateNote);
router.route('/note/:id').delete([verifyToken, isOwnerOrAdmin], NoteRoutes.deleteNote);
router.route('/note/:id').post([verifyToken, notOwner], NoteRoutes.saveNote);

router.route('/report').get([verifyToken, verifyAdmin, ], ReportRoutes.getReports);
router.route('/report').post(verifyToken, ReportRoutes.postReport);
router.route('/report/:id').put([verifyToken, verifyAdmin], ReportRoutes.resolveReport);

router.route('/login').post(LoginRoutes.postLogin);

module.exports = router;