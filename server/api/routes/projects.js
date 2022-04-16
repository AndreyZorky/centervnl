const express = require('express');
const router = express.Router();
const controller = require('../controllers/projects');
const responseJson = require('../utils/responseJson');
const auth = require('../../middleware/auth')
const upload = require('../../middleware/uploads')
const passport = require('passport')

fields = [
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 20 }
]

router.put('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.updateProject(req, res, responseJson))
router.patch('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, upload.fields(fields), (req, res) => controller.uploadImagesProject(req, res, responseJson))
router.get('/', (req, res) => controller.getProjects(req, res, responseJson))
router.get('/active', (req, res) => controller.getActive(req, res, responseJson))
router.get('/:id', (req, res) => controller.getProjectById(req, res, responseJson))
router.post('/', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.createProject(req, res, responseJson))
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => controller.deleteProject(req, res, responseJson))

module.exports = router;