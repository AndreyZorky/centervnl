const express = require('express');
const router = express.Router();
const {isAuth} = require('../middleware/auth')
const controller = require('../controllers/help');

router.get('/', controller.getHelpList) 
router.get('/donate', controller.getHelpDonate) 
router.get('/donate/finish', controller.getDonateFinish) 
router.post('/donate', controller.createDonation) 
router.post('/donate/finish', controller.createDonationFinish)
// router.get('/:path', controller.getNewsPage) 
// router.post('/:id/like', isAuth, controller.toggleLike)

module.exports = router;