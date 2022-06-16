const store = require('@store')

// utilities
const { raw, makeQuery } = require('@utilities/knex-helper')

// helpers
const getKey = (key, obj) => obj[key] === undefined ? obj.default : obj[key]

module.exports = {
  async list ({ filterBy, q, page, rows, sortBy, sort, dateFrom, dateTo, dateBy, isCount }) {
    try {
      const filterDictionary = getKey(filterBy, {})
      const sortDictionary = getKey(sortBy, {
        created_at: 'posts.created_at'
      })
      const dateByDictionary = getKey(dateBy, {})

      const query = store.knex({ posts: 'posts' })
        .whereNull('posts.deleted_at')
        .modify(knex => {
          makeQuery({
            ...{ filterBy: filterDictionary, q },
            ...{ sortBy: sortDictionary, sort },
            ...{ dateBy: dateByDictionary, dateFrom, dateTo },
            ...{ page, rows },
            knex,
            isCount
          })

          if (isCount) {
            knex.select({ total: raw('COUNT(posts.id)over()') })
              .first()
          } else {
            knex.select({
              id: 'posts.id',
              user_id: 'posts.user_id',
              post_content: 'posts.post_content',
              created_at: 'posts.created_at',
              updated_at: 'posts.updated_at',
              deleted_at: 'posts.deleted_at'
            })
          }
        })

      const posts = await query

      if (posts) {
        return posts
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  async store (payload) {
    try {
      await store.knex('posts')
        .insert(payload)
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }
}
