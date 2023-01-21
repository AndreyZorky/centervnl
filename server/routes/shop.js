const express = require('express');
const router = express.Router();
const controller = require('../controllers/shop');

router.get('/', controller.getShopPage) 
router.get('/:shop/:group', controller.getCatalogPage) 
router.get('/:shop/:group/:product', controller.getProductPage) 
router.get('/:id', controller.getCatalogsList) 

module.exports = router;