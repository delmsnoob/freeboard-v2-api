const router = require('koa-router')()

const Users = require('@store/users')

module.exports = router
  .prefix('/users')

  .post('/', async (ctx, next) => {
    try {
      ctx.body = await Users.log({
        loginId: ctx.request.body.loginId,
        password: ctx.request.body.password
      })
    } catch (err) {
      ctx.throw(err)
    }
  })
