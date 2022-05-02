const express = require('express');
const router = express.Router();
const passport = require('passport')
const controller = require('../controllers/registrations');
const responseJson = require('../utils/responseJson');
const auth = require('../../middleware/auth')

router.put('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.update(req, res, responseJson))
router.get('/:id', auth.isAdmin, (req, res) => controller.getById(req, res, responseJson))
router.get('/groups/:service', auth.isAdmin, (req, res) => controller.getGroups(req, res, responseJson))
router.get('/:service/:date', auth.isAdmin, (req, res) => controller.getByService(req, res, responseJson))

module.exports = router;