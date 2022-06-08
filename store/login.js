const store = require('@store')

// utilities
const CustomError = require('@utilities/custom-error')

// const jwt = require('../utilities/jwt')
// const bcrypt = require('@utilities/bcrypt')

module.exports = {

  async log (payload) {
    try {
      const user = await store.knex('users')
        .select({
          id: 'id',
          login_id: 'login_id',
          password: 'password'
        })
        .where('login_id', payload.loginId)
        .first()

      if (!user) {
        throw new CustomError({
          status: 400,
          name: 'LOGIN_ERROR',
          message: 'INCORRECT LOGIN ID'
        })
      }

      /* const passwordIsValid = await bcrypt.verify({ password: password, hash: user.password })

      if (!passwordIsValid) {
        throw new CustomError({
          status: 400,
          name: 'LOGIN_ERROR',
          message: 'INCORRECT PASSWORD'
        })
      }

      const token = await jwt.sign({
        id: user.id,
        login_id: user.login_id,
        role: 'admin'
      }) */

      return user
    } catch (error) {
      throw new CustomError({
        status: 400,
        name: 'LOGIN_ERROR',
        message: 'INVALID CREDENTIALS'
      })
    }
  }
}
