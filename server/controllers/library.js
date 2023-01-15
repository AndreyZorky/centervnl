const apiPrograms = require('../api/controllers/programs')
const apiData = require('../api/controllers/data')
const apiLibrary = require('../api/controllers/library')
const apiShops = require('../api/controllers/shops')
const moment = require('moment')

moment.locale('ru')

module.exports.getLibsListPage = async function(req, res, data = {}) {
    try {
        const result = {...data}
        req.query.filter_visible = true
        await apiLibrary.getLibrarys(req, res, async (req, res, posts) => {
            posts.forEach(post => {
                post.date = moment(post.date).format('D MMMM yyyy')
            })
            result.posts = posts
        })
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            result.contacts = contacts
        })
        renderListPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderListPage = function(req, res, data) {
    res.render('library-list', {
        title: 'База знаний',
        programs: data.programs, 
        contacts: data.contacts,
        user: req.user,
        posts: data.posts,
        shops: data.shops
    })
}

module.exports.getLibPage = async function(req, res, data = {}) {
    try {
      const result = {}
      req.query.filter_visible = true
      await apiLibrary.getLibraryByPath(req, res, (req, res, post) => {
        post.date = moment(post.date).format('D MMMM yyyy')
        result.post = post
      })
      await apiShops.getShops(req, res, (req, res, shops) => {
        result.shops = shops
      })

      req.query.fields_name = 1
      req.query.fields_path = 1
      await apiPrograms.getPrograms(req, res, (req, res, programs) => {
        result.programs = programs
      })
      req.params.type = "CONTACTS"
      await apiData.getByType(req, res, (req, res, contacts) => {
        result.contacts = contacts
      })
      renderPostPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderPostPage = function(req, res, data) {
    res.render('library', {
        title: data.post.name,
        programs: data.programs, 
        contacts: data.contacts, 
        user: req.user,
        post: data.post,
        shops: data.shops
    })
}
