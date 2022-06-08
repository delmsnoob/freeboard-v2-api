const router = require('koa-router')()

/**
 * Change necessarily and remove this comment
 */
// store
const Register = require('@store/register')

// utilities

// libraries
const Joi = require('joi')
const _get = require('lodash/get')

// middlewares
// const authentication = require('@middleware/authentication')
// const userLevel = require('@middleware/userLevel')

module.exports = router
  .prefix('/register')

// .use(authentication())

// .get('/', async ctx => {
//   try {
//     const query = ctx.request.query
//     const params = {
//       filterBy: query.filter_by,
//       q: query.q,
//       page: query.page,
//       rows: query.rows,
//       sortBy: query.sort_by,
//       sort: query.sort,
//       dateBy: query.date_by,
//       dateFrom: query.date_from,
//       dateTo: query.date_to,
//       status: query.status,
//       isCount: query.is_count
//     }

//     // /**
//     //  * Change necessarily and remove this comment
//     //  */
//     // ctx.throw(404)

//     /**
//      * Change necessarily and remove this comment
//      */
//     const response = await Samples.list({ ...params })

//     ctx.body = params.isCount ? _get(response, 'total', 0) : response
//   } catch (error) {
//     console.log(error)
//     ctx.throw(error)
//   }
// })

  .post('/', async ctx => {
    try {
      const schema = Joi.object({
        login_id: Joi.string()
          .required(),
        password: Joi.string()
          .required()
          // minimum 4 char, at least one letter and one number
          .pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,8}$/)),
        confirm_password: Joi.ref('password')
      })

      const request = ctx.request.body.payload

      const validate = await schema.validateAsync({
        login_id: request.loginId,
        password: request.password
      })
      ctx.body = await Register.store(validate)
    } catch (error) {
      console.log(error)
      ctx.throw(error)
    }
  })

// .patch('/', async ctx => {
//   /**
//    * Change necessarily and remove this comment
//    */
//   const schema = Joi.object({
//     id: Joi.number()
//       .required()
//   })

//   try {
//     const data = await schema.validateAsync(ctx.request.body)

//     /**
//      * Change necessarily and remove this comment
//      */
//     ctx.throw(404)

//     /**
//      * Change necessarily and remove this comment
//      */
//     ctx.body = await Samples.modify(data.id, {})
//   } catch (error) {
//     console.log(error)
//     ctx.throw(error)
//   }
// })

// .delete('/', async ctx => {
//   const schema = Joi.object({
//     id: Joi.number()
//       .required()
//   })

//   try {
//     const data = await schema.validateAsync(ctx.request.body)

//     /**
//      * Change necessarily and remove this comment
//      */
//     ctx.throw(404)

//     /**
//      * Change necessarily and remove this comment
//      */
//     await Samples.modify(data.id, {
//       deleted_at: new Date()
//     })

//     ctx.status = 200
//   } catch (error) {
//     console.log(error)
//     ctx.throw(error)
//   }
// })
