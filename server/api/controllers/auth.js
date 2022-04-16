const request = require('request');
const User = require('../models/users')
const errorHandler = require('../utils/errorHandler')
const { genPassword, validPassword } = require('../../middleware/password');
const randomNumber = require('../utils/randomNumber');
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')

module.exports.register = async function(req, res, next) {
  try {
    // login password
      const candidate = await User.findOne({email: req.body.email}).lean()
  
      if (candidate) {
        // Пользователь существует, нужно отправить ошибку
        res.status(409).json({
          message: 'Такой email уже занят. Попробуйте войти.'
        })
      } else {
        // Нужно создать пользователя
        const create = req.body
        if (!create.photo) create.photo = `/images/avatars/user-${req.body.sex}-${randomNumber(1, 10)}.svg`
        create.password = genPassword(req.body.password)

        const user = await new User(create).save()
        next(req, res, user)
      }
    } catch(e) {
      errorHandler(res, e)
    }
};

module.exports.update = async function(req, res, next) {
  try {
    const updated = req.body
    updated.password = genPassword(req.body.password)
    const user = await User.findOneAndUpdate({_id: req.user.id}, {$set: updated}, {new: true}).lean()
    next(req, res, user)
  } catch (e) {
    errorHandler(res, e)
  }
};

module.exports.registerEmo = async function(req, res, next) {
  const registr = this.register
  try {
    request.post('https://emo.su/api/login/get-user', {
      json: {login: req.body.loginEmo, password: req.body.passwordEmo},
    }, function (error, response, body) {
      if (!error) {
        const candidate = {...body, ...req.body};
        registr({...req, body: candidate}, res, next)
      } else {
        res.status(response.statusCode).json({message: response.statusMessage | body.message})
      }
    })
  } catch(e) {
    errorHandler(res, e)
  }
};

module.exports.login = async (req, res) => {
  try {
    const candidate = await User.findOne({email: req.body.email}, {email: 1, password: 1, isAdmin: 1}).lean()

    if (candidate) {
      // Проверка пароля, пользователь существует
      const passwordResult = validPassword(candidate.password, req.body.password)

      if (passwordResult) {
        // Генерация токена, пароли совпали
        const token = jwt.sign({
          userId: candidate._id,
          isAdmin: candidate.isAdmin
        }, keys.jwt, {expiresIn: 60 * 60 * 24})

        res.status(200).json({
          token: `Bearer ${token}`
        })
      } else {
        // Пароли не совпали
        res.status(401).json({
          message: 'Пароли не совпадают. Попробуйте снова.'
        })
      }
    } else {
      // Пользователя нет, ошибка
      res.status(404).json({
        message: 'Пользователь не найден.'
      })
    }
  } catch(e) {
    errorHandler(res, e)
  }
  
}