const router = require('koa-router')()

const posts = require('@store/posts')

// lib
const Joi = require('joi')

// utilities

module.exports = router
  .prefix('/posts')

  .post('/', async ctx => {
    const schema = Joi.object({
      user_id: Joi.string()
        .required(),
      post_content: Joi.string()
        .required()
    })

    try {
      const request = await schema.validateAsync(ctx.request.body)

      const params = {
        user_id: request.user_id,
        post_content: request.post_content
      }

      if (request) {
        ctx.body = await posts.store(params)
      }

      return ctx.body
    } catch (error) {
      console.log(error)
      ctx.throw(error)
    }
  })
