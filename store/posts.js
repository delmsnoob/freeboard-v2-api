const store = require('@store')

// utilities
const { raw, makeQuery } = require('@utilities/knex-helper')

// helpers

module.exports = {
  async list ({ filterBy, q, page, rows, sortBy, sort, isCount }) {
    const filterDictionary = {
      author: 'posts.user_id',
      content: 'posts.post_content'
    }

    const sortDictionary = {
      created_at: 'posts.created_at'
    }

    try {
      const query = await store.knex('posts')
        .whereNull('posts.deleted_at')
        .modify(knex => {
          makeQuery({
            ...{ filterBy, q, filterDictionary },
            ...{ sortBy, sort, sortDictionary },
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
      return query
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
