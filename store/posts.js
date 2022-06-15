const store = require('@store')

// utilities

module.exports = {

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
