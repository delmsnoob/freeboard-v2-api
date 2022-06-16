const router = require('koa-router')()

const posts = require('@store/posts')

// lib
const Joi = require('joi')
const _get = require('lodash/get')

// utilities

// middlewares
const authentication = require('@middleware/authentication')

module.exports = router
  .prefix('/posts')

  .use(authentication())

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

  .get('/fetchPosts', async (ctx, next) => {
    try {
      const query = ctx.request.query
      console.log(query)

      const params = {
        filterBy: query.filterBy,
        q: query.q,
        page: query.page,
        rows: query.rows,
        sortBy: query.sort_by,
        sort: query.sort
      }

      const count = await posts.list({ ...params, isCount: true })

      const list = await posts.list({ ...params })

      ctx.body = { count: _get(count, 'total', 0), list }
    } catch (error) {
      ctx.throw(error)
    }
  })

/*  .get('/', async ctx => {
    try {
      const params = {
        id: ctx.user_id
      }
      ctx.body = await posts.find(params)
    } catch (error) {
      console.log(error)
      ctx.throw(error)
    }
  }) */
