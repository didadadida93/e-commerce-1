const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')

class UserController {
  static register(req, res, next) {
    User.create({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
    })
      .then(user => {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
        res.status(201).json({ token, username: user.username })
      })
      .catch(next)
  }

  static login(req, res, next) {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          throw { name: 'BadRequest', message: 'Email or password is wrong' }
        }

        if (!bcryptjs.compareSync(req.body.password, user.password)) {
          throw { name: 'BadRequest', message: 'Email or password is wrong' }
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
        res.json({ token, username: user.username })
      })
      .catch(next)
  }
}

module.exports = UserController