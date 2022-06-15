const store = require('@store')

// utilities
const bcrypt = require('@utilities/bcrypt')

module.exports = {

  async checkLogin (loginId, password) {
    const user = await store.knex('users')
      .where('login_id', loginId)

    if (!user.length) {
      return false
    }

    const check = await bcrypt.verify(password, user[0].password)

    return !!(check)
  },

  async store (payload) {
    try {
      const hashPassword = await bcrypt.hash(payload.password)
      payload.password = hashPassword

      await store.knex('users')
        .insert(payload)

      return payload.login_id
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  },

  async find (loginId) {
    return store.knex('users')
      .where('login_id', loginId)
      .first()
  }
}
