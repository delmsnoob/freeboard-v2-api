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
    // const passwordPattern = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,8}$/)
    const schema = Joi.object({
      login_id: Joi.string()
        .lowercase()
        .alphanum()
        .min(4)
        .strict()
        // .error(new Error('Login id must contain minimum of 4 letters, lowercase, and alphanumeric characters')),
        .messages({
          'string.alphanum': 'login id must only contain alphanumberic characters',
          'string.min': 'login id must contain a minimum of 4 characters',
          'string.lowercase': 'login id must be in lowercase',
          'any.required': 'login id is cannot be empty'
        }),
      password: Joi.string()
        .required()
        .alphanum()
        .min(4)
        .max(8)
        .messages({
          'string.min': 'Password should have a minimum length of {#limit}',
          'string.max': 'Password should only have a maximum of {#limit} characters ',
          'string.alphanum': 'Password must contain alphanumeric characters only',
          'any.required': 'Password is a required field'
        }),
      confirm_password: Joi.valid(Joi.ref('password'))
        .messages({
          'any.only': 'Password must match'
        })
    })

    try {
      const request = await schema.validateAsync(ctx.request.body)

      const user = await users.find(request.login_id)

      if (user) {
        return ctx.throw(422, 'THIS USERNAME IS ALREADY IN USE', {
          body: [
            { params: 'name', msg: '' },
            { params: 'password', msg: '' }
          ]
        })
      }

      const params = {
        login_id: request.login_id,
        password: request.password
      }

      ctx.body = await users.store(params)
      return ctx.body

      // if (!_isEqual(request.password, request.confirm_password)) {
      //   ctx.throw(401, 'YOUR PASSWORD MUST BE MINIMUM OF 4 CHARACTERS, AT LEAST 1 LETTER AND 1 NUMBER', {
      //     body: [
      //       { params: 'name', msg: '' },
      //       { params: 'password', msg: '' }
      //     ]
      //   })
      // }

      // const isValidCredentials = await users.checkLogin(request.login_id, request.password)
      // if (!isValidCredentials) {
      //   return
      // }
    } catch (error) {
      console.log(error)
      ctx.throw(error)
    }
  })
