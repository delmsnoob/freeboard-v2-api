const router = require('koa-router')()

const users = require('@store/users')

// lib
const Joi = require('joi')
const _isEmpty = require('lodash/isEmpty')
const _isUndefined = require('lodash/isUndefined')
const _isEqual = require('lodash/isEqual')

// utilities
const JWT = require('@utilities/jwt')

module.exports = router
  .prefix('/users')

  .post('/login', async (ctx, next) => {
    const schema = Joi.object({
      login_id: Joi.string()
        .required(),
      password: Joi.string()
        .required()
    })

    try {
      const request = await schema.validateAsync(ctx.request.body)

      const user = await users.find(request.login_id)
      if (_isEmpty(user) || _isUndefined(user)) {
        ctx.throw(401, 'UNKNOWN USER', {
          body: [
            { params: 'name', msg: '' },
            { params: 'password', msg: '' }
          ]
        })
      }

      const isValidCredentials = await users.checkLogin(request.login_id, request.password)
      if (!isValidCredentials) {
        ctx.throw(401, 'Login failed, invalid name or password', {
          body: [
            { param: 'name', msg: 'invalid name' },
            { param: 'password', msg: 'invalid password' }
          ]
        })
      }
      ctx.body = await JWT.sign({ loginId: user.login_id })
      return next()
    } catch (err) {
      console.log(err)
      ctx.throw(err)
    }
  })

  .post('/register', async ctx => {
    const schema = Joi.object({
      login_id: Joi.string()
        .required(),
      password: Joi.string()
        .required()
      // minimum 4 char, at least one letter and one number
        .pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,8}$/)),
      confirm_password: Joi.ref('password')
    })

    try {
      const req = await schema.validateAsync(ctx.request.body)

      const user = await users.find(req.loginId)

      if (!_isEqual(req.password, req.confirm_password)) {
        ctx.throw(401, 'YOUR PASSWORD MUST BE MINIMUM OF 4 CHARACTERS, AT LEAST 1 LETTER AND 1 NUMBER', {
          body: [
            { params: 'name', msg: '' },
            { params: 'password', msg: '' }
          ]
        })
      }

      const isValidCredentials = await users.checkLogin(req.loginId, req.password)
      if (!isValidCredentials) {
        return
      }

      ctx.throw(401, 'Login failed, invalid name or password', {
        body: [
          { param: 'name', msg: 'invalid name' },
          { param: 'password', msg: 'invalid password' }
        ]
      })

      ctx.body = await JWT.sign({
        login_id: user.login_id,
        id: user.id
      })
    } catch (error) {
      console.log(error)
      ctx.throw(error)
    }
  })
