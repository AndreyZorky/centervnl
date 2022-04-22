const Shop = require('../models/shops')
const Product = require('../models/products')
const errorHandler = require('../utils/errorHandler')
const cyrillicToTranslit = require('cyrillic-to-translit-js')
const mongoose = require('mongoose')


module.exports.getShops = async function(req, res, next) {
    try {
        const shops = await Shop.find().sort({name: 1}).lean()
        next(req, res, shops)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getShopById = async function(req, res, next) {
    try {
        const filter = {}
        if (req.params.id && mongoose.isValidObjectId(req.params.id)) {
            filter._id = mongoose.Types.ObjectId(req.params.id)
        } else if (req.params.id) {
            filter.path =  req.params.id
        }
        const shop = await Shop.findOne(filter).lean()
        next(req, res, shop)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createShop = async function(req, res, next) {
    try {
        const created = req.body
        if (!created.path) created.path = cyrillicToTranslit().transform(created.name, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        else created.path = cyrillicToTranslit().transform(created.path, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        const shop = await new Shop(created).save()
        next(req, res, shop)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.deleteShop = async function(req, res, next) {
    try {
      await Shop.deleteOne({_id: req.params.id})
      next(req, res, {message: "Удалено"})
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateShop = async function(req, res, next) {
    try {
      const updated = req.body
      if (!updated.path) updated.path = cyrillicToTranslit().transform(updated.name, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
      else updated.path = cyrillicToTranslit().transform(updated.path, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
      const shop = await Shop.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
      next(req, res, shop)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getGroups = async function(req, res, next) {
    try {
      const groups = await Product.distinct("group", {shop: req.params.shop, group: {$ne: ""}})
      next(req, res, groups)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getProductsInShop = async function(req, res, next) {
    try {
        const skip = req.query.offset ? +req.query.offset * 20 : 0
        const limit = 20
        const shop = await Shop.findOne({path: req.params.shop}).lean()
        const products = await Product.aggregate([
            { $match: {shop: shop._id, visible: true} },
            { "$sort": { "name": 1 } },
            { "$skip": skip },
            { "$limit": limit },
        ])

        next(req, res, {shop, products})

    } catch (e) {
        errorHandler(res, e)
    }
}